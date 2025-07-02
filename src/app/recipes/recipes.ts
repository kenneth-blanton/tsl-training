import { Component, inject } from '@angular/core';
import {
  Firestore,
  Timestamp,
  collection,
  addDoc,
} from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-recipes',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  newRecipeForm: FormGroup;
  lines: string[] = ['F1', 'F2', 'F3', 'F4'];
  user$ = this.authService.user$;
  heatZoneConfigs: { [line: string]: { name: string }[] } = {
    F1: [
      { name: 'Top Main' },
      { name: 'Near Side Rail' },
      { name: 'Far Side Rail' },
    ],
    F2: [
      { name: 'Top Main' },
      { name: 'Front Radd' },
      { name: 'Bottom Front' },
      { name: 'Bottom Infeed' },
      { name: 'Near Side Rail' },
      { name: 'Far Side Rail' },
    ],
    F3: [
      { name: 'Top Front' },
      { name: 'Top Zone 1' },
      { name: 'Top Zone 2' },
      { name: 'Top Zone 3' },
      { name: 'Top Zone 4' },
      { name: 'Top Zone 5' },
      { name: 'Near Side Rail' },
      { name: 'Far Side Rail' },
    ],
    F4: [
      { name: 'Top Front' },
      { name: 'Top Main Front' },
      { name: 'Top Main Middle' },
      { name: 'Top Main Infeed' },
      { name: 'Bottom Main Front' },
      { name: 'Bottom Main Middle' },
      { name: 'Bottom Main Infeed' },
      { name: 'Near Side Rail' },
      { name: 'Far Side Rail' },
    ],
  };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.newRecipeForm = this.fb.group({
      line: ['', Validators.required],
      productName: ['', Validators.required],
      moldCycleTime: [null, Validators.required],
      piecesMade: [null, Validators.required],
      scrapAmount: [null, Validators.required],
      indexLength: [null, Validators.required],
      heatZones: this.fb.array([]),
    });

    // Listen for line changes
    this.newRecipeForm.get('line')!.valueChanges.subscribe((line) => {
      this.setHeatZonesForLine(line);
    });
  }

  get heatZonesFormArray() {
    return this.newRecipeForm.get('heatZones') as FormArray;
  }

  // Dynamically set heat zones based on the selected line
  setHeatZonesForLine(line: string) {
    const zones = this.heatZoneConfigs[line] || [];
    this.heatZonesFormArray.clear(); // Remove previous controls

    zones.forEach((zone) => {
      this.heatZonesFormArray.push(
        this.fb.group({
          name: [zone.name, Validators.required],
          setPoint: [null, Validators.required],
          actualValue: [null, Validators.required],
        })
      );
    });
  }

  async addRecipe() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.newRecipeForm.valid) {
      this.errorMessage = 'Please fill out all required fields.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    const user = await firstValueFrom(this.user$);
    if (!user) {
      this.errorMessage = 'User not authenticated. Please log in.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    try {
      const recipeData = {
        ...this.newRecipeForm.value,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(this.firestore, 'recipes'), recipeData);
      this.successMessage = 'Recipe added successfully!';
      this.newRecipeForm.reset();
      // Optionally, reset heat zones to empty or default
      (this.newRecipeForm.get('heatZones') as FormArray).clear();
    } catch (error) {
      this.errorMessage = 'Failed to add recipe. Please try again.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      console.error(error);
    }
  }
}
