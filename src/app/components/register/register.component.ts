import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SpinnerService } from '../../services/spinner.service';
import { UserAuthService } from '../../services/user-auth.service';
import Swal from 'sweetalert2';
import { DevoteesService } from '../../services/devotees.service';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

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
  imports: [MdbFormsModule, CommonModule, FormsModule, MdbValidationModule, ReactiveFormsModule],
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
  dpiValue: string = '';

  constructor(
    private spinnerService: SpinnerService,
    private devoteesService: DevoteesService,
    private authService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.spinnerService.show();
    if(this.isUpdate) {
      this.registerData.dpi = this.dataToUpdate.dpi;
      this.dpiValue = this.formatDPI(this.dataToUpdate.dpi);
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
    this.isChecked = event.target.checked;
    this.registerData.isTutored = this.isChecked;
  }

  onSubmit(){
    //this.spinnerService.show();
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
      //LLAMAMOS AL SERVICIO
      this.devoteesService.updateDevotee(this.registerData.dpi, this.registerData).subscribe({
        next: (res: any) => {
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
      //LLAMAMOS AL SERVICIO
      this.devoteesService.createDevotee(this.registerData).subscribe({
        next: (res: any) => {
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


