import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UserAuthService } from './services/user-auth.service';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, NavBarComponent, SpinnerComponent, NgxSonnerToaster],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';
  isLoggedIn: boolean = false;

  constructor(
    private authService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if(!this.isLoggedIn) {
        const mainElement = document.querySelector('.main-content');
        if (mainElement) {
          mainElement.classList.remove('main-content');
        }
        const containerDiv = document.getElementById('div-origin');
        if (containerDiv) {
          containerDiv.classList.remove('container-fluid', 'p-4');
        }
        document.body.style.backgroundColor = "#e9ecef";
      }
    });
  }
}
