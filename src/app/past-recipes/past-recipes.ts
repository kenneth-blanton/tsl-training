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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-past-recipes',
  imports: [CommonModule],
  templateUrl: './past-recipes.html',
  styleUrl: './past-recipes.css',
})
export class PastRecipes {
  firestore: Firestore = inject(Firestore);
  recipes$: Observable<any[]>;
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    const line = this.route.snapshot.paramMap.get('line');
    console.log(`Line from URL: ${line}`);
    const recipeCollection = collection(this.firestore, 'recipes');

    if (line) {
      const filteredCollection = query(
        recipeCollection,
        where('line', '==', line)
      );
      this.recipes$ = collectionData(filteredCollection);
      console.log(
        `Filtered recipes for line ${line}:`,
        this.recipes$.subscribe((recipes) => console.log(recipes))
      );
    } else {
      // Handle case where line is not in the URL, maybe load all recipes or show an error
      this.recipes$ = collectionData(recipeCollection);
    }
  }
}
