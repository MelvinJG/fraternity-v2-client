import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor() {
    Chart.register(...registerables);
  }

  chartDevotos: any;
  chartAlturas: any;
  chartVentas: any;
  exampleChart1: any;
  exampleChart2: any;
  exampleChart3: any;
  exampleChart4: any;

  ngOnInit(): void {
    // this.createChart();
    this.createChartsExamples();
  }

  createChart() {
    this.chartDevotos = new Chart("Devotos", {
      type: 'doughnut',
      data: {
        labels: ['Alumnos','Empleados'],
        datasets: [
          {
            data: [100,80],
            backgroundColor: [
              'rgb(142, 68, 173)',
              'rgba(142, 68, 173,0.4)'
            ]
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
      }
    });
    this.chartAlturas = new Chart('Alturas', {
      type: 'bar', //this denotes tha type of chart
      data: {
        // values on X-Axis
        labels: [
          '2022-05-10',
          '2022-05-11',
          '2022-05-12',
          '2022-05-13',
          '2022-05-14',
          '2022-05-15',
          '2022-05-16',
          '2022-05-17',
        ],
        datasets: [
          {
            label: 'Sales',
            data: ['467', '576', '572', '79', '92', '574', '573', '576'],
            backgroundColor: 'blue',
          },
          {
            label: 'Profit',
            data: ['542', '542', '536', '327', '17', '0.00', '538', '541'],
            backgroundColor: 'limegreen',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
    this.chartVentas = new Chart("Ventas", {
      type: 'line',
      data: {
        labels: [
          '2022-05-10',
          '2022-05-11',
          '2022-05-12',
          '2022-05-13',
          '2022-05-14',
          '2022-05-15',
          '2022-05-16',
          '2022-05-17',
        ],
        datasets: [
          {
            data: ['467', '576', '572', '79', '92', '574', '573', '576'],
            label: 'Ingresos',
            backgroundColor:'rgba(54, 162, 235, 0.4)',
            borderColor:'rgb(54, 162, 235)',
            // backgroundColor: 'rgba(255, 99, 132, 0.4)',
            // borderColor: 'rgb(255, 99, 132)',
            borderWidth: 3,
            fill: true,
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15
          }
        ]
      },
      options: {
        responsive: true
        // aspectRatio: 2.5
      }
    });
  }

  createChartsExamples() {
    this.exampleChart1 = new Chart("Chart1", {
      type: 'line',
      data: {
        labels: [
          '2025-05-10',
          '2025-05-11',
          '2025-05-12',
          '2025-05-13',
          '2025-05-14',
          '2025-05-15',
          '2025-05-16',
          '2025-05-17',
        ],
        datasets: [
          {
            data: ['467', '576', '572', '79', '92', '574', '573', '576'],
            label: 'Ingresos',
            // backgroundColor:'rgba(54, 162, 235, 0.4)',
            // borderColor:'rgb(54, 162, 235)',
            backgroundColor: 'rgba(255, 99, 132, 0.4)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 3,
            fill: true,
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15
          }
        ]
      },
      options: {
        //responsive: true
        aspectRatio: 2.5
      }
    });

    this.exampleChart2 = new Chart("Chart2", {
      type: 'bar', //this denotes tha type of chart
      data: {
        // values on X-Axis
        labels: [
          '2025-05-10',
          '2025-05-11',
          '2025-05-12',
          '2025-05-13',
          '2025-05-14',
          '2025-05-15',
          '2025-05-16',
          '2025-05-17',
        ],
        datasets: [
          {
            label: 'Ventas',
            data: ['467', '576', '572', '79', '92', '574', '573', '576'],
            backgroundColor: 'blue',
          },
          {
            label: 'Ganancias',
            data: ['542', '542', '536', '327', '17', '0.00', '538', '541'],
            backgroundColor: 'limegreen',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });

    this.exampleChart3 = new Chart("Chart3", {
      type: 'doughnut',
      data: {
        labels: ['Hombres','Mujeres'],
        datasets: [
          {
            data: [100,80],
            backgroundColor: [
              'rgb(142, 68, 173)',
              'rgba(142, 68, 173,0.4)'
            ]
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
      }
    });

    this.exampleChart4 = new Chart("Chart4", {
      type: 'line',
      data: {
        labels: [
          '2025-05-10',
          '2025-05-11',
          '2025-05-12',
          '2025-05-13',
          '2025-05-14',
          '2025-05-15',
          '2025-05-16',
          '2025-05-17',
        ],
        datasets: [
          {
            data: ['467', '576', '572', '79', '92', '574', '573', '576'],
            label: 'Ingresos',
            backgroundColor:'rgba(54, 162, 235, 0.4)',
            borderColor:'rgb(54, 162, 235)',
            // backgroundColor: 'rgba(255, 99, 132, 0.4)',
            // borderColor: 'rgb(255, 99, 132)',
            borderWidth: 3,
            fill: true,
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15
          }
        ]
      },
      options: {
        //responsive: true
        aspectRatio: 2.5
      }
    });
  }
}
