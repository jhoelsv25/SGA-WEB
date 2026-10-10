"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { DIAS_SEMANA_LABORALES } from "../consts";
import type { BloqueHorarioVista, FranjaHoraria } from "../types";
import { minutosDeHora } from "../utils";
import { BloqueCard } from "./bloque-card";

interface MiHorarioGridProps {
  bloques: readonly BloqueHorarioVista[];
  franjas: readonly FranjaHoraria[];
}

export function MiHorarioGrid({ bloques, franjas }: MiHorarioGridProps) {
  // Mapa de bloques por día
  const mapaPorDia = React.useMemo(() => {
    const mapa = new Map<number, BloqueHorarioVista[]>();
    for (const dia of DIAS_SEMANA_LABORALES) {
      mapa.set(dia.numero, []);
    }
    for (const b of bloques) {
      const lista = mapa.get(b.diaSemana);
      if (lista) lista.push(b);
    }
    return mapa;
  }, [bloques]);

  return (
    <div className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-border/60 bg-muted/40 border-b">
              <th
                scope="col"
                className="text-muted-foreground w-28 px-4 py-3 text-xs font-semibold tracking-wider uppercase"
              >
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Clock01Icon} className="size-3.5" aria-hidden="true" />
                  <span>Hora</span>
                </div>
              </th>
              {DIAS_SEMANA_LABORALES.map((dia) => (
                <th
                  key={dia.numero}
                  scope="col"
                  className="text-foreground px-3 py-3 text-center text-xs font-bold tracking-wider uppercase"
                >
                  <span className="hidden sm:inline">{dia.nombreCompleto}</span>
                  <span className="sm:hidden">{dia.nombreCorto}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border/40 divide-y">
            {franjas.map((franja, idxFranja) => {
              const inicioMin = minutosDeHora(franja.horaInicio);

              return (
                <tr key={franja.etiqueta} className="hover:bg-muted/15 transition-colors">
                  {/* Columna de hora */}
                  <td className="text-muted-foreground border-border/40 bg-muted/20 border-r px-3 py-2.5 text-center align-middle font-mono text-xs font-medium">
                    <span className="block whitespace-nowrap">{franja.horaInicio}</span>
                    <span className="text-muted-foreground/60 block text-[10px]">a</span>
                    <span className="block whitespace-nowrap">{franja.horaFin}</span>
                  </td>

                  {/* Columnas para cada día escolar */}
                  {DIAS_SEMANA_LABORALES.map((dia) => {
                    const diaBloques = mapaPorDia.get(dia.numero) ?? [];

                    // Bloque que inicia exactamente en esta franja
                    const bloqueInicia = diaBloques.find((b) => b.horaInicio === franja.horaInicio);

                    if (bloqueInicia) {
                      // Calcular cuántas franjas consecutivas abarca
                      const idxFin = franjas.findIndex((f) => f.horaFin === bloqueInicia.horaFin);
                      const span = idxFin >= idxFranja ? idxFin - idxFranja + 1 : 1;

                      return (
                        <td
                          key={dia.numero}
                          rowSpan={span}
                          className="border-border/40 border-r p-1.5 align-top last:border-r-0"
                        >
                          <BloqueCard bloque={bloqueInicia} className="h-full min-h-[72px]" />
                        </td>
                      );
                    }

                    // Verificar si esta celda ya está cubierta por un bloque previo con rowSpan
                    const estaCubierto = diaBloques.some((b) => {
                      const bInicio = minutosDeHora(b.horaInicio);
                      const bFin = minutosDeHora(b.horaFin);
                      return bInicio < inicioMin && bFin > inicioMin;
                    });

                    if (estaCubierto) {
                      return null;
                    }

                    // Celda vacía (sin clase programada en esta franja)
                    return (
                      <td
                        key={dia.numero}
                        className="border-border/40 border-r p-1.5 align-middle last:border-r-0"
                      >
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
