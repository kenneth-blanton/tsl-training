import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Thermoforming101 } from './thermoforming101/thermoforming101';
import { Dashboard } from './dashboard/dashboard';
import { Sops } from './sops/sops';
import { LogUploader } from './log-uploader/log-uploader';
import { DailyEntry } from './daily-entry/daily-entry';
import { authGuard } from './auth/auth.guard';

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
    path: 'log-uploader',
    component: LogUploader,
    title: 'Log Uploader',
    canActivate: [authGuard],
  },
  {
    path: 'thermoforming101',
    component: Thermoforming101,
    title: 'Thermoforming 101',
  },
  {
    path: 'daily-entry',
    component: DailyEntry,
    title: 'Daily Entry',
    canActivate: [authGuard],
  },
  // {
  //   path: 'daily-entry/:id',
  //   component: DailyEntry,
  //   title: 'Daily Entry Details',
  // },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect to home for any unknown routes
];
