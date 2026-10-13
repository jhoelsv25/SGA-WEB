"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { PageState } from "@/components/common/page-state";
import { useLibroNotas } from "../hooks";
import { descargarExcelLibroNotas } from "../api";
import { toast } from "@/lib/toast";

export function LibroNotasTab({
  cursoSeccionId,
  periodoId,
}: {
  cursoSeccionId: string;
  periodoId?: string;
}) {
  const {
    data: libro,
    isLoading,
    isError,
    error,
    refetch,
  } = useLibroNotas(cursoSeccionId, periodoId);
  const [descargando, setDescargando] = React.useState(false);

  const handleDescargarExcel = async () => {
    if (!libro) return;
    try {
      setDescargando(true);
      await descargarExcelLibroNotas(cursoSeccionId, libro.cursoNombre, periodoId);
      toast.success("Libro de notas descargado en formato Excel.");
    } catch {
      toast.error("No se pudo descargar el archivo Excel.");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => void refetch()}
      errorTitle="No se pudo cargar el libro de calificaciones"
    >
      {libro && (
        <div className="space-y-4">
          {/* Barra de cabecera con pesos y botón de exportación */}
          <div className="bg-card flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">
                  Libro de Calificaciones · {libro.periodoNombre}
                </h3>
                <StatusBadge tone="neutral">{libro.estudiantes.length} estudiantes</StatusBadge>
              </div>
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <span className="text-foreground font-semibold">Pesos efectivos (v2.0):</span>
                {Object.entries(libro.pesosEfectivos).map(([tipo, peso]) => (
                  <span
                    key={tipo}
                    className="bg-muted rounded-md px-2 py-0.5 font-medium capitalize"
                  >
                    {tipo}: {peso}%
                  </span>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              id="btn-exportar-excel-notas"
              onClick={handleDescargarExcel}
              disabled={descargando || libro.estudiantes.length === 0}
              className="gap-2 font-medium"
            >
              <HugeiconsIcon icon={Download01Icon} size={16} />
              {descargando ? "Generando..." : "Exportar a Excel"}
            </Button>
          </div>

          {/* Banner de explicación de redistribución proporcional (CP-RF016-31) */}
          <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/50 p-3 text-xs text-indigo-900 dark:border-indigo-950 dark:bg-indigo-950/20 dark:text-indigo-200">
            <HugeiconsIcon icon={InformationCircleIcon} size={16} className="shrink-0" />
            <span>
              Si un tipo de tarea no tiene actividades en el bimestre, su peso se redistribuye
              proporcionalmente entre los tipos evaluados (CP-RF016-30, CP-RF016-31). Las notas se
              convierten automáticamente a la escala literal oficial (AD, A, B, C).
            </span>
          </div>

          {/* Tabla interactiva de Notas */}
          {libro.estudiantes.length === 0 ? (
            <EmptyState
              title="No hay estudiantes en la sección"
              description="No se encontraron estudiantes matriculados en esta sección."
            />
          ) : (
            <div className="bg-card overflow-x-auto rounded-xl border shadow-2xs">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-muted/60 text-muted-foreground border-b font-semibold">
                    <th className="bg-muted/80 sticky left-0 z-10 w-20 p-3">Código</th>
                    <th className="bg-muted/80 sticky left-20 z-10 min-w-44 p-3">Estudiante</th>
                    {libro.tareas.map((t) => (
                      <th key={t.id} className="max-w-36 min-w-28 p-3 text-center">
                        <div className="text-foreground truncate font-semibold" title={t.titulo}>
                          {t.titulo}
                        </div>
                        <div className="text-muted-foreground text-[10px] font-normal uppercase">
                          {t.tipo}
                        </div>
                      </th>
                    ))}
                    <th className="bg-muted/40 min-w-20 p-3 text-center font-bold">Promedio</th>
                    <th className="bg-muted/50 min-w-20 p-3 text-center font-bold">Literal</th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {libro.estudiantes.map((est) => (
                    <tr key={est.matriculaId} className="hover:bg-muted/30 transition-colors">
                      <td className="text-muted-foreground bg-card sticky left-0 z-10 p-3 font-mono">
                        {est.codigo}
                      </td>
                      <td className="bg-card sticky left-20 z-10 p-3 font-medium">
                        {est.estudianteNombre}
                      </td>
                      {libro.tareas.map((t) => {
                        const info = est.notasPorTarea[t.id];
                        const notaNum = info?.nota;
                        return (
                          <td key={t.id} className="p-3 text-center font-mono">
                            {notaNum !== null && notaNum !== undefined ? (
                              <span
                                className={`font-semibold ${
                                  notaNum >= 14
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : notaNum >= 11
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {notaNum.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/50 text-[11px]">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="bg-muted/20 p-3 text-center font-mono text-sm font-black">
                        {est.notaFinal.toFixed(2)}
                      </td>
                      <td className="bg-muted/30 p-3 text-center font-bold">
                        <StatusBadge
                          tone={
                            est.notaLiteral === "AD"
                              ? "success"
                              : est.notaLiteral === "A"
                                ? "brand"
                                : est.notaLiteral === "B"
                                  ? "warning"
                                  : "danger"
                          }
                        >
                          {est.notaLiteral}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </PageState>
  );
}
