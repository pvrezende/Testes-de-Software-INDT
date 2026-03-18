import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaService } from '../../../shared/services/area-service';
import { Area } from '../../../core/models/area';

@Component({
  selector: 'app-crud-area',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-area.html',
  styleUrl: './crud-area.css',
})
export class CrudArea {
  private areaService = inject(AreaService);

  showForm = signal(false);
  areas = signal<any[]>([]);
  editingId = signal<string | null>(null);

  biomas = ['Floresta', 'Deserto', 'Savana', 'Tundra', 'Aquático'];

  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    descricao: new FormControl(''),
    bioma: new FormControl('', Validators.required),
    latitude: new FormControl<number | null>(null, Validators.required),
    longitude: new FormControl<number | null>(null, Validators.required),
    largura: new FormControl<number | null>(null, Validators.required),
    comprimento: new FormControl<number | null>(null, Validators.required),
    relevo: new FormControl('')
  });

  constructor() {
    this.load();
  }

  load() {
    this.areaService.listarAreas().subscribe((res: any) => this.areas.set(res));
  }

  toggleForm() {
    this.showForm.update(v => !v);
    this.editingId.set(null);
    this.form.reset();
  }

  editar(area: any) {
    this.editingId.set(area.id);
    this.form.patchValue({
      nome: area.nome,
      descricao: area.descricao || '',
      bioma: area.bioma,
      latitude: area.latitude,
      longitude: area.longitude,
      largura: area.largura,
      comprimento: area.comprimento,
      relevo: area.relevo || ''
    });
    this.showForm.set(true);
  }

  excluir(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta área?')) return;
    this.areaService.removerArea(id).subscribe({
      next: () => this.load(),
      error: err => console.error('Erro ao excluir área', err)
    });
  }

  salvar() {
    if (this.form.invalid) return;

    const payload: any = {
      nome: this.form.value.nome!,
      descricao: this.form.value.descricao || undefined,
      bioma: this.form.value.bioma!,
      latitude: Number(this.form.value.latitude),
      longitude: Number(this.form.value.longitude),
      largura: Number(this.form.value.largura),
      comprimento: Number(this.form.value.comprimento),
      relevo: this.form.value.relevo || undefined,
    };

    const id = this.editingId();
    const op = id
      ? this.areaService.atualizarArea(id, payload)
      : this.areaService.cadastrarArea(payload);

    op.subscribe({
      next: () => {
        this.toggleForm();
        this.load();
      },
      error: (err) => console.error('ERRO API:', err.error)
    });
  }
}
