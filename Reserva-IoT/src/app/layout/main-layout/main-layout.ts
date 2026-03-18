import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
authService = inject(AuthService);
  
  user = this.authService._user;

  logout() {
    this.authService.logout();
  }
}
