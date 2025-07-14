import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private showLoginSignal = signal(false);
  public showLogin = this.showLoginSignal.asReadonly();

  private showProblemSignal = signal(false);
  public showProblem = this.showProblemSignal.asReadonly();

  private editingProblemSignal = signal<any>(null);
  public editingProblem = this.editingProblemSignal.asReadonly();

  private showRemedySignal = signal(false);
  public showRemedy = this.showRemedySignal.asReadonly();

  private editingRemedySignal = signal<any>(null);
  public editingRemedy = this.editingRemedySignal.asReadonly();

  private currentProblemSignal = signal<any>(null);
  public currentProblem = this.currentProblemSignal.asReadonly();

  private selectedLineSignal = signal<string>('');
  public selectedLine = this.selectedLineSignal.asReadonly();

  openLoginModal() {
    this.showLoginSignal.set(true);
  }

  closeLoginModal() {
    this.showLoginSignal.set(false);
  }

  openProblemModal(problemData?: any, selectedLineId?: string) {
    this.editingProblemSignal.set(problemData || null);
    this.selectedLineSignal.set(selectedLineId || '');
    this.showProblemSignal.set(true);
  }

  closeProblemModal() {
    this.showProblemSignal.set(false);
    this.editingProblemSignal.set(null);
    this.selectedLineSignal.set('');
  }

  openRemedyModal(problemData: any, remedyData?: any) {
    this.currentProblemSignal.set(problemData);
    this.editingRemedySignal.set(remedyData || null);
    this.showRemedySignal.set(true);
  }

  closeRemedyModal() {
    this.showRemedySignal.set(false);
    this.editingRemedySignal.set(null);
    this.currentProblemSignal.set(null);
  }
}
