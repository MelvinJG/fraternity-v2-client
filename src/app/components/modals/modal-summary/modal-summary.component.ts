import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { NewTemplateReceipt } from '../../../utils/NewTemplateReceipt';

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
      hora: this.hour,
      codDevoto: 'D88888',
    };
    NewTemplateReceipt(info);
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
