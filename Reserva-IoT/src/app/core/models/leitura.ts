export interface Leitura {
  id: string;
  sensorId: string;
  umidade: number;
  temperatura: number;
  dataHora: Date | string;
}