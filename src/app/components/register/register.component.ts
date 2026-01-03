import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
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

export class RegisterComponent implements OnInit {

  @Input() isUpdate: boolean = false;
  @Input() dataToUpdate: any;
  isRegisterer: boolean = false;
  isChecked: boolean = false;
  private nextId: number = 2;
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
  childrenToUpdate: IChild[] = [
    { 
      id: 1, 
      fullName: '', 
      birthdate: '', 
      height: null,
      age: null,
      idState: 1
    }
  ];
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

  constructor(
    private spinnerService: SpinnerService,
    private devoteesService: DevoteesService,
    private authService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.spinnerService.show();
    if(this.isUpdate) {
      console.log("DATA TO UPDATE RECEIVED -> ",this.dataToUpdate);
      this.registerData.dpi = this.dataToUpdate.dpi;
      this.registerData.fullName = this.dataToUpdate.fullName;
      this.registerData.address = this.dataToUpdate.address;
      this.registerData.birthdate = this.dataToUpdate.birthdate;
      this.registerData.email = this.dataToUpdate.email;
      this.registerData.phone = this.dataToUpdate.phone;
      this.registerData.height = this.dataToUpdate.height;
      this.registerData.isTutored = this.dataToUpdate.isTutored;
      if(this.registerData.isTutored && this.dataToUpdate.children && this.dataToUpdate.children.length > 0) {
        this.isChecked = true;
        this.children = this.dataToUpdate.children.map((child: any, index: number) => ({
          id: child.id,
          fullName: child.fullName,
          birthdate: child.birthdate,
          height: child.height,
          age: child.age,
          idState: child.idState
        }));
        this.nextId = this.children[this.children.length - 1].id! + 10;
      }
      this.childrenToUpdate = this.children;
    }
    this.spinnerService.hide();
  }

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
      if(this.isUpdate) {
        this.childrenToUpdate = this.childrenToUpdate.map(child => {
          if(child.id === id) {
            return { ...child, idState: 2 }; // Marcar como eliminado
          }
          return child;
        });
      }
      this.children = this.children.filter(child => child.id !== id);
    }
  }

  onCheckboxChange(event: any) {
    console.log('Checkbox changed:', event.target.checked);
    this.isChecked = event.target.checked;
    this.registerData.isTutored = this.isChecked;
  }

  onSubmit(){
    //this.spinnerService.show();
    if(this.registerData.dpi === "" || this.registerData.fullName === "" || this.registerData.height === null) {
      this.spinnerService.hide();
      Swal.fire({
        position: "top-end",
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
          position: "top-end",
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
            position: "top-end",
            icon: 'warning',
            title: 'Oops...',
            text: 'Por favor, complete todos los campos de los hijos.'
          });
          return;
        }
      }
    }
    this.registerData.dpi = this.registerData.dpi.toString();
    this.registerData.phone = this.registerData.phone?.toString() || null;
    this.registerData.birthdate = this.registerData.birthdate === "" ? undefined : this.registerData.birthdate;
    this.registerData.address = this.registerData.address === "" ? undefined : this.registerData.address;
    this.registerData.email = this.registerData.email === "" ? undefined : this.registerData.email;
    if(this.isUpdate) { // ACTUALIZAR DEVOTO
      delete this.registerData.created_by;
      const eliminados = this.childrenToUpdate.filter(child => child.idState === 2);
      const childrenFinal = [...eliminados, ...this.children];
      this.registerData.children = childrenFinal;
      this.registerData.updated_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
      console.log("FORM DATA FINAL UPDATE -> ",this.registerData);
      //LLAMAMOS AL SERVICIO
      this.devoteesService.updateDevotee(this.registerData.dpi, this.registerData).subscribe({
        next: (res: any) => {
          console.log("RESPONSE UPDATE DEVOTEE -> ",res)
          this.spinnerService.hide();
          Swal.fire({
            icon: 'success',
            title: 'Devoto Actualizado.',
            showConfirmButton: false,
            timer: 1200
          });
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        },
        error: (err: any) => {
          console.log("ERROR UPDATE DEVOTEE -> ",err)
          this.spinnerService.hide();
          Swal.fire({
            icon: err.status === 500 ? 'error' : 'info',
            title: 'Oops...',
            text: err.error.message
          })
        }
      });
    } else { // CREAR DEVOTO
      this.registerData.created_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
      // Quitamos el ID para los hijos nuevos ya que es incremental
      const newObjectChildren = this.children.map(child => {
        const { id, ...childWithoutId } = child;
        return childWithoutId as IChild;
      });
      this.registerData.children = newObjectChildren;
      console.log("FORM DATA FINAL CREATE -> ",this.registerData);
      //LLAMAMOS AL SERVICIO
      this.devoteesService.createDevotee(this.registerData).subscribe({
        next: (res: any) => {
          console.log("RESPONSE CREATE DEVOTEE -> ",res)
          this.spinnerService.hide();
          Swal.fire({
            icon: 'success',
            title: 'Devoto Creado.',
            showConfirmButton: false,
            timer: 1200
          });
          setTimeout(() => {
            window.location.reload();
          }, 1200);
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
}


