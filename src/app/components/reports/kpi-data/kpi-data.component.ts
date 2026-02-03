import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';

interface KpiData {
  total_devotos: number,
  total_inscripciones: number,
  ingresos_totales: number,
  turnos_activos: number,
  altura_promedio: number,
  ticket_promedio: number,
  devotos_esta_semana: number,
  inscripciones_esta_semana: number,
  ingresos_esta_semana: number
}

@Component({
  selector: 'app-kpi-data',
  standalone: true,
  imports: [],
  templateUrl: './kpi-data.component.html',
  styleUrl: './kpi-data.component.scss'
})
export class KpiDataComponent {

  kpiData: KpiData = {
    total_devotos: 0,
    total_inscripciones: 0,
    ingresos_totales: 0,
    turnos_activos: 0,
    altura_promedio: 0,
    ticket_promedio: 0,
    devotos_esta_semana: 0,
    inscripciones_esta_semana: 0,
    ingresos_esta_semana: 0
  };

  loading: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadKpiData();
  }

  loadKpiData(): void {
    this.dashboardService.getKpis().subscribe({
      next: (data: any) => {
        this.kpiData = data.data[0];
        this.kpiData.ingresos_totales = Number(this.kpiData.ingresos_totales);
        this.kpiData.altura_promedio = Number(this.kpiData.altura_promedio);
        this.kpiData.ticket_promedio = Number(this.kpiData.ticket_promedio);
        this.kpiData.ingresos_esta_semana = Number(this.kpiData.ingresos_esta_semana);
        this.loading = true;
      },
      error: (error) => {
        console.error('Error loading KPIs:', error);
        this.loading = false;
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-GT').format(value);
  }
}
