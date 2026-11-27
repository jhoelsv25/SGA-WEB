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
  "/admin/biometrico",
  "/admin/biometrico/sincronizaciones",
  "/admin/biometrico/equipos",
  "/admin/aprobacion-dispositivos",
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
  "/admin/sesiones-hoy/planificaciones",
  "/admin/mis-sesiones",
  "/admin/planificacion-sesiones",
  "/admin/catalogo-curricular",
  "/admin/justificaciones-sesion",
  "/admin/aula-virtual",
  "/admin/solicitudes-cambio-fecha",
  "/admin/materiales-bimestre",
  "/admin/ausencias-docentes",
  "/admin/mis-ausencias",
  "/admin/consolidados-docentes",
  "/admin/pendientes-seguimiento",
  "/admin/informe-horas-efectivas",
  "/admin/mi-seguimiento",
  "/admin/observaciones-aula",
  "/admin/mis-observaciones",
  "/admin/indicadores",
  "/admin/mis-indicadores",
  "/admin/reportes",
]);

interface OpcionesMenu {
  /** El Administrador ve todas las opciones con página. */
  esAdministrador: boolean;
  /** Rutas asignadas al rol activo en Roles-Menú (`user.menuRoutes`). */
  menuRoutes?: readonly string[];
}

function filtrarItems(
  items: NavItem[],
  esVisible: (item: NavItem) => boolean,
  resolverEnlace: (item: NavItem) => NavItem,
): NavItem[] {
  return items.flatMap((item) => {
    if (item.items?.length) {
      const hijos = filtrarItems(item.items, esVisible, resolverEnlace);
      // Un grupo con una sola opción visible la muestra directamente, sin un clic de más.
      if (hijos.length <= 1) return hijos;
      // El grupo enlaza a su primera opción visible, para no llevar a una ruta no asignada.
      return [{ ...item, link: hijos[0].link, items: hijos }];
    }
    return esVisible(item) ? [resolverEnlace(item)] : [];
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
    if (asignadas.has(item.rutaPermiso ?? item.link)) return true;
    return Boolean(
      item.rutasIncluidas?.some((ruta) => RUTAS_CON_PAGINA.has(ruta) && asignadas.has(ruta)),
    );
  };

  const resolverEnlace = (item: NavItem): NavItem => {
    if (
      esAdministrador ||
      item.link === RUTA_INICIO ||
      asignadas.has(item.rutaPermiso ?? item.link)
    ) {
      return item;
    }
    const alternativa = item.rutasIncluidas?.find(
      (ruta) => RUTAS_CON_PAGINA.has(ruta) && asignadas.has(ruta),
    );
    return alternativa ? { ...item, link: alternativa } : item;
  };

  return adminNavigation
    .map((seccion) => {
      const items = filtrarItems(seccion.items, esVisible, resolverEnlace);
      const [primero] = items;
      const aplanar = items.length === 1 && primero.mostrarHijosSiEsUnico && primero.items;
      return { ...seccion, items: aplanar || items };
    })
    .filter((seccion) => seccion.items.length > 0);
}
