import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { ModalService } from '../../services/modal.service';
import { effect } from '@angular/core';

@Component({
  selector: 'app-remedies',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './remedies.html',
  styleUrl: './remedies.css',
})
export class Remedies {
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  user = this.authService.user;
  editingRemedy = this.modalService.editingRemedy;
  currentProblem = this.modalService.currentProblem;
  isEditMode = false;

  remedyForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    effectiveness: ['medium', Validators.required],
    timeRequired: ['', Validators.required],
    difficulty: ['medium', Validators.required],
    toolsRequired: [''],
    tested: [false],
    successful: [false],
  });

  effectivenessOptions = [
    { value: 'low', label: 'Low', color: '#F44336' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'high', label: 'High', color: '#4CAF50' },
    { value: 'proven', label: 'Proven', color: '#2196F3' },
  ];

  difficultyOptions = [
    { value: 'easy', label: 'Easy', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'hard', label: 'Hard', color: '#F44336' },
  ];

  isSubmitting = false;
  submitError: string | null = null;

  constructor() {
    // Watch for changes to editing remedy and patch form
    effect(() => {
      const remedyData = this.editingRemedy();
      if (remedyData) {
        this.isEditMode = true;
        this.remedyForm.patchValue({
          title: remedyData.title,
          description: remedyData.description,
          effectiveness: remedyData.effectiveness,
          timeRequired: remedyData.timeRequired,
          difficulty: remedyData.difficulty,
          toolsRequired: remedyData.toolsRequired || '',
          tested: remedyData.tested || false,
          successful: remedyData.successful || false,
        });
      } else {
        this.isEditMode = false;
        this.remedyForm.reset();
        this.remedyForm.patchValue({ 
          effectiveness: 'medium',
          difficulty: 'medium',
          tested: false,
          successful: false
        });
      }
    });

    // Watch tested checkbox to control successful field
    this.remedyForm.get('tested')?.valueChanges.subscribe(tested => {
      if (!tested) {
        this.remedyForm.get('successful')?.setValue(false);
      }
    });
  }

  async submitRemedy() {
    if (this.remedyForm.valid && this.user() && this.currentProblem()) {
      this.isSubmitting = true;
      this.submitError = null;

      try {
        const formData = this.remedyForm.value;
        const problemId = this.currentProblem().id;
        
        if (this.isEditMode && this.editingRemedy()) {
          // Update existing remedy
          const remedyDoc = doc(this.firestore, `problems/${problemId}/remedies/${this.editingRemedy().id}`);
          await updateDoc(remedyDoc, {
            title: formData.title,
            description: formData.description,
            effectiveness: formData.effectiveness,
            timeRequired: formData.timeRequired,
            difficulty: formData.difficulty,
            toolsRequired: formData.toolsRequired || null,
            tested: formData.tested,
            successful: formData.tested ? formData.successful : false,
            updatedAt: serverTimestamp(),
            updatedBy: this.user()?.uid || 'unknown',
          });
        } else {
          // Create new remedy
          const remedyData = {
            title: formData.title,
            description: formData.description,
            effectiveness: formData.effectiveness,
            timeRequired: formData.timeRequired,
            difficulty: formData.difficulty,
            toolsRequired: formData.toolsRequired || null,
            tested: formData.tested,
            successful: formData.tested ? formData.successful : false,
            createdAt: serverTimestamp(),
            createdBy: this.user()?.uid || 'unknown',
            createdByEmail: this.user()?.email || 'unknown',
          };

          const remedyCollection = collection(this.firestore, `problems/${problemId}/remedies`);
          await addDoc(remedyCollection, remedyData);
        }

        // Reset form and close modal on success
        this.remedyForm.reset();
        this.remedyForm.patchValue({ 
          effectiveness: 'medium',
          difficulty: 'medium',
          tested: false,
          successful: false
        });
        this.modalService.closeRemedyModal();
      } catch (error: any) {
        console.error('Error saving remedy:', error);
        this.submitError = 'Failed to save remedy. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  closeModal() {
    this.modalService.closeRemedyModal();
  }
}