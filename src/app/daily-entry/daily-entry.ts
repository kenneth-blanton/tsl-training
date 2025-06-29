import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom, map } from 'rxjs';
import { get } from 'http';

// Define an interface for type safety
interface Note {
  text: string;
  timestamp: Timestamp;
  line?: string; // Add optional line property
  imageUrls?: { url: string; path: string }[]; // Store image URLs and storage paths
}

@Component({
  selector: 'app-daily-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './daily-entry.html',
  styleUrls: ['./daily-entry.css'],
})
export class DailyEntry implements OnInit, OnDestroy {
  // Use inject() for consistent dependency injection
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  private dailyEntryCollection = collection(
    this.firestore,
    'dailyEntryCollection'
  );
  private notesSubscription: Unsubscribe | null = null;
  user$ = this.authService.user$;

  date: Date = new Date();
  dailyEntryForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  todaysEntryId: string | null = null;
  existingNotes: Note[] = []; // Use the Note interface for type safety
  lines: string[] = ['F1', 'F2', 'F3', 'F4']; // Define line options

  constructor() {
    this.dailyEntryForm = this.fb.group({
      notes: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.addNote();
    this.listenForTodaysEntry(); // Switch to a real-time listener
  }

  ngOnDestroy() {
    // Unsubscribe when the component is destroyed to prevent memory leaks
    if (this.notesSubscription) {
      this.notesSubscription();
    }
  }

  // Sets up a real-time listener for today's entry using onSnapshot.
  listenForTodaysEntry() {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const q = query(
      this.dailyEntryCollection,
      where('date', '>=', startOfDay),
      where('date', '<', endOfDay)
    );

    this.notesSubscription = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const entryDoc = querySnapshot.docs[0];
        this.todaysEntryId = entryDoc.id;
        const data = entryDoc.data();
        // Sort notes by timestamp for a consistent order
        this.existingNotes = ((data['notes'] as Note[]) || []).sort(
          (a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()
        );
      } else {
        this.todaysEntryId = null;
        this.existingNotes = [];
      }
      this.cdr.detectChanges(); // Update the view
    });
  }

  get notes(): FormArray {
    return this.dailyEntryForm.get('notes') as FormArray;
  }

  addNote() {
    // Push a FormGroup with text and line controls
    const noteGroup = this.fb.group({
      text: ['', Validators.required],
      line: [''], // Default to empty string (for "General")
      images: [null], // For new image uploads
    });
    this.notes.push(noteGroup);
  }

  onFileSelect(event: Event, noteIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.notes.at(noteIndex).get('images')?.setValue(input.files);
    }
  }

  removeNote(index: number) {
    if (this.notes.length > 1) {
      this.notes.removeAt(index);
    }
  }

  async removeExistingNote(noteToRemove: Note) {
    if (!this.todaysEntryId) {
      this.errorMessage = 'Could not remove note. No entry found for today.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    try {
      // Delete associated images from Firebase Storage first
      if (noteToRemove.imageUrls && noteToRemove.imageUrls.length > 0) {
        const deletePromises = noteToRemove.imageUrls.map((image) => {
          const imageRef = ref(this.storage, image.path);
          return deleteObject(imageRef);
        });
        await Promise.all(deletePromises);
      }

      const entryRef = doc(
        this.firestore,
        'dailyEntryCollection',
        this.todaysEntryId
      );
      await updateDoc(entryRef, {
        notes: arrayRemove(noteToRemove),
        lines: arrayRemove(noteToRemove.line || ''), // Remove the line if it exists
      });
      // No need to re-fetch; onSnapshot handles the update automatically.
      this.successMessage = 'Note removed successfully.';
      setTimeout(() => (this.successMessage = ''), 3000);
    } catch (error) {
      console.error('Error removing note: ', error);
      this.errorMessage = 'Failed to remove note.';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  async removeImageFromNote(
    noteToUpdate: Note,
    imageToRemove: { url: string; path: string }
  ) {
    if (!this.todaysEntryId) {
      this.errorMessage = 'Could not remove image. No entry found for today.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    try {
      // Delete from Storage
      const imageRef = ref(this.storage, imageToRemove.path);
      await deleteObject(imageRef);

      // Create a new note object without the removed image
      const updatedNote = {
        ...noteToUpdate,
        imageUrls: noteToUpdate.imageUrls?.filter(
          (image) => image.path !== imageToRemove.path
        ),
      };

      // Atomically remove the old note and add the updated one
      const entryRef = doc(
        this.firestore,
        'dailyEntryCollection',
        this.todaysEntryId
      );
      await updateDoc(entryRef, {
        notes: arrayRemove(noteToUpdate),
      });
      await updateDoc(entryRef, {
        notes: arrayUnion(updatedNote),
      });

      this.successMessage = 'Image removed successfully.';
      setTimeout(() => (this.successMessage = ''), 3.0);
    } catch (error) {
      console.error('Error removing image: ', error);
      this.errorMessage = 'Failed to remove image.';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  async onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.dailyEntryForm.markAllAsTouched();

    if (this.dailyEntryForm.valid) {
      const user = await firstValueFrom(this.user$);
      if (!user) {
        this.errorMessage = 'User not authenticated. Please log in.';
        setTimeout(() => (this.errorMessage = ''), 3000);
        return;
      }

      try {
        const formNotes = this.dailyEntryForm.value.notes;
        const newNotes: Note[] = [];

        for (const note of formNotes) {
          if (!note.text || note.text.trim() === '') continue;

          let imageUrls: { url: string; path: string }[] = [];
          if (note.images && note.images.length > 0) {
            const uploadPromises = Array.from(note.images as FileList).map(
              async (file: File) => {
                const filePath = `notes/${user.uid}/${Date.now()}_${file.name}`;
                const storageRef = ref(this.storage, filePath);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                return { url, path: filePath };
              }
            );
            imageUrls = await Promise.all(uploadPromises);
          }

          newNotes.push({
            text: note.text,
            timestamp: Timestamp.now(),
            ...(note.line && { line: note.line }),
            ...(imageUrls.length > 0 && { imageUrls: imageUrls }),
          });
        }

        if (newNotes.length === 0) {
          this.errorMessage =
            'Please enter a note, or add an image to an existing note, before submitting.';
          setTimeout(() => (this.errorMessage = ''), 3000);
          return;
        }

        if (this.todaysEntryId) {
          const entryRef = doc(
            this.firestore,
            'dailyEntryCollection',
            this.todaysEntryId
          );
          await updateDoc(entryRef, {
            notes: arrayUnion(...(newNotes as Note[])),
            lines: arrayUnion(
              ...newNotes
                .map((note: Note) => note.line)
                .filter((line: string | undefined): line is string => !!line)
            ),
          });
        } else {
          await addDoc(this.dailyEntryCollection, {
            createdBy: user?.uid as string,
            date: new Date(),
            notes: newNotes as Note[],
            lines: newNotes
              .map((note: Note) => note.line)
              .filter((line: string | undefined): line is string => !!line),
          });
        }

        this.successMessage = 'Your notes have been submitted successfully!';
        this.notes.clear();
        this.addNote();
        // No need to re-fetch; onSnapshot handles the update automatically.
        setTimeout(() => (this.successMessage = ''), 3000);
      } catch (error) {
        console.error('Error submitting notes: ', error);
        this.errorMessage = 'There was an error submitting your notes.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    } else {
      this.errorMessage = 'Please fill out all note fields before submitting.';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }
}
