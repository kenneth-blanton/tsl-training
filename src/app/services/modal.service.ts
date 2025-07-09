import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private showLoginSignal = signal(false);
  public showLogin = this.showLoginSignal.asReadonly();

  openLoginModal() {
    this.showLoginSignal.set(true);
  }

  closeLoginModal() {
    this.showLoginSignal.set(false);
  }
}
