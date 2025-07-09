import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Thermoforming101 } from './thermoforming101/thermoforming101';
import { Dashboard } from './dashboard/dashboard';
import { Sops } from './sops/sops';
import { DailyEntry } from './daily-entry/daily-entry';
import { authGuard } from './auth/auth.guard';
import { Recipes } from './recipes/recipes';
import { PastRecipes } from './past-recipes/past-recipes';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home',
  },
  {
    path: 'dashboard',
    component: Dashboard,
    title: 'Dashboard',
    canActivate: [authGuard],
  },
  { path: 'sops', component: Sops, title: 'SOPs' },
  {
    path: 'recipes',
    component: Recipes,
    title: 'Recipes',
    canActivate: [authGuard],
  },
  {
    path: 'recipes/add/:recipeId',
    component: Recipes,
    title: 'Add Recipe',
    canActivate: [authGuard],
  },
  {
    path: 'past-recipes/:line',
    component: PastRecipes,
    title: 'Past Recipes',
  },
  {
    path: 'thermoforming101',
    component: Thermoforming101,
    title: 'Thermoforming 101',
    canActivate: [authGuard],
  },
  {
    path: 'daily-log',
    component: DailyEntry,
    title: 'Daily Log',
    canActivate: [authGuard],
  },
  // {
  //   path: 'daily-entry/:id',
  //   component: DailyEntry,
  //   title: 'Daily Entry Details',
  // },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect to home for any unknown routes
];
