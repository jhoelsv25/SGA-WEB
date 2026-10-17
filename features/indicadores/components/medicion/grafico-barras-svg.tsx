"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ItemBarraSvg {
  etiqueta: string;
  valor: number | null;
  valorTexto?: string;
  subtitulo?: string;
  color?: string;
}

export interface GraficoBarrasSvgProps {
  titulo?: string;
  descripcion?: string;
  items: ItemBarraSvg[];
  altura?: number;
  className?: string;
  mostrarLeyenda?: boolean;
}

const COLOR_PRIMARIO = "#1e3a8a"; // Azul institucional
const COLOR_PRETEST = "#7a1228"; // Guindo institucional de la tesis
const COLOR_POSTEST = "#047857"; // Verde esmeralda de postest alcanzado
const COLOR_SIN_DATOS = "#94a3b8"; // Pizarra neutra para valores sin datos

export function GraficoBarrasSvg({
  titulo,
  descripcion,
  items,
  altura = 260,
  className,
  mostrarLeyenda = true,
}: GraficoBarrasSvgProps) {
  // Dimensiones del canvas SVG
  const ancho = 640;
  const margen = { arriba: 36, derecha: 24, abajo: 56, izquierda: 48 };
  const anchoGrafico = ancho - margen.izquierda - margen.derecha;
  const altoGrafico = altura - margen.arriba - margen.abajo;

  // Escala fija de 0 % a 100 % para indicadores educativos
  const valorMaximo = 100;
  const lineasGuia = [0, 25, 50, 75, 100];

  const anchoGrupo = items.length > 0 ? anchoGrafico / items.length : anchoGrafico;
  const anchoBarra = Math.min(56, Math.max(28, anchoGrupo * 0.5));

  const resolverColor = (item: ItemBarraSvg, indice: number): string => {
    if (item.color) return item.color;
    if (item.valor === null) return COLOR_SIN_DATOS;
    if (item.etiqueta.toLowerCase().includes("pretest")) return COLOR_PRETEST;
    if (item.etiqueta.toLowerCase().includes("postest")) return COLOR_POSTEST;
    // Alternancia armónica
    const paleta = [COLOR_PRIMARIO, COLOR_POSTEST, COLOR_PRETEST];
    return paleta[indice % paleta.length];
  };

  return (
    <div
      className={cn(
        "border-border/70 bg-card text-card-foreground flex w-full flex-col rounded-2xl border p-4 shadow-2xs sm:p-5",
        className,
      )}
    >
      {(titulo || descripcion) && (
        <div className="mb-4 space-y-1">
          {titulo && (
            <h4 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
              {titulo}
            </h4>
          )}
          {descripcion && (
            <p className="text-muted-foreground text-xs leading-relaxed">{descripcion}</p>
          )}
        </div>
      )}

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${ancho} ${altura}`}
          className="h-auto w-full min-w-[320px]"
          role="img"
          aria-label={
            titulo ? `Gráfico de barras: ${titulo}` : "Gráfico de barras comparativo de indicadores"
          }
        >
          {/* Líneas guía horizontales de porcentaje */}
          {lineasGuia.map((guia) => {
            const y = margen.arriba + altoGrafico - (guia / valorMaximo) * altoGrafico;
            return (
              <g key={`guia-${guia}`}>
                <line
                  x1={margen.izquierda}
                  y1={y}
                  x2={ancho - margen.derecha}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={guia === 0 ? 0.35 : 0.12}
                  strokeDasharray={guia === 0 ? "none" : "4 4"}
                />
                <text
                  x={margen.izquierda - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px] font-medium"
                >
                  {guia}%
                </text>
              </g>
            );
          })}

          {/* Barras de datos */}
          {items.map((item, indice) => {
            const centroX = margen.izquierda + indice * anchoGrupo + anchoGrupo / 2;
            const x = centroX - anchoBarra / 2;
            const tieneDato = item.valor !== null && !Number.isNaN(item.valor);
            const valorSeguro = tieneDato ? Math.min(100, Math.max(0, item.valor as number)) : 0;
            const alturaBarra = (valorSeguro / valorMaximo) * altoGrafico;
            const y = margen.arriba + altoGrafico - alturaBarra;
            const color = resolverColor(item, indice);
            const textoValor =
              item.valorTexto ?? (tieneDato ? `${valorSeguro.toFixed(2)} %` : "Sin datos");

            return (
              <g key={`barra-${item.etiqueta}-${indice}`} className="transition-all duration-300">
                {/* Barra de fondo sutil para contraste */}
                <rect
                  x={x}
                  y={margen.arriba}
                  width={anchoBarra}
                  height={altoGrafico}
                  rx={6}
                  className="fill-muted/20"
                />

                {/* Barra activa con relleno */}
                {tieneDato && alturaBarra > 0 ? (
                  <rect
                    x={x}
                    y={y}
                    width={anchoBarra}
                    height={alturaBarra}
                    rx={6}
                    fill={color}
                    className="opacity-90 transition-opacity hover:opacity-100"
                  />
                ) : (
                  <rect
                    x={x}
                    y={margen.arriba + altoGrafico - 4}
                    width={anchoBarra}
                    height={4}
                    rx={2}
                    fill={COLOR_SIN_DATOS}
                    className="opacity-50"
                  />
                )}

                {/* Etiqueta de valor encima de la barra */}
                <text
                  x={centroX}
                  y={
                    tieneDato
                      ? Math.max(margen.arriba - 6, y - 6)
                      : margen.arriba + altoGrafico - 10
                  }
                  textAnchor="middle"
                  className={cn(
                    "font-bold tracking-tight",
                    tieneDato ? "fill-foreground text-[11px]" : "fill-muted-foreground text-[10px]",
                  )}
                >
                  {textoValor}
                </text>

                {/* Etiqueta del eje X */}
                <text
                  x={centroX}
                  y={margen.arriba + altoGrafico + 20}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-semibold"
                >
                  {item.etiqueta}
                </text>

                {/* Subtítulo o detalle del eje X */}
                {item.subtitulo && (
                  <text
                    x={centroX}
                    y={margen.arriba + altoGrafico + 36}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {item.subtitulo}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Leyenda opcional */}
      {mostrarLeyenda && items.length > 0 && (
        <div className="border-border/60 mt-3 flex flex-wrap items-center justify-center gap-4 border-t pt-3 text-xs">
          {items.map((item, indice) => {
            const color = resolverColor(item, indice);
            return (
              <div key={`leyenda-${item.etiqueta}-${indice}`} className="flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-foreground font-medium">{item.etiqueta}</span>
                {item.valor !== null && (
                  <span className="text-muted-foreground text-[11px]">
                    ({item.valorTexto ?? `${item.valor.toFixed(2)} %`})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
