import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collectionData,
  collection,
  query,
  where,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-past-recipes',
  imports: [CommonModule, RouterModule],
  templateUrl: './past-recipes.html',
  styleUrl: './past-recipes.css',
})
export class PastRecipes {
  firestore: Firestore = inject(Firestore);
  private route: ActivatedRoute = inject(ActivatedRoute);

  recipes: any;
  products: any;

  constructor() {
    const line = this.route.snapshot.paramMap.get('line');
    const recipeCollection = collection(this.firestore, 'recipes');
    const productsCollection = collection(this.firestore, 'products');

    // Convert products observable to signal
    const productsObservable = collectionData(productsCollection, {
      idField: 'id',
    });
    this.products = toSignal(productsObservable, { initialValue: [] });

    // Convert recipes observable to signal
    let recipesObservable;
    if (line) {
      const filteredCollection = query(
        recipeCollection,
        where('line', '==', line)
      );
      recipesObservable = collectionData(filteredCollection, { idField: 'id' });
    } else {
      // Handle case where line is not in the URL, maybe load all recipes or show an error
      recipesObservable = collectionData(recipeCollection, { idField: 'id' });
    }

    this.recipes = toSignal(recipesObservable, { initialValue: [] });
  }

  getProductName(recipeName: string): string {
    const product = this.products().find((p: any) => p.id === recipeName);
    return product ? product.name : 'Unknown Product';
  }
}
