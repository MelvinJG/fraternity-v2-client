import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import colorLib from '@kurkle/color';
import { DashboardService } from '../../../services/dashboard.service';
import { SpinnerService } from '../../../services/spinner.service';
import { KpiDataComponent } from '../kpi-data/kpi-data.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KpiDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {
    Chart.register(...registerables);
  }

  chartIncomePerDay: any;
  dataIncomePerDay: Array<any> = [];
  delayed: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.spinnerService.show();
    this.dashboardService.getIncomePerDay().subscribe({
      next: (res: any) => {
        this.dataIncomePerDay = res.data;
        this.spinnerService.hide();
        this.loading = true;
        this.cdr.detectChanges();
        this.createCharts();
      },
      error: (err: any) => {
        this.spinnerService.hide();
      }
    });
  }

  createCharts() {
    this.chartIncomePerDay = new Chart("chartIncomePerDay", {
      type: 'bar',
      data: {
        labels: this.dataIncomePerDay.map(item => {
          const date = new Date(item.fecha);
          const day = String(date.getUTCDate()).padStart(2, '0');
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const year = date.getUTCFullYear();
          return `${day}-${month}-${year}`;
        }),
        datasets: [
          {
            label: 'Recaudado',
            data: this.dataIncomePerDay.map(item => item.total_recaudado),
            borderColor: 'blue',
            backgroundColor: this.transparentize('blue', 0.5),
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Inscripciones',
            data: this.dataIncomePerDay.map(item => item.total_inscripciones),
            borderColor: 'limegreen',
            backgroundColor: this.transparentize('limegreen', 0.5),
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        animation: {
          onComplete: () => {
            this.delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !this.delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        // aspectRatio: 2.5,
        responsive: true
      },
    });
    this.isLoading = true;
  }

  transparentize(value: any, opacity: any) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib(value).alpha(alpha).rgbString();
  }
}
