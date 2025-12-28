import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';
import { UserAuthService } from '../../services/user-auth.service';
import Swal from 'sweetalert2';
import { DevoteesService } from '../../services/devotees.service';

interface IChild {
  id?: number;
  fullName: string;
  birthdate: string;
  height: number | null;
  age: number | null;
  idState: number;
}

interface IRegister {
  dpi: string;
  fullName: string;
  address?: string;
  birthdate?: string;
  email?: string;
  phone?: string | null;
  height: number | null;
  isTutored: boolean;
  created_by?: string;
  children?: IChild[];
  updated_by?: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MdbFormsModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {

  registerData: IRegister = {
    dpi: '',
    fullName: '',
    address: '',
    birthdate: '',
    email: '',
    phone: '',
    height: null,
    isTutored: false,
    created_by: ''
  };

  @Input() isUpdate: boolean = false;

  isRegisterer: boolean = false;
  isChecked: boolean = false;

  children: IChild[] = [
    { 
      id: 1, 
      fullName: '', 
      birthdate: '', 
      height: null,
      age: null,
      idState: 1
    }
  ];

  constructor(
    private router: Router,
    private spinnerService: SpinnerService,
    private devoteesService: DevoteesService,
    private authService: UserAuthService
  ) {}
  private nextId: number = 2;

  agregarHijo() {
    this.children.push({
      id: this.nextId++,
      fullName: '',
      birthdate: '',
      height: null,
      age: null,
      idState: 1
    });
  }

  // Eliminar un hijo (mínimo 1)
  eliminarHijo(id: number) {
    if (this.children.length > 1) {
      this.children = this.children.filter(child => child.id !== id);
    }
  }

  guardarDatos() {
    // Lógica para guardar los datos del formulario
    console.log('Datos guardados:', this.children);
  }

  onCheckboxChange(event: any) {
    console.log('Checkbox changed:', event.target.checked);
    this.isChecked = event.target.checked;
    this.registerData.isTutored = this.isChecked;
  }

  onSubmit(){
    this.spinnerService.show();
    if(this.registerData.dpi === "" || this.registerData.fullName === "" || this.registerData.height === null) {
      this.spinnerService.hide();
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'El DPI, Nombre Completo y Altura son campos obligatorios.'
      });
      return;
    }
    if(this.registerData.isTutored){
      if(this.children.length === 0) {
        this.spinnerService.hide();
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Por favor, agregue al menos un hijo.'
        });
        return;
      }
      // Validar que todos los campos de los hijos estén completos
      for (let child of this.children) {
        if (child.fullName === '' || child.birthdate === '' || child.height === null || child.age === null) {
          this.spinnerService.hide();
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Por favor, complete todos los campos de los hijos.'
          });
          return;
        }
      }
      const newObjectChildren = this.children.map(child => {
        const { id, ...childWithoutId } = child;
        return childWithoutId as IChild;
      });
      this.registerData.children = newObjectChildren;
    }
    this.registerData.dpi = this.registerData.dpi.toString();
    this.registerData.phone = this.registerData.phone?.toString() || null;
    this.registerData.birthdate = this.registerData.birthdate === "" ? undefined : this.registerData.birthdate;
    this.registerData.address = this.registerData.address === "" ? undefined : this.registerData.address;
    this.registerData.email = this.registerData.email === "" ? undefined : this.registerData.email;
    this.registerData.created_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
    console.log("FORM DATA FINAL -> ",this.registerData);
    //LLAMAMOS AL SERVICIO
    this.devoteesService.createDevotee(this.registerData).subscribe({
      next: (res: any) => {
        console.log("RESPONSE CREATE DEVOTEE -> ",res)
        this.spinnerService.hide();
        Swal.fire({
          icon: 'success',
          title: 'Devoto created.',
          showConfirmButton: false,
          timer: 1200
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
        //this.router.navigate(['/user/list']);
      },
      error: (err: any) => {
        console.log("ERROR CREATE DEVOTEE -> ",err)
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


// if(this.isUpdate){
//       this.registerData.updated_by = 'SYSTEM_UPDATE_USER';
//     } else {
//       this.registerData.created_by = 'SYSTEM_CREATE_USER';
//     }