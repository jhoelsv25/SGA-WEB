export type TipoGestion = "publica" | "privada" | "convenio";

export interface Institucion {
  id: string;
  nombre: string;
  codigoModular: string;
  codigoLocal?: string | null;
  tipoGestion: TipoGestion;
  ugelDre?: string | null;
  director?: string | null;
  direccion: string;
  departamento?: string | null;
  provincia?: string | null;
  distrito?: string | null;
  telefono?: string | null;
  correo?: string | null;
  logoUrl?: string | null;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateInstitucionPayload {
  nombre?: string;
  codigoModular?: string;
  codigoLocal?: string | null;
  tipoGestion?: TipoGestion;
  ugelDre?: string | null;
  director?: string | null;
  direccion?: string;
  departamento?: string | null;
  provincia?: string | null;
  distrito?: string | null;
  telefono?: string | null;
  correo?: string | null;
  logoUrl?: string | null;
}
