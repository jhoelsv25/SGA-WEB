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
  gradoNombre?: string | null;
  seccionNombre?: string | null;
  emitidaEn: string;
  institucion?: {
    nombre: string;
    codigoModular?: string | null;
    distrito?: string | null;
    provincia?: string | null;
    departamento?: string | null;
    ugel?: string | null;
    dre?: string | null;
    logoUrl?: string | null;
  };
}

export interface ReemitirCredencialInput {
  personaId: string;
  motivo: string;
}

export interface CambiarPinInput {
  pinActual?: string;
  nuevoPin: string;
}
