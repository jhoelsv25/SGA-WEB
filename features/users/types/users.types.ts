export type UserStatus = "activo" | "bloqueado" | "inactivo";

export interface UserPersona {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  correo?: string | null;
  fotoUrl?: string | null;
}

export interface UserRole {
  id: string;
  nombre: string;
  esSistema: boolean;
}

export interface UserItem {
  id: string;
  nombreUsuario: string;
  estado: UserStatus;
  debeCambiarContrasena: boolean;
  intentosFallidos: number;
  ultimoAcceso?: string | null;
  creadoEn: string;
  actualizadoEn: string;
  persona: UserPersona;
  rol: UserRole;
}

export interface PaginatedUsersResponse {
  data: UserItem[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
  mensaje?: string;
}

export type EligiblePersona = UserPersona;

/** RF-002 V3: datos de una persona nueva en el registro único. */
export interface NuevaPersonaInput {
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  sexo: "M" | "F";
  correo?: string;
  celular?: string;
}

/** RF-002 V3 (registro único): persona existente o nueva + cargo + roles, en una transacción. */
export interface CreateUserInput {
  personaId?: string;
  persona?: NuevaPersonaInput;
  cargoId: string;
  rolIds?: string[];
  nombreUsuario?: string;
}

export interface CreateUserResponse {
  usuario: UserItem;
  tempPassword: string | null;
  /** true si la persona ya tenía cuenta y solo se le agregó el cargo y los roles. */
  cuentaExistente: boolean;
}

export interface TempPasswordResetResponse {
  message: string;
  tempPassword: string;
}

export interface ChangeUserRoleInput {
  rolId: string;
}

export interface UpdateUsernameInput {
  nombreUsuario: string;
}

export interface UserQueryParams {
  cursor?: string | null;
  limit?: number;
  rolId?: string;
  estado?: UserStatus;
  search?: string;
}
