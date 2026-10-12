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
  /** RF-002 V3 (Roles-Menú): IDs de las opciones de menú asignadas al rol. */
  menus: string[];
}

export interface MenuOptionCatalogItem {
  id: string;
  menuPadreId?: string | null;
  moduloId: string;
  nombre: string;
  ruta?: string | null;
  icono?: string | null;
  orden: number;
  esContenedor: boolean;
  vigente: boolean;
}

export interface ModuleCatalogItem {
  id: string;
  codigo: string;
  nombre: string;
  icono?: string | null;
  orden: number;
  vigente: boolean;
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
