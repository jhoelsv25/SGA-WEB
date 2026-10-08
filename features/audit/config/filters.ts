import type { ListFilterDef } from "@/components/common/list-toolbar/filters";

export const auditFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "usuario",
    placeholder: "Buscar por usuario o 'Sistema'...",
  },
  {
    type: "select",
    key: "accion",
    label: "Acción",
    options: [
      { label: "Todas las acciones", value: "all" },
      { label: "Crear", value: "crear" },
      { label: "Actualizar", value: "actualizar" },
      { label: "Eliminar", value: "eliminar" },
      { label: "Inicio de sesión", value: "iniciar_sesion" },
      { label: "Cierre de sesión", value: "cerrar_sesion" },
    ],
  },
  {
    type: "select",
    key: "entidad",
    label: "Entidad / Módulo",
    options: [
      { label: "Todas las entidades", value: "all" },
      { label: "Usuarios", value: "usuarios" },
      { label: "Roles", value: "roles" },
      { label: "Menús", value: "menus" },
      { label: "Personas", value: "personas" },
      { label: "Institución", value: "institucion" },
    ],
  },
] as const;
