"use client";

import { EmptyState } from "@/components/common/empty-state";
import { Book01Icon } from "@hugeicons/core-free-icons";
import type { DetalleCursoDocenteIndicadorDto } from "../../types";

export interface MisIndicadoresCursosTablaProps {
  cursos: DetalleCursoDocenteIndicadorDto[];
  className?: string;
}

/**
 * Tabla accesible con el desglose de indicadores (CSP e IGM) por cada curso
 * y sección que tiene asignados el docente en el año lectivo de trabajo.
 */
export function MisIndicadoresCursosTabla({
  cursos,
  className = "",
}: MisIndicadoresCursosTablaProps) {
  if (cursos.length === 0) {
    return (
      <EmptyState
        icon={Book01Icon}
        title="Sin cursos registrados"
        description="No se encontraron cursos asignados a tu usuario en el período seleccionado."
        className={className}
      />
    );
  }

  return (
    <div
      className={`border-border/60 bg-card overflow-hidden rounded-2xl border shadow-xs ${className}`}
    >
      <div className="border-border/60 border-b p-4 sm:p-5">
        <h3 className="text-foreground text-base font-semibold">
          Desglose por asignaturas y secciones
        </h3>
        <p className="text-muted-foreground text-xs">
          Métricas individuales de cada curso para evaluar el avance pedagógico y digital.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table
          className="w-full text-left text-sm"
          role="table"
          aria-label="Tabla de indicadores por curso"
        >
          <thead className="bg-muted/40 text-muted-foreground border-border/60 border-b text-xs font-semibold tracking-wider uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 sm:px-6">
                Curso
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6">
                Grado y Sección
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6">
                CSP (Sesiones)
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6">
                IGM (Materiales)
              </th>
            </tr>
          </thead>
          <tbody className="divide-border/40 divide-y">
            {cursos.map((c) => {
              const valCsp = c.csp.porcentaje;
              const valIgm = c.igm.porcentaje;

              return (
                <tr
                  key={`${c.cursoId}-${c.seccionId}`}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* Nombre del curso */}
                  <td className="px-4 py-3.5 sm:px-6">
                    <div className="text-foreground font-semibold">{c.cursoNombre}</div>
                  </td>

                  {/* Grado y Sección */}
                  <td className="px-4 py-3.5 sm:px-6">
                    <span className="bg-secondary text-secondary-foreground inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium">
                      {c.gradoNombre} {c.seccionNombre}
                    </span>
                  </td>

                  {/* CSP */}
                  <td className="px-4 py-3.5 sm:px-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-foreground font-bold">
                          {c.csp.sinDatos ? "Sin datos" : c.csp.porcentajeTexto}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {c.csp.numerador}/{c.csp.denominador}
                        </span>
                      </div>
                      {/* Mini barra de progreso SVG */}
                      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-[#7A1228] transition-all duration-300 dark:bg-[#A32035]"
                          style={{
                            width: `${Math.max(0, Math.min(100, valCsp ?? 0))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* IGM */}
                  <td className="px-4 py-3.5 sm:px-6">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-foreground font-bold">
                          {c.igm.sinDatos ? "Sin datos" : c.igm.porcentajeTexto}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {c.igm.numerador}/{c.igm.denominador}
                        </span>
                      </div>
                      {/* Mini barra de progreso SVG */}
                      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-[#0F766E] transition-all duration-300 dark:bg-[#14B8A6]"
                          style={{
                            width: `${Math.max(0, Math.min(100, valIgm ?? 0))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
