"use client";

import * as React from "react";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  FilterIcon,
  RefreshIcon,
  TableIcon,
  DashboardSquare02Icon,
  KanbanIcon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { DataToolbarProps, FilterField, ViewMode } from "./types";

export function DataToolbar({
  searchKey = "q",
  searchPlaceholder = "Buscar...",
  filters = [],
  viewMode,
  onViewModeChange,
  availableViews = ["table", "cards"],
  onRefresh,
  isRefreshing = false,
  actions,
  className,
}: DataToolbarProps) {
  // Hook centralizado para manejo de URL y filtros
  const { getParam, getArrayParam, setParam, toggleArrayParam, removeParams, searchParams } =
    useUrlFilters();

  // 1. Estado local de búsqueda con sincronización a la URL (debounced)
  const currentSearch = getParam(searchKey);
  const [searchValue, setSearchValue] = React.useState(currentSearch);
  const [prevSearch, setPrevSearch] = React.useState(currentSearch);

  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch);
    setSearchValue(currentSearch);
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        setParam(searchKey, searchValue);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchValue, currentSearch, searchKey, setParam]);

  // 2. Manejo de View Mode (sincronizado con URL o controlado por props)
  const urlViewMode = getParam("view", "table") as ViewMode;
  const activeView = viewMode ?? urlViewMode;

  const handleViewChange = (mode: ViewMode) => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setParam("view", mode);
    }
  };

  // 3. Manejo de Filtros
  const handleFilterToggle = (key: string, value: string, isMulti = false) => {
    if (isMulti) {
      toggleArrayParam(key, value);
    } else {
      const current = getParam(key);
      setParam(key, current === value ? null : value);
    }
  };

  const handleResetFilters = () => {
    removeParams(filters.map((f) => f.key));
  };

  // Conteo de filtros activos
  const activeFiltersCount = React.useMemo(() => {
    return filters.reduce((count, f) => {
      return searchParams.has(f.key) ? count + 1 : count;
    }, 0);
  }, [filters, searchParams]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {/* Zona izquierda: Buscador + Filtros Popover */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            strokeWidth={2}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
            className="pr-8 pl-9"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                setParam(searchKey, null);
              }}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Popover de Filtros Dinámicos */}
        {filters.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="default" className="gap-2">
                <HugeiconsIcon icon={FilterIcon} size={16} strokeWidth={2} />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 rounded-full px-1.5 text-xs font-semibold"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4" align="start">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="text-sm font-semibold">Filtros aplicados</h4>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-muted-foreground hover:text-destructive h-auto p-0 text-xs"
                  >
                    Limpiar todos
                  </Button>
                )}
              </div>

              <div className="mt-3 max-h-72 space-y-4 overflow-y-auto pr-1">
                {filters.map((field: FilterField) => {
                  const selectedValues =
                    field.type === "multi-select"
                      ? getArrayParam(field.key)
                      : [getParam(field.key)].filter(Boolean);
                  const isMulti = field.type === "multi-select";

                  return (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-muted-foreground text-xs font-medium">
                        {field.label}
                      </label>

                      <div className="flex flex-wrap gap-1.5">
                        {field.options?.map((opt) => {
                          const isSelected = selectedValues.includes(opt.value);

                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleFilterToggle(field.key, opt.value, isMulti)}
                              className={cn(
                                "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors",
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary font-medium"
                                  : "border-border bg-card text-muted-foreground hover:bg-muted",
                              )}
                            >
                              {isSelected && (
                                <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={2} />
                              )}
                              <span>{opt.label}</span>
                              {typeof opt.count === "number" && (
                                <span className="text-[10px] opacity-60">({opt.count})</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Botón de recarga (Reload) */}
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Recargar datos"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              size={16}
              strokeWidth={2}
              className={cn(isRefreshing && "animate-spin")}
            />
          </Button>
        )}
      </div>

      {/* Zona derecha: Selector de Vistas (Table / Cards / Kanban) + Acciones personalizadas */}
      <div className="flex items-center gap-2">
        {availableViews.length > 1 && (
          <div className="bg-muted border-border flex items-center rounded-lg border p-0.5">
            {availableViews.includes("table") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewChange("table")}
                className={cn(
                  "h-7 px-2 text-xs",
                  activeView === "table" && "bg-background text-foreground shadow-xs",
                )}
                aria-label="Vista tabla"
              >
                <HugeiconsIcon icon={TableIcon} size={14} strokeWidth={2} />
              </Button>
            )}

            {availableViews.includes("cards") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewChange("cards")}
                className={cn(
                  "h-7 px-2 text-xs",
                  activeView === "cards" && "bg-background text-foreground shadow-xs",
                )}
                aria-label="Vista tarjetas"
              >
                <HugeiconsIcon icon={DashboardSquare02Icon} size={14} strokeWidth={2} />
              </Button>
            )}

            {availableViews.includes("kanban") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewChange("kanban")}
                className={cn(
                  "h-7 px-2 text-xs",
                  activeView === "kanban" && "bg-background text-foreground shadow-xs",
                )}
                aria-label="Vista kanban"
              >
                <HugeiconsIcon icon={KanbanIcon} size={14} strokeWidth={2} />
              </Button>
            )}
          </div>
        )}

        {actions}
      </div>
    </div>
  );
}
