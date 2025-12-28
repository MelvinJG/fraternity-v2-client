import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { RegisterComponent } from '../register/register.component';
import { SpinnerService } from '../../services/spinner.service';
import { CommonModule } from '@angular/common';
import { DevoteesService } from '../../services/devotees.service';
import Swal from 'sweetalert2';
import { TurnsService } from '../../services/turns.service';
import { UserAuthService } from '../../services/user-auth.service';
import { ReceiptsService } from '../../services/receipts.service';
import { ModalSummaryComponent } from '../modals/modal-summary/modal-summary.component';
import { ModalComponent } from '../modals/modal-update-devotees/modal.component';

interface IOption {
  value: string;
  label: string;
  height?: number;
  isFather?: boolean;
  price?: number;
  available?: number; //quantity - sold
}

interface IRegistration {
  dpiDevotee: string;
  idChild?: number | null;
  idTurn: number;
  amount: number | null;
  idState: number;
  created_by: string;
}

@Component({ 
  selector: 'app-home',
  standalone: true,
  imports: [MdbFormsModule, MdbTabsModule, RegisterComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  isDataLoaded: boolean = false;
  modalRef: MdbModalRef<ModalComponent> | null = null;
  modalRefReceipt: MdbModalRef<ModalSummaryComponent> | null = null;
  dpiSearch: string = '';
  devoteeInfo: any;
  isTutored: boolean = false;
  labelHeight: string = '... ';
  labelPrice: string | null = '...';
  devoteesNames: IOption[] = [];
  turns: IOption[] = [];
  selectedPerson: string = ''; // Nueva variable para el select
  nameForReceipt: string = '';
  turnForReceipt: string = '';

  registrationData: IRegistration = {
    dpiDevotee: '',
    idChild: null,
    idTurn: 0,
    amount: null,
    idState: 1,
    created_by: ''
  };

  constructor(
    private modalService: MdbModalService,
    private spinnerService: SpinnerService,
    private devoteesService: DevoteesService,
    private turnsService: TurnsService,
    private authService: UserAuthService,
    private receiptsService: ReceiptsService
  ) {}

  ngOnInit(): void {
    const mainElement = document.getElementById('div-main');
    if (mainElement) {
      mainElement.classList.add('main-content');
    }
    const containerDiv = document.getElementById('div-origin');
    if (containerDiv) {
      containerDiv.classList.add('container-fluid', 'p-4');
    }
    this.turnsService.getTurns().subscribe({
      next: (res: any) => {
        this.turns = res.data.map((turn: any) => ({
          value: String(turn.id),
          label: turn.description,
          price: turn.price,
          available: turn.quantity === null ? null : turn.quantity - turn.sold
        }));
        console.log("this.turns -> ", this.turns);
      },
      error: (err: any) => {
        Swal.fire({
          icon: err.status === 500 ? 'error' : 'info',
          title: 'Oops...',
          text: err.error.message
        })
      }
    });
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalComponent, {
      modalClass: 'modal-lg',
      data: {
        isUpdate: true,
      }
    });
  }

  onSearch() {
    this.labelHeight = '... ';
    this.isTutored = false;
    this.devoteesNames = [];
    console.log("🟩 START this.isTutored ->", this.isTutored);
    console.log("🟦 START this.devoteesNames -> ", this.devoteesNames);
    if(this.dpiSearch === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese un DPI válido.'
      });
      return;
    }
    this.spinnerService.show();
    this.devoteesService.getDevoteeByDPI(this.dpiSearch).subscribe({
      next: (res: any) => {
        this.devoteeInfo = res.data;
        console.log("RESPONSE GET DPI DEVOTEE -> ",this.devoteeInfo);
        this.registrationData.dpiDevotee = this.devoteeInfo.dpi;
        if(this.devoteeInfo.isTutored) {
          this.isTutored = true;
          const father: IOption = {
            value: this.devoteeInfo.dpi,
            label: this.devoteeInfo.fullName,
            height: this.devoteeInfo.height,
            isFather: true
          }
          const children = this.devoteeInfo.children.map((child: any) => ({ 
            value: String(child.id), 
            label: child.fullName, 
            height: child.height 
          }));
          this.devoteesNames = [father, ...children];
          // Selecciona el primer elemento (padre) por defecto
          this.selectedPerson = this.devoteesNames[0].value;
          this.nameForReceipt = this.devoteesNames[0].label;
          this.labelHeight = this.devoteesNames[0].height ? `${this.devoteesNames[0].height}` : 'N/A';
        } else {
          this.labelHeight = this.devoteeInfo.height ? `${this.devoteeInfo.height}` : 'N/A';
          this.nameForReceipt = this.devoteeInfo.fullName;
        }
        console.log("DEVOTEE INFO -> ", this.devoteeInfo);
        this.spinnerService.hide();
        setTimeout(() => {
          this.isDataLoaded = true;
        }, 100);
        console.log("🟩🟩 END this.isTutored ->", this.isTutored);
        console.log("🟦🟦 END this.devoteesNames -> ", this.devoteesNames);
      },
      error: (err: any) => {
        this.isDataLoaded = false;
        console.log("ERROR DET DPI DEVOTEE -> ",err)
        this.spinnerService.hide();
        setTimeout(() => {
          Swal.fire({
            icon: err.status === 500 ? 'error' : 'info',
            title: 'Oops...',
            text: err.error.message
          });
        }, 100);
      }
    });
  }

  onChangeSelect(event: any, nameSelect: string){
    console.log("EVENT SELECT -> ", event.target.value);
    if(nameSelect === 'person') {
      this.devoteesNames.map(option => {
        if(option.value === event.target.value) {
          this.labelHeight = option.height ? `${option.height}` : 'N/A';
          this.nameForReceipt = option.label;
          if(!option.isFather) {
            this.registrationData.idChild = Number(event.target.value); // CUANDO SEA UN HIJO
          } else {
            this.registrationData.idChild = null; // CUANDO SEA EL PADRE
          }
        }
      });
    } else if(nameSelect === 'turn') {
      this.registrationData.idTurn = Number(event.target.value);
      this.turns.map(option => {
        if(option.value === event.target.value) {
          this.labelPrice = option.price ? `${option.price}` : null;
          this.registrationData.amount = option.price ? Number(option.price) : null;
          this.turnForReceipt = option.label;
        }
      });
      console.log("LABEL PRICE -> ", this.labelPrice);
    }
  }

  onSubmit() {
    console.log("🔥 REGISTRATION DATA -> ", this.registrationData);
    this.registrationData.created_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
    if(this.registrationData.dpiDevotee === '' || this.registrationData.idTurn === 0 || 
      this.registrationData.amount === null) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor complete todos los campos.'
      });
      return;
    }
    this.spinnerService.show();
    this.receiptsService.registration(this.registrationData).subscribe({
      next: (res: any) => {
        console.log("🔥🔥 RESPONSE REGISTRATION -> ",res);
        this.spinnerService.hide();
        this.modalRefReceipt = this.modalService.open(ModalSummaryComponent, {
          modalClass: 'modal-lg',
          data: {
            noTable: String(res.data.noTable).padStart(3, '0'), //1 remplazar por SERVICIO.DATA.noTable
            height: this.labelHeight,
            noReceipt: `M-${String(res.data.noReceipt).padStart(4, '0')}`, //REEMPLAZAR POR SERVICIO.DATA.noReceipt
            name: this.nameForReceipt,
            address: this.devoteeInfo.address || 'Sin información',
            turn: this.turnForReceipt,
            amount: this.registrationData.amount,
            date: new Date().toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            hour: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', hour12: true })
          }
        });
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
    /*LA INSCRIPCION RETORNA ESTO
    {
      "code": "OPERATION_SUCCESSFUL",
      "message": "Operación exitosa.",
      "data": {
        "noReceipt": 7,
        "noTable": 1
      }
    }
    */
  }
}
