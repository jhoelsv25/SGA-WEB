"use client";

import { cn } from "@/lib/utils";
import { COLOR_EVENTO, TEXTO_EVENTO } from "../../consts/colores";
import type { EventoCalendario } from "../../types";
import { diasDeLaCuadricula, fechaDeIso, fechaLarga, isoDeFecha } from "../../utils";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** «1 feb» en el primer día de cada mes; en el resto, solo el número. */
function numeroDeDia(fecha: Date): string {
  if (fecha.getDate() !== 1) return String(fecha.getDate());
  return `1 ${fecha.toLocaleDateString("es-PE", { month: "short" }).replace(".", "")}`;
}

interface CalendarioMesProps {
  anio: number;
  mes: number;
  diasSinClases: string[];
  eventos: EventoCalendario[];
  onAbrirDia: (iso: string) => void;
  onAbrirEvento: (evento: EventoCalendario) => void;
}

export function CalendarioMes({
  anio,
  mes,
  diasSinClases,
  eventos,
  onAbrirDia,
  onAbrirEvento,
}: CalendarioMesProps) {
  const sinClases = new Set(diasSinClases);
  const hoy = isoDeFecha(new Date());
  const fechas = diasDeLaCuadricula(anio, mes);
  const semanas = fechas.length / 7;
  // Con seis semanas las filas son más bajas y entra un evento menos.
  const maximo = semanas > 5 ? 1 : 2;

  return (
    <div className="border-border bg-border flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border">
      {/* Las líneas de la cuadrícula son el fondo que se ve entre celdas */}
      <div
        className="grid min-h-0 flex-1 grid-cols-7 gap-px"
        style={{ gridTemplateRows: `repeat(${semanas}, minmax(0, 1fr))` }}
      >
        {fechas.map((fecha, indice) => {
          const iso = isoDeFecha(fecha);
          const delMes = fecha.getMonth() === mes - 1;
          // El nombre del día va dentro de la primera semana
          const nombreDia = indice < 7 && (
            <span className="text-muted-foreground text-[11px] font-medium uppercase">
              {DIAS[indice]}
            </span>
          );

          if (!delMes) {
            // Fechas del mes anterior y del siguiente: atenuadas y sin acciones.
            return (
              <div key={iso} className="bg-card flex min-w-0 flex-col items-center p-1">
                {nombreDia}
                <span className="text-muted-foreground flex h-6 items-center text-xs tabular-nums">
                  {numeroDeDia(fecha)}
                </span>
              </div>
            );
          }

          const delDia = eventos.filter((e) => e.fechaInicio <= iso && e.fechaFin >= iso);
          const esHoy = iso === hoy;
          const marcado = sinClases.has(iso);

          return (
            <div key={iso} className="bg-card relative min-h-14 min-w-0 overflow-hidden md:min-h-0">
              {marcado && <span aria-hidden="true" className="bg-warning/10 absolute inset-0" />}

              {/* Toda la celda abre el día; los eventos quedan por encima */}
              <button
                type="button"
                onClick={() => onAbrirDia(iso)}
                aria-current={esHoy ? "date" : undefined}
                aria-label={`${fechaLarga(iso)}${marcado ? ", sin clases" : ""}, ${delDia.length} ${delDia.length === 1 ? "evento" : "eventos"}`}
                className="hover:bg-foreground/4 focus-visible:ring-primary absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-inset"
              />

              <div className="pointer-events-none relative flex h-full flex-col items-center gap-0.5 p-1">
                {nombreDia}
                <span
                  title={marcado ? "Sin clases" : undefined}
                  className={cn(
                    "flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold tabular-nums",
                    esHoy ? "bg-primary text-primary-foreground" : "text-foreground",
                  )}
                >
                  {numeroDeDia(fechaDeIso(iso) ?? fecha)}
                </span>

                {/* Celular: puntos. Computadora: barras con título */}
                <div className="flex justify-center gap-1 md:hidden" aria-hidden="true">
                  {delDia.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={cn("size-1.5 rounded-full", COLOR_EVENTO[e.tipo])}
                    />
                  ))}
                </div>

                <div className="hidden w-full flex-col gap-0.5 md:flex">
                  {delDia.slice(0, maximo).map((evento) => (
                    <button
                      key={evento.id}
                      type="button"
                      onClick={() => onAbrirEvento(evento)}
                      title={evento.titulo}
                      className={cn(
                        "focus-visible:ring-foreground pointer-events-auto shrink-0 truncate rounded px-1.5 py-0.5 text-left text-xs font-medium outline-none hover:brightness-110 focus-visible:ring-2 pointer-coarse:py-1.5",
                        COLOR_EVENTO[evento.tipo],
                        TEXTO_EVENTO[evento.tipo],
                      )}
                    >
                      {evento.titulo}
                    </button>
                  ))}
                  {delDia.length > maximo && (
                    <span className="text-muted-foreground px-1.5 text-[11px] font-medium">
                      +{delDia.length - maximo} más
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
