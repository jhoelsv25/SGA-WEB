import type { SelectOptionItem } from "@/components/common/select/types";

/** `inline: false` guarda el filtro en el popover en pantallas anchas. */
type ListFilterVisibility = {
  inline?: boolean;
  /** Etiqueta visible cuando el filtro se muestra dentro del popover. */
  label?: string;
};

export type ListFilterSearchDef = {
  type: "search";
  key: string;
  placeholder?: string;
  debounceMs?: number;
};

export type ListFilterSelectDef = {
  type: "select";
  key: string;
  options: SelectOptionItem<string>[];
  placeholder?: string;
  searchPlaceholder?: string;
  /** Value that means "no filter" — omitted from the URL. Default: `"all"`. */
  allValue?: string;
  className?: string;
  widthClassName?: string;
} & ListFilterVisibility;

export type ListFilterMultiSelectDef = {
  type: "multiSelect";
  key: string;
  options: SelectOptionItem<string>[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  widthClassName?: string;
} & ListFilterVisibility;

export type ListFilterDateDef = {
  type: "date";
  key: string;
  placeholder?: string;
  className?: string;
  widthClassName?: string;
} & ListFilterVisibility;

export type ListFilterDateRangeDef = {
  type: "dateRange";
  fromKey: string;
  toKey: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  className?: string;
  widthClassName?: string;
} & ListFilterVisibility;

export type ListFilterDef =
  | ListFilterSearchDef
  | ListFilterSelectDef
  | ListFilterMultiSelectDef
  | ListFilterDateDef
  | ListFilterDateRangeDef;

/** URL / controller value for a single filter key. */
export type ListFilterValue = string | string[];

export type ListFilterValues = Record<string, ListFilterValue>;

export interface ListFilterController {
  values: ListFilterValues;
  searchInput: string;
  setSearchInput: (value: string) => void;
  setFilter: (key: string, value: string | null | undefined) => void;
  setFilters: (values: Record<string, string | null | undefined>) => void;
  setMultiFilter: (key: string, values: string[]) => void;
  clearFilters: () => void;
  activeCount: number;
  hasActive: boolean;
}
