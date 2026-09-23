"use client";

import * as React from "react";
import { useUrlFilters } from "@/hooks/use-url-filters";
import type {
  ListFilterController,
  ListFilterDef,
  ListFilterValues,
} from "@/components/common/list-toolbar/filters";
import {
  collectFilterKeys,
  countActiveFilters,
  getSearchDef,
  parseFilterValues,
  serializeSelectValue,
} from "@/components/common/list-toolbar/filters";

export interface UseListFiltersOptions {
  resetPageOnFilter?: boolean;
  pageParamKey?: string;
  /** Keys preserved when clearing (e.g. view mode). Default: `["view"]`. */
  clearExcludeKeys?: string[];
}

export interface UseListFiltersResult extends ListFilterController {
  defs: readonly ListFilterDef[];
  /** Convenience: string value for a key (empty string if missing / not a string). */
  getString: (key: string) => string;
  /** Convenience: array value for a multiSelect key. */
  getArray: (key: string) => string[];
}

/**
 * Schema-driven list filters backed by the URL (via `useUrlFilters`).
 * Call with the same defs from the page (read values) and the toolbar (write + render).
 */
export function useListFilters(
  defs: readonly ListFilterDef[],
  options: UseListFiltersOptions = {},
): UseListFiltersResult {
  const { resetPageOnFilter = true, pageParamKey = "page", clearExcludeKeys = ["view"] } = options;

  const {
    getParam,
    getArrayParam,
    setParam,
    setParams,
    setArrayParam,
    removeParams,
    clearAllFilters,
    searchParams,
  } = useUrlFilters({ resetPageOnFilter, pageParamKey });

  const searchDef = getSearchDef(defs);
  const urlSearch = searchDef ? getParam(searchDef.key) : "";
  const [searchInput, setSearchInput] = React.useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = React.useState(urlSearch);

  if (prevUrlSearch !== urlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  React.useEffect(() => {
    if (!searchDef) return;

    const debounceMs = searchDef.debounceMs ?? 300;
    const timer = setTimeout(() => {
      const next = searchInput.trim();
      const current = urlSearch.trim();
      if (next !== current) {
        setParam(searchDef.key, next || null);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, searchDef?.key, searchDef?.debounceMs]);

  const values = React.useMemo(
    () => parseFilterValues(defs, getParam, getArrayParam),
    // searchParams identity changes when URL changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defs, searchParams, getParam, getArrayParam],
  );

  const { activeCount, hasActive } = countActiveFilters(
    defs,
    values,
    searchDef ? searchInput : undefined,
  );

  const setFilter = React.useCallback(
    (key: string, value: string | null | undefined) => {
      const def = defs.find(
        (d) =>
          (d.type !== "dateRange" && d.key === key) ||
          (d.type === "dateRange" && (d.fromKey === key || d.toKey === key)),
      );

      if (def?.type === "select") {
        setParam(key, serializeSelectValue(def, value));
        return;
      }

      setParam(key, value);
    },
    [defs, setParam],
  );

  const setFilters = React.useCallback(
    (next: Record<string, string | null | undefined>) => {
      setParams(next);
    },
    [setParams],
  );
  const setMultiFilter = React.useCallback(
    (key: string, next: string[]) => {
      setArrayParam(key, next);
    },
    [setArrayParam],
  );

  const clearFilters = React.useCallback(() => {
    const keys = collectFilterKeys(defs);
    if (keys.length === 0) {
      clearAllFilters(clearExcludeKeys);
    } else {
      removeParams(keys);
    }
    setSearchInput("");
  }, [defs, removeParams, clearAllFilters, clearExcludeKeys]);

  const getString = React.useCallback(
    (key: string) => {
      const value = values[key];
      return typeof value === "string" ? value : "";
    },
    [values],
  );

  const getArray = React.useCallback(
    (key: string) => {
      const value = values[key];
      return Array.isArray(value) ? value : [];
    },
    [values],
  );

  return {
    defs,
    values: values as ListFilterValues,
    searchInput,
    setSearchInput,
    setFilter,
    setFilters,
    setMultiFilter,
    clearFilters,
    activeCount,
    hasActive,
    getString,
    getArray,
  };
}
