import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import colorLib from '@kurkle/color';
import { DashboardService } from '../../../services/dashboard.service';
import { SpinnerService } from '../../../services/spinner.service';
import { KpiDataComponent } from '../kpi-data/kpi-data.component';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  isChartIncomePerDay: boolean = false;

  chartInscriptionsPerTurns: any;
  dataInscriptionsPerTurns: Array<any> = [];
  isChartInscriptionsPerTurns: boolean = false;

  chartTop10Devotees: any;
  dataTop10Devotees: Array<any> = [];
  isChartTop10Devotees: boolean = false;

  delayed: boolean = false;
  isChartsLoading: boolean = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.spinnerService.show();
    // Ejecutar las 3 llamadas en paralelo
    forkJoin({
      incomePerDay: this.dashboardService.getIncomePerDay().pipe(
        catchError(error => {
          this.isChartIncomePerDay = true;
          console.error('Error al cargar ingresos por día:', error);
          return of({ data: [] }); // Retornar array vacío en caso de error
        })
      ),
      inscriptionsPerTurns: this.dashboardService.getInscriptionsPerTurns().pipe(
        catchError(error => {
          this.isChartInscriptionsPerTurns = true;
          console.error('Error al cargar inscripciones por turno:', error);
          return of({ data: [] }); // Retornar array vacío en caso de error
        })
      ),
      top10Devotees: this.dashboardService.getTop10Devotees().pipe(
        catchError(error => {
          this.isChartTop10Devotees = true;
          console.error('Error al cargar top 10 devotos:', error);
          return of({ data: [] }); // Retornar array vacío en caso de error
        })
      )
    }).subscribe({
      next: (results) => {
        // Asignar los datos (incluso si algunos están vacíos por errores)
        this.dataIncomePerDay = (results.incomePerDay as any).data || [];
        this.dataInscriptionsPerTurns = (results.inscriptionsPerTurns as any).data || [];
        this.dataTop10Devotees = (results.top10Devotees as any).data || [];
        
        // Siempre ocultar el spinner y actualizar estados
        this.spinnerService.hide();
        this.isChartIncomePerDay = this.isChartIncomePerDay ? false : true;
        this.isChartInscriptionsPerTurns = this.isChartInscriptionsPerTurns ? false : true;
        this.isChartTop10Devotees = this.isChartTop10Devotees ? false : true;
        this.cdr.detectChanges();
        // Crear charts con los datos disponibles
        this.createCharts();
      },
      error: (err) => {
        // Este error solo ocurriría si forkJoin falla completamente (muy raro)
        console.error('Error crítico al cargar datos del dashboard:', err);
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
    this.chartTop10Devotees = new Chart("chartTop10Devotees", {
      type: 'bar',
      data: {
        labels: this.dataTop10Devotees.map(item => { return [item.devoto, item.dpi]; } ),
        datasets: [
          {
            label: 'Turnos Adquiridos',
            data: this.dataTop10Devotees.map(item => item.total_inscripciones),
            backgroundColor:'rgba(54, 162, 235, 0.4)',
            borderColor:'rgb(54, 162, 235)',
            borderWidth: 2,
            order: 1,
            borderRadius: 5,
            borderSkipped: false
          }
        ]
      },
      options: {
        indexAxis: 'y',
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
      }
    });
    this.chartInscriptionsPerTurns = new Chart("chartInscriptionsPerTurns", {
      type: 'bar',
      data: {
        labels: this.dataInscriptionsPerTurns.map(item => item.turno),
        datasets: [
          {
            label: 'Vendidos',
            data: this.dataInscriptionsPerTurns.map(item => item.total_inscripciones),
            backgroundColor: 'rgba(255, 99, 132, 0.4)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            type: 'line',
            fill: true,
            pointStyle: 'star',
            pointRadius: 6,
            pointHoverRadius: 15,
            order: 0
          }
        ]
      },
      options: {
        indexAxis: 'y',
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
      }
    });
    this.isChartsLoading = true;
  }

  transparentize(value: any, opacity: any) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib(value).alpha(alpha).rgbString();
  }
}
