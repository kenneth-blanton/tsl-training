import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class]="'loading-' + size()">
      <div class="spinner" [style.border-color]="color()"></div>
      <span *ngIf="text()" class="loading-text">{{ text() }}</span>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .spinner {
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-left: 3px solid var(--primary-color, #007bff);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-small .spinner {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }

    .loading-medium .spinner {
      width: 40px;
      height: 40px;
      border-width: 3px;
    }

    .loading-large .spinner {
      width: 60px;
      height: 60px;
      border-width: 4px;
    }

    .loading-text {
      font-size: 0.9rem;
      color: var(--text-secondary, #666);
      text-align: center;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class Loading {
  size = input<'small' | 'medium' | 'large'>('medium');
  color = input<string>('var(--primary-color, #007bff)');
  text = input<string>('');
}