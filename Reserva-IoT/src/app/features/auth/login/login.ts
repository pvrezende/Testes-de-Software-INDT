import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router)

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        console.log('wwew')
        this.isLoading.set(false);
        this.router.navigate(['']);
      },
      error: () => {
        this.errorMessage.set('Credenciais inválidas ou erro no servidor.');
        this.isLoading.set(false);
      }
    });

  }
}


