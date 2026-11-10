"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { Analytics01Icon } from "@hugeicons/core-free-icons";
import { COLUMNAS_APOYO } from "../../consts";
import type { FilaRankingApoyoDto, IndicadorApoyo } from "../../types";
import { valorCortoApoyo } from "../../utils";

interface RankingApoyoTablaProps {
  filas: FilaRankingApoyoDto[];
  etiquetaSinDatos: string;
  ordenarPor: IndicadorApoyo;
  orden: "asc" | "desc";
  onOrdenar: (columna: IndicadorApoyo) => void;
}

/**
 * Ranking de docentes con los indicadores de apoyo (RF-020 V2). Solo Director y Subdirector.
 * El orden lo calcula la API: los docentes con «Sin datos» quedan al final.
 */
export function RankingApoyoTabla({
  filas,
  etiquetaSinDatos,
  ordenarPor,
  orden,
  onOrdenar,
}: RankingApoyoTablaProps) {
  if (filas.length === 0) {
    return (
      <EmptyState
        icon={Analytics01Icon}
        title="Sin docentes para mostrar"
        description="No hay sesiones de docentes para el período y los filtros elegidos."
      />
    );
  }

  return (
    <div className="border-border/60 bg-card overflow-hidden rounded-2xl border shadow-xs">
      <div className="border-border/60 border-b p-4 sm:p-5">
        <h3 className="text-foreground text-base font-semibold">Ranking de docentes</h3>
        <p className="text-muted-foreground text-xs">
          Haga clic en una columna para ordenar. El ranking es informativo.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" aria-label="Ranking de indicadores de apoyo">
          <thead className="bg-muted/40 text-muted-foreground border-border/60 border-b text-xs font-semibold tracking-wider uppercase">
            <tr>
              <th scope="col" className="px-4 py-3">
                Docente
              </th>
              {COLUMNAS_APOYO.map((col) => {
                const activa = col.clave === ordenarPor;
                return (
                  <th
                    key={col.clave}
                    scope="col"
                    className="px-4 py-3"
                    aria-sort={activa ? (orden === "asc" ? "ascending" : "descending") : "none"}
                  >
                    <button
                      type="button"
                      onClick={() => onOrdenar(col.clave)}
                      className="hover:text-foreground inline-flex items-center gap-1 uppercase"
                    >
                      {col.titulo}
                      {activa && (
                        <HugeiconsIcon
                          icon={orden === "asc" ? ArrowUp01Icon : ArrowDown01Icon}
                          size={13}
                        />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-border/60 divide-y">
            {filas.map((fila) => (
              <tr key={fila.docenteId} className="hover:bg-muted/30">
                <td className="text-foreground px-4 py-3 font-medium">{fila.docenteNombre}</td>
                {COLUMNAS_APOYO.map((col) => {
                  const valor = valorCortoApoyo(fila.resumen, col.clave);
                  return (
                    <td
                      key={col.clave}
                      className={
                        valor === null
                          ? "text-muted-foreground px-4 py-3"
                          : "px-4 py-3 tabular-nums"
                      }
                    >
                      {valor ?? etiquetaSinDatos}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
