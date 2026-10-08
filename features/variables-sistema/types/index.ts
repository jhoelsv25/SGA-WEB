export type VariableTipo = "texto" | "entero" | "decimal" | "booleano" | "fecha" | "hora" | "lista";

export interface VariableSistema {
  id: number;
  codigo: string;
  descripcion: string;
  modulo: string;
  tipo: VariableTipo;
  valor: string;
  unidad: string | null;
  valorMinimo: number | null;
  valorMaximo: number | null;
  editable: boolean;
  cargaEnAplicacion: boolean;
  vigente: boolean;
  motivoCambio: string | null;
  actualizadoPorId: string | null;
  actualizadoPorNombre?: string | null;
  creadoEn: string;
}

export interface UpdateVariablePayload {
  valor: string;
  motivoCambio: string;
}
