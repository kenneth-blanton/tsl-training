import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { LoginComponent } from './login-component/login-component';
import { ModalService } from './services/modal.service';
import { Problems } from './forms/problems/problems';
import { Remedies } from './forms/remedies/remedies';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule, LoginComponent, Problems, Remedies],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'tf-operators';
  private modalService = inject(ModalService);

  showLogin = this.modalService.showLogin;
  showProblem = this.modalService.showProblem;
  showRemedy = this.modalService.showRemedy;

  onLoginModalClose() {
    this.modalService.closeLoginModal();
  }

  onProblemModalClose() {
    this.modalService.closeProblemModal();
  }

  onRemedyModalClose() {
    this.modalService.closeRemedyModal();
  }
}
