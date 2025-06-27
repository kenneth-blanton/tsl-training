import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormControl,
  Validators, // Import Validators
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);

  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }
  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  async signIn() {
    this.loginError = null;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        await this.authService.signIn(email, password);
        console.log(`User signed in: ${email}`);
      } catch (e: any) {
        this.loginError = 'Failed to sign in. Please check your credentials.';
        console.error(e);
      }
    }
  }

  async signOut() {
    try {
      await this.authService.signOut();
      console.log('User signed out');
    } catch (e: any) {
      console.error('Failed to sign out:', e);
    }
  }
}
