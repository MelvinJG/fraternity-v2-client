import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SpinnerService } from '../../../services/spinner.service';
import { ManagementService } from '../../../services/management.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { UserAuthService } from '../../../services/user-auth.service';
import { Router } from '@angular/router';

interface IOption {
  value: number;
  label: string;
}

interface IRegister {
  dpi: string;
  fullName: string;
  email: string;
  idFraternity: number;
  idPermissions: number;
  pass: string;
  created_by: string;
}

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [MdbFormsModule, CommonModule, FormsModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})

export class NewUserComponent implements OnInit {
  fraternities: IOption[] = [];
  permissions: IOption[] = [];
  registerData: IRegister = {
    dpi: '',
    fullName: '',
    email: '',
    idFraternity: 0,
    idPermissions: 0,
    pass: '',
    created_by: ''
  }

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private managementService: ManagementService,
    private authService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.spinnerService.show();
    this.managementService.getFraternities().subscribe({
      next: (res: any) => {
        this.fraternities = res.data.map((fraternity: any) => ({ value: fraternity.id, label: fraternity.name }));
      },
      error: (err: any) => {
        Swal.fire({
          icon: err.status === 500 ? 'error' : 'info',
          title: 'Oops...',
          text: err.error.message
        })
      }
    });
    this.managementService.getPermissions().subscribe({
      next: (res: any) => {
        this.permissions = res.data.map((permission: any) => ({ value: permission.id, label: permission.description }));
      },
      error: (err: any) => {
        Swal.fire({
          icon: err.status === 500 ? 'error' : 'info',
          title: 'Oops...',
          text: err.error.message
        })
      }
    });
    this.spinnerService.hide();
  }

  onChangeSelect(event: any, nameSelect: string){
    if(nameSelect === 'fraternity') {
      this.registerData.idFraternity = Number(event.target.value);
    } else if(nameSelect === 'permissions') {
      this.registerData.idPermissions = Number(event.target.value);
    }
  }

  onSubmit(){
    if(this.registerData.dpi === "" || this.registerData.fullName === "" || this.registerData.email === "" ||
      this.registerData.idFraternity === 0 || this.registerData.idPermissions === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor complete todos los campos.'
      });
    } else {
      this.spinnerService.show();
      this.registerData.dpi = this.registerData.dpi.toString();
      this.registerData.pass = this.registerData.dpi.toString();
      this.registerData.created_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';

      console.log("DATOS INGRESADOS -> ",this.registerData);
      
      this.authService.createUser(this.registerData).subscribe({
        next: (res: any) => {
          console.log("RESPONSE CREATE USER -> ",res)
          this.spinnerService.hide();
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado.',
            showConfirmButton: false,
            timer: 1200
          });
          this.router.navigate(['/user/list']);
        },
        error: (err: any) => {
          console.log("ERROR CREATE USER -> ",err)
          this.spinnerService.hide();
          Swal.fire({
            icon: err.status === 500 ? 'error' : 'info',
            title: 'Oops...',
            text: err.error.message
          })
        }
      });
    }
  }
}
