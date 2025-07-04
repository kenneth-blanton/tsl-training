import { Component, inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
  recipes$: Observable<any[]>;
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    const line = this.route.snapshot.paramMap.get('line');
    const recipeCollection = collection(this.firestore, 'recipes');

    if (line) {
      const filteredCollection = query(
        recipeCollection,
        where('line', '==', line)
      );
      this.recipes$ = collectionData(filteredCollection, { idField: 'id' });
    } else {
      // Handle case where line is not in the URL, maybe load all recipes or show an error
      this.recipes$ = collectionData(recipeCollection, { idField: 'id' });
    }
  }
}
