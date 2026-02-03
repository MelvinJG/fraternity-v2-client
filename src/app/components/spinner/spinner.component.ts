import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-overlay" *ngIf="isLoading$ | async">
      <div class="spinner-container">
        <div class="dots-spinner">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <p class="loading-text">Cargando...</p>
      </div>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(108, 117, 125, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    }

    .spinner-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: white;
      border-radius: 50%;
      width: 140px;
      height: 140px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .dots-spinner {
      position: absolute;
      top: 35px;
      left: 50px;
      width: 40px;
      height: 40px;
    }

    .dot {
      position: absolute;
      width: 6px;
      height: 6px;
      background-color: #7b2cbf;
      border-radius: 50%;
      animation: dot-spin 1.2s linear infinite;
    }

    .dot:nth-child(1) { 
      top: 0; 
      left: 17px; 
      animation-delay: 0s; 
    }
    .dot:nth-child(2) { 
      top: 5px; 
      left: 29px; 
      animation-delay: -0.15s; 
    }
    .dot:nth-child(3) { 
      top: 17px; 
      left: 34px; 
      animation-delay: -0.3s; 
    }
    .dot:nth-child(4) { 
      top: 29px; 
      left: 29px; 
      animation-delay: -0.45s; 
    }
    .dot:nth-child(5) { 
      top: 34px; 
      left: 17px; 
      animation-delay: -0.6s; 
    }
    .dot:nth-child(6) { 
      top: 29px; 
      left: 5px; 
      animation-delay: -0.75s; 
    }
    .dot:nth-child(7) { 
      top: 17px; 
      left: 0; 
      animation-delay: -0.9s; 
    }
    .dot:nth-child(8) { 
      top: 5px; 
      left: 5px; 
      animation-delay: -1.05s; 
    }

    .loading-text {
      position: absolute;
      bottom: 35px;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      color: #7b2cbf;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    @keyframes dot-spin {
      0%, 20% {
        transform: scale(1);
        opacity: 1;
      }
      40% {
        transform: scale(1.5);
        opacity: 0.8;
      }
      60%, 100% {
        transform: scale(0.8);
        opacity: 0.3;
      }
    }
  `]
})
export class SpinnerComponent {
  isLoading$: Observable<boolean>;

  constructor(private spinnerService: SpinnerService) {
    this.isLoading$ = this.spinnerService.isLoading$;
  }
}