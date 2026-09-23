"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface UseUrlFiltersOptions {
  resetPageOnFilter?: boolean;
  pageParamKey?: string;
}

export function useUrlFilters(options: UseUrlFiltersOptions = {}) {
  const { resetPageOnFilter = true, pageParamKey = "page" } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Obtener un valor simple o fallback
  const getParam = useCallback(
    (key: string, defaultValue = ""): string => {
      return searchParams.get(key) ?? defaultValue;
    },
    [searchParams],
  );

  // 2. Obtener lista de valores separados por coma (ej. ?worker=id1,id2)
  const getArrayParam = useCallback(
    (key: string): string[] => {
      const value = searchParams.get(key);
      if (!value) return [];
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    },
    [searchParams],
  );

  // 3. Establecer o actualizar un parámetro individual
  const setParam = useCallback(
    (key: string, value: string | number | null | undefined) => {
      const params = new URLSearchParams(
        typeof window === "undefined" ? searchParams.toString() : window.location.search,
      );

      if (value !== null && value !== undefined && String(value).trim() !== "") {
        params.set(key, String(value).trim());
      } else {
        params.delete(key);
      }

      if (resetPageOnFilter && key !== pageParamKey) {
        params.delete(pageParamKey);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, resetPageOnFilter, pageParamKey, router, searchParams],
  );

  // 4. Alternar valor en lista separada por comas (para multi-selects)
  const toggleArrayParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(
        typeof window === "undefined" ? searchParams.toString() : window.location.search,
      );
      const current = params.get(key)?.split(",").filter(Boolean) ?? [];

      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      if (next.length > 0) {
        params.set(key, next.join(","));
      } else {
        params.delete(key);
      }

      if (resetPageOnFilter && key !== pageParamKey) {
        params.delete(pageParamKey);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, resetPageOnFilter, pageParamKey, router, searchParams],
  );

  // 4.1 Establecer lista completa separada por comas (multi-selects)
  const setArrayParam = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(
        typeof window === "undefined" ? searchParams.toString() : window.location.search,
      );

      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }

      if (resetPageOnFilter && key !== pageParamKey) {
        params.delete(pageParamKey);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, resetPageOnFilter, pageParamKey, router, searchParams],
  );

  // 5. Actualizar múltiples parámetros en una sola operación
  const setParams = useCallback(
    (newParams: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(
        typeof window === "undefined" ? searchParams.toString() : window.location.search,
      );

      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && String(value).trim() !== "") {
          params.set(key, String(value).trim());
        } else {
          params.delete(key);
        }
      });

      if (resetPageOnFilter) {
        params.delete(pageParamKey);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, resetPageOnFilter, pageParamKey, router, searchParams],
  );

  // 6. Eliminar parámetros específicos o limpiar todos los filtros
  const removeParams = useCallback(
    (keys: string[]) => {
      const params = new URLSearchParams(
        typeof window === "undefined" ? searchParams.toString() : window.location.search,
      );
      keys.forEach((k) => params.delete(k));

      if (resetPageOnFilter) {
        params.delete(pageParamKey);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, resetPageOnFilter, pageParamKey, router, searchParams],
  );

  const clearAllFilters = useCallback(
    (excludeKeys: string[] = ["view"]) => {
      const params = new URLSearchParams();
      // Mantiene claves que no son filtros (como vista table/cards)
      excludeKeys.forEach((key) => {
        const val = searchParams.get(key);
        if (val) params.set(key, val);
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // 7. Objeto completo plano con todos los parámetros actuales
  const allParams = useMemo(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      result[key] = val;
    });
    return result;
  }, [searchParams]);

  return {
    getParam,
    getArrayParam,
    setParam,
    setParams,
    toggleArrayParam,
    setArrayParam,
    removeParams,
    clearAllFilters,
    allParams,
    searchParams,
    pathname,
  };
}
