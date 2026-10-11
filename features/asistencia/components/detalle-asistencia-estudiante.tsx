"use client";

import { PageState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { RESULTADOS_MARCACION_CONFIG } from "@/features/marcaciones/consts";
import { ESTADOS_ASISTENCIA_CONFIG } from "../consts";
import { useAsistenciaEstudiante } from "../hooks";
import type { IncidenciaCurso, RangoFechas } from "../types";

interface DetalleAsistenciaEstudianteProps {
  estudianteId: string;
  rango: RangoFechas;
  /** Si se entrega, las faltas muestran el botón para justificarlas. */
  onJustificar?: (incidencia: IncidenciaCurso, cursoNombre: string) => void;
}

const fechaCorta = (iso: string): string => iso.slice(0, 10).split("-").reverse().join("/");

function Dato({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  return (
    <div className="border-border/60 rounded-xl border p-3">
      <p className="text-muted-foreground text-xs">{etiqueta}</p>
      <p className="text-xl font-extrabold tabular-nums">{valor}</p>
    </div>
  );
}

export function DetalleAsistenciaEstudiante({
  estudianteId,
  rango,
  onJustificar,
}: DetalleAsistenciaEstudianteProps) {
  const { data, isLoading, isError, error, refetch } = useAsistenciaEstudiante(estudianteId, rango);

  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => void refetch()}
      errorTitle="No se pudo cargar la asistencia"
    >
      {data && (
        <div className="space-y-6">
          <section aria-labelledby="titulo-colegio" className="space-y-3">
            <h2 id="titulo-colegio" className="text-base font-bold">
              Asistencia al colegio
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Dato etiqueta="Entradas puntuales" valor={data.colegio.puntuales} />
              <Dato etiqueta="Tardanzas" valor={data.colegio.tardanzas} />
              <Dato etiqueta="Fuera de turno" valor={data.colegio.fueraDeTurno} />
              <Dato etiqueta="Faltas al colegio" valor={data.colegio.faltasAlColegio.length} />
            </div>
            {data.colegio.faltasAlColegio.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Días con falta al colegio">
                {data.colegio.faltasAlColegio.map((dia) => (
                  <li key={dia}>
                    <StatusBadge tone="danger" size="sm">
                      Falta al colegio · {fechaCorta(dia)}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            )}
            {data.colegio.entradas.length > 0 && (
              <ul className="divide-border/60 divide-y text-sm">
                {data.colegio.entradas.map((e) => {
                  const resultado = RESULTADOS_MARCACION_CONFIG[e.resultado];
                  return (
                    <li key={`${e.fecha}-${e.hora}`} className="flex items-center gap-3 py-2">
                      <span className="w-24 font-mono text-xs">{fechaCorta(e.fecha)}</span>
                      <span className="w-14 font-mono text-xs">{e.hora}</span>
                      <StatusBadge tone={resultado.tone} dot size="sm">
                        {resultado.label}
                        {e.minutosTardanza > 0 && ` · ${e.minutosTardanza} min`}
                      </StatusBadge>
                      {e.justificada && (
                        <StatusBadge tone="info" size="sm">
                          Justificada
                        </StatusBadge>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="titulo-cursos" className="space-y-3">
            <h2 id="titulo-cursos" className="text-base font-bold">
              Asistencia por curso
            </h2>
            {data.cursos.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Aún no hay asistencia registrada en clase en este periodo.
              </p>
            ) : (
              data.cursos.map((curso) => (
                <div key={curso.cursoSeccionId} className="border-border/60 rounded-xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{curso.cursoNombre}</h3>
                    <p className="text-muted-foreground text-xs">
                      {curso.totales.presentes} presentes · {curso.totales.tardanzas} tardanzas ·{" "}
                      {curso.totales.faltas} faltas · {curso.totales.faltasJustificadas}{" "}
                      justificadas
                    </p>
                  </div>
                  {curso.incidencias.length > 0 && (
                    <ul className="divide-border/60 mt-2 divide-y text-sm">
                      {curso.incidencias.map((i) => {
                        const estado = ESTADOS_ASISTENCIA_CONFIG[i.estado];
                        return (
                          <li key={i.id} className="flex flex-wrap items-center gap-3 py-2">
                            <span className="w-24 font-mono text-xs">{fechaCorta(i.fecha)}</span>
                            <StatusBadge tone={estado.tone} dot size="sm">
                              {estado.label}
                            </StatusBadge>
                            {i.justificacion && (
                              <span className="text-muted-foreground text-xs">
                                {i.justificacion}
                              </span>
                            )}
                            {onJustificar && i.estado === "falta" && (
                              <Button
                                type="button"
                                variant="outline"
                                className="ml-auto min-h-10"
                                onClick={() => onJustificar(i, curso.cursoNombre)}
                              >
                                Justificar
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </PageState>
  );
}
