import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoading = signal(false);

  registerForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    especialidade: [''],
    titulacao: ['', [Validators.required]],
    matricula: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        alert('Cadastro realizado! Faça login.');
        this.router.navigate(['/login']);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
