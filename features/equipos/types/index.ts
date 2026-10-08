export type TipoEquipo = "kiosko" | "biometrico";
export type PropositoEquipo = "marcacion" | "sesiones";
export type UsuarioPermitido = "estudiantes" | "docentes" | "administrativos";

export interface Equipo {
  id: string;
  nombre: string;
  ubicacion: string;
  tipo: TipoEquipo;
  proposito: PropositoEquipo;
  usuariosPermitidos: UsuarioPermitido[];
  numeroSerie?: string | null;
  activo: boolean;
  tokenAutorizado: boolean;
  autorizadoEn?: string | null;
  autorizadoPor?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEquipoPayload {
  nombre: string;
  ubicacion: string;
  tipo: TipoEquipo;
  proposito: PropositoEquipo;
  usuariosPermitidos: UsuarioPermitido[];
  numeroSerie?: string | null;
  activo?: boolean;
}

export interface UpdateEquipoPayload {
  nombre?: string;
  ubicacion?: string;
  tipo?: TipoEquipo;
  proposito?: PropositoEquipo;
  usuariosPermitidos?: UsuarioPermitido[];
  numeroSerie?: string | null;
  activo?: boolean;
}

export interface AutorizarEquipoResponse {
  message: string;
  equipoId: string;
  nombre: string;
  token: string;
  autorizadoEn: string;
}

export interface ValidarEquipoResponse {
  valido: boolean;
  mensaje: string;
  equipo?: {
    id: string;
    nombre: string;
    ubicacion: string;
    tipo: TipoEquipo;
    proposito: PropositoEquipo;
    usuariosPermitidos: UsuarioPermitido[];
  };
}
