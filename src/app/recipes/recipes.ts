import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-recipes',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes implements OnInit {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  newRecipeForm: FormGroup;
  lines: string[] = ['F1', 'F2', 'F3', 'F4'];
  products$: Observable<any[]>;
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
  products: any[] = [];
  selectedProduct: any | null = null;
  submitted = false;

  constructor(private fb: FormBuilder) {
    const productsCollection = collection(this.firestore, 'products');
    this.products$ = collectionData(productsCollection, { idField: 'id' });
    // Store products locally to easily find the selected one
    this.products$.subscribe((products) => {
      this.products = products;
    });

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
    });

    // Listen for line changes
    this.newRecipeForm.get('line')!.valueChanges.subscribe((line) => {
      this.setHeatZonesForLine(line);
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
      
      formControls.forEach(controlName => {
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
                actualValue: zoneData.actualValue
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
      this.products.find((p) => p.id === productId) || null;
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
      const recipeData = {
        ...formValue,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(this.firestore, 'recipes'), recipeData);
      this.successMessage = 'Recipe added successfully!';
      this.newRecipeForm.reset();
      this.submitted = false; // Reset submitted state on success
      // Optionally, reset heat zones to empty or default
      (this.newRecipeForm.get('heatZones') as FormArray).clear();
    } catch (error) {
      this.errorMessage = 'Failed to add recipe. Please try again.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      console.error(error);
    }
  }
}
