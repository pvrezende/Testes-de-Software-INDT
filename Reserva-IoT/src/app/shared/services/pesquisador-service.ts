import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PesquisadorService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/pesquisador`;

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  atualizar(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.API}/${id}`, data);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
