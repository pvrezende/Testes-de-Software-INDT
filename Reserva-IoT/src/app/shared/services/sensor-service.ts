import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sensors`;

  sensores = signal<any[]>([]);

  listar() {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarPorId(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  cadastrar(payload: any) {
    return this.http.post(this.apiUrl, payload);
  }

  atualizar(id: string, payload: any) {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  remover(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  ultimasLeituras(sensorId: string, limit = 20) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/sensor/${sensorId}/leituras?limit=${limit}`
    );
  }

}
