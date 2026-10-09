export interface CredencialResponse {
  id: string;
  personaId: string;
  codigo: string;
  activa: boolean;
  emitidaEn: string;
  venceEn?: string | null;
  pin?: string;
  mensaje?: string;
}

export interface CarneDatos {
  personaId: string;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fotoUrl?: string | null;
  tipoRol: string;
  codigoCredencial: string;
  codigoInstitucional?: string | null;
  emitidaEn: string;
}

export interface ReemitirCredencialInput {
  personaId: string;
  motivo: string;
}

export interface CambiarPinInput {
  pinActual?: string;
  nuevoPin: string;
}
