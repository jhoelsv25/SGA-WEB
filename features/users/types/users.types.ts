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
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type EligiblePersona = UserPersona;

export interface CreateUserInput {
  personaId: string;
  rolId: string;
  nombreUsuario: string;
}

export interface CreateUserResponse {
  user: UserItem;
  tempPassword: string;
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
  page?: number;
  limit?: number;
  rolId?: string;
  estado?: UserStatus;
  search?: string;
}
