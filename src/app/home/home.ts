import { Component, inject, NgModule } from '@angular/core';
import { LoginComponent } from '../login-component/login-component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [LoginComponent, CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  authService = inject(AuthService);

  user$ = this.authService.user$;

  signOut() {
    this.authService
      .signOut()
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Failed to sign out:', error);
      });
  }
}
