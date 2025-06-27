import { CommonModule } from '@angular/common';
import { Component, inject, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  drawerOpen = false;
  private authService = inject(AuthService);

  user$: Observable<User | null> = this.authService.user$;

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  async logout() {
    this.closeDrawer();
    await this.authService.signOut();
  }
}
