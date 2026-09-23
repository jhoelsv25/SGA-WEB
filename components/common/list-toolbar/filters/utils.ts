import type { ListFilterDef, ListFilterSelectDef, ListFilterValues } from "./types";

export function collectFilterKeys(defs: readonly ListFilterDef[]): string[] {
  const keys: string[] = [];
  for (const def of defs) {
    if (def.type === "dateRange") {
      keys.push(def.fromKey, def.toKey);
    } else {
      keys.push(def.key);
    }
  }
  return keys;
}

export function getSearchDef(defs: readonly ListFilterDef[]) {
  return defs.find((d) => d.type === "search");
}

export function getNonSearchDefs(defs: readonly ListFilterDef[]) {
  return defs.filter((d) => d.type !== "search");
}

export function getSelectAllValue(def: ListFilterSelectDef): string {
  return def.allValue ?? "all";
}

/**
 * Parse URL params into typed filter values according to the schema.
 * Select filters fall back to `allValue` when the param is missing.
 */
export function parseFilterValues(
  defs: readonly ListFilterDef[],
  getParam: (key: string, defaultValue?: string) => string,
  getArrayParam: (key: string) => string[],
): ListFilterValues {
  const values: ListFilterValues = {};

  for (const def of defs) {
    switch (def.type) {
      case "multiSelect":
        values[def.key] = getArrayParam(def.key);
        break;
      case "select":
        values[def.key] = getParam(def.key) || getSelectAllValue(def);
        break;
      case "dateRange":
        values[def.fromKey] = getParam(def.fromKey);
        values[def.toKey] = getParam(def.toKey);
        break;
      case "search":
      case "date":
        values[def.key] = getParam(def.key);
        break;
    }
  }

  return values;
}

/** Count active filters; search counts toward `hasActive` but not the badge. */
export function countActiveFilters(
  defs: readonly ListFilterDef[],
  values: ListFilterValues,
  searchInput?: string,
): { activeCount: number; hasActive: boolean } {
  let activeCount = 0;

  for (const def of defs) {
    switch (def.type) {
      case "search":
        break;
      case "select": {
        const all = getSelectAllValue(def);
        const current = String(values[def.key] ?? "");
        if (current && current !== all) activeCount += 1;
        break;
      }
      case "multiSelect": {
        const current = values[def.key];
        if (Array.isArray(current) && current.length > 0) {
          // Cada valor seleccionado cuenta (ej. 2 workers → badge 2)
          activeCount += current.length;
        }
        break;
      }
      case "date": {
        if (String(values[def.key] ?? "").trim()) activeCount += 1;
        break;
      }
      case "dateRange": {
        const from = String(values[def.fromKey] ?? "").trim();
        const to = String(values[def.toKey] ?? "").trim();
        if (from || to) activeCount += 1;
        break;
      }
    }
  }

  const searchDef = getSearchDef(defs);
  const searchLive = searchDef
    ? searchInput !== undefined
      ? searchInput.trim()
      : String(values[searchDef.key] ?? "").trim()
    : "";

  return {
    activeCount,
    hasActive: activeCount > 0 || searchLive.length > 0,
  };
}

/** Normalize a select write: `allValue` / empty → null (delete from URL). */
export function serializeSelectValue(
  def: ListFilterSelectDef,
  value: string | null | undefined,
): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === getSelectAllValue(def)) return null;
  return trimmed;
}

/** Format Date → `yyyy-MM-dd` for URL storage. */
export function formatDateParam(date: Date | undefined): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse `yyyy-MM-dd` from URL into a local Date. */
export function parseDateParam(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return undefined;
  }
  return date;
}
