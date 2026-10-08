import type { NavSection, UserRole } from "./types";
import { defaultNavigation } from "./default";
import { studentNavigation, estudianteNavigation } from "./student";
import { teacherNavigation, docenteNavigation } from "./teacher";
import { principalNavigation, directorNavigation } from "./principal";
import { adminNavigation } from "./admin";
import { parentNavigation, apoderadoNavigation } from "./parent";
import { secretaryNavigation, secretariaNavigation } from "./secretary";

export * from "./types";
export * from "./default";
export * from "./student";
export * from "./teacher";
export * from "./principal";
export * from "./admin";
export * from "./parent";
export * from "./secretary";

/**
 * Mapa centralizado de navegaciones indexadas por rol institucional
 * Basado en las 6 definiciones de roles del modelo DB v3.2 (0000_init.sql):
 * 1. Administrador (admin)
 * 2. Director (principal, director)
 * 3. Secretaria (secretary, secretaria)
 * 4. Docente (teacher, docente)
 * 5. Estudiante (student, estudiante)
 * 6. Apoderado (parent, apoderado)
 */
export const roleNavigations: Record<UserRole, NavSection[]> = {
  admin: adminNavigation,
  principal: principalNavigation,
  director: directorNavigation,
  secretary: secretaryNavigation,
  secretaria: secretariaNavigation,
  teacher: teacherNavigation,
  docente: docenteNavigation,
  student: studentNavigation,
  estudiante: estudianteNavigation,
  parent: parentNavigation,
  apoderado: apoderadoNavigation,
};

/**
 * Obtiene la estructura de navegación configurada para un rol específico.
 * Soporta tanto nombres en inglés (principal, parent) como en español (director, apoderado).
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
        if (!item.permissions || item.permissions.length === 0) return true;
        return item.permissions.some((p) => permSet.has(p));
      });

      return {
        ...section,
        items: allowedItems,
      };
    })
    .filter((section) => section.items.length > 0);
}
