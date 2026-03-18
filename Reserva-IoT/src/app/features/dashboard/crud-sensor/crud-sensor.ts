import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SensorService } from '../../../shared/services/sensor-service';
import { AreaService } from '../../../shared/services/area-service';

@Component({
  selector: 'app-crud-sensor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-sensor.html'
})
export class CrudSensorComponent {

  private sensorService = inject(SensorService);
  private areaService = inject(AreaService);

  sensores = signal<any[]>([]);
  areas = signal<any[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  erroMsg = signal<string | null>(null);

  statusList = ['Ativo', 'Inativo', 'Manutencao'];

  form = new FormGroup({
    serialNumber: new FormControl('', Validators.required),
    fabricante: new FormControl('', Validators.required),
    modelo: new FormControl('', Validators.required),
    tipo: new FormControl('', Validators.required),
    dataInstalacao: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    cicloLeitura: new FormControl<number | null>(null, Validators.required),
    latitude: new FormControl<number | null>(null, Validators.required),
    longitude: new FormControl<number | null>(null, Validators.required),
    areaId: new FormControl('', Validators.required),
  });

  constructor() {
    this.load();
  }

  load() {
    this.sensorService.listar().subscribe({
      next: res => this.sensores.set(res),
      error: err => console.error('Erro listar sensores', err)
    });

    this.areaService.listarAreas().subscribe({
      next: res => this.areas.set(res),
      error: err => console.error('Erro listar áreas', err)
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    this.editingId.set(null);
    this.erroMsg.set(null);
    this.form.reset();
  }

  editar(sensor: any) {
    this.editingId.set(sensor.id);
    this.erroMsg.set(null);
    const dataFormatada = sensor.dataInstalacao
      ? new Date(sensor.dataInstalacao).toISOString().split('T')[0]
      : '';
    this.form.patchValue({
      serialNumber: sensor.serialNumber,
      fabricante: sensor.fabricante,
      modelo: sensor.modelo,
      tipo: sensor.tipo,
      dataInstalacao: dataFormatada,
      status: sensor.status,
      cicloLeitura: sensor.cicloLeitura,
      latitude: sensor.latitude,
      longitude: sensor.longitude,
      areaId: sensor.area?.id || ''
    });
    this.showForm.set(true);
  }

  excluir(id: string) {
    if (!confirm('Tem certeza que deseja excluir este sensor?')) return;
    this.sensorService.remover(id).subscribe({
      next: () => this.load(),
      error: err => {
        const msg = err?.error?.message || err?.error?.error?.[0]?.message || 'Erro ao excluir sensor';
        this.erroMsg.set(msg);
      }
    });
  }

  salvar() {
    if (this.form.invalid) return;
    this.erroMsg.set(null);

    const payload = {
      serialNumber: this.form.value.serialNumber,
      fabricante: this.form.value.fabricante,
      modelo: this.form.value.modelo,
      dataInstalacao: this.form.value.dataInstalacao,
      tipo: this.form.value.tipo,
      status: this.form.value.status,
      cicloLeitura: Number(this.form.value.cicloLeitura),
      latitude: Number(this.form.value.latitude),
      longitude: Number(this.form.value.longitude),
      area_id: this.form.value.areaId
    };

    const id = this.editingId();
    const op = id
      ? this.sensorService.atualizar(id, payload)
      : this.sensorService.cadastrar(payload);

    op.subscribe({
      next: () => {
        this.toggleForm();
        this.load();
      },
      error: err => {
        const msg = err?.error?.message || err?.error?.error?.[0]?.message || 'Erro ao salvar sensor';
        this.erroMsg.set(msg);
      }
    });
  }
}
