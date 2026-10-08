"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EventoCalendario } from "../../types";
import { isoDePartes, tituloMes } from "../../utils";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface CalendarioMesProps {
  anio: number;
  mes: number;
  anioEscolar: number;
  diasSinClases: string[];
  eventos: EventoCalendario[];
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  onSeleccionarDia?: (iso: string) => void;
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
}: CalendarioMesProps) {
  const sinClases = new Set(diasSinClases);
  const primero = new Date(anio, mes - 1, 1);
  const offset = (primero.getDay() + 6) % 7;
  const cantidad = new Date(anio, mes, 0).getDate();
  const celdas = [...Array<number | null>(offset).fill(null)];
  for (let dia = 1; dia <= cantidad; dia += 1) celdas.push(dia);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{tituloMes(anio, mes)}</CardTitle>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" aria-label="Mes anterior" onClick={onMesAnterior}>
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Mes siguiente" onClick={onMesSiguiente}>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3 text-xs">Año escolar {anioEscolar}</p>
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
            if (dia === null) return <div key={`vacio-${indice}`} className="min-h-16" />;
            const iso = isoDePartes(anio, mes, dia);
            const marcado = sinClases.has(iso);
            const delDia = eventos.filter(
              (evento) => evento.fechaInicio <= iso && evento.fechaFin >= iso,
            );
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSeleccionarDia?.(iso)}
                className={cn(
                  "flex min-h-16 flex-col gap-1 rounded-lg border p-1.5 text-left transition-colors",
                  marcado
                    ? "border-destructive/40 bg-destructive/10"
                    : "border-border bg-card hover:bg-muted/60",
                )}
              >
                <span className={cn("text-xs font-semibold", marcado && "text-destructive")}>
                  {dia}
                </span>
                {marcado ? (
                  <span className="text-destructive text-[10px] leading-tight">Sin clases</span>
                ) : null}
                {delDia.slice(0, 2).map((evento) => (
                  <span
                    key={evento.id}
                    className="bg-primary/15 text-foreground truncate rounded px-1 text-[10px]"
                  >
                    {evento.titulo}
                  </span>
                ))}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
