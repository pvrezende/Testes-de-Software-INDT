import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AreaService } from '../../../shared/services/area-service'
import { ApexXAxis } from 'ng-apexcharts';
;

import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexDataLabels,
  ApexTooltip,
  ApexGrid,
  ChartType
} from 'ng-apexcharts';
import { LeituraService } from '../../../shared/services/leitura-service';

@Component({
  selector: 'app-global-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './global-dashboard.html'
})
export class GlobalDashboard implements OnInit {

  private areaService = inject(AreaService);
  private leituraService = inject(LeituraService);

  areas = signal<any[]>([]);
  leituras = signal<any[]>([]);

  series = signal<ApexAxisChartSeries>([]);
  labels = signal<string[]>([]);

  xaxis = signal<ApexXAxis>({
    categories: []
  });

  totalAlertas = signal(0);
  totalSensores = signal(0);
  sensoresAtivos = signal(0);
  sensoresInativos = signal(0);


   chartOptions: {
    chart: ApexChart;
    stroke: ApexStroke;
    colors: string[];
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    tooltip: ApexTooltip;
  } = {
    chart: {
      type: 'area' as ChartType,   
      height: 350,
      toolbar: { show: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#f97316', '#3b82f6'],
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light'
    }
  };;

  ngOnInit() {
    this.areaService.listarAreas().subscribe(res => {
      this.areas.set(res);
    });
  }

  onAreaChange(event: Event) {
    const areaId = (event.target as HTMLSelectElement).value;
    if (!areaId) return;

    this.leituraService.listarPorArea(areaId).subscribe((res: any) => {

      this.series.set([
        {
          name: 'Temperatura (°C)',
          data: res.temperatura
        },
        {
          name: 'Umidade (%)',
          data: res.umidade
        }
      ]);

      this.xaxis.set({
        categories: res.labels
      });

      const leiturasReconstruidas = res.labels.map((label: string, i: number) => ({
        dataHora: label,
        temperatura: res.temperatura[i],
        umidade: res.umidade[i]
      }));

      this.leituras.set(leiturasReconstruidas);

    });
    // Sensores
    this.areaService.sensorAtivoPorArea(areaId).subscribe(res => {
      console.log(res)
      this.totalSensores.set(res.total);
      this.sensoresAtivos.set(res.ativos);
      this.sensoresInativos.set(res.inativos);
    });
  }

  montarGrafico(leituras: any[]) {
    this.series.set([
      {
        name: 'Temperatura (°C)',
        data: leituras.map(l => l.temperatura)
      },
      {
        name: 'Umidade (%)',
        data: leituras.map(l => l.umidade)
      }
    ]);

    this.labels.set(
      leituras.map(l =>
        new Date(l.dataHora).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      )
    );
  }


  totalAreas() {
    return this.areas().length;
  }

  temperaturaMedia() {
    if (this.leituras().length === 0) return 0;

    const soma = this.leituras()
      .reduce((acc, l) => acc + l.temperatura, 0);

    return (soma / this.leituras().length).toFixed(1);
  }

}
