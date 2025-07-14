import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs/internal/Observable';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalService } from '../services/modal.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private modalService = inject(ModalService);
  private router = inject(Router);

  // Keep Observable for backward compatibility
  user$: Observable<User | null> = authState(this.auth);

  // Signal-based authentication state with proper loading detection
  private hasReceivedAuthState = signal(false);
  user = toSignal(this.user$, {
    initialValue: undefined,
    requireSync: false,
  });

  // Computed auth states
  isAuthenticated = computed(() => !!this.user());
  isLoading = computed(() => !this.hasReceivedAuthState());

  constructor() {
    // Track when we've received the first auth state (even if null)
    this.user$.subscribe(() => {
      this.hasReceivedAuthState.set(true);
    });
  }

  async signIn(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.modalService.closeLoginModal();
      return { success: true, user: credential.user };
    } catch (error: any) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to sign out' };
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      default:
        return 'An error occurred during sign in. Please try again.';
    }
  }
}
