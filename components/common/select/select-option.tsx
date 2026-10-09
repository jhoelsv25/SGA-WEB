"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkSquare02Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { SelectOptionItem, SelectOptionProps } from "./types";

function MultiSelectCheck({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <HugeiconsIcon
        icon={CheckmarkSquare02Icon}
        size={15}
        strokeWidth={2}
        className="text-primary shrink-0"
      />
    );
  }

  return (
    <span
      aria-hidden
      className="border-muted-foreground/40 size-3.5 shrink-0 rounded-[3px] border"
    />
  );
}

export function SelectOption<T extends string = string>({
  options,
  value,
  values,
  onSelect,
  onValuesChange,
  multi = false,
  placeholder = "Seleccionar opción...",
  searchPlaceholder = "Buscar opción...",
  emptyMessage = "No se encontraron resultados.",
  disabled = false,
  className,
  clearable = false,
}: SelectOptionProps<T>) {
  const [open, setOpen] = React.useState(false);

  const selectedValues = React.useMemo(() => {
    if (multi) {
      return values ?? [];
    }
    return value ? [value] : [];
  }, [multi, values, value]);

  const selectedItems = React.useMemo(() => {
    return options.filter((opt) => selectedValues.includes(opt.value) && opt.value !== ("" as T));
  }, [options, selectedValues]);

  const triggerLabel = React.useMemo(() => {
    if (selectedValues.length === 0) return null;
    if (selectedItems.length === 1) return selectedItems[0].label;
    if (selectedItems.length === 2) {
      return `${selectedItems[0].label}, ${selectedItems[1].label}`;
    }
    if (selectedItems.length > 2) {
      return `${selectedItems.length} seleccionados`;
    }
    // Valores en URL/estado que aún no están en options (carga async)
    return `${selectedValues.length} seleccionados`;
  }, [selectedItems, selectedValues.length]);

  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, SelectOptionItem<T>[]> = {};
    const ungrouped: SelectOptionItem<T>[] = [];

    for (const opt of options) {
      if (opt.group) {
        if (!groups[opt.group]) {
          groups[opt.group] = [];
        }
        groups[opt.group].push(opt);
      } else {
        ungrouped.push(opt);
      }
    }

    return { groups, ungrouped };
  }, [options]);

  const handleSelect = React.useCallback(
    (selectedValue: T) => {
      if (multi) {
        const next = selectedValues.includes(selectedValue)
          ? selectedValues.filter((item) => item !== selectedValue)
          : [...selectedValues, selectedValue];
        onValuesChange?.(next);
      } else {
        onSelect?.(selectedValue);
        setOpen(false);
      }
    },
    [multi, selectedValues, onSelect, onValuesChange],
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (multi) {
        onValuesChange?.([]);
      } else {
        onSelect?.("" as T);
      }
    },
    [multi, onSelect, onValuesChange],
  );

  const renderItem = (item: SelectOptionItem<T>) => {
    const isSelected = selectedValues.includes(item.value);

    return (
      <CommandItem
        key={String(item.value)}
        value={`${item.label} ${item.description ?? ""}`}
        disabled={item.disabled}
        onSelect={() => handleSelect(item.value)}
        className="cursor-pointer justify-between rounded-xl px-2.5 py-2 text-xs font-medium"
      >
        <div className="flex items-center gap-2 truncate">
          {multi ? (
            <MultiSelectCheck selected={isSelected} />
          ) : (
            item.icon && <span className="text-muted-foreground shrink-0">{item.icon}</span>
          )}
          <div className="flex flex-col truncate">
            <span
              className={cn(
                "truncate text-xs",
                isSelected ? "text-primary font-semibold" : "text-foreground font-medium",
              )}
            >
              {item.label}
            </span>
            {item.description && (
              <span className="text-muted-foreground truncate text-xs">{item.description}</span>
            )}
          </div>
        </div>
        {!multi && (
          <HugeiconsIcon
            icon={Tick02Icon}
            size={15}
            strokeWidth={2.5}
            className={cn(
              "text-primary ml-2 shrink-0 transition-opacity",
              isSelected ? "opacity-100" : "opacity-0",
            )}
          />
        )}
      </CommandItem>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "border-border/80 bg-background text-foreground hover:border-ring/30 hover:bg-background focus-visible:border-primary focus-visible:ring-primary/20 aria-expanded:border-primary aria-expanded:ring-primary/20 dark:border-border/70 dark:bg-card/40 dark:hover:bg-card/50 h-11 w-full min-w-0 justify-between rounded-full border px-4 py-2 text-sm font-normal shadow-2xs transition-all duration-150 outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-expanded:ring-2",
            !triggerLabel && "text-muted-foreground/60 dark:text-muted-foreground/50",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            {multi && selectedValues.length > 0 && (
              <span className="bg-primary/10 text-primary inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold">
                {selectedValues.length}
              </span>
            )}
            {!multi && selectedItems.length === 1 && selectedItems[0].icon ? (
              <span className="shrink-0">{selectedItems[0].icon}</span>
            ) : null}
            {!multi && selectedItems.length === 1 ? (
              <span className="flex min-w-0 flex-col items-start">
                <span className="truncate">{selectedItems[0].label}</span>
                {selectedItems[0].description ? (
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {selectedItems[0].description}
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="truncate">{triggerLabel ?? placeholder}</span>
            )}
          </span>

          <span className="flex items-center gap-1">
            {clearable && selectedValues.length > 0 && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClear(e as unknown as React.MouseEvent);
                  }
                }}
                className="hover:bg-muted rounded-full p-0.5"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={14}
                  strokeWidth={2}
                  className="opacity-50 hover:opacity-100"
                />
              </span>
            )}
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              size={16}
              strokeWidth={2}
              className="shrink-0 opacity-50"
            />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="border-border/80 bg-popover/95 w-[--radix-popover-trigger-width] min-w-72 rounded-2xl p-1 shadow-xl backdrop-blur-md"
        align="start"
        sideOffset={6}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <Command className="p-0">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList
            className="max-h-64 overflow-y-auto p-1"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <CommandEmpty>{emptyMessage}</CommandEmpty>

            {groupedOptions.ungrouped.length > 0 && (
              <CommandGroup>{groupedOptions.ungrouped.map(renderItem)}</CommandGroup>
            )}

            {Object.entries(groupedOptions.groups).map(([groupName, items]) => (
              <CommandGroup key={groupName} heading={groupName}>
                {items.map(renderItem)}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
