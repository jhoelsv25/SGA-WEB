"use client";

import * as React from "react";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DateTimePickerProps {
  value?: Date | string | null;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  className?: string;
}

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES_INTERVAL = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha y hora",
  disabled = false,
  minDate,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parsear valor entrante
  const parsedDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = typeof value === "string" ? new Date(value) : value;
    return isValid(d) ? d : undefined;
  }, [value]);

  // Estado interno para edición en Popover
  const [currentDate, setCurrentDate] = React.useState<Date>(() => {
    if (parsedDate) return parsedDate;
    const now = new Date();
    now.setHours(9, 0, 0, 0);
    return now;
  });

  // Sincronizar con cambios externos durante el renderizado
  const [prevParsedDate, setPrevParsedDate] = React.useState(parsedDate);
  if (parsedDate !== prevParsedDate) {
    setPrevParsedDate(parsedDate);
    if (parsedDate) {
      setCurrentDate(parsedDate);
    }
  }

  // Extraer componentes de hora en formato 12 horas
  const hours24 = currentDate.getHours();
  const isPm = hours24 >= 12;
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = currentDate.getMinutes();

  const updateDateTime = (newYearMonthDay: Date, h24: number, m: number) => {
    const updated = new Date(newYearMonthDay);
    updated.setHours(h24, m, 0, 0);
    setCurrentDate(updated);
    onChange?.(updated);
  };

  const handleDateSelect = (selectedDay: Date | undefined) => {
    if (!selectedDay) return;
    updateDateTime(selectedDay, hours24, minutes);
  };

  const handleHourSelect = (selectedH12: number) => {
    let newH24 = selectedH12;
    if (isPm && selectedH12 < 12) newH24 += 12;
    if (!isPm && selectedH12 === 12) newH24 = 0;
    updateDateTime(currentDate, newH24, minutes);
  };

  const handleMinuteSelect = (selectedMinute: number) => {
    updateDateTime(currentDate, hours24, selectedMinute);
  };

  const handleAmPmToggle = (targetPm: boolean) => {
    if (targetPm === isPm) return;
    const newH24 = targetPm ? hours24 + 12 : hours24 - 12;
    updateDateTime(currentDate, newH24, minutes);
  };

  const handleQuickPreset = (daysFromNow: number, hour: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    target.setHours(hour, 0, 0, 0);
    setCurrentDate(target);
    onChange?.(target);
  };

  const formattedDisplay = parsedDate
    ? format(parsedDate, "EEEE, d 'de' MMMM 'de' yyyy, hh:mm a", { locale: es })
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          type="button"
          className={cn(
            "border-border/80 bg-background hover:bg-muted/40 h-10.5 w-full justify-start rounded-xl px-3.5 text-left text-xs font-medium shadow-2xs transition-all",
            !parsedDate && "text-muted-foreground",
            className,
          )}
        >
          <HugeiconsIcon
            icon={Calendar01Icon}
            size={16}
            className="text-primary/80 mr-2.5 shrink-0"
          />
          <span className="truncate capitalize">{formattedDisplay || placeholder}</span>
          <HugeiconsIcon
            icon={Clock01Icon}
            size={15}
            className="text-muted-foreground/60 ml-auto shrink-0"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="border-border/80 bg-popover/95 w-auto rounded-2xl p-0 shadow-2xl backdrop-blur-md"
      >
        {/* Atajos Rápidos Superiores */}
        <div className="border-border/60 flex items-center gap-1.5 border-b p-2.5">
          <div className="text-muted-foreground flex items-center gap-1 pl-1 text-[11px] font-semibold">
            <HugeiconsIcon icon={SparklesIcon} size={13} className="text-primary" />
            <span>Atajos:</span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickPreset(1, 9)}
            className="bg-muted/50 hover:bg-primary/15 hover:text-primary cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium transition-colors"
          >
            Mañana 9:00 AM
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset(1, 15)}
            className="bg-muted/50 hover:bg-primary/15 hover:text-primary cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium transition-colors"
          >
            Mañana 3:00 PM
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset(3, 10)}
            className="bg-muted/50 hover:bg-primary/15 hover:text-primary cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium transition-colors"
          >
            En 3 días
          </button>
        </div>

        {/* Panel Principal: Calendario a la izquierda + Columnas de Hora a la derecha */}
        <div className="flex flex-col sm:flex-row">
          {/* Calendario */}
          <div className="p-3">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              locale={es}
              disabled={minDate ? { before: minDate } : undefined}
              className="p-0"
            />
          </div>

          {/* Divisor vertical */}
          <div className="border-border/60 hidden border-r sm:block" />
          <div className="border-border/60 block border-b sm:hidden" />

          {/* Selector de Hora y Minutos */}
          <div className="flex flex-col p-3 sm:w-56">
            <div className="border-border/60 mb-2.5 flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase">
                <HugeiconsIcon icon={Clock01Icon} size={13} className="text-primary" />
                Hora de publicación
              </span>

              {/* Selector AM / PM */}
              <div className="bg-muted/60 flex items-center rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => handleAmPmToggle(false)}
                  className={cn(
                    "cursor-pointer rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-all",
                    !isPm
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleAmPmToggle(true)}
                  className={cn(
                    "cursor-pointer rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-all",
                    isPm
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Listas de Selección de Horas y Minutos */}
            <div className="grid grid-cols-2 gap-2">
              {/* Horas (1-12) */}
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-center text-[10px] font-semibold uppercase">
                  Hora
                </span>
                <ScrollArea className="border-border/60 h-44 rounded-xl border p-1">
                  <div className="flex flex-col gap-1">
                    {HOURS_12.map((h) => {
                      const isSelected = hour12 === h;
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleHourSelect(h)}
                          className={cn(
                            "flex h-7 w-full cursor-pointer items-center justify-center rounded-lg font-mono text-xs font-medium transition-all",
                            isSelected
                              ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                              : "hover:bg-muted/80 text-foreground",
                          )}
                        >
                          {h.toString().padStart(2, "0")}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Minutos (00 - 55 en saltos de 5) */}
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-center text-[10px] font-semibold uppercase">
                  Minuto
                </span>
                <ScrollArea className="border-border/60 h-44 rounded-xl border p-1">
                  <div className="flex flex-col gap-1">
                    {MINUTES_INTERVAL.map((m) => {
                      // Coincide si el minuto está en el rango
                      const isSelected = Math.abs(minutes - m) < 3 || minutes === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleMinuteSelect(m)}
                          className={cn(
                            "flex h-7 w-full cursor-pointer items-center justify-center rounded-lg font-mono text-xs font-medium transition-all",
                            isSelected
                              ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                              : "hover:bg-muted/80 text-foreground",
                          )}
                        >
                          {m.toString().padStart(2, "0")}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior con Resumen y Confirmación */}
        <div className="border-border/60 bg-muted/20 flex items-center justify-between border-t p-2.5">
          <div className="flex max-w-[240px] flex-col truncate pl-1">
            <span className="text-muted-foreground text-[10px] font-medium uppercase">
              Programar para
            </span>
            <span className="text-foreground truncate font-mono text-[11px] font-semibold">
              {format(currentDate, "d MMM, yyyy • hh:mm a", { locale: es })}
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-8 gap-1.5 rounded-lg px-3.5 text-xs font-semibold shadow-xs"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Listo</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
