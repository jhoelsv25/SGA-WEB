import type { ReactNode } from "react";
import type { ListFilterController, ListFilterDef } from "./filters";

export type ListToolbarViewMode = "table" | "list";

export interface ListToolbarProps {
  /**
   * Declarative filters. When provided with `listFilters`, the toolbar
   * renders search + filter fields and syncs them via the controller (URL).
   */
  filterDefs?: readonly ListFilterDef[];
  /** Controller from `useListFilters(filterDefs)`. Required when using `filterDefs`. */
  listFilters?: ListFilterController;

  /** @deprecated Prefer a `search` entry in `filterDefs`. */
  searchPlaceholder?: string;
  /** @deprecated Prefer `listFilters` + `filterDefs`. */
  searchValue?: string;
  /** @deprecated Prefer `listFilters` + `filterDefs`. */
  onSearchChange?: (value: string) => void;

  hasActiveFilters?: boolean;
  /** Número opcional para el badge del botón Filtros en móvil */
  activeFiltersCount?: number;
  onClearFilters?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  refreshLabel?: string;

  /**
   * Legacy custom filter slot. Still used when `filterDefs` is omitted.
   * With `filterDefs`, prefer `extraFilters` for one-off controls.
   */
  filters?: ReactNode;
  /** Extra controls rendered after declarative filters. */
  extraFilters?: ReactNode;

  /** Acciones antes del reload (p. ej. toggle tabla/lista) */
  leadingActions?: ReactNode;
  actions?: ReactNode;
  /**
   * Acciones ocasionales (importar, exportar…) como `DropdownMenuItem`s dentro del menú "⋯".
   * Si se pasan, "Actualizar" también se mueve a ese menú.
   */
  secondaryActions?: ReactNode;
  className?: string;
}
