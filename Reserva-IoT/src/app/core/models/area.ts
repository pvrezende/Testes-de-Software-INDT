export type Bioma = 'Floresta' | 'Deserto' | 'Savana' | 'Tundra' | 'Aquatico';

export interface Area {
  id?: string;
  nome: string;
  descricao?: string;
  bioma: Bioma;
  latitude: number;
  longitude: number;
  largura: number;
  comprimento: number;
  relevo?: string;
}