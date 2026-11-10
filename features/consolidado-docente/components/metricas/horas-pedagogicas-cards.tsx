"use client";

import { formatDateTime } from "@/lib/formatters/date";
import type { ConsolidadoResumenItem } from "../../types";
import { formatearHoras, formatearMinutos, SIN_DATO_HORAS } from "../../utils";

export interface HorasPedagogicasCardsProps {
  consolidado: ConsolidadoResumenItem;
  /** Tarjetas grandes de «Mi seguimiento» o compactas del detalle del Director. */
  variante?: "detalle" | "docente";
}

/** Horas pedagógicas del bimestre y fecha de la decisión (RF-013 V2, HU1). */
export function HorasPedagogicasCards({
  consolidado,
  variante = "detalle",
}: HorasPedagogicasCardsProps) {
  const sinHoras = consolidado.horasProgramadas === null;
  const minutosHora = consolidado.minutosHoraPedagogica;

  const tarjetas = [
    {
      etiqueta: "Horas programadas",
      valor: formatearHoras(consolidado.horasProgramadas),
      detalle: formatearMinutos(consolidado.minutosProgramados),
    },
    {
      etiqueta: "Horas dictadas",
      valor: formatearHoras(consolidado.horasDictadas),
      detalle: formatearMinutos(consolidado.minutosDictados),
    },
    {
      etiqueta: "Horas perdidas",
      valor: formatearHoras(consolidado.horasPerdidas),
      detalle: formatearMinutos(consolidado.minutosNoDictados),
    },
    {
      etiqueta: "Decisión registrada",
      valor: consolidado.decisionRegistradaEn
        ? formatDateTime(consolidado.decisionRegistradaEn)
        : SIN_DATO_HORAS,
      detalle: consolidado.decisionRegistradaEn ? "Fecha y hora" : "Aún sin decisión",
    },
  ];

  const esDocente = variante === "docente";

  return (
    <div className="space-y-2">
      <div
        className={
          esDocente
            ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            : "grid grid-cols-2 gap-3 text-xs sm:grid-cols-4"
        }
      >
        {tarjetas.map((t) => (
          <div
            key={t.etiqueta}
            className={
              esDocente
                ? "border-border/60 bg-card rounded-2xl border p-4 shadow-xs"
                : "border-border/60 bg-muted/20 rounded-xl border p-3"
            }
          >
            <span className="text-muted-foreground block text-xs font-medium">{t.etiqueta}</span>
            <span
              className={
                esDocente
                  ? "text-foreground mt-2 block font-mono text-2xl font-bold"
                  : "text-foreground block font-mono text-base font-bold"
              }
            >
              {t.valor}
            </span>
            <span className="text-muted-foreground block text-[11px]">{t.detalle}</span>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-[11px]">
        {sinHoras
          ? "Este consolidado es anterior a las horas pedagógicas y no trae ese dato."
          : `Una hora pedagógica equivale a ${minutosHora ?? "—"} minutos, valor vigente cuando se generó este consolidado.`}
      </p>
    </div>
  );
}
