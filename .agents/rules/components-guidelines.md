# Componentes Comunes y Reutilización de UI

## 1. Prohibido Reinventar Primitivas Comunes

Toda nueva funcionalidad o vista debe consumir los componentes compartidos estandarizados en `@/components/common/`. No crees modales, botones de acción, toolbars o selectores desde cero.

### Catálogo de Componentes Obligatorios:

- **Modales:** `@/components/common/modal` (`<Modal title="..." description="..." icon={...}>`)
  - Usar siempre como contenedor envolvente para formularios o vistas emergentes.
  - El icono, el título y el detalle van en el `Modal`, no repetidos como cabecera dentro del formulario.
  - El formulario sigue el patrón de `features/users/components/forms/create-user-form.tsx`. Ver `.agents/skills/formularios-ui/SKILL.md`.
- **Diálogos de Confirmación:** `@/components/common/confirm-dialog` (`<ConfirmDialog />`)
  - Para acciones destructivas (eliminar, cancelar, resetear estados).
- **Acciones de Fila en Tablas:** `@/components/common/row-actions` (`<TableRowActions />`)
  - Uso obligatorio para celdas de acciones en TanStack Table con popover de estados, edición y confirmación de eliminación integrada.
- **Toolbars, Búsqueda y Filtros de Listados:**
  - `@/components/common/list-toolbar` (`<ListToolbar />`) y `useListFilters` (`@/hooks/use-list-filters`).
  - **Obligatorio para toda tabla o listado del sistema**: Prohibido crear barras de filtros manuales con `<Select>` sueltos que se quiebren en 2 líneas.
  - **Sincronización con la URL (100% Reactiva)**: Todos los filtros y el campo de búsqueda deben persistir en los query params de la URL mediante `useListFilters(filterDefs)` para permitir compartir enlaces directos y recargar la página (`F5`) sin perder filtros.
  - **Patrón de la barra**: buscador visible, todos los demás filtros dentro del botón `Filtros` (con insignia numérica), un único botón de acción principal en `actions` y las acciones ocasionales (importar, exportar, actualizar) en el menú `⋯` vía `secondaryActions`. Detalle y ejemplo en `.agents/skills/barra-listados/SKILL.md`.
- **Paginación por Cursores Global:**
  - Hook obligatorio: `useCursorPagination` (`@/hooks/use-cursor-pagination`).
  - Componente obligatorio: `DataTableCursorPagination` (`@/components/common/data-table`).
  - Prohibido reimplementar `cursorHistory` y lógica manual de cursores en cada página. Debe consumirse `useCursorPagination(queryData, { resetDeps: [filtros...] })`.
- **Selectores de Búsqueda y Filtro:** `@/components/common/select` (`<SelectOption />`)
  - Combobox institucional estilizado con búsqueda integrada, truncado de textos y selección tipada. Prohibido usar selectores nativos planos para filtros.
- **Fechas y Rangos:**
  - `@/components/common/date-picker` (`<DatePicker />`)
  - `@/components/common/date-range-picker` (`<DateRangePicker />`)
  - `@/components/common/date-time-picker` (`<DateTimePicker />`)
- **Estados de Carga y Vacíos:**
  - `@/components/common/empty-state` (`<EmptyState title="..." description="..." action={...} />`)
  - `@/components/common/loading-screen` (`<LoadingScreen />`)
  - `@/components/common/spinner` (`<Spinner />`)
  - `@/components/common/skeletons` (skeletons preconfigurados para tablas y cards)
- **Utilidades UI Adicionales:**
  - `@/components/common/copy-button` (`<CopyButton value="..." />`)
  - `@/components/common/user-avatar` (`<UserAvatar name="..." avatarUrl="..." />`)
  - `@/components/common/file-dropzone` (`<FileDropzone />`)

---

## 2. Formateadores Centralizados en `@/lib/formatters`

Queda prohibido formatear datos inline con `Intl` o cálculos manuales ad-hoc. Utiliza siempre los helpers centralizados:

- **Monedas:** `formatCurrency(amount, currencyCode)` (`@/lib/formatters/currency`)
- **Fechas:** `formatDate(date, formatStr)`, `formatRelativeDate(date)` (`@/lib/formatters/date`)
- **Números y Porcentajes:** `formatNumber(value)`, `formatPercentage(value)` (`@/lib/formatters/number`)
- **Identificadores:** `formatUUID(uuid, length)` (`@/lib/formatters/uuid`)
- **Portapapeles:** `copyToClipboard(text)` (`@/lib/formatters/copy`)
