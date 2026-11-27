import { adminNavigation } from "@/config/navigation/admin";
import type { NavItem } from "@/config/navigation/types";
import type { MenuOptionCatalogItem } from "../types/roles.types";

export interface NodoMenu {
  clave: string;
  nombre: string;
  /** Solo las hojas son opciones asignables (`menus.id`). */
  menuId?: string;
  hijos: NodoMenu[];
}

/** IDs de las opciones que cuelgan de un nodo (incluido él mismo si es una opción). */
export function opcionesDelNodo(nodo: NodoMenu): string[] {
  return nodo.menuId ? [nodo.menuId] : nodo.hijos.flatMap(opcionesDelNodo);
}

/**
 * Árbol de permisos con la misma estructura de la barra lateral (sección → grupo → opción).
 * Las opciones sin enlace en la barra van en «Otras opciones», para no perder ninguna.
 */
export function construirArbolMenu(catalogo: MenuOptionCatalogItem[]): NodoMenu[] {
  const porRuta = new Map(
    catalogo
      .filter((m) => !m.esContenedor && m.vigente && m.ruta)
      .map((m) => [m.ruta as string, m]),
  );
  const usadas = new Set<string>();

  const aNodo = (item: NavItem): NodoMenu[] => {
    if (item.items?.length) {
      const hijos = item.items.flatMap(aNodo);
      return hijos.length > 0 ? [{ clave: item.id, nombre: item.label, hijos }] : [];
    }
    // Un ítem con pestañas representa además a sus rutas incluidas.
    return [item.link, ...(item.rutasIncluidas ?? [])].flatMap((ruta) => {
      const menu = porRuta.get(ruta);
      if (!menu || usadas.has(menu.id)) return [];
      usadas.add(menu.id);
      const nombre = ruta === item.link ? item.label : menu.nombre;
      return [{ clave: menu.id, nombre, menuId: menu.id, hijos: [] }];
    });
  };

  const secciones = adminNavigation.flatMap((seccion) => {
    const hijos = seccion.items.flatMap(aNodo);
    return seccion.title && hijos.length > 0
      ? [{ clave: seccion.title, nombre: seccion.title, hijos }]
      : [];
  });

  const otras = [...porRuta.values()]
    .filter((m) => !usadas.has(m.id))
    .map((m) => ({ clave: m.id, nombre: m.nombre, menuId: m.id, hijos: [] }));

  return otras.length > 0
    ? [...secciones, { clave: "otras", nombre: "Otras opciones", hijos: otras }]
    : secciones;
}
