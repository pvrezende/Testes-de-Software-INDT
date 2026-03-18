import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LeituraService {

  private api = `${environment.apiUrl}/leitura`;

  constructor(private http: HttpClient) {}

  listarPorSensor(sensorId: string) {
    return this.http.get<any[]>(`${this.api}/sensor/${sensorId}`);
  }


  listarPorArea(areaId: string) {
    return this.http.get<any[]>(`${this.api}/area/${areaId}`);
  }
}
