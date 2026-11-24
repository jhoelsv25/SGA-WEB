"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { cn } from "@/lib/utils";
import { calcularFranjasHorarias, minutosDeHora } from "@/features/mi-horario/utils";
import type { BloqueHorarioVista } from "@/features/mi-horario/types";
import { ESTADOS_PLANIFICACION, MENU_PLANIFICACION_SESIONES } from "../consts";
import type { BloqueSemana } from "../types";
import { DIAS, desplazarDias, hoyIso, recortarHora } from "../utils";

interface Props {
  desde: string;
  bloques: BloqueSemana[];
}

const BORDE_ESTADO = {
  sin_planificar: "border-dashed border-border bg-muted/30",
  borrador: "border-warning/50 bg-warning/10",
  lista: "border-success/50 bg-success/10",
  ejecutada: "border-info/50 bg-info/10",
} as const;

function hrefDe(b: BloqueSemana): string {
  return b.planificacionId
    ? `${MENU_PLANIFICACION_SESIONES}/editor?id=${b.planificacionId}`
    : `${MENU_PLANIFICACION_SESIONES}/editor?horarioId=${b.bloque.horarioId}&fecha=${b.fecha}`;
}

/** Mi horario de la semana, con el estado de la sesión planificada en cada bloque. */
export function GrillaSemana({ desde, bloques }: Props) {
  const hoy = hoyIso();
  const dias = [1, 2, 3, 4, 5].map((n) => ({ numero: n, fecha: desplazarDias(desde, n - 1) }));

  const porClave = React.useMemo(() => {
    const mapa = new Map<string, BloqueSemana>();
    for (const b of bloques)
      mapa.set(`${b.bloque.diaSemana}-${recortarHora(b.bloque.horaInicio)}`, b);
    return mapa;
  }, [bloques]);

  const franjas = React.useMemo(() => {
    const vista: BloqueHorarioVista[] = bloques.map((b) => ({
      id: b.bloque.horarioId,
      diaSemana: b.bloque.diaSemana,
      horaInicio: recortarHora(b.bloque.horaInicio),
      horaFin: recortarHora(b.bloque.horaFin),
      tipoBloque: "clase",
      cursoNombre: b.bloque.cursoNombre,
      duracionMinutos: 0,
      esBloqueDoble: false,
    }));
    return calcularFranjasHorarias(vista);
  }, [bloques]);

  return (
    <div className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-border/60 bg-muted/40 border-b">
              <th
                scope="col"
                className="text-muted-foreground w-24 px-3 py-3 text-xs font-semibold tracking-wider uppercase"
              >
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Clock01Icon} className="size-3.5" aria-hidden="true" />
                  Hora
                </span>
              </th>
              {dias.map((d) => (
                <th
                  key={d.numero}
                  scope="col"
                  className={cn(
                    "px-3 py-3 text-center text-xs font-bold tracking-wider uppercase",
                    d.fecha === hoy && "bg-primary/10 text-primary",
                  )}
                >
                  {DIAS[d.numero]}
                  <span className="text-muted-foreground block text-[11px] font-normal normal-case">
                    {d.fecha.slice(8, 10)}/{d.fecha.slice(5, 7)}
                    {d.fecha === hoy ? " · hoy" : ""}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border/40 divide-y">
            {franjas.map((franja, idx) => {
              const inicioMin = minutosDeHora(franja.horaInicio);
              return (
                <tr key={franja.etiqueta}>
                  <td className="text-muted-foreground border-border/40 bg-muted/20 border-r px-2 py-2 text-center font-mono text-xs">
                    <span className="block">{franja.horaInicio}</span>
                    <span className="block text-[10px] opacity-60">a</span>
                    <span className="block">{franja.horaFin}</span>
                  </td>
                  {dias.map((d) => {
                    const b = porClave.get(`${d.numero}-${franja.horaInicio}`);
                    if (b) {
                      const fin = recortarHora(b.bloque.horaFin);
                      const idxFin = franjas.findIndex((f) => f.horaFin === fin);
                      const span = idxFin >= idx ? idxFin - idx + 1 : 1;
                      const e = ESTADOS_PLANIFICACION[b.estado];
                      return (
                        <td
                          key={d.numero}
                          rowSpan={span}
                          className="border-border/40 border-r p-1.5 align-top"
                        >
                          <Link
                            href={hrefDe(b)}
                            aria-label={`${b.bloque.cursoNombre} ${b.bloque.gradoNombre} ${b.bloque.seccionNombre}, ${e.etiqueta}. ${b.planificacionId ? "Abrir" : "Planificar"}`}
                            className={cn(
                              "focus-visible:ring-ring flex h-full min-h-[84px] flex-col justify-between gap-2 rounded-xl border p-3 transition-transform hover:scale-[1.01] focus-visible:ring-2",
                              BORDE_ESTADO[b.estado],
                            )}
                          >
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold">{b.bloque.cursoNombre}</p>
                              <p className="text-muted-foreground text-xs font-medium">
                                {b.bloque.gradoNombre.replace(" de secundaria", "")}{" "}
                                {b.bloque.seccionNombre}
                              </p>
                              {b.titulo && <p className="line-clamp-2 text-xs">{b.titulo}</p>}
                            </div>
                            <StatusBadge tone={e.tono} size="sm">
                              {b.planificacionId ? e.etiqueta : "Planificar"}
                            </StatusBadge>
                          </Link>
                        </td>
                      );
                    }
                    const cubierto = bloques.some(
                      (x) =>
                        x.bloque.diaSemana === d.numero &&
                        minutosDeHora(recortarHora(x.bloque.horaInicio)) < inicioMin &&
                        minutosDeHora(recortarHora(x.bloque.horaFin)) > inicioMin,
                    );
                    if (cubierto) return null;
                    return (
                      <td key={d.numero} className="border-border/40 border-r p-1.5">
                        <div
                          className="border-border/30 bg-muted/5 min-h-[56px] rounded-lg border border-dashed"
                          aria-hidden="true"
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
