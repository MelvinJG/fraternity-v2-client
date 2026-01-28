import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SpinnerService } from '../../services/spinner.service';
import { TurnsService } from '../../services/turns.service';
import Swal from 'sweetalert2';
import { ReceiptsService } from '../../services/receipts.service';
import { ExcelService } from '../../services/excel.service';
import { orderReportInscription } from '../../utils/orderReportInscription';
import { ModalSummaryComponent } from '../modals/modal-summary/modal-summary.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MdbFormsModule, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})

export class ReportsComponent implements OnInit {
  loadData: any;
  modalRefReport: MdbModalRef<ModalSummaryComponent> | null = null;

  constructor(
      private spinnerService: SpinnerService,
      private turnsService: TurnsService,
      private receiptsService: ReceiptsService,
      private excelService: ExcelService,
      private modalService: MdbModalService,
    ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.turnsService.getTurns().subscribe({
      next: (res: any) => {
        this.loadData = res.data.map((data: any) => ({
          id: data.id,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          armNumber: data.armNumber,
          sold: data.sold
        }));
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

  report() {
    this.spinnerService.show();
    this.receiptsService.report().subscribe({
      next: (res: any) => {
        const DATA = orderReportInscription(res.data.turnos);
        this.excelService.ExcelOfficial(DATA, 'reporte_inscripciones');
        this.modalRefReport = this.modalService.open(ModalSummaryComponent, {
          modalClass: 'modal-lg',
          data: {
            isReport: true,
            summaryData: res.data.resumen
          }
        });
        //this.loadData = res.data;
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
}
