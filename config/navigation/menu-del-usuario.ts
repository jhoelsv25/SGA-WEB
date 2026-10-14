import type { NavItem, NavSection } from "./types";
import { adminNavigation } from "./admin";

/** Ruta de inicio del panel; todo rol la ve. */
export const RUTA_INICIO = "/admin/dashboard";

/**
 * Rutas que ya tienen página en `app/`. Una opción del menú sin página se oculta
 * para no llevar a un 404. Al crear una página nueva, agrega aquí su ruta.
 */
export const RUTAS_CON_PAGINA: ReadonlySet<string> = new Set([
  RUTA_INICIO,
  "/admin/users",
  "/admin/roles",
  "/admin/cargos",
  "/admin/audit",
  "/admin/curriculum",
  "/admin/secciones",
  "/admin/horarios",
  "/admin/personas",
  "/admin/docentes",
  "/admin/estudiantes",
  "/admin/apoderados",
  "/admin/enrollment",
  "/admin/comunicados",
  "/admin/notificaciones",
  "/admin/institucion",
  "/admin/configuracion",
  "/admin/turnos",
  "/admin/equipos",
  "/admin/variables",
  "/admin/academic-years",
  "/admin/calendario",
  "/admin/mi-horario",
  "/admin/conducta",
  "/admin/libretas",
  "/admin/mis-libretas",
  "/admin/marcaciones-hoy",
  "/admin/marcacion-manual",
  "/admin/asistencia",
  "/admin/asistencia-seccion",
  "/admin/mi-asistencia",
  "/admin/sesiones-hoy",
  "/admin/mis-sesiones",
  "/admin/justificaciones-sesion",
  "/admin/aula-virtual",
  "/admin/solicitudes-cambio-fecha",
  "/admin/materiales-bimestre",
]);

interface OpcionesMenu {
  /** El Administrador ve todas las opciones con página. */
  esAdministrador: boolean;
  /** Rutas asignadas al rol activo en Roles-Menú (`user.menuRoutes`). */
  menuRoutes?: readonly string[];
}

function filtrarItems(items: NavItem[], esVisible: (item: NavItem) => boolean): NavItem[] {
  return items.flatMap((item) => {
    if (item.items?.length) {
      const hijos = filtrarItems(item.items, esVisible);
      return hijos.length > 0 ? [{ ...item, items: hijos }] : [];
    }
    return esVisible(item) ? [item] : [];
  });
}

/**
 * Menú del rol activo: catálogo único filtrado por las páginas que existen y, salvo para
 * el Administrador, por las rutas asignadas en Roles-Menú.
 */
export function menuDelUsuario({ esAdministrador, menuRoutes = [] }: OpcionesMenu): NavSection[] {
  const asignadas = new Set(menuRoutes);

  const esVisible = (item: NavItem) => {
    if (!RUTAS_CON_PAGINA.has(item.link)) return false;
    if (item.ocultarAlAdministrador && esAdministrador) return false;
    if (item.link === RUTA_INICIO || esAdministrador) return true;
    return asignadas.has(item.link);
  };

  return adminNavigation
    .map((seccion) => ({ ...seccion, items: filtrarItems(seccion.items, esVisible) }))
    .filter((seccion) => seccion.items.length > 0);
}
