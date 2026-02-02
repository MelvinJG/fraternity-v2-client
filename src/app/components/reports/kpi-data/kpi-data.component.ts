import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';

interface KpiData {
  total_devotos: number;
  total_inscripciones: number;
  ingresos_totales: number;
  turnos_activos: number;
  ticket_promedio: number;
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
    total_devotos: 10,
    total_inscripciones: 10,
    ingresos_totales: 10,
    turnos_activos: 10,
    ticket_promedio: 10
  };

  loading: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadKpiData();
  }

  loadKpiData(): void {
    this.dashboardService.getKpis().subscribe({
      next: (data: any) => {
        //this.kpiData = data;
        this.loading = false;
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
