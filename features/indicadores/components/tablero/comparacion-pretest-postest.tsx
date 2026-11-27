"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartHistogramIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MENSAJES_INDICADORES,
  type ComparacionBimestreResponseDto,
  type ComparacionIndicadorItemDto,
} from "@/features/indicadores";
import { GraficoBarrasComparativo } from "./grafico-barras-comparativo";
import { GraficoEvolucionBimestres } from "./grafico-evolucion-bimestres";

interface ComparacionPretestPostestProps {
  comparacionData?: ComparacionBimestreResponseDto | null;
  cargando?: boolean;
}

/**
 * Sección de comparación empírica de la tesis: Pretest (Línea Base) vs Postest (Con SGA).
 * Muestra variación en puntos porcentuales (+pp), fuentes documentales y gráfico de barras.
 */
export function ComparacionPretestPostest({
  comparacionData,
  cargando = false,
}: ComparacionPretestPostestProps) {
  const comparaciones = comparacionData?.comparaciones ?? [];
  const evolucion = comparacionData?.evolucionBimestres ?? [];

  if (cargando) {
    return (
      <div className="space-y-6">
        <Card className="border-border/60 text-muted-foreground animate-pulse p-8 text-center">
          <p>Cargando datos de comparación pretest–postest...</p>
        </Card>
      </div>
    );
  }

  if (comparaciones.length === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={36}
            className="text-muted-foreground/60 mb-2"
          />
          <CardTitle className="text-foreground text-base font-semibold">
            Sin datos de comparación
          </CardTitle>
          <CardDescription className="mt-1 max-w-md text-xs">
            Seleccione un bimestre cerrado para consultar los resultados comparativos y la variación
            en puntos porcentuales frente a la línea base.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado de la Sección de Comparación */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={ChartHistogramIcon} size={20} className="text-primary" />
          <h2 className="text-foreground text-lg font-bold tracking-tight">
            Comparación Pretest – Postest (
            {comparacionData?.periodoNombre ?? "Bimestre Seleccionado"})
          </h2>
        </div>
        <p className="text-muted-foreground text-xs">
          Medición cuantitativa del efecto de la implementación del sistema web sobre las
          dimensiones pedagógica, de seguimiento y de aula virtual.
        </p>
      </div>

      {/* Gráfico de Barras Vectorial SVG (Pretest vs Postest) */}
      <GraficoBarrasComparativo comparaciones={comparaciones} />

      {/* Tarjetas comparativas detalladas por indicador */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {comparaciones.map((item) => (
          <TarjetaComparacionItem key={item.indicador} item={item} />
        ))}
      </div>

      {/* Evolución Longitudinal por Bimestre */}
      {evolucion.length > 0 && <GraficoEvolucionBimestres evolucion={evolucion} />}
    </div>
  );
}

/**
 * Tarjeta individual comparativa por cada indicador (CSP, ISA, IGM).
 */
function TarjetaComparacionItem({ item }: { item: ComparacionIndicadorItemDto }) {
  const tienePretest = item.pretest.registrado && item.pretest.porcentaje !== null;
  const tienePostest = item.postest.medido && item.postest.porcentaje !== null;
  const variacion = item.variacionPuntos;
  const esVariacionPositiva = variacion !== null && variacion >= 0;

  return (
    <Card className="border-border/60 hover:border-border flex flex-col justify-between transition-all">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-bold">
            {item.indicador}
          </Badge>
          <Badge variant="secondary" className="text-[11px]">
            {item.dimension}
          </Badge>
        </div>

        <CardTitle className="text-foreground text-sm leading-snug font-semibold">
          {item.nombre}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Variación en Puntos Porcentuales (pp) */}
        <div
          className={cn(
            "rounded-xl border p-3 text-center transition-colors",
            variacion !== null
              ? esVariacionPositiva
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300"
                : "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-300"
              : "border-border/60 bg-muted/30 text-muted-foreground",
          )}
        >
          <span className="text-[11px] font-medium tracking-wide uppercase">
            Impacto / Variación
          </span>
          <p className="font-mono text-2xl font-black tracking-tight">
            {item.variacionPuntosTexto}
          </p>
          <p className="text-[11px] opacity-80">
            {variacion !== null
              ? esVariacionPositiva
                ? "Incremento porcentual favorable"
                : "Disminución porcentual"
              : "Pendiente de registro de pretest o postest"}
          </p>
        </div>

        {/* Fila Doble: Pretest vs Postest */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Columna Pretest */}
          <div className="border-border/50 bg-background space-y-1 rounded-lg border p-2.5">
            <div className="text-muted-foreground flex items-center gap-1 text-[11px] font-semibold">
              <span className="size-2 rounded-full bg-indigo-500" />
              <span>Pretest</span>
            </div>
            {tienePretest ? (
              <>
                <p className="text-foreground font-mono text-lg font-bold">
                  {item.pretest.porcentajeTexto}
                </p>
                {item.pretest.periodoDescrito && (
                  <p
                    className="text-muted-foreground truncate text-[10px]"
                    title={item.pretest.periodoDescrito}
                  >
                    {item.pretest.periodoDescrito}
                  </p>
                )}
                {item.pretest.fuente && (
                  <p
                    className="text-muted-foreground/80 line-clamp-2 text-[10px]"
                    title={`Fuente documental: ${item.pretest.fuente}`}
                  >
                    Fuente: {item.pretest.fuente}
                  </p>
                )}
              </>
            ) : (
              <div className="pt-1">
                <p className="text-muted-foreground text-xs italic">Sin pretest</p>
                <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                  {MENSAJES_INDICADORES.SIN_PRETEST}
                </p>
              </div>
            )}
          </div>

          {/* Columna Postest */}
          <div className="border-border/50 bg-background space-y-1 rounded-lg border p-2.5">
            <div className="text-muted-foreground flex items-center gap-1 text-[11px] font-semibold">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Postest</span>
            </div>
            {tienePostest ? (
              <>
                <p className="text-foreground font-mono text-lg font-bold">
                  {item.postest.porcentajeTexto}
                </p>
                {item.postest.version && (
                  <p className="text-muted-foreground text-[10px]">
                    Versión congelada: v{item.postest.version}
                  </p>
                )}
                {item.postest.cerradaEn && (
                  <p className="text-muted-foreground/80 text-[10px]">
                    Cerrado: {new Date(item.postest.cerradaEn).toLocaleDateString("es-PE")}
                  </p>
                )}
              </>
            ) : (
              <div className="pt-1">
                <p className="text-muted-foreground text-xs italic">Pendiente</p>
                <p className="text-muted-foreground mt-1 text-[10px]">
                  Medición al cerrar el bimestre
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
