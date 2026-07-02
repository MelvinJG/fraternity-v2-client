import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { templateReceiptSept } from '../../../utils/templateReceipt Morado - Sep Mujeres';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { templateReceiptSemSantHom } from '../../../utils/templateReceipt Corinto - SemSant Hombres';
import { templateReceiptNov } from '../../../utils/templateReceipt Negro - Nov Hombres';
import { templateReceiptSemSantMuj } from '../../../utils/templateReceipt Morado - SemSant Mujeres';

@Component({
  selector: 'app-modal-summary',
  standalone: true,
  imports: [CommonModule, MdbRippleModule],
  templateUrl: './modal-summary.component.html',
  styleUrl: './modal-summary.component.scss'
})
export class ModalSummaryComponent {
  noTable: string = '';
  height: string = '';
  noReceipt: string = '';
  name: string = '';
  address: string = '';
  turn: string = '';
  amount: string = '';
  date: string = '';
  hour: string = '';
  idFraternity: number = 0;
  fullDate: string = '';
  isReport: boolean = false;
  summaryData: any = {};

  constructor(
    public modalRef: MdbModalRef<ModalSummaryComponent>,
    private router: Router
  ) {}

  print() {
    const info = {
      numeroMesa: this.noTable,
      estatura: this.height,
      numeroRecibo: this.noReceipt,
      nombre: this.name,
      direccion: this.address,
      turno: this.turn,
      monto: this.amount,
      fecha: this.date,
      hora: this.hour
    };
    const parsedDate = new Date(this.fullDate);
    const month = Number.isNaN(parsedDate.getTime())
      ? new Date().getMonth() + 1
      : parsedDate.getMonth() + 1;
    const isDecToMay = month === 12 || month <= 5;
    const isJunToNov = month >= 6 && month <= 11;
    if (this.idFraternity === 1 && isDecToMay) {
      templateReceiptSemSantHom(info); // Semana Santa Hermandad Jesus
    } else if (this.idFraternity === 2 && isDecToMay) {
      templateReceiptSemSantMuj(info); // Semana Santa Hermandad Virgen
    } else if (this.idFraternity === 1 && isJunToNov) {
      templateReceiptNov(info); // Noviembre Hermandad Jesus
    } else if (this.idFraternity === 2 && isJunToNov) {
      templateReceiptSept(info); // Septiembre Hermandad Virgen
    } else {
      templateReceiptSemSantHom(info) // Default
    }
  }

  reload() {
    this.modalRef.close();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  getTotalGeneral(): number {
    return this.summaryData?.turnos?.reduce(
      (sum: number, turno: any) => sum + turno.monto_total, 
      0
    ) || 0;
  }
}
