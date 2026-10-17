"use client";

import * as React from "react";
import type { DetalleCursoDocenteIndicadorDto } from "../../types";

export interface GraficoBarrasMisIndicadoresProps {
  cspPorcentaje: number | null;
  igmPorcentaje: number | null;
  cursos?: DetalleCursoDocenteIndicadorDto[];
  titulo?: string;
  className?: string;
}

/**
 * Gráfico de barras vectorial implementado exclusivamente en SVG nativo.
 * Compara visualmente el CSP (Cumplimiento de sesiones) y el IGM (Gestión de materiales)
 * tanto a nivel global como desagregado por cada curso asignado al docente.
 */
export function GraficoBarrasMisIndicadores({
  cspPorcentaje,
  igmPorcentaje,
  cursos = [],
  titulo = "Comparativa de eficacia pedagógica (CSP vs IGM)",
  className = "",
}: GraficoBarrasMisIndicadoresProps) {
  const [cursoHoverId, setCursoHoverId] = React.useState<string | null>(null);

  const hayCursos = cursos.length > 0;

  // Parámetros de renderizado SVG para cursos
  const anchoTotal = 680;
  const altoFila = 56;
  const margenSuperior = 44;
  const margenIzquierdo = 160;
  const margenDerecho = 60;
  const margenInferior = 36;
  const anchoGrafico = anchoTotal - margenIzquierdo - margenDerecho;

  const altoTotal = hayCursos ? margenSuperior + cursos.length * altoFila + margenInferior : 220;

  return (
    <div
      className={`border-border/60 bg-card rounded-2xl border p-5 shadow-xs transition-colors ${className}`}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-foreground text-base font-semibold">{titulo}</h3>
          <p className="text-muted-foreground text-xs">
            {hayCursos
              ? `Desglose comparativo en ${cursos.length} curso${cursos.length > 1 ? "s" : ""} asignado${cursos.length > 1 ? "s" : ""}`
              : "Valores consolidados del docente en el período seleccionado"}
          </p>
        </div>

        {/* Leyenda accesible */}
        <div
          className="flex items-center gap-4 text-xs font-medium"
          aria-label="Leyenda del gráfico"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block size-3 rounded-xs bg-[#7A1228] dark:bg-[#A32035]"
              aria-hidden="true"
            />
            <span className="text-foreground">CSP (Sesiones)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block size-3 rounded-xs bg-[#0F766E] dark:bg-[#14B8A6]"
              aria-hidden="true"
            />
            <span className="text-foreground">IGM (Materiales)</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${anchoTotal} ${altoTotal}`}
          className="h-auto w-full min-w-[560px]"
          role="img"
          aria-labelledby="titulo-grafico-mis-indicadores descripcion-grafico-mis-indicadores"
        >
          <title id="titulo-grafico-mis-indicadores">{titulo}</title>
          <desc id="descripcion-grafico-mis-indicadores">
            Gráfico de barras SVG con el porcentaje de cumplimiento de sesiones planificadas y
            gestión de materiales.
          </desc>

          {/* Líneas guía de fondo (0%, 25%, 50%, 75%, 100%) */}
          {[0, 25, 50, 75, 100].map((pct) => {
            const x = margenIzquierdo + (pct / 100) * anchoGrafico;
            return (
              <g key={`guia-${pct}`}>
                <line
                  x1={x}
                  y1={margenSuperior - 10}
                  x2={x}
                  y2={altoTotal - margenInferior}
                  stroke="currentColor"
                  strokeOpacity={pct === 100 ? 0.35 : 0.12}
                  strokeDasharray={pct === 100 ? undefined : "3 3"}
                  strokeWidth={pct === 100 ? 1.5 : 1}
                />
                <text
                  x={x}
                  y={altoTotal - margenInferior + 18}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] font-medium"
                >
                  {pct} %
                </text>
              </g>
            );
          })}

          {hayCursos ? (
            // Modo desglose por cursos asignados
            cursos.map((c, index) => {
              const yBase = margenSuperior + index * altoFila;
              const valCsp = c.csp.porcentaje ?? 0;
              const valIgm = c.igm.porcentaje ?? 0;
              const anchoBarraCsp = Math.max(0, Math.min(100, valCsp)) * (anchoGrafico / 100);
              const anchoBarraIgm = Math.max(0, Math.min(100, valIgm)) * (anchoGrafico / 100);
              const estaSeleccionado = cursoHoverId === `${c.cursoId}-${c.seccionId}`;

              return (
                <g
                  key={`${c.cursoId}-${c.seccionId}`}
                  onMouseEnter={() => setCursoHoverId(`${c.cursoId}-${c.seccionId}`)}
                  onMouseLeave={() => setCursoHoverId(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={cursoHoverId && !estaSeleccionado ? 0.6 : 1}
                  tabIndex={0}
                  role="graphics-symbol"
                  aria-label={`${c.cursoNombre} - ${c.gradoNombre} ${c.seccionNombre}: CSP ${c.csp.porcentajeTexto}, IGM ${c.igm.porcentajeTexto}`}
                >
                  {/* Etiqueta del curso y sección */}
                  <text
                    x={margenIzquierdo - 12}
                    y={yBase + 16}
                    textAnchor="end"
                    className="fill-foreground text-[11px] font-semibold"
                  >
                    {c.cursoNombre.length > 18 ? `${c.cursoNombre.slice(0, 18)}…` : c.cursoNombre}
                  </text>
                  <text
                    x={margenIzquierdo - 12}
                    y={yBase + 30}
                    textAnchor="end"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {c.gradoNombre} {c.seccionNombre}
                  </text>

                  {/* Barra CSP */}
                  <rect
                    x={margenIzquierdo}
                    y={yBase + 6}
                    width={anchoBarraCsp}
                    height={14}
                    rx={3}
                    className="fill-[#7A1228] transition-all duration-300 dark:fill-[#A32035]"
                  />
                  <text
                    x={margenIzquierdo + anchoBarraCsp + 6}
                    y={yBase + 17}
                    className="fill-foreground text-[10px] font-bold"
                  >
                    {c.csp.sinDatos ? "Sin datos" : c.csp.porcentajeTexto}
                  </text>

                  {/* Barra IGM */}
                  <rect
                    x={margenIzquierdo}
                    y={yBase + 24}
                    width={anchoBarraIgm}
                    height={14}
                    rx={3}
                    className="fill-[#0F766E] transition-all duration-300 dark:fill-[#14B8A6]"
                  />
                  <text
                    x={margenIzquierdo + anchoBarraIgm + 6}
                    y={yBase + 35}
                    className="fill-foreground text-[10px] font-bold"
                  >
                    {c.igm.sinDatos ? "Sin datos" : c.igm.porcentajeTexto}
                  </text>
                </g>
              );
            })
          ) : (
            // Modo general docente (CSP e IGM totales)
            <>
              {/* Barra CSP Global */}
              <g
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`CSP General: ${cspPorcentaje !== null ? `${cspPorcentaje.toFixed(2)} %` : "Sin datos"}`}
              >
                <text
                  x={margenIzquierdo - 12}
                  y={margenSuperior + 26}
                  textAnchor="end"
                  className="fill-foreground text-xs font-semibold"
                >
                  CSP Docente
                </text>
                <rect
                  x={margenIzquierdo}
                  y={margenSuperior + 10}
                  width={Math.max(0, Math.min(100, cspPorcentaje ?? 0)) * (anchoGrafico / 100)}
                  height={24}
                  rx={4}
                  className="fill-[#7A1228] transition-all duration-500 dark:fill-[#A32035]"
                />
                <text
                  x={
                    margenIzquierdo +
                    Math.max(0, Math.min(100, cspPorcentaje ?? 0)) * (anchoGrafico / 100) +
                    8
                  }
                  y={margenSuperior + 27}
                  className="fill-foreground text-xs font-bold"
                >
                  {cspPorcentaje !== null ? `${cspPorcentaje.toFixed(2)} %` : "Sin datos"}
                </text>
              </g>

              {/* Barra IGM Global */}
              <g
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`IGM General: ${igmPorcentaje !== null ? `${igmPorcentaje.toFixed(2)} %` : "Sin datos"}`}
              >
                <text
                  x={margenIzquierdo - 12}
                  y={margenSuperior + 76}
                  textAnchor="end"
                  className="fill-foreground text-xs font-semibold"
                >
                  IGM Docente
                </text>
                <rect
                  x={margenIzquierdo}
                  y={margenSuperior + 60}
                  width={Math.max(0, Math.min(100, igmPorcentaje ?? 0)) * (anchoGrafico / 100)}
                  height={24}
                  rx={4}
                  className="fill-[#0F766E] transition-all duration-500 dark:fill-[#14B8A6]"
                />
                <text
                  x={
                    margenIzquierdo +
                    Math.max(0, Math.min(100, igmPorcentaje ?? 0)) * (anchoGrafico / 100) +
                    8
                  }
                  y={margenSuperior + 77}
                  className="fill-foreground text-xs font-bold"
                >
                  {igmPorcentaje !== null ? `${igmPorcentaje.toFixed(2)} %` : "Sin datos"}
                </text>
              </g>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
