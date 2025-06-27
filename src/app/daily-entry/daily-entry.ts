import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

// Define an interface for type safety
interface Note {
  text: string;
  timestamp: Timestamp;
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
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  private dailyEntryCollection = collection(this.firestore, 'dailyEntryCollection');
  private notesSubscription: Unsubscribe | null = null;

  date: Date = new Date();
  dailyEntryForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  todaysEntryId: string | null = null;
  existingNotes: Note[] = []; // Use the Note interface for type safety

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
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

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
        this.existingNotes = (data['notes'] as Note[] || []).sort(
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
    this.notes.push(new FormControl('', Validators.required));
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
      const entryRef = doc(this.firestore, 'dailyEntryCollection', this.todaysEntryId);
      await updateDoc(entryRef, {
        notes: arrayRemove(noteToRemove),
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

  async onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.dailyEntryForm.markAllAsTouched();

    if (this.dailyEntryForm.valid) {
      try {
        const newNotes = this.dailyEntryForm.value.notes
          .filter((noteText: string) => noteText && noteText.trim() !== '')
          .map((noteText: string): Note => ({
            text: noteText,
            timestamp: Timestamp.now(),
          }));

        if (newNotes.length === 0) {
          this.errorMessage = 'Please enter a note before submitting.';
          setTimeout(() => (this.errorMessage = ''), 3000);
          return;
        }

        if (this.todaysEntryId) {
          const entryRef = doc(this.firestore, 'dailyEntryCollection', this.todaysEntryId);
          await updateDoc(entryRef, {
            notes: arrayUnion(...newNotes),
          });
        } else {
          await addDoc(this.dailyEntryCollection, {
            date: new Date(),
            notes: newNotes,
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
