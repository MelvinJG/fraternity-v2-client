import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SpinnerService } from '../../services/spinner.service';
import { UserAuthService } from '../../services/user-auth.service';
import Swal from 'sweetalert2'
import { FormsModule } from '@angular/forms';

interface IUser {
  dpi: string;
  pass: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

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
    console.log("DATOS INGRESADOS -> ",this.user);
    this.spinnerService.show();
    if(this.user.dpi !== "" && this.user.pass !== ""){
      this.userAuthService.signin(this.user).subscribe({
        next: (res: any) => {
          console.log("RESPONSE INICIO DE SESION -> ",res)
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
          console.log("ERROR INICIO DE SESION -> ",err)
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
}
