import {
  Home01Icon,
  UserGroupIcon,
  ShieldCheckIcon,
  School01Icon,
  Audit01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

export const adminNavigation: NavSection[] = [
  {
    items: [
      {
        id: "admin-dashboard",
        label: "Inicio",
        link: "/dashboard",
        icon: Home01Icon,
        permissions: ["admin:dashboard:view"],
        roles: ["admin"],
        exact: true,
        description: "Estado de la infraestructura, servicios y métricas técnicas",
      },
    ],
  },
  {
    title: "Administración Central",
    items: [
      {
        id: "admin-users",
        label: "Gestión de Usuarios",
        link: "/dashboard/admin/users",
        icon: UserGroupIcon,
        permissions: ["admin:users:manage"],
        roles: ["admin"],
        badge: { text: "Cuentas", variant: "default" },
        description: "Creación, activación y reseteo de claves",
      },

      {
        id: "admin-roles",
        label: "Roles y Permisos",
        link: "/dashboard/admin/roles",
        icon: ShieldCheckIcon,
        permissions: ["admin:roles:manage"],
        roles: ["admin"],
        badge: { text: "Seguridad", variant: "destructive" },
        description: "Matriz de privilegios RBAC y políticas de acceso",
      },
    ],
  },
  {
    title: "Estructura Académica",
    items: [
      {
        id: "admin-academic-years",
        label: "Años Lectivos y Periodos",
        link: "/dashboard/admin/academic-years",
        icon: School01Icon,
        permissions: ["admin:academic-years:manage"],
        roles: ["admin"],
        description: "Configuración de bimestres, trimestres, grados y secciones",
      },
      {
        id: "admin-settings",
        label: "Parámetros del Sistema",
        link: "/dashboard/admin/settings",
        icon: Settings02Icon,
        permissions: ["admin:settings:manage"],
        roles: ["admin"],
        description: "Configuraciones globales de la institución, logos y correos",
      },
    ],
  },
  {
    title: "Seguridad y Auditoría",
    items: [
      {
        id: "admin-audit",
        label: "Logs de Auditoría",
        link: "/dashboard/admin/audit",
        icon: Audit01Icon,
        permissions: ["admin:audit:view"],
        roles: ["admin"],
        description: "Trazabilidad de cambios, accesos y acciones críticas",
      },
    ],
  },
];
