"use client";

import * as React from "react";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { PageState } from "@/components/common/page-state";
import { formatDate } from "@/lib/formatters/date";
import { useMisNotas } from "../hooks";
import type { CursoNotasEstudiante, TareaEstudianteNota } from "../types";

export function MisNotasTab({ periodoId }: { periodoId?: string }) {
  const { data: notas = [], isLoading, isError, error, refetch } = useMisNotas(periodoId);

  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => void refetch()}
      errorTitle="No se pudieron cargar sus calificaciones"
    >
      {notas.length === 0 ? (
        <EmptyState
          title="Sin calificaciones registradas"
          description="Aún no hay actividades evaluadas en este periodo escolar."
        />
      ) : (
        <div className="space-y-6">
          {notas.map((item: CursoNotasEstudiante) => (
            <div
              key={item.cursoSeccionId}
              className="bg-card space-y-4 rounded-xl border p-5 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div>
                  <h3 className="text-base font-bold">{item.cursoNombre}</h3>
                  <p className="text-muted-foreground text-xs">
                    {item.seccionNombre} {item.docenteNombre && `· Docente: ${item.docenteNombre}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-mono text-lg font-black">
                      {typeof item.notaFinal === "number" ? item.notaFinal.toFixed(2) : "—"}
                    </span>
                    <span className="text-muted-foreground text-xs"> / 20</span>
                  </div>
                  {item.notaLiteral && (
                    <StatusBadge
                      tone={
                        item.notaLiteral === "AD"
                          ? "success"
                          : item.notaLiteral === "A"
                            ? "brand"
                            : item.notaLiteral === "B"
                              ? "warning"
                              : "danger"
                      }
                    >
                      {item.notaLiteral}
                    </StatusBadge>
                  )}
                </div>
              </div>

              {item.tareas && item.tareas.length > 0 ? (
                <div className="divide-y rounded-lg border">
                  {item.tareas.map((t: TareaEstudianteNota) => (
                    <div
                      key={t.tareaId}
                      className="flex flex-wrap items-center justify-between gap-3 p-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{t.titulo}</span>
                          <StatusBadge tone="neutral">{t.tipo.toUpperCase()}</StatusBadge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Fecha límite: {formatDate(t.fechaLimite)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge
                          tone={
                            t.estadoEntrega === "calificada"
                              ? "success"
                              : t.estadoEntrega === "entregada"
                                ? "brand"
                                : t.estadoEntrega === "devuelta"
                                  ? "warning"
                                  : "neutral"
                          }
                        >
                          {t.estadoEntrega.toUpperCase()}
                        </StatusBadge>
                        <span className="min-w-16 text-right font-mono text-sm font-bold">
                          {t.nota !== null && t.nota !== undefined
                            ? `${Number(t.nota).toFixed(2)} pts`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-xs italic">
                  No hay tareas registradas en este curso.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </PageState>
  );
}
