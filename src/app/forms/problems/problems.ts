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
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { ModalService } from '../../services/modal.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { effect } from '@angular/core';

@Component({
  selector: 'app-problems',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './problems.html',
  styleUrl: './problems.css',
})
export class Problems {
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  user = this.authService.user;
  editingProblem = this.modalService.editingProblem;
  selectedLine = this.modalService.selectedLine;
  isEditMode = false;

  // Load lines for dropdown
  private lineCollection = collection(this.firestore, 'lines');
  private lineObservable = collectionData(this.lineCollection, {
    idField: 'id',
  });
  lines = toSignal(this.lineObservable, { initialValue: [] });

  // Load products for dropdown
  private productCollection = collection(this.firestore, 'products');
  private productObservable = collectionData(this.productCollection, {
    idField: 'id',
  });
  products = toSignal(this.productObservable, { initialValue: [] });

  problemForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    severity: ['medium', Validators.required],
    lineId: ['', Validators.required],
    productId: ['', Validators.required],
  });

  severityOptions = [
    { value: 'low', label: 'Low', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'high', label: 'High', color: '#F44336' },
  ];

  isSubmitting = false;
  submitError: string | null = null;

  constructor() {
    // Watch for changes to editing problem and patch form
    effect(() => {
      const problemData = this.editingProblem();
      const selectedLineId = this.selectedLine();
      
      if (problemData) {
        this.isEditMode = true;
        this.problemForm.patchValue({
          title: problemData.title,
          description: problemData.description,
          severity: problemData.severity,
          lineId: problemData.lineId,
          productId: problemData.productId || '',
        });
      } else {
        this.isEditMode = false;
        this.problemForm.reset();
        this.problemForm.patchValue({ 
          severity: 'medium',
          lineId: selectedLineId || ''
        });
      }
    });
  }

  async submitProblem() {
    if (this.problemForm.valid && this.user()) {
      this.isSubmitting = true;
      this.submitError = null;

      try {
        const formData = this.problemForm.value;
        
        if (this.isEditMode && this.editingProblem()) {
          // Update existing problem
          const problemDoc = doc(this.firestore, `problems/${this.editingProblem().id}`);
          await updateDoc(problemDoc, {
            title: formData.title,
            description: formData.description,
            severity: formData.severity,
            lineId: formData.lineId,
            productId: formData.productId,
            updatedAt: serverTimestamp(),
            updatedBy: this.user()?.uid || 'unknown',
          });
        } else {
          // Create new problem
          const problemData = {
            title: formData.title,
            description: formData.description,
            severity: formData.severity,
            lineId: formData.lineId,
            productId: formData.productId,
            status: 'active',
            createdAt: serverTimestamp(),
            createdBy: this.user()?.uid || 'unknown',
            createdByEmail: this.user()?.email || 'unknown',
          };

          const problemCollection = collection(this.firestore, 'problems');
          await addDoc(problemCollection, problemData);
        }

        // Reset form and close modal on success
        this.problemForm.reset();
        this.problemForm.patchValue({ severity: 'medium' });
        this.modalService.closeProblemModal();
      } catch (error: any) {
        console.error('Error saving problem:', error);
        this.submitError = 'Failed to save problem. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  // Get products that can run on the selected line
  getProductsForSelectedLine() {
    const selectedLineId = this.problemForm.get('lineId')?.value;
    
    if (!selectedLineId) {
      return this.products();
    }
    
    // Get the line name from the selected line ID
    const selectedLine = this.lines().find((l: any) => l.id === selectedLineId);
    const selectedLineName = selectedLine ? selectedLine['name'] : '';
    
    if (!selectedLineName) {
      return this.products();
    }
    
    return this.products().filter((product: any) => {
      const linesRanOn = product['linesRanOn'] || [];
      return linesRanOn.includes(selectedLineName);
    });
  }

  // Get the name of the selected line
  getSelectedLineName(): string {
    const selectedLineId = this.problemForm.get('lineId')?.value;
    if (!selectedLineId) return '';
    
    const line = this.lines().find((l: any) => l.id === selectedLineId);
    return line ? line['name'] : 'Selected Line';
  }

  // Handle line selection change
  onLineChange() {
    // Reset product selection when line changes
    this.problemForm.patchValue({ productId: '' });
  }

  closeModal() {
    this.modalService.closeProblemModal();
  }
}
