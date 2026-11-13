"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { bloqueSchema, type BloqueFormValues } from "../../schemas";
import type { BloqueHorario, CargaItemHorario } from "../../types";
import { DIAS_SEMANA, convertirHoraAMinutos, minutosAHora } from "../../utils";

interface BloqueFormProps {
  bloque?: BloqueHorario | null;
  diaSemanaInicial?: number;
  horaInicioInicial?: string;
  horaFinInicial?: string;
  cursoSeccionIdInicial?: string | null;
  tipoBloqueInicial?: "clase" | "receso";
  cargaItems: CargaItemHorario[];
  onSubmit: (values: BloqueFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BloqueForm({
  bloque,
  diaSemanaInicial = 1,
  horaInicioInicial = "",
  horaFinInicial = "",
  cursoSeccionIdInicial = null,
  tipoBloqueInicial = "clase",
  cargaItems,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BloqueFormProps) {
  const form = useForm<BloqueFormValues>({
    resolver: zodResolver(bloqueSchema),
    defaultValues: {
      tipoBloque: bloque?.tipoBloque ?? tipoBloqueInicial,
      cursoSeccionId: bloque?.cursoSeccionId ?? cursoSeccionIdInicial ?? "",
      diaSemana: bloque?.diaSemana ?? diaSemanaInicial,
      horaInicio: bloque?.horaInicio ?? horaInicioInicial,
      horaFin: bloque?.horaFin ?? horaFinInicial,
      aula: bloque?.aula ?? "",
    },
  });

  const tipoBloque = useWatch({
    control: form.control,
    name: "tipoBloque",
    defaultValue: bloque?.tipoBloque ?? tipoBloqueInicial,
  });
  const horaInicioVal = useWatch({
    control: form.control,
    name: "horaInicio",
  });
  const errors = form.formState.errors;

  const aplicarDuracion = (minutos: number) => {
    if (!horaInicioVal || !horaInicioVal.includes(":")) return;
    try {
      const minIni = convertirHoraAMinutos(horaInicioVal);
      const minFin = minIni + minutos;
      form.setValue("horaFin", minutosAHora(minFin), { shouldValidate: true });
    } catch {
      // Ignorar si el formato es inválido
    }
  };

  const [openCursoSelector, setOpenCursoSelector] = React.useState(false);

  const gruposPorDocente = React.useMemo(() => {
    const mapa = new Map<string, { docente: string; items: CargaItemHorario[] }>();
    for (const item of cargaItems) {
      const nombre = item.docente?.nombreCompleto?.trim() || "Sin docente asignado";
      const grupo = mapa.get(nombre) ?? { docente: nombre, items: [] };
      grupo.items.push(item);
      mapa.set(nombre, grupo);
    }
    return Array.from(mapa.values())
      .sort((a, b) => {
        if (a.docente === "Sin docente asignado") return 1;
        if (b.docente === "Sin docente asignado") return -1;
        return a.docente.localeCompare(b.docente, "es");
      })
      .map((g) => ({
        ...g,
        items: [...g.items].sort((a, b) => a.cursoNombre.localeCompare(b.cursoNombre, "es")),
      }));
  }, [cargaItems]);

  return (
    <form className="space-y-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tipoBloque" className="text-sm font-medium">
            Tipo de bloque *
          </Label>
          <Controller
            control={form.control}
            name="tipoBloque"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  if (val === "receso") form.setValue("cursoSeccionId", null);
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="tipoBloque" className="h-10 w-full">
                  <SelectValue placeholder="Selecciona el tipo de bloque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clase">Clase pedagógica</SelectItem>
                  <SelectItem value="receso">Receso / Recreo</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.tipoBloque && (
            <p className="text-destructive text-xs font-medium">{errors.tipoBloque.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="diaSemana" className="text-sm font-medium">
            Día escolar *
          </Label>
          <Controller
            control={form.control}
            name="diaSemana"
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(val) => field.onChange(Number(val))}
                disabled={isSubmitting}
              >
                <SelectTrigger id="diaSemana" className="h-10 w-full">
                  <SelectValue placeholder="Selecciona el día" />
                </SelectTrigger>
                <SelectContent>
                  {DIAS_SEMANA.map((d) => (
                    <SelectItem key={d.dia} value={String(d.dia)}>
                      {d.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.diaSemana && (
            <p className="text-destructive text-xs font-medium">{errors.diaSemana.message}</p>
          )}
        </div>
      </div>

      {tipoBloque === "clase" && (
        <div className="space-y-1.5">
          <Label htmlFor="cursoSeccionId" className="text-sm font-medium">
            Docente y curso de la sección *
          </Label>
          <Controller
            control={form.control}
            name="cursoSeccionId"
            render={({ field }) => {
              const seleccionado = cargaItems.find((item) => item.id === field.value) ?? null;
              return (
                <Popover open={openCursoSelector} onOpenChange={setOpenCursoSelector}>
                  <PopoverTrigger asChild>
                    <Button
                      id="cursoSeccionId"
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCursoSelector}
                      disabled={isSubmitting}
                      className="h-10 w-full justify-between px-3 font-normal"
                    >
                      {seleccionado ? (
                        <span className="flex min-w-0 items-center gap-2 truncate">
                          {seleccionado.colorHex && (
                            <span
                              className="inline-block size-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: seleccionado.colorHex }}
                            />
                          )}
                          <span className="truncate font-medium">{seleccionado.cursoNombre}</span>
                          <span className="text-muted-foreground truncate text-xs">
                            · {seleccionado.docente?.nombreCompleto ?? "Sin docente"}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Selecciona docente y curso...</span>
                      )}
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        className="text-muted-foreground size-4 shrink-0"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-(--radix-popover-trigger-width) min-w-72 p-0"
                  >
                    <Command>
                      <CommandInput placeholder="Buscar por docente o curso..." />
                      <CommandList className="max-h-64">
                        <CommandEmpty>No se encontraron coincidencias.</CommandEmpty>
                        {gruposPorDocente.map((grupo, idx) => (
                          <React.Fragment key={grupo.docente}>
                            {idx > 0 && <CommandSeparator />}
                            <CommandGroup heading={grupo.docente}>
                              {grupo.items.map((item) => (
                                <CommandItem
                                  key={item.id}
                                  value={`${grupo.docente} ${item.cursoNombre}`}
                                  data-checked={field.value === item.id}
                                  onSelect={() => {
                                    field.onChange(item.id);
                                    setOpenCursoSelector(false);
                                  }}
                                >
                                  {item.colorHex && (
                                    <span
                                      className="inline-block size-2.5 shrink-0 rounded-full"
                                      style={{ backgroundColor: item.colorHex }}
                                    />
                                  )}
                                  <span>{item.cursoNombre}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </React.Fragment>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              );
            }}
          />
          {errors.cursoSeccionId && (
            <p className="text-destructive text-xs font-medium">{errors.cursoSeccionId.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="horaInicio" className="text-sm font-medium">
            Hora de inicio *
          </Label>
          <Input
            id="horaInicio"
            type="text"
            placeholder="Ej. 07:45"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.horaInicio)}
            {...form.register("horaInicio")}
          />
          <p className="text-muted-foreground text-xs">Formato HH:mm</p>
          {errors.horaInicio && (
            <p className="text-destructive text-xs font-medium">{errors.horaInicio.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="horaFin" className="text-sm font-medium">
            Hora de fin *
          </Label>
          <Input
            id="horaFin"
            type="text"
            placeholder="Ej. 08:45 o 09:30"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.horaFin)}
            {...form.register("horaFin")}
          />
          <p className="text-muted-foreground text-[11px]">
            1 hora pedagógica = 45 min · Bloque doble = 90 min · 2 horas = 120 min
          </p>
          {errors.horaFin && (
            <p className="text-destructive text-xs font-medium">{errors.horaFin.message}</p>
          )}

          {tipoBloque === "clase" ? (
            <div className="flex flex-wrap items-center gap-1 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => aplicarDuracion(45)}
                disabled={!horaInicioVal || isSubmitting}
                className="h-6 rounded-md px-2 text-[10px] font-medium"
              >
                +45m (1 h)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => aplicarDuracion(90)}
                disabled={!horaInicioVal || isSubmitting}
                className="text-primary hover:bg-primary/10 h-6 rounded-md px-2 text-[10px] font-medium"
              >
                +90m (Doble)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => aplicarDuracion(120)}
                disabled={!horaInicioVal || isSubmitting}
                className="h-6 rounded-md px-2 text-[10px] font-medium"
              >
                +120m (2 h)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => aplicarDuracion(135)}
                disabled={!horaInicioVal || isSubmitting}
                className="h-6 rounded-md px-2 text-[10px] font-medium"
              >
                +135m (Triple)
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => aplicarDuracion(15)}
                disabled={!horaInicioVal || isSubmitting}
                className="h-6 rounded-md px-2 text-[10px] font-medium text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
              >
                +15m (Receso corto)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => aplicarDuracion(30)}
                disabled={!horaInicioVal || isSubmitting}
                className="h-6 rounded-md px-2 text-[10px] font-medium text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
              >
                +30m (Recreo principal)
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="aula" className="text-sm font-medium">
          Aula o ambiente (Opcional)
        </Label>
        <Input
          id="aula"
          placeholder="Ej. Pab. B – 201 o Lab. de Cómputo"
          disabled={isSubmitting}
          maxLength={50}
          aria-invalid={Boolean(errors.aula)}
          {...form.register("aula")}
        />
        {errors.aula && (
          <p className="text-destructive text-xs font-medium">{errors.aula.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 min-h-11 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shadow-primary/20 h-10 min-h-11 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isSubmitting ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>{bloque ? "Guardar cambios" : "Guardar bloque"}</span>
        </Button>
      </div>
    </form>
  );
}
