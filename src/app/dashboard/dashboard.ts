import { Component, NgModule, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import {
  Firestore,
  collection,
  collectionData,
  getDoc,
  doc,
  updateDoc,
  where,
  query,
  orderBy,
  serverTimestamp,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal.service';
import { Problems } from '../forms/problems/problems';
import { map, switchMap, combineLatest, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnDestroy {
  authService = inject(AuthService);
  firestore = inject(Firestore);
  modal = inject(ModalService);
  private cdr = inject(ChangeDetectorRef);
  public userDetailsOpen = false;

  // Signal-based auth state
  user = this.authService.user;
  isLoading = this.authService.isLoading;
  isAuthenticated = this.authService.isAuthenticated;

  toggleUserDetails() {
    this.userDetailsOpen = !this.userDetailsOpen;
  }
  lines: any;
  products: any;
  problems: any;
  remedies: Map<string, any[]> = new Map();
  windowWidth: number;
  selectedLineId: string = '';
  selectedProductId: string = '';
  private selectedLineSubject = new BehaviorSubject<string>('');
  currentLineStatus: string = 'active';
  selectedLine$ = this.selectedLineSubject.asObservable();
  estimatedTimeRemaining: string = '2 days'; // Example value, can be dynamic
  currentQuantity: number = 50; // Example value, can be dynamic
  orderQuantity: number = 100; // Example value, can be dynamic
  
  // Timer properties
  private timerInterval: any;
  private currentTime: Date = new Date();

  constructor(private router: Router) {
    const lineCollection = collection(this.firestore, 'lines');
    const lineObservable = collectionData(lineCollection, { idField: 'id' });
    this.lines = toSignal(lineObservable, { initialValue: [] });

    const productCollection = collection(this.firestore, 'products');
    const productObservable = collectionData(productCollection, {
      idField: 'id',
    });
    this.products = toSignal(productObservable, { initialValue: [] });

    const problemCollection = collection(this.firestore, 'problems');
    const problemObservable = this.selectedLine$.pipe(
      switchMap(selectedLineId => {
        let activeProblemsQuery = query(problemCollection, where('status', '==', 'active'));
        
        if (selectedLineId) {
          activeProblemsQuery = query(
            problemCollection,
            where('status', '==', 'active'),
            where('lineId', '==', selectedLineId)
          );
        }
        
        return collectionData(activeProblemsQuery, { idField: 'id' });
      }),
      switchMap((problems: any[]) => {
        // Load remedies for each problem
        const remedyObservables = problems.map((problem) => {
          const remedyCollection = collection(
            this.firestore,
            `problems/${problem.id}/remedies`
          );
          const remedyQuery = query(
            remedyCollection,
            orderBy('createdAt', 'desc')
          );
          return collectionData(remedyQuery, { idField: 'id' }).pipe(
            map((remedies) => ({ problemId: problem.id, remedies }))
          );
        });

        if (remedyObservables.length === 0) {
          return [{ problems: [], remedyMap: new Map() }];
        }

        return combineLatest(remedyObservables).pipe(
          map((remedyData) => {
            const remedyMap = new Map();
            remedyData.forEach(({ problemId, remedies }) => {
              remedyMap.set(problemId, remedies);
            });
            return { problems, remedyMap };
          })
        );
      }),
      map(({ problems, remedyMap }) => {
        this.remedies = remedyMap;
        return problems.sort((a, b) => {
          const severityOrder = { low: 1, medium: 2, high: 3 };
          return (
            severityOrder[b['severity'] as keyof typeof severityOrder] -
            severityOrder[a['severity'] as keyof typeof severityOrder]
          );
        });
      })
    );
    this.problems = toSignal(problemObservable, { initialValue: [] });

    this.windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });

    // Watch for line changes to update status
    this.selectedLineSubject.subscribe(() => {
      this.loadLineStatus();
    });

    // Start the timer to update every second
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.detectChanges(); // Force change detection
    }, 1000);
  }

  addProblem() {
    this.modal.openProblemModal(null, this.selectedLineId);
    console.log('Open problem modal');
  }

  editProblem(problem: any) {
    console.log('Edit problem:', problem);
    this.modal.openProblemModal(problem, this.selectedLineId);
  }

  problemHistory() {
    console.log('Navigating to problem history');
    this.router.navigate(['/problem-history']);
  }

  async changeLineStatus() {
    if (!this.selectedLineId) {
      console.error('No line selected');
      return;
    }

    try {
      // Toggle the status
      const newStatus = this.currentLineStatus === 'active' ? 'inactive' : 'active';
      
      // Update in database
      const lineDoc = doc(this.firestore, `lines/${this.selectedLineId}`);
      await updateDoc(lineDoc, {
        status: newStatus,
        statusChangedAt: serverTimestamp(),
        statusChangedBy: this.user()?.uid || 'unknown',
      });
      
      // Update local status
      this.currentLineStatus = newStatus;
      console.log(`Line status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Error updating line status:', error);
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

  getLineName(lineId: string): string {
    const line = this.lines().find((l: any) => l['id'] === lineId);
    return line ? line['name'] : 'Unknown Line';
  }

  getProductName(productId: string): string {
    const product = this.products().find((p: any) => p['id'] === productId);
    return product ? product['name'] : 'Unknown Product';
  }

  getRemediesForProblem(problemId: string): any[] {
    return this.remedies.get(problemId) || [];
  }

  addRemedy(problem: any) {
    console.log('Add remedy for problem:', problem);
    this.modal.openRemedyModal(problem);
  }

  editRemedy(problem: any, remedy: any) {
    console.log('Edit remedy:', remedy, 'for problem:', problem);
    this.modal.openRemedyModal(problem, remedy);
  }

  selectLine(lineId: string) {
    this.selectedLineId = lineId;
    this.selectedLineSubject.next(lineId);
    
    // Reset product selection when line changes
    this.selectedProductId = '';
    
    // Load the status of the selected line
    this.loadLineStatus();
  }

  async toggleLineStatus(lineId: string, event: Event) {
    event.stopPropagation(); // Prevent line selection when clicking toggle button
    
    if (!lineId) {
      console.error('No line ID provided');
      return;
    }

    try {
      // Find the current line to get its status
      const currentLine = this.lines().find((l: any) => l.id === lineId);
      if (!currentLine) {
        console.error('Line not found');
        return;
      }

      // Toggle the status
      const newStatus = currentLine.status === 'active' ? 'inactive' : 'active';
      
      // Update in database
      const lineDoc = doc(this.firestore, `lines/${lineId}`);
      await updateDoc(lineDoc, {
        status: newStatus,
        statusChangedAt: serverTimestamp(),
        statusChangedBy: this.user()?.uid || 'unknown',
      });
      
      // Update local status if this is the selected line
      if (lineId === this.selectedLineId) {
        this.currentLineStatus = newStatus;
      }
      
      console.log(`Line ${currentLine.name} status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Error updating line status:', error);
    }
  }

  onLineChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedLineId = target.value;
    this.selectedLineSubject.next(target.value);
    
    // Reset product selection when line changes
    this.selectedProductId = '';
    
    // Load the status of the selected line
    this.loadLineStatus();
  }

  loadLineStatus() {
    if (this.selectedLineId) {
      const selectedLine = this.lines().find((l: any) => l.id === this.selectedLineId);
      if (selectedLine) {
        this.currentLineStatus = selectedLine['status'] || 'active';
      }
    }
  }

  onProductChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedProductId = target.value;
  }

  // Get products that can run on the selected line
  getProductsForSelectedLine() {
    if (!this.selectedLineId) {
      return this.products();
    }
    
    // Get the line name from the selected line ID
    const selectedLine = this.lines().find((l: any) => l.id === this.selectedLineId);
    const selectedLineName = selectedLine ? selectedLine['name'] : '';
    
    if (!selectedLineName) {
      return this.products();
    }
    
    return this.products().filter((product: any) => {
      const linesRanOn = product['linesRanOn'] || [];
      return linesRanOn.includes(selectedLineName);
    });
  }

  async resolveProblem(problem: any) {
    try {
      const problemDoc = doc(this.firestore, `problems/${problem.id}`);
      await updateDoc(problemDoc, {
        status: 'resolved',
        resolvedAt: serverTimestamp(),
        resolvedBy: this.user()?.uid || 'unknown',
        resolvedByEmail: this.user()?.email || 'unknown',
      });
      console.log('Problem resolved successfully');
    } catch (error) {
      console.error('Error resolving problem:', error);
    }
  }

  getLineStatusText(): string {
    return this.currentLineStatus === 'active' ? 'RUNNING' : 'STOPPED';
  }

  getToggleButtonText(): string {
    return this.currentLineStatus === 'active' ? 'Stop Line' : 'Start Line';
  }

  isLineActive(): boolean {
    return this.currentLineStatus === 'active';
  }

  getLineTimer(line: any): string {
    if (!line.statusChangedAt) {
      return '0:00:00';
    }

    // Convert Firestore timestamp to Date
    const statusChangedAt = line.statusChangedAt.toDate ? line.statusChangedAt.toDate() : new Date(line.statusChangedAt);
    const timeDiff = this.currentTime.getTime() - statusChangedAt.getTime();
    
    // Convert milliseconds to hours, minutes, seconds
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Format with leading zeros
    const formatTime = (num: number): string => num.toString().padStart(2, '0');
    
    return `${hours}:${formatTime(minutes)}:${formatTime(seconds)}`;
  }
}
