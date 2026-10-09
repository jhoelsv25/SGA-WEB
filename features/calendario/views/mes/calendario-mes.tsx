"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  PencilEdit01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ETIQUETAS_EVENTO } from "../../consts";
import type { EventoCalendario } from "../../types";
import { formatoFecha, isoDePartes, tituloMes } from "../../utils";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const DIAS_SEMANA_COMPLETOS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function fechaCompletaDeIso(iso: string): string {
  const [anioStr, mesStr, diaStr] = iso.split("-");
  const a = Number(anioStr);
  const m = Number(mesStr);
  const d = Number(diaStr);
  const fecha = new Date(a, m - 1, d);
  const diaSemana = DIAS_SEMANA_COMPLETOS[fecha.getDay()] ?? "";
  const mesNombre = MESES[m - 1] ?? "";
  return `${diaSemana} ${d} de ${mesNombre} de ${a}`;
}

interface CalendarioMesProps {
  anio: number;
  mes: number;
  anioEscolar: number;
  diasSinClases: string[];
  eventos: EventoCalendario[];
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  onSeleccionarDia?: (iso: string) => void;
  onEditar?: (evento: EventoCalendario) => void;
  onEliminar?: (evento: EventoCalendario) => void;
}

export function CalendarioMes({
  anio,
  mes,
  anioEscolar,
  diasSinClases,
  eventos,
  onMesAnterior,
  onMesSiguiente,
  onSeleccionarDia,
  onEditar,
  onEliminar,
}: CalendarioMesProps) {
  const sinClases = new Set(diasSinClases);
  const primero = new Date(anio, mes - 1, 1);
  const offset = (primero.getDay() + 6) % 7;
  const cantidad = new Date(anio, mes, 0).getDate();
  const celdas = [...Array<number | null>(offset).fill(null)];
  for (let dia = 1; dia <= cantidad; dia += 1) celdas.push(dia);

  const hoy = new Date();
  const anioHoy = hoy.getFullYear();
  const mesHoy = hoy.getMonth() + 1;
  const diaHoy = hoy.getDate();

  const [diaSeleccionado, setDiaSeleccionado] = React.useState<string>(() => {
    if (anio === anioHoy && mes === mesHoy) {
      return isoDePartes(anioHoy, mesHoy, diaHoy);
    }
    return isoDePartes(anio, mes, 1);
  });

  const diaSeleccionadoEfectivo = React.useMemo(() => {
    const prefijoMes = `${anio}-${String(mes).padStart(2, "0")}`;
    if (diaSeleccionado.startsWith(prefijoMes)) {
      return diaSeleccionado;
    }
    if (anio === anioHoy && mes === mesHoy) {
      return isoDePartes(anioHoy, mesHoy, diaHoy);
    }
    return isoDePartes(anio, mes, 1);
  }, [anio, mes, anioHoy, mesHoy, diaHoy, diaSeleccionado]);

  const handleDiaClick = (iso: string) => {
    setDiaSeleccionado(iso);
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      onSeleccionarDia?.(iso);
    }
  };

  const eventosDiaSeleccionado = React.useMemo(() => {
    return eventos.filter(
      (evento) =>
        evento.fechaInicio <= diaSeleccionadoEfectivo && evento.fechaFin >= diaSeleccionadoEfectivo,
    );
  }, [eventos, diaSeleccionadoEfectivo]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{tituloMes(anio, mes)}</CardTitle>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Mes anterior"
            onClick={onMesAnterior}
            className="size-11 sm:size-9"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Mes siguiente"
            onClick={onMesSiguiente}
            className="size-11 sm:size-9"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3 text-xs">Año académico {anioEscolar}</p>
        <div className="grid grid-cols-7 gap-1">
          {DIAS.map((dia) => (
            <div
              key={dia}
              className="text-muted-foreground px-1 py-2 text-center text-xs font-medium"
            >
              {dia}
            </div>
          ))}
          {celdas.map((dia, indice) => {
            if (dia === null)
              return <div key={`vacio-${indice}`} className="min-h-12 md:min-h-16" />;
            const iso = isoDePartes(anio, mes, dia);
            const marcado = sinClases.has(iso);
            const delDia = eventos.filter(
              (evento) => evento.fechaInicio <= iso && evento.fechaFin >= iso,
            );
            const esHoy = anio === anioHoy && mes === mesHoy && dia === diaHoy;
            const esSeleccionado = iso === diaSeleccionadoEfectivo;

            const fechaDia = new Date(anio, mes - 1, dia);
            const diaSemanaTexto = DIAS_SEMANA_COMPLETOS[fechaDia.getDay()];
            const mesTexto = MESES[mes - 1];
            const partesAria = [`${diaSemanaTexto} ${dia} de ${mesTexto} de ${anio}`];
            if (marcado) {
              partesAria.push("sin clases");
            }
            if (delDia.length === 1) {
              partesAria.push("1 evento");
            } else if (delDia.length > 1) {
              partesAria.push(`${delDia.length} eventos`);
            }
            if (esSeleccionado) {
              partesAria.push("seleccionado");
            }
            const ariaLabel = partesAria.join(", ");

            return (
              <button
                key={iso}
                type="button"
                onClick={() => handleDiaClick(iso)}
                aria-label={ariaLabel}
                aria-current={esHoy ? "date" : undefined}
                aria-pressed={esSeleccionado}
                className={cn(
                  "focus-visible:ring-primary flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg border p-1 text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-1 md:min-h-16 md:items-start md:justify-start md:p-1.5 md:text-left",
                  esSeleccionado
                    ? "border-primary bg-primary/10 ring-primary ring-2 ring-offset-1"
                    : marcado
                      ? "border-warning/40 bg-warning/10 hover:bg-warning/20"
                      : "border-border bg-card hover:bg-muted/60",
                  esHoy && !esSeleccionado && "ring-primary/60 font-bold ring-2 ring-offset-1",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-semibold",
                    esHoy
                      ? "text-primary font-bold"
                      : marcado
                        ? "text-warning-text"
                        : "text-foreground",
                  )}
                >
                  {dia}
                </span>

                {/* Vista móvil (< md): solo puntos indicadores de eventos/sin clases */}
                <div className="flex items-center justify-center gap-1 md:hidden">
                  {delDia.slice(0, 3).map((evento) => (
                    <span
                      key={evento.id}
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        evento.suspendeClases ? "bg-warning" : "bg-primary",
                      )}
                      aria-hidden="true"
                    />
                  ))}
                  {marcado && !delDia.some((e) => e.suspendeClases) ? (
                    <span
                      className="bg-warning size-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>

                {/* Vista desktop (>= md): vista completa con títulos */}
                <div className="hidden w-full flex-col gap-1 md:flex">
                  {marcado ? (
                    <span className="text-warning-text text-xs leading-tight font-medium">
                      Sin clases
                    </span>
                  ) : null}
                  {delDia.slice(0, 2).map((evento) => (
                    <span
                      key={evento.id}
                      className="bg-primary/15 text-foreground truncate rounded px-1 text-xs"
                    >
                      {evento.titulo}
                    </span>
                  ))}
                  {delDia.length > 2 ? (
                    <span className="text-muted-foreground text-xs leading-tight font-medium">
                      +{delDia.length - 2}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Vista móvil (< md): lista de eventos del día seleccionado con fecha completa */}
        <div className="border-border/60 mt-4 flex flex-col gap-3 border-t pt-4 md:hidden">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-muted-foreground text-xs font-medium">Día seleccionado</p>
              <h3 className="text-foreground text-sm font-bold">
                {fechaCompletaDeIso(diaSeleccionadoEfectivo)}
              </h3>
            </div>
            {sinClases.has(diaSeleccionadoEfectivo) ? (
              <StatusBadge tone="warning" className="shrink-0">
                Sin clases
              </StatusBadge>
            ) : null}
          </div>

          {eventosDiaSeleccionado.length === 0 ? (
            <div className="border-border/60 bg-muted/30 rounded-lg border border-dashed p-4 text-center">
              <p className="text-muted-foreground text-xs">
                No hay eventos programados para este día.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {eventosDiaSeleccionado.map((evento) => (
                <div
                  key={evento.id}
                  className="bg-card border-border/60 flex flex-col gap-2 rounded-lg border p-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-xs font-semibold">{evento.titulo}</p>
                      {evento.descripcion ? (
                        <p className="text-muted-foreground mt-0.5 text-xs">{evento.descripcion}</p>
                      ) : null}
                      <p className="text-muted-foreground mt-1 text-xs">
                        {formatoFecha(evento.fechaInicio)}
                        {evento.fechaFin !== evento.fechaInicio
                          ? ` – ${formatoFecha(evento.fechaFin)}`
                          : ""}
                      </p>
                    </div>
                    <StatusBadge
                      tone={evento.suspendeClases ? "warning" : "neutral"}
                      className="shrink-0"
                    >
                      {evento.suspendeClases ? "Sin clases" : ETIQUETAS_EVENTO[evento.tipo]}
                    </StatusBadge>
                  </div>
                  {onEditar || onEliminar ? (
                    <div className="flex gap-2 pt-1">
                      {onEditar ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 gap-1.5 text-xs pointer-coarse:h-11"
                          onClick={() => onEditar(evento)}
                        >
                          <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
                          Editar
                        </Button>
                      ) : null}
                      {onEliminar ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 gap-1.5 text-xs pointer-coarse:h-11"
                          onClick={() => onEliminar(evento)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                          Eliminar
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {onSeleccionarDia ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSeleccionarDia(diaSeleccionadoEfectivo)}
              className="h-11 w-full gap-2 text-xs font-semibold"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Registrar evento en esta fecha
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
