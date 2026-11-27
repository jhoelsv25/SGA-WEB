"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Book02Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Folder01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  MENSAJES_INDICADORES,
  type DesgloseCspDto,
  type DesgloseIgmDto,
  type DesgloseIsaDto,
  type Indicador,
  type IndicadorCalculadoDto,
} from "@/features/indicadores";

interface TarjetaIndicadorProps {
  indicador:
    | IndicadorCalculadoDto<DesgloseCspDto>
    | IndicadorCalculadoDto<DesgloseIsaDto>
    | IndicadorCalculadoDto<DesgloseIgmDto>;
  className?: string;
}

const ESTILOS_INDICADOR: Record<
  Indicador,
  {
    borde: string;
    insigniaFondo: string;
    progresoColor: string;
    icono: typeof Calendar03Icon;
  }
> = {
  CSP: {
    borde: "border-sky-500/20 hover:border-sky-500/40",
    insigniaFondo: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    progresoColor: "bg-sky-600 dark:bg-sky-500",
    icono: Calendar03Icon,
  },
  ISA: {
    borde: "border-emerald-500/20 hover:border-emerald-500/40",
    insigniaFondo: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    progresoColor: "bg-emerald-600 dark:bg-emerald-500",
    icono: Book02Icon,
  },
  IGM: {
    borde: "border-amber-500/20 hover:border-amber-500/40",
    insigniaFondo: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    progresoColor: "bg-amber-600 dark:bg-amber-500",
    icono: Folder01Icon,
  },
};

/**
 * Tarjeta de visualización detallada de un indicador clave de la tesis (CSP, ISA, IGM).
 * Incluye valor porcentual, métrica en vivo (en curso), desglose y trazabilidad de fórmulas.
 */
export function TarjetaIndicador({ indicador, className }: TarjetaIndicadorProps) {
  const [expandido, setExpandido] = React.useState(true);
  const estilo = ESTILOS_INDICADOR[indicador.indicador];
  const IconoIndicador = estilo.icono;

  const tieneDatos = !indicador.sinDatos && indicador.porcentaje !== null;
  const valorProgreso = tieneDatos ? Math.min(Math.max(indicador.porcentaje ?? 0, 0), 100) : 0;

  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between transition-all duration-200",
        estilo.borde,
        className,
      )}
    >
      <CardHeader className="space-y-3 pb-2">
        {/* Encabezado: Código de Indicador, Dimensión y Estado */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex size-7 items-center justify-center rounded-lg text-xs font-bold",
                estilo.insigniaFondo,
              )}
            >
              {indicador.indicador}
            </span>
            <Badge variant="outline" className="text-[11px] font-medium">
              {indicador.dimension}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            {indicador.enCurso ? (
              <Badge
                variant="warning"
                className="animate-pulse gap-1 px-2 text-[11px] font-semibold"
              >
                <span className="size-1.5 rounded-full bg-amber-500" />
                En curso
              </Badge>
            ) : indicador.sinDatos ? (
              <Badge variant="secondary" className="text-[11px]">
                Sin datos
              </Badge>
            ) : (
              <Badge variant="success" className="gap-1 px-2 text-[11px]">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} strokeWidth={2.5} />
                Calculado
              </Badge>
            )}
          </div>
        </div>

        {/* Título Oficial del Indicador */}
        <div>
          <CardTitle className="text-foreground text-base leading-tight font-semibold">
            {indicador.nombre}
          </CardTitle>
          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <HugeiconsIcon icon={IconoIndicador} size={13} className="shrink-0 opacity-70" />
            <span>Fórmula: {indicador.formula}</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Valor Principal y Ratio */}
        <div className="bg-muted/40 flex items-baseline justify-between rounded-lg p-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  "text-3xl font-extrabold tracking-tight",
                  tieneDatos ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {indicador.porcentajeTexto}
              </span>
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {tieneDatos
                ? `${indicador.numerador} de ${indicador.denominador} favorables`
                : MENSAJES_INDICADORES.SIN_DATOS}
            </p>
          </div>

          <div className="text-right">
            <span className="text-muted-foreground text-xs font-medium">Efectividad</span>
            <p className="text-foreground text-sm font-semibold">
              {tieneDatos ? `${valorProgreso.toFixed(1)}%` : "—"}
            </p>
          </div>
        </div>

        {/* Barra de Progreso Visual */}
        <div className="space-y-1">
          <Progress
            value={valorProgreso}
            className="bg-muted h-2.5"
            aria-label={`Porcentaje de cumplimiento de ${indicador.nombre}: ${indicador.porcentajeTexto}`}
          />
        </div>

        {/* Alerta de Sin Datos */}
        {indicador.sinDatos && (
          <div className="border-border/80 bg-background text-muted-foreground flex items-start gap-2 rounded-lg border p-3 text-xs">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={16}
              className="text-muted-foreground mt-0.5 shrink-0"
            />
            <p>{indicador.mensajeSinDatos ?? MENSAJES_INDICADORES.SIN_DATOS}</p>
          </div>
        )}

        {/* Botón para Alternar Desglose */}
        <div className="border-border/60 border-t pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpandido((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground h-8 w-full justify-between px-2 text-xs font-medium"
            aria-expanded={expandido}
            aria-label={`${expandido ? "Ocultar" : "Mostrar"} desglose detallado de ${indicador.indicador}`}
          >
            <span>Desglose de cálculo</span>
            <HugeiconsIcon
              icon={expandido ? ArrowUp01Icon : ArrowDown01Icon}
              size={14}
              strokeWidth={2}
            />
          </Button>

          {/* Desglose Condicional según Indicador */}
          {expandido && (
            <div className="bg-card mt-2.5 space-y-2 rounded-lg p-3 text-xs">
              {indicador.indicador === "CSP" && (
                <DesgloseCspVista desglose={indicador.desglose as DesgloseCspDto} />
              )}
              {indicador.indicador === "ISA" && (
                <DesgloseIsaVista desglose={indicador.desglose as DesgloseIsaDto} />
              )}
              {indicador.indicador === "IGM" && (
                <DesgloseIgmVista desglose={indicador.desglose as DesgloseIgmDto} />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Desglose específico para el indicador CSP (Cumplimiento de sesiones planificadas).
 */
function DesgloseCspVista({ desglose }: { desglose: DesgloseCspDto }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground">Sesiones planificadas:</span>
        <span className="text-foreground font-semibold">{desglose.planificadas}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Cumplidas:
        </span>
        <span className="text-foreground font-medium">{desglose.cumplidas}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-sky-500" />
          Parciales:
        </span>
        <span className="text-foreground font-medium">{desglose.parciales}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-rose-500" />
          No cumplidas:
        </span>
        <span className="text-foreground font-medium">{desglose.noCumplidas}</span>
      </div>
      <div className="border-border/40 flex justify-between border-t py-0.5 pt-1">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Justificadas (excluidas del denominador):
        </span>
        <span className="text-foreground font-medium">{desglose.justificadas}</span>
      </div>
      <div className="border-border/60 flex justify-between border-t py-0.5 pt-1 font-medium">
        <span className="text-foreground">Denominador efectivo:</span>
        <span className="text-foreground font-bold">{desglose.denominadorEfectivo}</span>
      </div>
    </div>
  );
}

/**
 * Desglose específico para el indicador ISA (Informes de seguimiento académico).
 */
function DesgloseIsaVista({ desglose }: { desglose: DesgloseIsaDto }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground">Libretas programadas:</span>
        <span className="text-foreground font-semibold">{desglose.programadas}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Publicadas a tiempo:
        </span>
        <span className="text-foreground font-medium">{desglose.publicadasATiempo}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Fuera de plazo:
        </span>
        <span className="text-foreground font-medium">{desglose.publicadasFueraDePlazo}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-rose-500" />
          Pendientes (vencidas no publicadas):
        </span>
        <span className="text-foreground font-medium">{desglose.pendientes}</span>
      </div>
      <div className="border-border/60 text-muted-foreground flex justify-between border-t py-0.5 pt-1 text-[11px]">
        <span className="flex items-center gap-1">
          <HugeiconsIcon icon={InformationCircleIcon} size={12} className="shrink-0" />
          Vistas por familias (complementario):
        </span>
        <span className="text-foreground font-semibold">
          {desglose.vistasPorFamilia} ({desglose.porcentajeVistasFamilia.toFixed(1)} %)
        </span>
      </div>
    </div>
  );
}

/**
 * Desglose específico para el indicador IGM (Gestión de materiales del aula virtual).
 */
function DesgloseIgmVista({ desglose }: { desglose: DesgloseIgmDto }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground">Materiales planificados:</span>
        <span className="text-foreground font-semibold">{desglose.planificados}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Publicados a tiempo:
        </span>
        <span className="text-foreground font-medium">{desglose.publicadosATiempo}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Publicados fuera de plazo:
        </span>
        <span className="text-foreground font-medium">{desglose.publicadosFueraDePlazo}</span>
      </div>
      <div className="flex justify-between py-0.5">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-rose-500" />
          Pendientes no publicados:
        </span>
        <span className="text-foreground font-medium">{desglose.pendientes}</span>
      </div>
      <div className="border-border/60 text-muted-foreground flex justify-between border-t py-0.5 pt-1 text-[11px]">
        <span className="flex items-center gap-1">
          <HugeiconsIcon icon={InformationCircleIcon} size={12} className="shrink-0" />
          Materiales extra (excluidos del cálculo):
        </span>
        <span className="text-foreground font-semibold">{desglose.extras}</span>
      </div>
    </div>
  );
}
