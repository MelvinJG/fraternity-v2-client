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
      console.log('Estado de login actualizado APP:', status);
      if(!this.isLoggedIn) {
        const mainElement = document.querySelector('.main-content');
        if (mainElement) {
          console.log('ENTRO IF');
          mainElement.classList.remove('main-content');
        }
        const containerDiv = document.getElementById('div-origin');
        if (containerDiv) {
          console.log('ENTRO IF 222');
          containerDiv.classList.remove('container-fluid', 'p-4');
        }
        document.body.style.backgroundColor = "#e9ecef";
      }
    });
  }
}

// AgregarClase
// ngOnInit() {
//   const mainElement = document.querySelector('.main-content');
//   if (mainElement) {
//     mainElement.classList.add('nueva-clase');
//   }
// }