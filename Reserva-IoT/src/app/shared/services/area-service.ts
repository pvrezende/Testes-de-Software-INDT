import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { Sensor } from '../../core/models/sensor';
import { Leitura } from '../../core/models/leitura';
import { Area } from '../../core/models/area';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/area`;

  private _areas = signal<Area[]>([]);
  readonly areas = this._areas.asReadonly();



  listarAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.API).pipe(
      tap(data => this._areas.set(data))
    );
  }

  buscarAreaPorId(id: string): Observable<Area> {
    return this.http.get<Area>(`${this.API}/${id}`);
  }

  cadastrarArea(area: Area): Observable<Area> {
    return this.http.post<Area>(this.API, area).pipe(
      tap(novaArea => this._areas.update(prev => [...prev, novaArea]))
    );
  }

  atualizarArea(id: string, area: Partial<Area>): Observable<Area> {
    return this.http.put<Area>(`${this.API}/${id}`, area);
  }

  removerArea(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  sensorAtivoPorArea(id: string) {
    return this.http.get<any>(`${this.API}/sensor/${id}`)
  }
}
