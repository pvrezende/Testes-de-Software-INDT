
export type SensorStatus = 'Ativo' | 'Inativo' | 'Manutencao';

export interface Sensor {
  id?: string;
  serialNumber: string;
  fabricante: string;
  modelo: string;
  tipo: string;
  status: SensorStatus;
  ipFixo?: string;
  dataInstalacao: Date | string;
  cicloLeitura: number; 
  latitude: number;
  longitude: number;
  areaId: string; 
}
