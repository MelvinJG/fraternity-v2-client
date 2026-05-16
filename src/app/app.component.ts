import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UserAuthService } from './services/user-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, SpinnerComponent],
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
      const mainElement = document.querySelector('.main-content');
      const containerDiv = document.getElementById('div-origin');

      if (!this.isLoggedIn) {
        document.body.classList.remove('logged-in');
        if (mainElement) {
          mainElement.classList.remove('main-content');
        }
        if (containerDiv) {
          containerDiv.classList.remove('container-fluid', 'p-4');
        }
        document.body.style.backgroundColor = "#e9ecef";
      } else {
        document.body.classList.add('logged-in');
        if (mainElement) {
          mainElement.classList.add('main-content');
        }
        if (containerDiv) {
          containerDiv.classList.add('container-fluid', 'p-4');
        }
        document.body.style.backgroundColor = "";
      }
    });
  }
}