import { Component, inject, OnInit, computed } from '@angular/core';
import {
  Firestore,
  Timestamp,
  collection,
  addDoc,
  doc,
  getDoc,
  collectionData,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

// Define an interface for recipe notes
interface Note {
  text: string;
  timestamp: Timestamp;
  imageUrls?: { url: string; path: string }[];
}

@Component({
  selector: 'app-recipes',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes implements OnInit {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  newRecipeForm: FormGroup;
  lines: any;
  products: any;
  user$ = this.authService.user$;
  heatZoneConfigs = computed(() => {
    const configs: { [line: string]: { name: string }[] } = {};
    this.lines().forEach((line: any) => {
      if (line.heatZones) {
        configs[line.name] = line.heatZones;
      }
    });
    return configs;
  });
  successMessage: string = '';
  errorMessage: string = '';
  selectedProduct: any | null = null;
  submitted = false;

  constructor(private fb: FormBuilder) {
    const productsCollection = collection(this.firestore, 'products');
    const productsObservable = collectionData(productsCollection, {
      idField: 'id',
    });
    this.products = toSignal(productsObservable, { initialValue: [] });
    const lineCollection = collection(this.firestore, 'lines');
    const lineObservable = collectionData(lineCollection, { idField: 'id' });
    this.lines = toSignal(lineObservable, { initialValue: [] });

    this.newRecipeForm = this.fb.group({
      line: ['', Validators.required],
      productName: ['', Validators.required],
      // Add controls for product-specific fields
      degrees: [null, Validators.required],
      length: [null, Validators.required],
      mil: [null, Validators.required],
      width: [null, Validators.required],
      sides: [null, Validators.required],
      // Existing controls
      moldCycleTime: [null, Validators.required],
      piecesMade: [null, Validators.required],
      scrapAmount: [null, Validators.required],
      indexLength: [null, Validators.required],
      heatZones: this.fb.array([]),
      // Vacuum forming fields (F4 only)
      moldVentDelayTimer: [null],
      airEjectTimer: [null],
      // Notes array
      notes: this.fb.array([]),
    });

    // Listen for line changes
    this.newRecipeForm.get('line')!.valueChanges.subscribe((line) => {
      this.setHeatZonesForLine(line);
      this.setVacuumFormingFieldsForLine(line);
    });

    // Listen for product changes to update dependent fields
    this.newRecipeForm
      .get('productName')!
      .valueChanges.subscribe((productId) => {
        this.updateFormForProduct(productId);
      });
  }

  ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('recipeId');
    if (recipeId) {
      this.loadRecipeToClone(recipeId);
    }
  }

  async loadRecipeToClone(recipeId: string) {
    const docRef = doc(this.firestore, 'recipes', recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const recipeData = docSnap.data();

      // Get list of form control names to safely patch only existing fields
      const formControls = Object.keys(this.newRecipeForm.controls);

      // Create object with only the fields that exist in the form
      const dataToPatch: any = {};

      formControls.forEach((controlName) => {
        if (controlName === 'heatZones') {
          // Skip heatZones - will be handled separately after line is set
          return;
        }

        if (recipeData.hasOwnProperty(controlName)) {
          // Convert Firestore Timestamp to regular value if needed
          const value = recipeData[controlName];
          if (value && typeof value === 'object' && value.toDate) {
            // Skip timestamp fields for cloning
            return;
          }
          dataToPatch[controlName] = value;
        }
      });

      // Exclude fields you don't want to carry over for cloning
      delete dataToPatch['piecesMade'];
      delete dataToPatch['scrapAmount'];
      delete dataToPatch['createdBy'];
      delete dataToPatch['createdAt'];

      // Patch the form with the safe data
      this.newRecipeForm.patchValue(dataToPatch);

      // Handle heatZones separately after line is set
      if (recipeData['heatZones'] && Array.isArray(recipeData['heatZones'])) {
        // Wait for line change to set up heat zones, then patch the values
        setTimeout(() => {
          const heatZonesArray = this.heatZonesFormArray;
          recipeData['heatZones'].forEach((zoneData: any, index: number) => {
            if (heatZonesArray.at(index)) {
              heatZonesArray.at(index).patchValue({
                name: zoneData.name,
                setPoint: zoneData.setPoint,
                actualValue: zoneData.actualValue,
              });
            }
          });
        }, 100);
      }
    } else {
      this.errorMessage = 'Recipe not found.';
      console.error('No document found with ID:', recipeId);
    }
  }

  updateFormForProduct(productId: string): void {
    this.selectedProduct =
      this.products().find((p: { id: string }) => p.id === productId) || null;
    const dependentFields = ['degrees', 'length', 'mil', 'width', 'sides'];

    dependentFields.forEach((fieldName) => {
      const control = this.newRecipeForm.get(fieldName);
      if (!control) return;

      // Reset control and enable it by default
      control.reset();
      control.enable();

      if (this.selectedProduct) {
        const options = this.selectedProduct[fieldName];
        if (options && options.length === 1) {
          // If only one option, set it and disable the field
          control.setValue(options[0]);
          control.disable();
        } else if (!options || options.length === 0) {
          // If no options, disable the control (it will be hidden by *ngIf)
          control.disable();
        }
      } else {
        // If no product is selected, disable the control
        control.disable();
      }
    });
  }

  get heatZonesFormArray() {
    return this.newRecipeForm.get('heatZones') as FormArray;
  }

  get notesFormArray() {
    return this.newRecipeForm.get('notes') as FormArray;
  }

  // Dynamically set heat zones based on the selected line
  setHeatZonesForLine(line: string) {
    const zones = this.heatZoneConfigs()[line] || [];
    this.heatZonesFormArray.clear(); // Remove previous controls

    zones.forEach((zone) => {
      this.heatZonesFormArray.push(
        this.fb.group({
          name: [zone, Validators.required],
          setPoint: [null, Validators.required],
          actualValue: [null, Validators.required],
        })
      );
    });
  }

  // Set vacuum forming field requirements based on selected line
  setVacuumFormingFieldsForLine(line: string) {
    const moldVentControl = this.newRecipeForm.get('moldVentDelayTimer');
    const airEjectControl = this.newRecipeForm.get('airEjectTimer');

    if (line === 'F4') {
      // F4 requires vacuum forming fields
      moldVentControl?.setValidators([Validators.required]);
      airEjectControl?.setValidators([Validators.required]);
    } else {
      // Other lines don't need vacuum forming fields
      moldVentControl?.clearValidators();
      airEjectControl?.clearValidators();
      moldVentControl?.setValue(null);
      airEjectControl?.setValue(null);
    }

    // Update validity after changing validators
    moldVentControl?.updateValueAndValidity();
    airEjectControl?.updateValueAndValidity();
  }

  // Add a new note to the form array
  addNote() {
    const noteGroup = this.fb.group({
      text: ['', Validators.required],
      images: [null], // For new image uploads
    });
    this.notesFormArray.push(noteGroup);
  }

  // Remove a note from the form array
  removeNote(index: number) {
    if (this.notesFormArray.length > 0) {
      this.notesFormArray.removeAt(index);
    }
  }

  // Handle file selection for note images
  onFileSelect(event: Event, noteIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.notesFormArray.at(noteIndex).get('images')?.setValue(input.files);
    }
  }

  async addRecipe() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.newRecipeForm.valid) {
      this.errorMessage = 'Please fill out all required fields.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    // Use getRawValue() to include values from disabled controls
    const formValue = this.newRecipeForm.getRawValue();
    const user = await firstValueFrom(this.user$);

    if (!user) {
      this.errorMessage = 'User not authenticated. Please log in.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    try {
      // Process notes with image uploads
      const processedNotes: Note[] = [];
      if (formValue.notes && formValue.notes.length > 0) {
        for (const note of formValue.notes) {
          if (!note.text || note.text.trim() === '') continue;

          let imageUrls: { url: string; path: string }[] = [];
          if (note.images && note.images.length > 0) {
            const uploadPromises = Array.from(note.images as FileList).map(
              async (file: File) => {
                const filePath = `recipe-notes/${user.uid}/${Date.now()}_${file.name}`;
                const storageRef = ref(this.storage, filePath);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                return { url, path: filePath };
              }
            );
            imageUrls = await Promise.all(uploadPromises);
          }

          processedNotes.push({
            text: note.text,
            timestamp: Timestamp.now(),
            ...(imageUrls.length > 0 && { imageUrls: imageUrls }),
          });
        }
      }

      const recipeData = {
        ...formValue,
        notes: processedNotes,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(this.firestore, 'recipes'), recipeData);
      this.successMessage = 'Recipe added successfully!';
      this.newRecipeForm.reset();
      this.submitted = false; // Reset submitted state on success
      // Clear form arrays
      (this.newRecipeForm.get('heatZones') as FormArray).clear();
      (this.newRecipeForm.get('notes') as FormArray).clear();
    } catch (error) {
      this.errorMessage = 'Failed to add recipe. Please try again.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      console.error(error);
    }
  }
}
