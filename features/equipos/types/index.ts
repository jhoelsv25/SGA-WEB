export type TipoEquipo = "kiosko";
export type PropositoEquipo = "marcacion" | "sesiones";
export type UsuarioPermitido = "estudiantes" | "docentes" | "administrativos";

export interface Equipo {
  id: string;
  nombre: string;
  ubicacion: string;
  tipo: TipoEquipo;
  proposito: PropositoEquipo;
  usuariosPermitidos: UsuarioPermitido[] | string;
  numeroSerie?: string | null;
  activo: boolean;
  autorizado?: boolean;
  tokenAutorizado?: boolean;
  autorizadoEn?: string | null;
  autorizadoPor?: string | null;
  autorizadoPorId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface CreateEquipoPayload {
  nombre: string;
  ubicacion: string;
  tipo: TipoEquipo;
  proposito: PropositoEquipo;
  usuariosPermitidos: UsuarioPermitido[] | string;
  numeroSerie?: string | null;
  activo?: boolean;
}

export interface UpdateEquipoPayload {
  nombre?: string;
  ubicacion?: string;
  tipo?: TipoEquipo;
  proposito?: PropositoEquipo;
  usuariosPermitidos?: UsuarioPermitido[] | string;
  numeroSerie?: string | null;
  activo?: boolean;
}

export interface AutorizarEquipoResponse {
  message: string;
  /** Clave secreta del kiosko; la API la entrega solo en esta respuesta. */
  tokenAutorizacion: string;
  equipo: Equipo;
}

export interface ValidarEquipoResponse {
  valido: boolean;
  mensaje?: string;
  message?: string;
  equipo?: {
    id: string;
    nombre: string;
    ubicacion: string;
    tipo: TipoEquipo;
    proposito: PropositoEquipo;
    usuariosPermitidos: UsuarioPermitido[] | string;
  };
}

export interface EstadoSolicitudKiosko {
  codigo: string;
  estado: number;
}

export interface SolicitudKiosko extends EstadoSolicitudKiosko {
  id: string;
  equipoId?: string | null;
  equipoNombre?: string | null;
  solicitadoEn: string;
  ultimaConsultaEn: string;
  resueltoEn?: string | null;
}
