import type { NavItem, NavSection } from "@/config/navigation/types";

/** Minúsculas y sin tildes: «matricula» encuentra «Matrícula». */
const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

/**
 * Deja solo lo que coincide. Si coincide el nombre de una sección o de un grupo,
 * se muestran todas sus opciones.
 */
export function filtrarMenu(sections: NavSection[], busqueda: string): NavSection[] {
  const q = normalizar(busqueda);
  if (!q) return sections;
  const coincide = (texto?: string) => Boolean(texto) && normalizar(texto!).includes(q);

  const filtrar = (items: NavItem[]): NavItem[] =>
    items.flatMap((item) => {
      if (coincide(item.label)) return [item];
      const hijos = item.items ? filtrar(item.items) : [];
      return hijos.length > 0 ? [{ ...item, items: hijos }] : [];
    });

  return sections.flatMap((section) => {
    if (coincide(section.title)) return [section];
    const items = filtrar(section.items);
    return items.length > 0 ? [{ ...section, items }] : [];
  });
}
