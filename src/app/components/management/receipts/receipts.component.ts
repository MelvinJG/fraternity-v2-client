import { Component, OnInit } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SpinnerService } from '../../../services/spinner.service';
import { ReceiptsService } from '../../../services/receipts.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { FormsModule } from '@angular/forms';
import { UserAuthService } from '../../../services/user-auth.service';
import { ModalSummaryComponent } from '../../modals/modal-summary/modal-summary.component';

@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [MdbFormsModule, CommonModule, FormsModule],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.scss'
})
export class ReceiptsComponent implements OnInit {
  loadData: any = [];
  modalRefReceipt: MdbModalRef<ModalSummaryComponent> | null = null;
  dpiSearch: string = '';
  isSearching: boolean = false;

  constructor(
      private spinnerService: SpinnerService,
      private receiptsService: ReceiptsService,
      private modalService: MdbModalService,
      private authService: UserAuthService
    ) { }

  ngOnInit(): void {
    this.loadAllReceipts();
  }

  ngAfterViewInit() {
    const element = document.getElementById(`page-1`);
    console.log("element", element);
    if (element) {
      element.classList.add('active');
    }
    //this.spinnerService.hide();
  }

  print(data: any){
    console.log("data", data)
    this.modalRefReceipt = this.modalService.open(ModalSummaryComponent, {
      modalClass: 'modal-lg',
      data: {
        noTable: String(data.mesa).padStart(3, '0'),
        height: data.hijo_altura ? data.hijo_altura : data.padre_altura,
        noReceipt: `M-${String(data.inscripcion_id).padStart(4, '0')}`,
        name: data.hijo_nombre ? data.hijo_nombre : data.padre_nombre,
        address: data.padre_direccion || 'Sin información',
        turn: data.turno_descripcion,
        amount: data.monto,
        date: new Date(data.fecha_inscripcion).toLocaleDateString("es-GT"),
        hour: new Date(data.fecha_inscripcion).toLocaleTimeString("es-GT")
      }
    });
  }

  delete(id: number){
    console.log("inscripcion_id", id)
    Swal.fire({
      title: 'Eliminar Inscripción',
      text: "¿Quieres eliminar esta inscripción?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        const deletedUser = { deleted_by: this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP' };
        this.receiptsService.deleteInscription(id, deletedUser).subscribe({
          next: (res: any) => {
            console.log("RESPONSE deleteInscription -> ",res)
            this.spinnerService.hide();
            Swal.fire({
              icon: 'success',
              title: 'Inscripción Eliminada.',
              showConfirmButton: false,
              timer: 1200
            });
            setTimeout(() => {
              //window.location.reload();
              this.ngOnInit();
            }, 1200);
          },
          error: (err: any) => {
            console.log("ERROR deleteInscription -> ",err)
            this.spinnerService.hide();
            Swal.fire({
              icon: err.status === 500 ? 'error' : 'info',
              title: 'Oops...',
              text: err.error.message
            })
          }
        });
      }
    });
  }

  changePage(page: number) {
    this.spinnerService.show();
    console.log("Change to page:", page);
    const elementI = document.getElementsByClassName(`custom-mel`);
    console.log("elementI", elementI);
    if (elementI) {
      for (let i = 0; i < elementI.length; i++) {
        elementI[i].classList.remove('active');
      }
    }
    const element = document.getElementById(`page-${page}`);
    if (element) {
      element.classList.add('active');
    }
    if(this.isSearching) {
      this.receiptsService.getInscriptionsByDPI(this.dpiSearch, page).subscribe({
        next: (res: any) => {
          this.loadData = res.data;
          console.log("this.loadData",this.loadData)
          this.isSearching = true;
          console.log("this.isSearching",this.isSearching)
          this.spinnerService.hide();
        },
        error: (err: any) => {
          this.isSearching = false;
          this.spinnerService.hide();
          Swal.fire({
            icon: err.status === 500 ? 'error' : 'info',
            title: 'Oops...',
            text: err.error.message
          })
        }
      });
    } else {
      this.isSearching = false;
      this.receiptsService.getInscriptions(page).subscribe({
        next: (res: any) => {
          this.loadData = res.data;
          console.log("this.loadData",this.loadData)
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
    this.spinnerService.hide();
  }

  onSearch() {
    console.log("🟩 START this.dpiSearch ->", this.dpiSearch);
    if(!this.dpiSearch || this.dpiSearch === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Ingrese un DPI válido.'
      });
      this.isSearching = false;
      return;
    }
    this.spinnerService.show();
    this.receiptsService.getInscriptionsByDPI(this.dpiSearch).subscribe({
      next: (res: any) => {
        this.loadData = res.data;
        console.log("this.loadData",this.loadData)
        this.isSearching = true;
        console.log("this.isSearching",this.isSearching)
        this.spinnerService.hide();
      },
      error: (err: any) => {
        this.isSearching = false;
        this.spinnerService.hide();
        Swal.fire({
          icon: err.status === 500 ? 'error' : 'info',
          title: 'Oops...',
          text: err.error.message
        })
      }
    });
  }

  loadAllReceipts() {
    this.spinnerService.show();
    this.receiptsService.getInscriptions(1).subscribe({
      next: (res: any) => {
        this.loadData = res.data;
        console.log("this.loadData",this.loadData)
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

  onInputChange() {
    if (!this.dpiSearch || this.dpiSearch.toString().trim() === '') {
      this.loadAllReceipts();
    }
  }
}
