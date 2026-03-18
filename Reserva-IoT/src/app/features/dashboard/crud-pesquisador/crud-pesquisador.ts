import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PesquisadorService } from '../../../shared/services/pesquisador-service';

@Component({
  selector: 'app-crud-pesquisador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-pesquisador.html'
})
export class CrudPesquisador {
  private pesquisadorService = inject(PesquisadorService);

  pesquisadores = signal<any[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);

  titulacoes = ['Graduação', 'Especialização', 'Mestrado', 'Doutorado'];

  form = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    especialidade: new FormControl('', Validators.required),
    titulacao: new FormControl('', Validators.required),
    linhaPesquisa: new FormControl('')
  });

  constructor() {
    this.load();
  }

  load() {
    this.pesquisadorService.listar().subscribe({
      next: res => this.pesquisadores.set(res),
      error: err => console.error('Erro ao listar pesquisadores', err)
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    this.editingId.set(null);
    this.form.reset();
  }

  editar(pesquisador: any) {
    this.editingId.set(pesquisador.id);
    this.form.patchValue({
      nome: pesquisador.nome,
      especialidade: pesquisador.especialidade,
      titulacao: pesquisador.titulacao,
      linhaPesquisa: pesquisador.linhaPesquisa || ''
    });
    this.showForm.set(true);
  }

  excluir(id: string) {
    if (!confirm('Tem certeza que deseja excluir este pesquisador?')) return;
    this.pesquisadorService.remover(id).subscribe({
      next: () => this.load(),
      error: err => console.error('Erro ao excluir pesquisador', err)
    });
  }

  salvar() {
    if (this.form.invalid || !this.editingId()) return;

    const payload = {
      nome: this.form.value.nome!,
      especialidade: this.form.value.especialidade!,
      titulacao: this.form.value.titulacao!,
      linhaPesquisa: this.form.value.linhaPesquisa || undefined
    };

    this.pesquisadorService.atualizar(this.editingId()!, payload).subscribe({
      next: () => {
        this.toggleForm();
        this.load();
      },
      error: err => console.error('Erro ao atualizar pesquisador', err)
    });
  }
}
