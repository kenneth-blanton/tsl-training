import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { LoginComponent } from './login-component/login-component';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'tf-operators';
  private modalService = inject(ModalService);
  
  showLogin = this.modalService.showLogin;
  
  onLoginModalClose() {
    this.modalService.closeLoginModal();
  }
}
