import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SpinnerService } from '../../../services/spinner.service';
import { TurnsService } from '../../../services/turns.service';
import { ReceiptsService } from '../../../services/receipts.service';
import { ExcelService } from '../../../services/excel.service';
import { orderReportInscription } from '../../../utils/orderReportInscription';
import { ModalSummaryComponent } from '../../modals/modal-summary/modal-summary.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-excel-report-turns',
    imports: [MdbFormsModule, CommonModule],
    templateUrl: './excel-report-turns.component.html',
    styleUrl: './excel-report-turns.component.scss'
})

export class ExcelReportTurnsComponent implements OnInit {
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
        if (err.status === 0) {
          toast.error(err.message || "Error interno del servidor");
        } else if (err.status === 500) {
          toast.error(err.error.message || "Error interno del servidor");
        } else if (err.status === 404) {
          this.loadData = [];
        } else {
          toast.info(err.error.message);
        }
      }
    });
  }

  async report() {
    this.spinnerService.show();
    this.receiptsService.report().subscribe({
      next: async (res: any) => {
        const DATA = orderReportInscription(res.data.turnos);
        await this.excelService.ExcelOfficial(DATA, 'reporte_inscripciones');
        this.modalRefReport = this.modalService.open(ModalSummaryComponent, {
          modalClass: 'modal-lg',
          data: {
            isReport: true,
            summaryData: res.data.resumen
          }
        });
        this.spinnerService.hide();
      },
      error: (err: any) => {
        this.spinnerService.hide();
        err.status === 500 || err.status === 0 ? toast.error(err.error.message || err.message || "Error interno del servidor") : toast.info(err.error.message);
      }
    });
  }
}
