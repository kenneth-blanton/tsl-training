import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, combineLatest } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-problem-history',
  imports: [CommonModule, RouterModule],
  templateUrl: './problem-history.html',
  styleUrl: './problem-history.css',
})
export class ProblemHistory implements OnInit {
  private firestore = inject(Firestore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  user = this.authService.user;

  selectedLineId: string = '';
  selectedProductId: string = '';

  // Load lines for filtering
  private lineCollection = collection(this.firestore, 'lines');
  private lineObservable = collectionData(this.lineCollection, {
    idField: 'id',
  });
  lines = toSignal(this.lineObservable, { initialValue: [] });

  // Load products for filtering
  private productCollection = collection(this.firestore, 'products');
  private productObservable = collectionData(this.productCollection, {
    idField: 'id',
  });
  products = toSignal(this.productObservable, { initialValue: [] });

  // Load resolved problems
  private problemCollection = collection(this.firestore, 'problems');
  private resolvedProblemsQuery = query(
    this.problemCollection,
    where('status', '==', 'resolved')
  );
  private resolvedProblemsObservable = collectionData(
    this.resolvedProblemsQuery,
    { idField: 'id' }
  );

  allResolvedProblems = toSignal(this.resolvedProblemsObservable, {
    initialValue: [],
  });

  // Filtered problems based on line and product selection
  filteredProblems = toSignal(
    combineLatest([
      this.resolvedProblemsObservable,
      this.route.queryParams,
    ]).pipe(
      map(([problems, params]) => {
        let filtered = problems;

        if (params['lineId']) {
          this.selectedLineId = params['lineId'];
          filtered = filtered.filter(
            (p: any) => p['lineId'] === params['lineId']
          );
        }

        if (params['productId']) {
          this.selectedProductId = params['productId'];
          filtered = filtered.filter(
            (p: any) => p['productId'] === params['productId']
          );
        }

        return filtered;
      })
    ),
    { initialValue: [] }
  );

  ngOnInit() {
    // Get query parameters for initial filtering
    this.route.queryParams.subscribe((params) => {
      this.selectedLineId = params['lineId'] || '';
      this.selectedProductId = params['productId'] || '';
    });

    // Debug: Log resolved problems
    // this.resolvedProblemsObservable.subscribe((problems) => {
    //   console.log('Resolved problems loaded:', problems);
    //   console.log('Number of resolved problems:', problems.length);
    // });

    // Debug: Log all problems to see what's in the database
    // const allProblemsQuery = collection(this.firestore, 'problems');
    // const allProblemsObservable = collectionData(allProblemsQuery, { idField: 'id' });
    // allProblemsObservable.subscribe(allProblems => {
    //   console.log('All problems in database:', allProblems);
    //   const resolved = allProblems.filter((p: any) => p['status'] === 'resolved');
    //   const active = allProblems.filter((p: any) => p['status'] === 'active');
    //   console.log('Resolved problems found:', resolved);
    //   console.log('Active problems found:', active);
    // });
  }

  goBackToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onLineChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filterByLine(target.value);
  }

  onProductChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.filterByProduct(target.value);
  }

  filterByLine(lineId: string) {
    this.selectedLineId = lineId;
    this.updateFilters();
  }

  filterByProduct(productId: string) {
    this.selectedProductId = productId;
    this.updateFilters();
  }

  clearFilters() {
    this.selectedLineId = '';
    this.selectedProductId = '';
    this.updateFilters();
  }

  private updateFilters() {
    const queryParams: any = {};
    if (this.selectedLineId) queryParams.lineId = this.selectedLineId;
    if (this.selectedProductId) queryParams.productId = this.selectedProductId;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
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

  getSelectedLineName(): string {
    return this.selectedLineId
      ? this.getLineName(this.selectedLineId)
      : 'All Lines';
  }

  getSelectedProductName(): string {
    return this.selectedProductId
      ? this.getProductName(this.selectedProductId)
      : 'All Products';
  }

  async unresolveProblem(problem: any) {
    try {
      const problemDoc = doc(this.firestore, `problems/${problem.id}`);
      await updateDoc(problemDoc, {
        status: 'active',
        unresolvedAt: serverTimestamp(),
        unresolvedBy: this.user()?.uid || 'unknown',
        unresolvedByEmail: this.user()?.email || 'unknown',
        // Clear the resolution data
        resolvedAt: null,
        resolvedBy: null,
        resolvedByEmail: null,
      });
      console.log('Problem unresolved successfully');
    } catch (error) {
      console.error('Error unresolving problem:', error);
    }
  }
}
