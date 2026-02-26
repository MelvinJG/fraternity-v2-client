import { Component, OnInit } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SpinnerService } from '../../../services/spinner.service';
import { ReceiptsService } from '../../../services/receipts.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAuthService } from '../../../services/user-auth.service';
import { ModalSummaryComponent } from '../../modals/modal-summary/modal-summary.component';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [MdbFormsModule, CommonModule, FormsModule, MdbValidationModule, ReactiveFormsModule],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.scss'
})
export class ReceiptsComponent implements OnInit {
  loadData: any = {
    records: [],
    pagination: {
      hasPreviousPage: false,
      hasNextPage: false,
      previousPage: null,
      nextPage: null,
      pages: []
    }
  };
  modalRefReceipt: MdbModalRef<ModalSummaryComponent> | null = null;
  dpiSearch: string = '';
  isSearching: boolean = false;
  dpiValue: string = '';
  currentPage: number = 1;
  visiblePages: (number | '...')[] = [];

  constructor(
      private spinnerService: SpinnerService,
      private receiptsService: ReceiptsService,
      private modalService: MdbModalService,
      private authService: UserAuthService
    ) { }

  ngOnInit(): void {
    this.loadAllReceipts();
  }

  print(data: any){
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
    Swal.fire({
      title: 'Eliminar Inscripción',
      text: "¿Quieres eliminar esta inscripción?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        const deletedUser = { deleted_by: this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP' };
        this.receiptsService.deleteInscription(id, deletedUser).subscribe({
          next: (res: any) => {
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
    if (!page || page === this.currentPage) {
      return;
    }

    this.spinnerService.show();

    if(this.isSearching) {
      this.receiptsService.getInscriptionsByDPI(this.dpiSearch, page).subscribe({
        next: (res: any) => {
          this.loadData = res.data;
          this.isSearching = true;
          this.refreshVisiblePages(page);
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
          this.refreshVisiblePages(page);
          this.spinnerService.hide();
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

  onSearch() {
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
        this.isSearching = true;
        this.refreshVisiblePages(1);
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
        this.refreshVisiblePages(1);
        this.spinnerService.hide();
      },
      error: (err: any) => {
        this.spinnerService.hide();
        Swal.fire({
          position: "top-end",
          icon: err.status === 500 ? 'error' : 'info',
          title: err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  onInputChange() {
    if (!this.dpiSearch || this.dpiSearch.toString().trim() === '') {
      this.loadAllReceipts();
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
    //this.isDPIValid = dpiIsValid(this.dpiValue.replaceAll(' ', ''));
    this.dpiSearch = this.dpiValue.replaceAll(' ', '');
    if (!this.dpiSearch || this.dpiSearch.toString().trim() === '') {
      this.loadAllReceipts();
    }
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

  private refreshVisiblePages(fallbackPage: number): void {
    const pagination = this.loadData?.pagination || {};
    const totalPages = typeof pagination.totalPages === 'number'
      ? pagination.totalPages
      : Array.isArray(pagination.pages)
        ? pagination.pages.length
        : 0;

    const current = typeof pagination.currentPage === 'number'
      ? pagination.currentPage
      : fallbackPage;

    this.currentPage = current;
    this.visiblePages = this.buildVisiblePages(current, totalPages);
  }

  private buildVisiblePages(currentPage: number, totalPages: number): (number | '...')[] {
    if (!totalPages || totalPages <= 0) {
      return [];
    }

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    const pages: (number | '...')[] = [1];
    if (start > 2) {
      pages.push('...');
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }


    pages.push(totalPages);
    return pages;
  }
}
