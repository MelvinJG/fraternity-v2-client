import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SpinnerService } from '../../../services/spinner.service';
import { ManagementService } from '../../../services/management.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { UserAuthService } from '../../../services/user-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { dpiIsValid } from '../../../utils/dpiIsValid';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

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
  created_by?: string;
  updated_by?: string;
}

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [MdbFormsModule, CommonModule, FormsModule, MdbValidationModule, ReactiveFormsModule],
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
    pass: ''
  }
  updateMode: boolean = false;
  createMode: boolean = false;
  password: string = '';
  passwordRepeat: string = '';
  dpiValue: string = '';
  isDPIValid: boolean = false;
  validationForm: FormGroup;

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private managementService: ManagementService,
    private authService: UserAuthService,
    private route: ActivatedRoute
  ) {
    const mode = this.route.snapshot.data['mode'];
    if (mode === 'update') {
      this.updateMode = true;
      this.createMode = false;
    } else if (mode === 'new') {
      this.createMode = true;
      this.updateMode = false;
    } else {
      this.updateMode = false;
      this.createMode = false;
    }
    this.validationForm = new FormGroup({
      dpi: new FormControl(null, { 
        validators: [
          Validators.required,
          (control: AbstractControl) => {
            const value = control.value?.toString().replaceAll(' ', '') || '';
            return dpiIsValid(value) ? null : { invalidDpi: true };
          }
        ]
      })
    });
  }

  get dpi(): AbstractControl {
    return this.validationForm.get('dpi')!;
  }

  ngOnInit(): void {
    this.spinnerService.show();
    const USER_DATA = this.authService.getUserInfo();

    if (this.createMode && USER_DATA?.idPermission !== 1) { // Solo el admin puede crear usuarios
      this.spinnerService.hide();
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'No tienes permisos para crear usuarios.'
      }).then(() => {
        this.router.navigate(['/home']);
      });
      return;
    }

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
    if (this.updateMode) {
      this.registerData = {
        dpi: USER_DATA?.dpi || '',
        fullName: USER_DATA?.fullName || '',
        email: USER_DATA?.email || '',
        idFraternity: USER_DATA?.idFraternity || 0,
        idPermissions: USER_DATA?.idPermission || 0,
        pass: '',
        created_by: '' 
      };
    }
    this.spinnerService.hide();
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
      
      if (this.updateMode) {
        // ACTUALIZAR USUARIO
        if(this.password !== this.passwordRepeat) {
          this.spinnerService.hide();
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Las contraseñas no coinciden.'
          });
          return;
        }
        this.registerData.pass = this.password.toString();
        this.registerData.updated_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
        const dpiToUpdate = this.registerData.dpi;
        // @ts-ignore
        delete this.registerData.dpi;
        delete this.registerData.created_by;
        if(this.password === "") {
          // @ts-ignore
          delete this.registerData.pass;
        }
        console.log("DATOS INGRESADOS UPDATE -> ",this.registerData);
        this.authService.editDeleteUser(dpiToUpdate, this.registerData).subscribe({
          next: (res: any) => {
            console.log("RESPONSE UPDATE USER -> ",res)
            this.spinnerService.hide();
            Swal.fire({
              icon: 'success',
              title: 'Usuario actualizado.',
              showConfirmButton: false,
              timer: 1200
            });
            this.authService.logout();
            this.router.navigate(['/login']);
          },
          error: (err: any) => {
            console.log("ERROR UPDATE USER -> ",err)
            this.spinnerService.hide();
            Swal.fire({
              icon: err.status === 500 ? 'error' : 'info',
              title: 'Oops...',
              text: err.error.message
            })
          }
        });
        return;
      }
      // CREAR USUARIO
      if(!this.isDPIValid) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'El DPI ingresado no es válido.'
        });
        this.spinnerService.hide();
        return;
      }
      this.registerData.pass = this.registerData.dpi.toString();
      this.registerData.created_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
      delete this.registerData.updated_by;
      console.log("DATOS INGRESADOS CREATE -> ",this.registerData);
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
    this.isDPIValid = dpiIsValid(this.dpiValue.replaceAll(' ', ''));
    this.registerData.dpi = this.dpiValue.replaceAll(' ', '');
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
