"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon } from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import type { FilaEstudianteLibro, TipoTarea } from "../../../types";

interface TareaColumna {
  id: string;
  titulo: string;
  tipo: TipoTarea;
  fechaLimite: string;
}

interface LibroNotasTablaProps {
  cursoSeccionId: string;
  tareas: TareaColumna[];
  estudiantes: FilaEstudianteLibro[];
}

export function LibroNotasTabla({ cursoSeccionId, tareas, estudiantes }: LibroNotasTablaProps) {
  // Cálculo de promedios por cada tarea para el pie de tabla
  const promediosPorTarea = React.useMemo(() => {
    const mapa: Record<string, { suma: number; cuenta: number }> = {};
    for (const t of tareas) {
      mapa[t.id] = { suma: 0, cuenta: 0 };
    }

    for (const est of estudiantes) {
      for (const t of tareas) {
        const nota = est.notasPorTarea[t.id]?.nota;
        if (typeof nota === "number" && !isNaN(nota)) {
          mapa[t.id].suma += nota;
          mapa[t.id].cuenta += 1;
        }
      }
    }

    const resultados: Record<string, number | null> = {};
    for (const t of tareas) {
      const item = mapa[t.id];
      resultados[t.id] = item && item.cuenta > 0 ? item.suma / item.cuenta : null;
    }
    return resultados;
  }, [tareas, estudiantes]);

  // Promedio general de toda la sección
  const promedioGeneral = React.useMemo(() => {
    if (estudiantes.length === 0) return 0;
    const suma = estudiantes.reduce((acc, est) => acc + (est.notaFinal || 0), 0);
    return suma / estudiantes.length;
  }, [estudiantes]);

  return (
    <div className="bg-card overflow-hidden rounded-2xl border shadow-xs">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-muted/70 text-muted-foreground border-b font-semibold">
              {/* Sticky Izquierda: Código */}
              <th className="bg-muted sticky left-0 z-20 w-24 min-w-[90px] p-3 text-left">
                Código
              </th>

              {/* Sticky Izquierda: Estudiante (con sombra divisoria) */}
              <th className="bg-muted border-border/80 sticky left-24 z-20 min-w-[200px] border-r p-3 text-left shadow-[3px_0_6px_-2px_rgba(0,0,0,0.06)] dark:shadow-[3px_0_6px_-2px_rgba(0,0,0,0.3)]">
                Estudiante
              </th>

              {/* Tareas dinámicas en el centro (scrollables) */}
              {tareas.map((t) => (
                <th
                  key={t.id}
                  className="w-32 max-w-[140px] min-w-[120px] p-2.5 text-center transition-colors"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
                      {t.tipo}
                    </span>
                    <Link
                      href={`/admin/aula-virtual/${cursoSeccionId}/tareas/${t.id}`}
                      className="group text-foreground hover:text-primary line-clamp-2 flex items-center justify-center gap-1 text-center font-bold transition-colors"
                      title={`${t.titulo} (clic para calificar)`}
                    >
                      <span>{t.titulo}</span>
                      <HugeiconsIcon
                        icon={Link01Icon}
                        size={11}
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </Link>
                  </div>
                </th>
              ))}

              {/* Sticky Derecha: Promedio (con sombra divisoria) */}
              <th className="bg-muted border-border/80 sticky right-20 z-20 w-20 min-w-[80px] border-l p-3 text-center font-bold shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.06)] dark:shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.3)]">
                Promedio
              </th>

              {/* Sticky Derecha: Literal */}
              <th className="bg-muted sticky right-0 z-20 w-20 min-w-[80px] p-3 text-center font-bold">
                Literal
              </th>
            </tr>
          </thead>

          <tbody className="divide-border/60 divide-y">
            {estudiantes.map((est) => (
              <tr key={est.matriculaId} className="hover:bg-muted/40 transition-colors">
                {/* Sticky Izquierda: Código */}
                <td className="bg-card text-muted-foreground sticky left-0 z-10 p-3 font-mono text-[11px]">
                  {est.codigo || "—"}
                </td>

                {/* Sticky Izquierda: Estudiante */}
                <td className="bg-card border-border/80 text-foreground sticky left-24 z-10 max-w-[220px] truncate border-r p-3 font-semibold shadow-[3px_0_6px_-2px_rgba(0,0,0,0.06)] dark:shadow-[3px_0_6px_-2px_rgba(0,0,0,0.3)]">
                  <span title={est.estudianteNombre}>{est.estudianteNombre}</span>
                </td>

                {/* Celdas de Notas de Tareas */}
                {tareas.map((t) => {
                  const info = est.notasPorTarea[t.id];
                  const notaNum = info?.nota;

                  return (
                    <td key={t.id} className="p-2.5 text-center font-mono">
                      {notaNum !== null && notaNum !== undefined ? (
                        <Link
                          href={`/admin/aula-virtual/${cursoSeccionId}/tareas/${t.id}`}
                          className={`inline-block text-xs font-bold hover:underline ${
                            notaNum >= 14
                              ? "text-emerald-600 dark:text-emerald-400"
                              : notaNum >= 11
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-rose-600 dark:text-rose-400"
                          }`}
                          title={`Nota: ${notaNum.toFixed(1)}`}
                        >
                          {notaNum.toFixed(1)}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground/40 text-[11px]">—</span>
                      )}
                    </td>
                  );
                })}

                {/* Sticky Derecha: Promedio */}
                <td className="bg-card border-border/80 text-foreground sticky right-20 z-10 border-l p-3 text-center font-mono text-sm font-black shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.06)] dark:shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.3)]">
                  {est.notaFinal.toFixed(2)}
                </td>

                {/* Sticky Derecha: Literal */}
                <td className="bg-card sticky right-0 z-10 p-3 text-center">
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

          {/* Fila de Promedios de la Clase */}
          <tfoot>
            <tr className="bg-muted/80 text-foreground border-t-2 text-xs font-bold">
              <td className="bg-muted sticky left-0 z-20 p-3">Promedio</td>
              <td className="bg-muted border-border/80 sticky left-24 z-20 border-r p-3 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.06)] dark:shadow-[3px_0_6px_-2px_rgba(0,0,0,0.3)]">
                Promedio de aula ({estudiantes.length} alumnos)
              </td>

              {/* Promedios por tarea */}
              {tareas.map((t) => {
                const prom = promediosPorTarea[t.id];
                return (
                  <td key={t.id} className="p-2.5 text-center font-mono">
                    {prom !== null && prom !== undefined ? (
                      <span
                        className={`font-black ${
                          prom >= 14
                            ? "text-emerald-600 dark:text-emerald-400"
                            : prom >= 11
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {prom.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40 text-[11px]">—</span>
                    )}
                  </td>
                );
              })}

              {/* Promedio General */}
              <td className="bg-muted border-border/80 sticky right-20 z-20 border-l p-3 text-center font-mono text-sm font-black shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.06)] dark:shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.3)]">
                {promedioGeneral.toFixed(2)}
              </td>

              <td className="bg-muted sticky right-0 z-20 p-3 text-center">
                <StatusBadge
                  tone={
                    promedioGeneral >= 17
                      ? "success"
                      : promedioGeneral >= 14
                        ? "brand"
                        : promedioGeneral >= 11
                          ? "warning"
                          : "danger"
                  }
                >
                  {promedioGeneral >= 17
                    ? "AD"
                    : promedioGeneral >= 14
                      ? "A"
                      : promedioGeneral >= 11
                        ? "B"
                        : "C"}
                </StatusBadge>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
