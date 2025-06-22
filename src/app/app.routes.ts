import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Thermoforming101 } from './thermoforming101/thermoforming101';
import { Dashboard } from './dashboard/dashboard';
import { Sops } from './sops/sops';
import { LogUploader } from './log-uploader/log-uploader';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home',
  },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
  { path: 'sops', component: Sops, title: 'SOPs' },
  { path: 'log-uploader', component: LogUploader, title: 'Log Uploader' },
  {
    path: 'thermoforming101',
    component: Thermoforming101,
    title: 'Thermoforming 101',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect to home for any unknown routes
];
