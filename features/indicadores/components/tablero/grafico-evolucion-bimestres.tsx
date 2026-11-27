"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EvolucionBimestreItemDto } from "@/features/indicadores";

interface GraficoEvolucionBimestresProps {
  evolucion: EvolucionBimestreItemDto[];
  className?: string;
}

/**
 * Visualización de la evolución temporal de los 3 indicadores a través de los bimestres del año lectivo.
 * Incluye gráfico vectorial SVG propio y tarjetas de resumen bimestral.
 */
export function GraficoEvolucionBimestres({
  evolucion,
  className,
}: GraficoEvolucionBimestresProps) {
  // Ordenar bimestres por número (I, II, III, IV)
  const bimestresOrdenados = React.useMemo(() => {
    return [...evolucion].sort((a, b) => a.numero - b.numero);
  }, [evolucion]);

  // Dimensiones SVG
  const anchoTotal = 720;
  const altoTotal = 320;
  const margen = { arriba: 40, derecha: 40, abajo: 50, izquierda: 55 };

  const anchoGrafico = anchoTotal - margen.izquierda - margen.derecha;
  const altoGrafico = altoTotal - margen.arriba - margen.abajo;

  const calcularY = (porcentaje: number) => {
    const seguro = Math.min(Math.max(porcentaje, 0), 100);
    return margen.arriba + (100 - seguro) * (altoGrafico / 100);
  };

  const marcasY = [0, 25, 50, 75, 100];
  const totalPuntos = bimestresOrdenados.length;

  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-foreground text-base font-semibold">
              Evolución de Indicadores por Bimestre
            </CardTitle>
            <CardDescription className="text-xs">
              Seguimiento longitudinal del CSP, ISA e IGM durante el año académico de la tesis
            </CardDescription>
          </div>

          {/* Leyenda de la serie */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
              <span className="size-2.5 rounded-full bg-sky-500" />
              CSP (Sesiones)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              ISA (Libretas)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <span className="size-2.5 rounded-full bg-amber-500" />
              IGM (Materiales)
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Gráfico SVG de Líneas de Tendencia */}
        <div className="border-border/50 bg-card w-full overflow-hidden rounded-xl border p-2 shadow-xs sm:p-4">
          <svg
            viewBox={`0 0 ${anchoTotal} ${altoTotal}`}
            preserveAspectRatio="xMidYMid meet"
            className="h-auto max-h-[340px] w-full overflow-visible select-none"
            role="img"
            aria-label="Gráfico de evolución de CSP, ISA e IGM a lo largo de los bimestres"
          >
            <title>Evolución de los indicadores por bimestre</title>

            {/* Marcas horizontales del eje Y */}
            {marcasY.map((marca) => {
              const y = calcularY(marca);
              return (
                <g key={marca}>
                  <line
                    x1={margen.izquierda}
                    y1={y}
                    x2={margen.izquierda + anchoGrafico}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray={marca === 0 ? "none" : "3 3"}
                    strokeWidth={1}
                    className="text-border/60"
                  />
                  <text
                    x={margen.izquierda - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-muted-foreground font-mono text-[10px]"
                  >
                    {marca}%
                  </text>
                </g>
              );
            })}

            {/* Eje X y Líneas Verticales para cada Bimestre */}
            {bimestresOrdenados.map((b, i) => {
              const x =
                totalPuntos > 1
                  ? margen.izquierda + (anchoGrafico / (totalPuntos - 1)) * i
                  : margen.izquierda + anchoGrafico / 2;

              return (
                <g key={b.periodoId}>
                  <line
                    x1={x}
                    y1={margen.arriba}
                    x2={x}
                    y2={margen.arriba + altoGrafico}
                    stroke="currentColor"
                    strokeDasharray="2 2"
                    strokeWidth={1}
                    className="text-border/30"
                  />
                  <text
                    x={x}
                    y={altoTotal - margen.abajo + 22}
                    textAnchor="middle"
                    className="fill-foreground text-xs font-semibold"
                  >
                    {b.periodoNombre}
                  </text>
                </g>
              );
            })}

            {/* Trazo y Puntos para CSP (Azul / Sky) */}
            {totalPuntos > 1 && (
              <path
                d={bimestresOrdenados
                  .filter((b) => b.csp !== null)
                  .map((b, idx) => {
                    const originalIdx = bimestresOrdenados.findIndex(
                      (orig) => orig.periodoId === b.periodoId,
                    );
                    const x = margen.izquierda + (anchoGrafico / (totalPuntos - 1)) * originalIdx;
                    const y = calcularY(b.csp ?? 0);
                    return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#0284c7"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Trazo y Puntos para ISA (Verde / Emerald) */}
            {totalPuntos > 1 && (
              <path
                d={bimestresOrdenados
                  .filter((b) => b.isa !== null)
                  .map((b, idx) => {
                    const originalIdx = bimestresOrdenados.findIndex(
                      (orig) => orig.periodoId === b.periodoId,
                    );
                    const x = margen.izquierda + (anchoGrafico / (totalPuntos - 1)) * originalIdx;
                    const y = calcularY(b.isa ?? 0);
                    return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#10b981"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Trazo y Puntos para IGM (Ámbar) */}
            {totalPuntos > 1 && (
              <path
                d={bimestresOrdenados
                  .filter((b) => b.igm !== null)
                  .map((b, idx) => {
                    const originalIdx = bimestresOrdenados.findIndex(
                      (orig) => orig.periodoId === b.periodoId,
                    );
                    const x = margen.izquierda + (anchoGrafico / (totalPuntos - 1)) * originalIdx;
                    const y = calcularY(b.igm ?? 0);
                    return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Puntos y etiquetas de valor */}
            {bimestresOrdenados.map((b, i) => {
              const x =
                totalPuntos > 1
                  ? margen.izquierda + (anchoGrafico / (totalPuntos - 1)) * i
                  : margen.izquierda + anchoGrafico / 2;

              return (
                <g key={`puntos-${b.periodoId}`}>
                  {b.csp !== null && (
                    <g>
                      <circle
                        cx={x}
                        cy={calcularY(b.csp)}
                        r={4.5}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      <text
                        x={x}
                        y={calcularY(b.csp) - 9}
                        textAnchor="middle"
                        className="fill-sky-700 font-mono text-[10px] font-bold dark:fill-sky-300"
                      >
                        {b.csp.toFixed(1)}%
                      </text>
                    </g>
                  )}
                  {b.isa !== null && (
                    <g>
                      <circle
                        cx={x}
                        cy={calcularY(b.isa)}
                        r={4.5}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      <text
                        x={x}
                        y={calcularY(b.isa) - 9}
                        textAnchor="middle"
                        className="fill-emerald-700 font-mono text-[10px] font-bold dark:fill-emerald-300"
                      >
                        {b.isa.toFixed(1)}%
                      </text>
                    </g>
                  )}
                  {b.igm !== null && (
                    <g>
                      <circle
                        cx={x}
                        cy={calcularY(b.igm)}
                        r={4.5}
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      <text
                        x={x}
                        y={calcularY(b.igm) + 16}
                        textAnchor="middle"
                        className="fill-amber-700 font-mono text-[10px] font-bold dark:fill-amber-300"
                      >
                        {b.igm.toFixed(1)}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tarjetas resumen por cada bimestre */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bimestresOrdenados.map((item) => {
            const tieneAlgunDato = item.csp !== null || item.isa !== null || item.igm !== null;

            return (
              <div
                key={item.periodoId}
                className="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-semibold">
                    {item.periodoNombre}
                  </span>
                  {tieneAlgunDato ? (
                    <Badge variant="success" className="h-4 px-1.5 py-0 text-[10px]">
                      Medido
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-muted-foreground h-4 px-1.5 py-0 text-[10px]"
                    >
                      Pendiente
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CSP:</span>
                    <span className="text-foreground font-medium">
                      {item.csp !== null ? `${item.csp.toFixed(2)} %` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISA:</span>
                    <span className="text-foreground font-medium">
                      {item.isa !== null ? `${item.isa.toFixed(2)} %` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IGM:</span>
                    <span className="text-foreground font-medium">
                      {item.igm !== null ? `${item.igm.toFixed(2)} %` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
