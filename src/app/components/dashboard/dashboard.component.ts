import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import colorLib from '@kurkle/color';
import { DashboardService } from '../../services/dashboard.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
    private spinnerService: SpinnerService
  ) {
    Chart.register(...registerables);
  }

  chartDevotos: any;
  chartAlturas: any;
  chartVentas: any;
  exampleChart1: any;
  exampleChart2: any;
  exampleChart3: any;
  exampleChart4: any;
  data: Array<any> = [];
  data2: Array<any> = [];
  delayed: boolean = false;

  ngOnInit(): void {
    this.spinnerService.show();
    this.dashboardService.getIncomePerDay().subscribe({
      next: (res: any) => {
        console.log('✅ Income per day data fetched successfully:', res);
        this.data = res.data;
        this.data2 = res.data;
        console.log('🔥 Data for charts:', this.data.map(item => item.total_inscripciones.toString()));
        this.spinnerService.hide();
        this.createChartsExamples();
      },
      error: (err: any) => {
        console.error('Error fetching income per day data:', err);
        this.spinnerService.hide();
      }
    });
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
    // this.exampleChart1 = new Chart("Chart1", {
    //   type: 'line',
    //   data: {
    //     labels: [
    //       '2025-05-10',
    //       '2025-05-11',
    //       '2025-05-12',
    //       '2025-05-13',
    //       '2025-05-14',
    //       '2025-05-15',
    //       '2025-05-16',
    //       '2025-05-17',
    //     ],
    //     datasets: [
    //       {
    //         data: ['467', '576', '572', '79', '92', '574', '573', '576'],
    //         label: 'Ingresos',
    //         // backgroundColor:'rgba(54, 162, 235, 0.4)',
    //         // borderColor:'rgb(54, 162, 235)',
    //         backgroundColor: 'rgba(255, 99, 132, 0.4)',
    //         borderColor: 'rgb(255, 99, 132)',
    //         borderWidth: 3,
    //         fill: true,
    //         pointStyle: 'circle',
    //         pointRadius: 10,
    //         pointHoverRadius: 15
    //       }
    //     ]
    //   },
    //   options: {
    //     //responsive: true
    //     aspectRatio: 2.5
    //   }
    // });

    // this.exampleChart2 = new Chart("Chart2", {
    //   type: 'bar', //this denotes tha type of chart
    //   data: {
    //     // values on X-Axis
    //     labels: [
    //       '2025-05-10',
    //       '2025-05-11',
    //       '2025-05-12',
    //       '2025-05-13',
    //       '2025-05-14',
    //       '2025-05-15',
    //       '2025-05-16',
    //       '2025-05-17',
    //     ],
    //     datasets: [
    //       {
    //         label: 'Ventas',
    //         data: ['467', '576', '572', '79', '92', '574', '573', '576'],
    //         backgroundColor: 'blue',
    //       },
    //       {
    //         label: 'Ganancias',
    //         data: ['542', '542', '536', '327', '17', '0.00', '538', '541'],
    //         backgroundColor: 'limegreen',
    //       },
    //     ],
    //   },
    //   options: {
    //     aspectRatio: 2.5,
    //   },
    // });

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

    // MISMOS DATOS GRAFICA 1 Y 2
    this.exampleChart1 = new Chart("Chart1", {
      type: 'bar',
      data: {
        labels: this.data2.map(item => {
          const date = new Date(item.fecha);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }),
        datasets: [
          {
            label: 'Recaudado',
            data: this.data2.map(item => item.total_recaudado),
            backgroundColor: 'rgba(255, 99, 132, 0.4)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            order: 1,
            borderRadius: 9,
            borderSkipped: false,
          },
          {
            label: 'Inscripciones',
            data: this.data2.map(item => item.total_inscripciones),
            backgroundColor:'rgba(54, 162, 235, 0.4)',
            borderColor:'rgb(54, 162, 235)',
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
        responsive: true,
        //aspectRatio: 2.5,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Recaudación e Inscripciones Diarias',
            font: {
              size: 20,
              family: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
              weight: 'normal',
              style: 'normal'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        },
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

    // MISMOS DATOS GRAFICA 1 Y 2
    this.exampleChart2 = new Chart("Chart2", {
      type: 'bar',
      data: {
        labels: this.data.map(item => {
          const date = new Date(item.fecha);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        }),
        datasets: [
          {
            label: 'Recaudado',
            data: this.data.map(item => item.total_recaudado),
            borderColor: 'blue',
            backgroundColor: this.transparentize('blue', 0.5),
            borderWidth: 2,
            borderRadius: 9,
            borderSkipped: false,
          },
          {
            label: 'Inscripciones',
            data: this.data.map(item => item.total_inscripciones),
            borderColor: 'limegreen',
            backgroundColor: this.transparentize('limegreen', 0.5),
            borderWidth: 2,
            borderRadius: 9,
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
        // responsive: true,
        // plugins: {
        //   legend: {
        //     position: 'top',
        //   },
        //   title: {
        //     display: true,
        //     text: 'Chart.js Bar Chart'
        //   }
        // }
      },
    });
  }

  transparentize(value: any, opacity: any) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib(value).alpha(alpha).rgbString();
  }

  
}
