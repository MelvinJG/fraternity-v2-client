import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SpinnerService } from '../../services/spinner.service';
import { UserAuthService } from '../../services/user-auth.service';
import Swal from 'sweetalert2'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

interface IUser {
  dpi: string;
  pass: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MdbFormsModule, FormsModule, MdbValidationModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  dpiValue: string = '';
  user: IUser = {
    dpi: '',
    pass: ''
  }

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.spinnerService.hide();
    }, 500);
  }

  onLogin(){
    this.spinnerService.show();
    if(this.user.dpi !== "" && this.user.pass !== ""){
      this.userAuthService.signin(this.user).subscribe({
        next: (res: any) => {
          localStorage.setItem('token',JSON.parse(JSON.stringify(res)).data.token);
          this.userAuthService.login();
          this.spinnerService.hide();
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            showConfirmButton: false,
            timer: 1200
          });
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.spinnerService.hide();
          Swal.fire({
            icon: err.status === 500 ? 'error' : 'info',
            title: 'Oops...',
            text: err.error.message
          })
        }
      });
    } else {
      this.spinnerService.hide();
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese usuario y contraseña.'
      })
      
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart ?? input.value.length;
    const prevVal = input.value;
    const masked = this.formatDPI(prevVal);
    this.dpiValue = masked;
    setTimeout(() => {
      const spacesBefore = (prevVal.slice(0, cursorPos).match(/ /g) || []).length;
      const spacesAfter = (masked.slice(0, cursorPos).match(/ /g) || []).length;
      let newPos = cursorPos + (spacesAfter - spacesBefore);
      if (masked[newPos - 1] === ' ' && masked.replace(/ /g, '').length < 13) {
        newPos = newPos + 1;
      }
      newPos = Math.max(0, Math.min(newPos, masked.length));
      input.setSelectionRange(newPos, newPos);
    }, 0);
    this.user.dpi = this.dpiValue.replaceAll(' ', '');
  }

  formatDPI(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 13);
    const part1 = digits.slice(0, 4);
    const part2 = digits.slice(4, 9);
    const part3 = digits.slice(9, 13);
    let formatted = part1;
    if (part2) formatted += ' ' + part2;
    if (part3) formatted += ' ' + part3;
    return formatted;
  }
}
