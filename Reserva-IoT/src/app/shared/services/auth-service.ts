import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API = `${environment.apiUrl}`;

  _user = signal<any | null>(null);

  isAuthenticated = computed(() => !!this._user());


  constructor() {
    this.restoreSession();
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, credentials).pipe(
      tap(res => this.setSession(res)),
      shareReplay()
    );
  }

  private setSession(authRes: any) {
    const { tokenAccess, tokenRefresh } = authRes.tokens;

    localStorage.setItem('access_token', tokenAccess);
    localStorage.setItem('refresh_token', tokenRefresh);

    this._user.set({ authenticated: true });
  }


  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

    private restoreSession() {
      const token = this.getAccessToken();
      if (token) {
        this._user.set({ authenticated: true });
      }
    }


  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');

    return this.http.post<any>(`${this.API}/refresh`, {
      refreshToken
    }).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.tokens.tokenAccess);
        localStorage.setItem('refresh_token', res.tokens.tokenRefresh);
      })
    );
  }


}
