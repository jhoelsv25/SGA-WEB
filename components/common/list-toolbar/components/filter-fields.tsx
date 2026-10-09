"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SelectOption } from "@/components/common/select";
import { DatePicker } from "@/components/common/date-picker";
import { DateRangePicker } from "@/components/common/date-range-picker";
import { cn } from "@/lib/utils";
import type {
  ListFilterController,
  ListFilterDef,
  ListFilterChipsDef,
  ListFilterDateDef,
  ListFilterDateRangeDef,
  ListFilterMultiSelectDef,
  ListFilterSelectDef,
} from "../filters";
import { formatDateParam, getNonSearchDefs, getSelectAllValue, parseDateParam } from "../filters";
import { listToolbarSelectClassName } from "../styles";

type FilterFieldLayout = "inline" | "stack";

function FilterFieldShell({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  if (!label) {
    return <div className={className}>{children}</div>;
  }
  return (
    <label className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}>
      <span className="text-muted-foreground px-0.5 text-xs leading-none font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}

function FilterSelectField({
  def,
  controller,
  layout,
}: {
  def: ListFilterSelectDef;
  controller: ListFilterController;
  layout: FilterFieldLayout;
}) {
  const allValue = getSelectAllValue(def);
  const raw = controller.values[def.key];
  const value = typeof raw === "string" && raw ? raw : allValue;
  const isStacked = layout === "stack";
  return (
    <FilterFieldShell
      label={isStacked ? def.label : undefined}
      className={isStacked ? "w-full" : cn("w-full md:w-44 lg:w-52", def.widthClassName)}
    >
      <SelectOption<string>
        options={def.options}
        value={value}
        onSelect={(val) => controller.setFilter(def.key, val)}
        placeholder={def.placeholder}
        searchPlaceholder={def.searchPlaceholder ?? "Filtrar..."}
        className={cn(listToolbarSelectClassName, "w-full", def.className)}
      />
    </FilterFieldShell>
  );
}

function FilterMultiSelectField({
  def,
  controller,
  layout,
}: {
  def: ListFilterMultiSelectDef;
  controller: ListFilterController;
  layout: FilterFieldLayout;
}) {
  const raw = controller.values[def.key];
  const values = Array.isArray(raw)
    ? raw
    : typeof raw === "string" && raw.trim()
      ? raw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
  const isStacked = layout === "stack";
  return (
    <FilterFieldShell
      label={isStacked ? def.label : undefined}
      className={isStacked ? "w-full" : cn("w-full md:w-48 lg:w-56", def.widthClassName)}
    >
      <SelectOption<string>
        multi
        options={def.options}
        values={values}
        onValuesChange={(next) => controller.setMultiFilter(def.key, next)}
        placeholder={def.placeholder}
        searchPlaceholder={def.searchPlaceholder ?? "Buscar..."}
        className={cn(listToolbarSelectClassName, "w-full", def.className)}
      />
    </FilterFieldShell>
  );
}

function FilterDateField({
  def,
  controller,
  layout,
}: {
  def: ListFilterDateDef;
  controller: ListFilterController;
  layout: FilterFieldLayout;
}) {
  const raw = controller.values[def.key];
  const date = parseDateParam(typeof raw === "string" ? raw : undefined);
  const isStacked = layout === "stack";
  return (
    <FilterFieldShell
      label={isStacked ? def.label : undefined}
      className={isStacked ? "w-full" : cn("w-full md:w-44 lg:w-52", def.widthClassName)}
    >
      <DatePicker
        date={date}
        onSelect={(next) => controller.setFilter(def.key, formatDateParam(next))}
        placeholder={def.placeholder ?? "Fecha"}
        className={cn(
          listToolbarSelectClassName,
          "w-full justify-between sm:w-full",
          def.className,
        )}
      />
    </FilterFieldShell>
  );
}

function FilterDateRangeField({
  def,
  controller,
  layout,
}: {
  def: ListFilterDateRangeDef;
  controller: ListFilterController;
  layout: FilterFieldLayout;
}) {
  const fromRaw = controller.values[def.fromKey];
  const toRaw = controller.values[def.toKey];
  const from = parseDateParam(typeof fromRaw === "string" ? fromRaw : undefined);
  const to = parseDateParam(typeof toRaw === "string" ? toRaw : undefined);
  const dateRange = from ? { from, to } : undefined;
  const isStacked = layout === "stack";
  return (
    <FilterFieldShell
      label={isStacked ? def.label : undefined}
      className={isStacked ? "w-full" : cn("w-full sm:w-56", def.widthClassName)}
    >
      <DateRangePicker
        dateRange={dateRange}
        numberOfMonths={1}
        placeholder={def.fromPlaceholder ?? "Fecha"}
        className={cn(listToolbarSelectClassName, "w-full justify-start sm:w-full", def.className)}
        onSelect={(next) => {
          controller.setFilters({
            [def.fromKey]: formatDateParam(next?.from),
            [def.toKey]: formatDateParam(next?.to),
          });
        }}
      />
    </FilterFieldShell>
  );
}

function FilterChipsField({
  def,
  controller,
  layout,
}: {
  def: ListFilterChipsDef;
  controller: ListFilterController;
  layout: FilterFieldLayout;
}) {
  const allValue = getSelectAllValue(def);
  const raw = controller.values[def.key];
  const currentValue = typeof raw === "string" && raw ? raw : allValue;
  const isStacked = layout === "stack";

  return (
    <FilterFieldShell
      label={isStacked ? def.label : undefined}
      className={isStacked ? "w-full" : cn("max-w-full min-w-0", def.className)}
    >
      <div
        role="group"
        aria-label={def.label ?? "Filtro de opciones"}
        className={cn(
          "flex scrollbar-none items-center gap-1.5 overflow-x-auto py-0.5",
          isStacked ? "flex-wrap overflow-x-visible" : "max-w-full",
        )}
      >
        {def.options.map((option) => {
          const isSelected = currentValue === option.value;
          return (
            <Button
              key={String(option.value)}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="xs"
              aria-pressed={isSelected}
              disabled={option.disabled}
              onClick={() => {
                if (isSelected) {
                  if (option.value === allValue) return;
                  controller.setFilter(def.key, null);
                } else {
                  controller.setFilter(def.key, option.value === allValue ? null : option.value);
                }
              }}
              className={cn(
                "shrink-0 rounded-full text-xs font-medium whitespace-nowrap transition-colors pointer-coarse:min-h-11",
                isSelected && "shadow-2xs",
              )}
            >
              {option.icon}
              <span>{option.label}</span>
            </Button>
          );
        })}
      </div>
    </FilterFieldShell>
  );
}

/**
 * Renderiza los filtros del listado, excepto la búsqueda.
 * `stack` muestra la etiqueta de cada filtro y ocupa el ancho del popover.
 */
export function ListToolbarFilterFields({
  filterDefs,
  controller,
  layout = "inline",
}: {
  filterDefs: readonly ListFilterDef[];
  controller: ListFilterController;
  layout?: FilterFieldLayout;
}) {
  const defs = getNonSearchDefs(filterDefs);
  return (
    <>
      {defs.map((def) => {
        switch (def.type) {
          case "select":
            return (
              <FilterSelectField key={def.key} def={def} controller={controller} layout={layout} />
            );
          case "multiSelect":
            return (
              <FilterMultiSelectField
                key={def.key}
                def={def}
                controller={controller}
                layout={layout}
              />
            );
          case "chips":
            return (
              <FilterChipsField key={def.key} def={def} controller={controller} layout={layout} />
            );
          case "date":
            return (
              <FilterDateField key={def.key} def={def} controller={controller} layout={layout} />
            );
          case "dateRange":
            return (
              <FilterDateRangeField
                key={`${def.fromKey}-${def.toKey}`}
                def={def}
                controller={controller}
                layout={layout}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
