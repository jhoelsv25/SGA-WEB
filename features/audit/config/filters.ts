import type { ListFilterDef } from "@/components/common/list-toolbar/filters";

export const auditFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "usuario",
    placeholder: "Buscar por usuario...",
  },
  {
    type: "dateRange",
    fromKey: "fechaInicio",
    toKey: "fechaFin",
    label: "Rango de fechas",
    fromPlaceholder: "Últimos 7 días",
  },
  {
    type: "select",
    key: "accion",
    label: "Acción",
    placeholder: "Todas las acciones",
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
    label: "Módulo",
    placeholder: "Todos los módulos",
    options: [
      { label: "Todos los módulos", value: "all" },
      { label: "Seguridad y accesos", value: "seguridad" },
      { label: "Estructura académica", value: "academico" },
      { label: "Comunidad y matrícula", value: "matricula" },
      { label: "Asistencia escolar", value: "asistencia" },
      { label: "Seguimiento y evaluación", value: "seguimiento-docente" },
      { label: "Libretas y méritos", value: "libretas" },
      { label: "Aula virtual", value: "aula-virtual" },
      { label: "Comunicaciones", value: "comunicacion" },
      { label: "Configuración general", value: "configuracion" },
    ],
  },
] as const;
