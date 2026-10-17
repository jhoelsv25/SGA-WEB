"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/common/date-picker";
import { Spinner } from "@/components/common/spinner";
import { toast } from "@/lib/toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Download01Icon,
  EyeIcon,
  FileExportIcon,
  FileSpreadsheetIcon,
  Pdf01Icon,
} from "@hugeicons/core-free-icons";
import {
  descargarExcelIndicadores,
  descargarPdfIndicadores,
  obtenerPdfIndicadoresBlobUrl,
} from "../../api";
import { INDICADORES_LISTA, NOMBRES_INDICADORES } from "../../consts";
import type { ExportarIndicadoresQueryDto, Indicador } from "../../types";
import { cn } from "@/lib/utils";

export interface ModalExportarMedicionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodoIdSeleccionado?: string;
  periodosDisponibles?: Array<{ id: string; nombre: string }>;
}

export function ModalExportarMedicion({
  open,
  onOpenChange,
  periodoIdSeleccionado,
  periodosDisponibles = [],
}: ModalExportarMedicionProps) {
  const [periodoIdManual, setPeriodoIdManual] = React.useState<string | null>(null);
  const periodoId = periodoIdManual ?? periodoIdSeleccionado ?? "";
  const [indicador, setIndicador] = React.useState<Indicador | "TODOS">("TODOS");
  const [fechaInicio, setFechaInicio] = React.useState<string>("");
  const [fechaFin, setFechaFin] = React.useState<string>("");

  const [descargandoExcel, setDescargandoExcel] = React.useState(false);
  const [descargandoPdf, setDescargandoPdf] = React.useState(false);
  const [previsualizandoPdf, setPrevisualizandoPdf] = React.useState(false);

  const construirQuery = (): ExportarIndicadoresQueryDto => {
    const q: ExportarIndicadoresQueryDto = {};
    if (periodoId) q.periodoId = periodoId;
    if (indicador !== "TODOS") q.indicador = indicador;
    if (fechaInicio) q.fechaInicio = fechaInicio;
    if (fechaFin) q.fechaFin = fechaFin;
    return q;
  };

  const nombrePeriodoActual =
    periodosDisponibles
      .find((p) => p.id === periodoId)
      ?.nombre.toLowerCase()
      .replace(/\s+/g, "-") ?? "general";

  const manejarExportarExcel = async () => {
    setDescargandoExcel(true);
    try {
      const nombreArchivo = `reporte-indicadores-${nombrePeriodoActual}.xlsx`;
      await descargarExcelIndicadores(construirQuery(), nombreArchivo);
      toast.success("Evidencia en Excel generada y descargada exitosamente.");
      onOpenChange(false);
    } catch {
      toast.error("Error al exportar los indicadores a Excel.");
    } finally {
      setDescargandoExcel(false);
    }
  };

  const manejarExportarPdf = async () => {
    setDescargandoPdf(true);
    try {
      const nombreArchivo = `informe-indicadores-tesis-${nombrePeriodoActual}.pdf`;
      await descargarPdfIndicadores(construirQuery(), nombreArchivo);
      toast.success("Informe formal en PDF generado y descargado exitosamente.");
      onOpenChange(false);
    } catch {
      toast.error("Error al exportar el informe formal a PDF.");
    } finally {
      setDescargandoPdf(false);
    }
  };

  const manejarPrevisualizarPdf = async () => {
    setPrevisualizandoPdf(true);
    try {
      const url = await obtenerPdfIndicadoresBlobUrl(construirQuery());
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => window.URL.revokeObjectURL(url), 120_000);
      toast.success("Abriendo vista previa del informe en PDF...");
    } catch {
      toast.error("Error al generar la vista previa del PDF.");
    } finally {
      setPrevisualizandoPdf(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Exportar evidencia oficial de la tesis"
      description="Genera reportes oficiales de indicadores institucionales para el análisis de resultados e informe final."
      icon={FileExportIcon}
      size="lg"
    >
      <div className="space-y-4 pt-1">
        {/* Selector de Período Académico */}
        {periodosDisponibles.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-foreground text-sm font-medium">Período académico</Label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPeriodoIdManual("")}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  !periodoId
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : "border-border/80 bg-card hover:bg-muted/60 text-foreground",
                )}
              >
                Año completo / Todos
              </button>
              {periodosDisponibles.map((p) => {
                const activo = p.id === periodoId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPeriodoIdManual(p.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      activo
                        ? "border-primary bg-primary text-primary-foreground font-semibold"
                        : "border-border/80 bg-card hover:bg-muted/60 text-foreground",
                    )}
                  >
                    {p.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selector de Indicador Específico */}
        <div className="space-y-1.5">
          <Label className="text-foreground text-sm font-medium">Indicador a incluir</Label>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setIndicador("TODOS")}
              className={cn(
                "rounded-xl border p-2 text-center text-xs font-medium transition-all",
                indicador === "TODOS"
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                  : "border-border/70 bg-card hover:bg-muted/50 text-foreground",
              )}
            >
              Todos (3)
            </button>
            {INDICADORES_LISTA.map((ind) => {
              const activo = indicador === ind;
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => setIndicador(ind)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border p-2 text-center text-xs font-medium transition-all",
                    activo
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                      : "border-border/70 bg-card hover:bg-muted/50 text-foreground",
                  )}
                >
                  <span>{ind}</span>
                  <span className="text-muted-foreground line-clamp-1 text-[9px]">
                    {NOMBRES_INDICADORES[ind]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rango de Fechas Opcional */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-foreground text-sm font-medium">
              Fecha de inicio (opcional)
            </Label>
            <DatePicker
              date={fechaInicio ? parseISO(fechaInicio) : undefined}
              onSelect={(d) => setFechaInicio(d ? format(d, "yyyy-MM-dd") : "")}
              placeholder="Rango inicial"
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground text-sm font-medium">Fecha de fin (opcional)</Label>
            <DatePicker
              date={fechaFin ? parseISO(fechaFin) : undefined}
              onSelect={(d) => setFechaFin(d ? format(d, "yyyy-MM-dd") : "")}
              minDate={fechaInicio ? parseISO(fechaInicio) : undefined}
              placeholder="Rango final"
              className="w-full"
            />
          </div>
        </div>

        {/* Tarjetas de opciones de formato oficial */}
        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
          {/* Opción Excel */}
          <div className="border-border/70 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-2xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <HugeiconsIcon icon={FileSpreadsheetIcon} size={18} />
                </div>
                <h4 className="text-foreground text-sm font-bold">Datos crudos (Excel)</h4>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Libro XLSX estructurado con hojas de detalle por sesión de clase, libreta y
                material. Diseñado para pruebas estadísticas inferenciales (SPSS, R o Jamovi).
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={manejarExportarExcel}
              disabled={descargandoExcel || descargandoPdf}
              className="mt-4 h-9 gap-1.5 rounded-full text-xs font-semibold"
            >
              {descargandoExcel ? (
                <Spinner className="size-3.5" />
              ) : (
                <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
              )}
              <span>Descargar .xlsx</span>
            </Button>
          </div>

          {/* Opción PDF */}
          <div className="border-border/70 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-2xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <HugeiconsIcon icon={Pdf01Icon} size={18} />
                </div>
                <h4 className="text-foreground text-sm font-bold">Informe formal (PDF)</h4>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Documento A4 oficial con membrete del colegio, marco metodológico, fórmulas de los 3
                indicadores, tablas comparativas y gráfico de barras para anexar a la tesis.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={manejarPrevisualizarPdf}
                disabled={previsualizandoPdf || descargandoPdf}
                className="h-9 flex-1 gap-1 rounded-full text-xs font-medium"
              >
                {previsualizandoPdf ? (
                  <Spinner className="size-3" />
                ) : (
                  <HugeiconsIcon icon={EyeIcon} className="size-3" />
                )}
                <span>Vista previa</span>
              </Button>

              <Button
                type="button"
                onClick={manejarExportarPdf}
                disabled={descargandoPdf || descargandoExcel}
                className="shadow-primary/20 h-9 flex-1 gap-1 rounded-full text-xs font-semibold shadow-xs"
              >
                {descargandoPdf ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
                )}
                <span>Descargar .pdf</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Pie con botón de cerrar */}
        <div className="flex justify-end pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-9 gap-1 rounded-full px-4 text-xs font-medium"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cerrar</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
