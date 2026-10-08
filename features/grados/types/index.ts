export interface Grado {
  id: string;
  numero: number;
  nombre: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface UpdateGradoPayload {
  nombre: string;
}
