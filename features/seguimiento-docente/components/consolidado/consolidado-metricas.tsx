"use client";

import * as React from "react";
import { AlertCircleIcon, Clock01Icon, Time02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearTiempoMinutos } from "../../utils";

export interface ConsolidadoMetricasProps {
  totalDocentes: number;
  totalMinutosPerdidosFirma: number;
  totalMinutosFueraAula: number;
  tiempoTotalFueraClaseTexto: string;
  isLoading?: boolean;
}

/**
 * Tarjetas de métricas agregadas del consolidado para el bimestre seleccionado (RF-013 HU4).
 */
export function ConsolidadoMetricas({
  totalDocentes,
  totalMinutosPerdidosFirma,
  totalMinutosFueraAula,
  tiempoTotalFueraClaseTexto,
  isLoading = false,
}: ConsolidadoMetricasProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`loading-metrica-${index}`}
            className="border-border/60 bg-card/60 flex items-center gap-3.5 rounded-2xl border p-4 shadow-2xs"
          >
            <Skeleton className="size-11 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const metricas = [
    {
      titulo: "Docentes evaluados",
      valor: totalDocentes.toString(),
      descripcion: "Con consolidado en el bimestre",
      icono: UserIcon,
      colorIcono: "bg-primary/10 text-primary border-primary/20",
    },
    {
      titulo: "Tiempo fuera de clase",
      valor: tiempoTotalFueraClaseTexto || "0 h 0 min",
      descripcion: "Suma total de firmas y ausencias",
      icono: Time02Icon,
      colorIcono: "bg-primary/10 text-primary border-primary/20 font-bold",
      destacado: true,
    },
    {
      titulo: "Retrasos de firma",
      valor: formatearTiempoMinutos(totalMinutosPerdidosFirma),
      descripcion: "Ingreso tardío y salida antes",
      icono: Clock01Icon,
      colorIcono: "bg-warning/10 text-warning-text border-warning/20",
    },
    {
      titulo: "Ausencias del aula",
      valor: formatearTiempoMinutos(totalMinutosFueraAula),
      descripcion: "Ausencias vigentes no anuladas",
      icono: AlertCircleIcon,
      colorIcono: "bg-destructive/10 text-destructive border-destructive/20",
    },
  ];

  return (
    <section
      aria-label="Métricas consolidadas del bimestre"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metricas.map((m) => (
        <div
          key={m.titulo}
          className="border-border/70 bg-card hover:border-primary/40 relative flex items-center gap-3.5 overflow-hidden rounded-2xl border p-4 shadow-2xs transition-all"
        >
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-2xs ${m.colorIcono}`}
          >
            <HugeiconsIcon icon={m.icono} size={22} strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate text-xs font-medium">{m.titulo}</p>
            <p
              className={`text-foreground font-heading truncate text-xl font-bold tracking-tight ${
                m.destacado ? "text-primary" : ""
              }`}
            >
              {m.valor}
            </p>
            <p className="text-muted-foreground/80 text-2xs truncate">{m.descripcion}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
