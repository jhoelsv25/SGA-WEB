"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import type { Matcher } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDays?: Matcher | Matcher[];
  /** "dropdown" muestra selectores de mes y año (útil para fechas lejanas). */
  captionLayout?: "label" | "dropdown";
  /** Primer y último mes navegables; necesarios con captionLayout="dropdown". */
  startMonth?: Date;
  endMonth?: Date;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Seleccionar fecha",
  disabled = false,
  clearable = true,
  className,
  dateFormat = "PPP",
  minDate,
  maxDate,
  disabledDays,
  captionLayout = "label",
  startMonth,
  endMonth,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(undefined);
  };

  const calendarDisabled = React.useMemo<Matcher | Matcher[] | undefined>(() => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    if (disabledDays) {
      if (Array.isArray(disabledDays)) {
        matchers.push(...disabledDays);
      } else {
        matchers.push(disabledDays);
      }
    }
    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate, disabledDays]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "border-input bg-background/90 h-11 w-full justify-between rounded-full px-4 text-left font-normal transition-all",
            !className?.includes("w-") && "sm:w-65",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={16}
              strokeWidth={2}
              className="text-muted-foreground shrink-0"
            />
            <span className="truncate">
              {date ? format(date, dateFormat, { locale: es }) : placeholder}
            </span>
          </div>

          {clearable && date && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
              className="hover:bg-muted ml-2 rounded-full p-0.5"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={14}
                strokeWidth={2}
                className="opacity-50 hover:opacity-100"
              />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={date ?? endMonth}
          captionLayout={captionLayout}
          startMonth={startMonth}
          endMonth={endMonth}
          selected={date}
          onSelect={(newDate) => {
            onSelect?.(newDate);
            setOpen(false);
          }}
          disabled={calendarDisabled}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}
