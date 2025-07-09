import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  private modalService = inject(ModalService);

  user$ = this.authService.user$;
  showDemo = false;

  demoForm: FormGroup = this.formBuilder.group({
    company: ['', [Validators.required]],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    productionLines: ['', [Validators.required]],
    message: [''],
  });

  onDemoButtonClick() {
    this.showDemo = true;
  }

  openLoginModal() {
    this.modalService.openLoginModal();
  }

  onDemoModalClose() {
    this.showDemo = false;
  }

  requestDemo() {
    if (this.demoForm.valid) {
      try {
        console.log('Demo request submitted:', this.demoForm.value);

        // Here you would typically send the data to your backend
        // For now, we'll just show a success message and close the modal
        alert(
          'Thank you for your interest! We will contact you within 24 hours to schedule your demo.',
        );
        this.showDemo = false;
        this.demoForm.reset();
      } catch (error) {
        console.error('Error submitting demo request:', error);
      }
    }
  }

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
