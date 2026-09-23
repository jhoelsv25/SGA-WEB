# Componentes Comunes y Reutilización de UI

## 1. Prohibido Reinventar Primitivas Comunes

Toda nueva funcionalidad o vista debe consumir los componentes compartidos estandarizados en `@/components/common/`. No crees modales, botones de acción, toolbars o selectores desde cero.

### Catálogo de Componentes Obligatorios:

- **Modales:** `@/components/common/modal` (`<Modal title="..." description="...">`)
  - Usar siempre como contenedor envolvente para formularios o vistas emergentes.
- **Diálogos de Confirmación:** `@/components/common/confirm-dialog` (`<ConfirmDialog />`)
  - Para acciones destructivas (eliminar, cancelar, resetear estados).
- **Acciones de Fila en Tablas:** `@/components/common/row-actions` (`<TableRowActions />`)
  - Uso obligatorio para celdas de acciones en TanStack Table con popover de estados, edición y confirmación de eliminación integrada.
- **Toolbars y Filtros:**
  - `@/components/common/data-toolbar` (`<DataToolbar />`)
  - `@/components/common/list-toolbar` (`<ListToolbar />`)
- **Selectores de Búsqueda y Filtro:** `@/components/common/select` (`<SelectOption />`)
  - Combobox optimizado con búsqueda y selección tipada.
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
