import type { NavSection, UserRole } from "./types";
import { defaultNavigation } from "./default";
import { studentNavigation } from "./student";
import { teacherNavigation } from "./teacher";
import { directorNavigation } from "./director";
import { adminNavigation } from "./admin";
import { apoderadoNavigation } from "./apoderado";

export * from "./types";
export * from "./default";
export * from "./student";
export * from "./teacher";
export * from "./director";
export * from "./admin";
export * from "./apoderado";

/**
 * Mapa centralizado de navegaciones indexadas por rol institucional.
 */
export const roleNavigations: Record<UserRole, NavSection[]> = {
  admin: adminNavigation,
  director: directorNavigation,
  teacher: teacherNavigation,
  student: studentNavigation,
  apoderado: apoderadoNavigation,
};

/**
 * Obtiene la estructura de navegación configurada para un rol específico.
 * Si el rol no existe o no se provee, retorna la navegación por defecto (defaultNavigation).
 */
export function getNavigationForRole(role?: UserRole | string | null): NavSection[] {
  if (!role) return defaultNavigation;
  const normalizedRole = role.toLowerCase() as UserRole;
  return roleNavigations[normalizedRole] ?? defaultNavigation;
}

/**
 * Obtiene y combina secciones de navegación para usuarios con múltiples roles asignados.
 */
export function getNavigationForRoles(roles: (UserRole | string)[] = []): NavSection[] {
  if (!roles.length) return defaultNavigation;

  const combinedSections: NavSection[] = [];
  const seenItemIds = new Set<string>();

  for (const role of roles) {
    const sections = getNavigationForRole(role);
    for (const section of sections) {
      const filteredItems = section.items.filter((item) => {
        if (seenItemIds.has(item.id)) return false;
        seenItemIds.add(item.id);
        return true;
      });

      if (filteredItems.length > 0) {
        combinedSections.push({
          title: section.title,
          items: filteredItems,
        });
      }
    }
  }

  return combinedSections;
}

/**
 * Filtra los elementos de navegación verificando que el usuario posea al menos uno de los permisos requeridos.
 */
export function filterNavigationByPermissions(
  sections: NavSection[],
  userPermissions: string[] = [],
): NavSection[] {
  const permSet = new Set(userPermissions);

  return sections
    .map((section) => {
      const allowedItems = section.items.filter((item) => {
        // Si el elemento no define permisos específicos, se permite por defecto
        if (!item.permissions || item.permissions.length === 0) return true;
        // Si define permisos, el usuario debe tener al menos uno
        return item.permissions.some((p) => permSet.has(p));
      });

      return {
        ...section,
        items: allowedItems,
      };
    })
    .filter((section) => section.items.length > 0);
}
