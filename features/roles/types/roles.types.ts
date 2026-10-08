export interface RoleItem {
  id: string;
  nombre: string;
  descripcion?: string | null;
  esSistema: boolean;
  activo: boolean;
  usuariosCount: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RoleDetail extends RoleItem {
  permisos: string[];
}

export interface PermissionCatalogItem {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  moduloId: string;
  moduloNombre: string;
  moduloCodigo: string;
}

export interface CreateRoleInput {
  nombre: string;
  descripcion?: string;
}

export interface UpdateRoleInput {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}
