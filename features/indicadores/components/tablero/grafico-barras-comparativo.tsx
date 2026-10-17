"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ComparacionIndicadorItemDto } from "@/features/indicadores";

interface GraficoBarrasComparativoProps {
  comparaciones: ComparacionIndicadorItemDto[];
  className?: string;
}

/**
 * Gráfico de barras comparativo Pretest vs Postest en SVG puro y responsive.
 * Muestra el impacto del sistema en los tres indicadores clave (CSP, ISA, IGM).
 */
export function GraficoBarrasComparativo({
  comparaciones,
  className,
}: GraficoBarrasComparativoProps) {
  // Dimensiones del lienzo SVG
  const anchoTotal = 720;
  const altoTotal = 360;
  const margen = { arriba: 45, derecha: 35, abajo: 65, izquierda: 55 };

  const anchoGrafico = anchoTotal - margen.izquierda - margen.derecha;
  const altoGrafico = altoTotal - margen.arriba - margen.abajo;

  // Escala Y: 0% a 100% -> altoGrafico px
  const calcularY = (porcentaje: number) => {
    const seguro = Math.min(Math.max(porcentaje, 0), 100);
    return margen.arriba + (100 - seguro) * (altoGrafico / 100);
  };

  const calcularAltura = (porcentaje: number) => {
    const seguro = Math.min(Math.max(porcentaje, 0), 100);
    return seguro * (altoGrafico / 100);
  };

  // Líneas de cuadrícula horizontal (0%, 25%, 50%, 75%, 100%)
  const marcasY = [0, 25, 50, 75, 100];

  const anchoBarra = 38;
  const separacionEntreBarras = 8;

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Leyenda visual superior */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs" aria-hidden="true">
        <div className="flex items-center gap-2">
          <span className="size-3.5 rounded-sm bg-indigo-500 shadow-sm" />
          <span className="text-foreground font-medium">Pretest (Antes del sistema)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3.5 rounded-sm bg-emerald-500 shadow-sm" />
          <span className="text-foreground font-medium">Postest (Con el sistema)</span>
        </div>
      </div>

      {/* Contenedor SVG Responsive */}
      <div className="border-border/60 bg-card/60 w-full overflow-hidden rounded-xl border p-2 shadow-xs sm:p-4">
        <svg
          viewBox={`0 0 ${anchoTotal} ${altoTotal}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-auto max-h-[380px] w-full overflow-visible select-none"
          role="img"
          aria-label="Gráfico de barras comparativo: Pretest vs Postest para los indicadores CSP, ISA e IGM"
        >
          <title>Comparación Pretest vs Postest de la Tesis</title>
          <desc>
            Gráfico de barras dobles que compara los valores de línea base (pretest) con los
            resultados obtenidos tras la implementación del sistema (postest) en CSP, ISA e IGM.
          </desc>

          <defs>
            {/* Gradientes visuales para barras */}
            <linearGradient id="gradiente-pretest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="gradiente-postest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Líneas horizontales de cuadrícula y etiquetas del eje Y */}
          {marcasY.map((marca) => {
            const y = calcularY(marca);
            return (
              <g key={marca} className="text-muted-foreground/50">
                <line
                  x1={margen.izquierda}
                  y1={y}
                  x2={margen.izquierda + anchoGrafico}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray={marca === 0 ? "none" : "3 3"}
                  strokeWidth={marca === 0 ? 1.5 : 1}
                  className={marca === 0 ? "text-border" : "text-border/60"}
                />
                <text
                  x={margen.izquierda - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground font-mono text-[11px]"
                >
                  {marca}%
                </text>
              </g>
            );
          })}

          {/* Grupos de barras por cada indicador (CSP, ISA, IGM) */}
          {comparaciones.map((item, indice) => {
            // Posición central del grupo
            const anchoSector = anchoGrafico / Math.max(comparaciones.length, 1);
            const centroX = margen.izquierda + anchoSector * indice + anchoSector / 2;

            const posXPretest = centroX - anchoBarra - separacionEntreBarras / 2;
            const posXPostest = centroX + separacionEntreBarras / 2;

            // Datos Pretest
            const tienePretest = item.pretest.registrado && item.pretest.porcentaje !== null;
            const valorPretest = tienePretest ? (item.pretest.porcentaje ?? 0) : 0;
            const yPretest = calcularY(valorPretest);
            const altoPretest = calcularAltura(valorPretest);

            // Datos Postest
            const tienePostest = item.postest.medido && item.postest.porcentaje !== null;
            const valorPostest = tienePostest ? (item.postest.porcentaje ?? 0) : 0;
            const yPostest = calcularY(valorPostest);
            const altoPostest = calcularAltura(valorPostest);

            // Variación en puntos porcentuales
            const variacion = item.variacionPuntos;
            const tieneVariacion = variacion !== null && variacion !== undefined;
            const variacionPositiva = tieneVariacion && variacion >= 0;

            return (
              <g key={item.indicador} className="transition-all duration-300">
                {/* Insignia de Variación en Puntos Porcentuales (pp) arriba del grupo */}
                {tieneVariacion && (
                  <g>
                    <rect
                      x={centroX - 36}
                      y={margen.arriba - 28}
                      width={72}
                      height={20}
                      rx={10}
                      className={
                        variacionPositiva
                          ? "fill-emerald-500/15 stroke-emerald-500/30"
                          : "fill-amber-500/15 stroke-amber-500/30"
                      }
                      strokeWidth={1}
                    />
                    <text
                      x={centroX}
                      y={margen.arriba - 14}
                      textAnchor="middle"
                      className={cn(
                        "font-mono text-[11px] font-bold",
                        variacionPositiva
                          ? "fill-emerald-700 dark:fill-emerald-400"
                          : "fill-amber-700 dark:fill-amber-400",
                      )}
                    >
                      {item.variacionPuntosTexto}
                    </text>
                  </g>
                )}

                {/* Barra Pretest */}
                {tienePretest ? (
                  <g>
                    <rect
                      x={posXPretest}
                      y={yPretest}
                      width={anchoBarra}
                      height={Math.max(altoPretest, 2)}
                      rx={5}
                      fill="url(#gradiente-pretest)"
                      className="transition-all duration-200 hover:opacity-90"
                    />
                    <text
                      x={posXPretest + anchoBarra / 2}
                      y={yPretest - 6}
                      textAnchor="middle"
                      className="fill-foreground font-mono text-[11px] font-semibold"
                    >
                      {valorPretest.toFixed(1)}%
                    </text>
                  </g>
                ) : (
                  <g>
                    <rect
                      x={posXPretest}
                      y={margen.arriba + altoGrafico - 24}
                      width={anchoBarra}
                      height={24}
                      rx={4}
                      className="fill-muted/40 stroke-muted-foreground/30"
                      strokeDasharray="2 2"
                      strokeWidth={1}
                    />
                    <text
                      x={posXPretest + anchoBarra / 2}
                      y={margen.arriba + altoGrafico - 8}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[9px] font-medium"
                    >
                      Sin pretest
                    </text>
                  </g>
                )}

                {/* Barra Postest */}
                {tienePostest ? (
                  <g>
                    <rect
                      x={posXPostest}
                      y={yPostest}
                      width={anchoBarra}
                      height={Math.max(altoPostest, 2)}
                      rx={5}
                      fill="url(#gradiente-postest)"
                      className="transition-all duration-200 hover:opacity-90"
                    />
                    <text
                      x={posXPostest + anchoBarra / 2}
                      y={yPostest - 6}
                      textAnchor="middle"
                      className="fill-foreground font-mono text-[11px] font-semibold"
                    >
                      {valorPostest.toFixed(1)}%
                    </text>
                  </g>
                ) : (
                  <g>
                    <rect
                      x={posXPostest}
                      y={margen.arriba + altoGrafico - 24}
                      width={anchoBarra}
                      height={24}
                      rx={4}
                      className="fill-muted/40 stroke-muted-foreground/30"
                      strokeDasharray="2 2"
                      strokeWidth={1}
                    />
                    <text
                      x={posXPostest + anchoBarra / 2}
                      y={margen.arriba + altoGrafico - 8}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[9px] font-medium"
                    >
                      Pendiente
                    </text>
                  </g>
                )}

                {/* Etiquetas del Eje X: Código y Nombre Corto */}
                <text
                  x={centroX}
                  y={altoTotal - margen.abajo + 22}
                  textAnchor="middle"
                  className="fill-foreground text-sm font-bold tracking-wide"
                >
                  {item.indicador}
                </text>
                <text
                  x={centroX}
                  y={altoTotal - margen.abajo + 38}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  {item.indicador === "CSP" && "Sesiones"}
                  {item.indicador === "ISA" && "Libretas"}
                  {item.indicador === "IGM" && "Materiales"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tabla accesible de datos para lectores de pantalla */}
      <table className="sr-only">
        <caption>Comparación de indicadores pretest y postest</caption>
        <thead>
          <tr>
            <th scope="col">Indicador</th>
            <th scope="col">Pretest</th>
            <th scope="col">Postest</th>
            <th scope="col">Variación</th>
          </tr>
        </thead>
        <tbody>
          {comparaciones.map((item) => (
            <tr key={item.indicador}>
              <td>{item.nombre}</td>
              <td>{item.pretest.porcentajeTexto}</td>
              <td>{item.postest.porcentajeTexto}</td>
              <td>{item.variacionPuntosTexto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
