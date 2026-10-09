"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon, RefreshIcon, FilterIcon } from "@hugeicons/core-free-icons";
import { useContainerCompact } from "@/hooks/use-container-compact";
import { cn } from "@/lib/utils";
import type { ListToolbarProps } from "../types";
import {
  countActiveFilters,
  getSearchDef,
  type ListFilterController,
  type ListFilterDef,
} from "../filters";
import { ListToolbarFilterFields } from "./filter-fields";

/** Ancho del toolbar por debajo del cual los filtros van a popover */
const LIST_TOOLBAR_COMPACT_BREAKPOINT = 960;
/** Filtros visibles junto a la búsqueda. El resto va al menú. */
const MAX_INLINE_FILTERS = 2;

function splitToolbarFilters(defs: readonly ListFilterDef[]): {
  inline: ListFilterDef[];
  overflow: ListFilterDef[];
} {
  const inline: ListFilterDef[] = [];
  const overflow: ListFilterDef[] = [];
  for (const def of defs) {
    if (def.type === "search") continue;
    const isForcedOverflow = def.inline === false;
    if (isForcedOverflow || inline.length >= MAX_INLINE_FILTERS) {
      overflow.push(def);
      continue;
    }
    inline.push(def);
  }
  return { inline, overflow };
}

function clearListedFilters(
  defs: readonly ListFilterDef[],
  setFilters: ListFilterController["setFilters"],
): void {
  const next: Record<string, null> = {};
  for (const def of defs) {
    if (def.type === "dateRange") {
      next[def.fromKey] = null;
      next[def.toKey] = null;
      continue;
    }
    if (def.type === "search") continue;
    next[def.key] = null;
  }
  setFilters(next);
}

function ToolbarFiltersButton({
  badgeCount,
  onClear,
  children,
}: {
  badgeCount: number;
  onClear?: () => void;
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="border-border/80 bg-background hover:bg-muted dark:border-border/70 dark:bg-card/40 h-10 shrink-0 gap-2 rounded-xl px-3.5 text-xs font-semibold shadow-2xs"
        >
          <HugeiconsIcon icon={FilterIcon} size={16} strokeWidth={2} />
          <span>Filtros</span>
          {badgeCount > 0 ? (
            <Badge
              variant="secondary"
              className="ml-0.5 h-5 min-w-5 rounded-full px-1.5 text-[10px] font-semibold"
            >
              {badgeCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="border-border/60 w-[min(100vw-2rem,20rem)] gap-0 rounded-2xl p-0 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 px-3.5 pt-3 pb-2">
          <p className="text-sm font-semibold">Filtros</p>
          {badgeCount > 0 && onClear ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive h-auto px-2 py-1 text-xs"
            >
              Limpiar
            </Button>
          ) : null}
        </div>
        <div className="flex max-h-80 flex-col gap-3 overflow-y-auto px-3.5 pb-3.5">{children}</div>
      </PopoverContent>
    </Popover>
  );
}

export function ListToolbar({
  filterDefs,
  listFilters,
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  hasActiveFilters = false,
  activeFiltersCount,
  onClearFilters,
  onRefresh,
  isRefreshing = false,
  refreshLabel = "Recargar",
  filters,
  extraFilters,
  leadingActions,
  actions,
  className,
}: ListToolbarProps) {
  const { ref, isCompact } = useContainerCompact<HTMLDivElement>(LIST_TOOLBAR_COMPACT_BREAKPOINT);

  const declarative = Boolean(filterDefs && listFilters);
  const searchDef = filterDefs ? getSearchDef(filterDefs) : undefined;

  const resolvedSearchValue = declarative ? listFilters!.searchInput : (searchValue ?? "");
  const resolvedOnSearchChange = declarative
    ? listFilters!.setSearchInput
    : (onSearchChange ?? (() => undefined));
  const resolvedSearchPlaceholder = searchDef?.placeholder ?? searchPlaceholder;

  const resolvedHasActive = declarative ? listFilters!.hasActive : hasActiveFilters;
  const resolvedActiveCount = declarative ? listFilters!.activeCount : activeFiltersCount;
  const resolvedClear = declarative
    ? () => {
        listFilters!.clearFilters();
        onClearFilters?.();
      }
    : onClearFilters;

  const splitFilters = filterDefs ? splitToolbarFilters(filterDefs) : { inline: [], overflow: [] };
  const inlineDefs = splitFilters.inline;
  const overflowDefs = splitFilters.overflow;
  const overflowCount =
    declarative && listFilters && overflowDefs.length > 0
      ? countActiveFilters(overflowDefs, listFilters.values).activeCount
      : 0;
  const clearOverflow = () => {
    if (!listFilters) return;
    clearListedFilters(overflowDefs, listFilters.setFilters);
  };
  const inlineFields =
    declarative && inlineDefs && listFilters ? (
      <ListToolbarFilterFields filterDefs={inlineDefs} controller={listFilters} />
    ) : null;
  const overflowFields =
    declarative && listFilters && overflowDefs.length > 0 ? (
      <ListToolbarFilterFields filterDefs={overflowDefs} controller={listFilters} layout="stack" />
    ) : null;
  const allFields =
    declarative && filterDefs && listFilters ? (
      <>
        <ListToolbarFilterFields filterDefs={filterDefs} controller={listFilters} layout="stack" />
        {extraFilters}
      </>
    ) : (
      <>
        {filters}
        {extraFilters}
      </>
    );
  const showFilters = Boolean(
    declarative
      ? (filterDefs && filterDefs.some((d) => d.type !== "search")) || extraFilters
      : filters || extraFilters,
  );

  const badgeCount =
    typeof resolvedActiveCount === "number" ? resolvedActiveCount : resolvedHasActive ? 1 : 0;

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-2.5">
        <div className="relative min-w-0 flex-1 basis-48 sm:w-52 sm:max-w-60 sm:flex-none sm:basis-auto lg:w-56 xl:w-60">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
          />
          <Input
            placeholder={resolvedSearchPlaceholder}
            value={resolvedSearchValue}
            onChange={(e) => resolvedOnSearchChange(e.target.value)}
            className="h-11 rounded-full pr-9 pl-9.5 text-xs shadow-2xs"
          />
          {resolvedSearchValue ? (
            <button
              type="button"
              onClick={() => resolvedOnSearchChange("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
          ) : null}
        </div>

        {showFilters && isCompact ? (
          <ToolbarFiltersButton
            badgeCount={badgeCount}
            onClear={resolvedHasActive ? resolvedClear : undefined}
          >
            {allFields}
          </ToolbarFiltersButton>
        ) : null}

        {showFilters && !isCompact ? (
          <>
            {inlineFields}
            {extraFilters}
            {overflowFields ? (
              <ToolbarFiltersButton
                badgeCount={overflowCount}
                onClear={overflowCount > 0 ? clearOverflow : undefined}
              >
                {overflowFields}
              </ToolbarFiltersButton>
            ) : null}
            {resolvedHasActive && resolvedClear ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={resolvedClear}
                className="text-muted-foreground hover:text-foreground h-10 gap-1.5 rounded-xl px-2.5 text-xs font-medium transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
                <span>Limpiar</span>
              </Button>
            ) : null}
          </>
        ) : null}

        {!showFilters && resolvedHasActive && resolvedClear ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={resolvedClear}
            className="text-muted-foreground hover:text-foreground h-10 gap-1.5 rounded-xl px-2.5 text-xs font-medium transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
            <span>Limpiar</span>
          </Button>
        ) : null}
      </div>

      <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto xl:self-center">
        {leadingActions}
        {onRefresh ? (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title={refreshLabel}
            aria-label={refreshLabel}
            className="border-border/80 bg-background hover:bg-muted dark:border-border/70 dark:bg-card/40 size-10 shrink-0 rounded-xl shadow-2xs"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </Button>
        ) : null}
        {actions}
      </div>
    </div>
  );
}
