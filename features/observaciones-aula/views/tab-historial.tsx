"use client";

import * as React from "react";
import Link from "next/link";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { formatDate } from "@/lib/formatters/date";
import { ETIQUETA_EVOLUCION, MENU_OBSERVACIONES_AULA, NIVEL_ROMANO } from "../consts";
import { useCronograma, useHistorialDocente } from "../hooks";

const DESEMPENOS = [1, 2, 3, 4, 5];

/** Evolución de cada desempeño del docente a lo largo del año. */
export function TabHistorial() {
  const { data: cronograma } = useCronograma();
  const [docenteId, setDocenteId] = React.useState<string | undefined>();
  const { data, isLoading, isError, error, refetch } = useHistorialDocente(docenteId);

  return (
    <div className="space-y-4">
      <div className="w-full sm:max-w-sm">
        <SelectOption
          options={(cronograma?.docentes ?? []).map((d) => ({
            value: d.docenteId,
            label: d.docenteNombre,
          }))}
          value={docenteId}
          onSelect={setDocenteId}
          placeholder="Elija al docente"
          searchPlaceholder="Buscar docente"
        />
      </div>
      {!docenteId ? (
        <p className="text-muted-foreground text-sm">Elija un docente para ver su historial.</p>
      ) : (
        <PageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
        >
          {data && data.observaciones.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {data.mensaje ?? "Este docente aún no tiene observaciones calificadas."}
            </p>
          ) : (
            <div className="border-border/80 bg-card overflow-x-auto rounded-2xl border">
              <table className="w-full text-sm">
                <caption className="sr-only">Niveles por observación y su evolución</caption>
                <thead className="bg-muted/50 text-left text-xs">
                  <tr>
                    <th scope="col" className="p-3">
                      Fecha
                    </th>
                    <th scope="col" className="p-3">
                      Observador
                    </th>
                    {DESEMPENOS.map((d) => (
                      <th key={d} scope="col" className="p-3 text-center">
                        D{d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.observaciones.map((o) => (
                    <tr key={o.observacionId} className="border-border/60 border-t">
                      <th scope="row" className="p-3 text-left font-medium">
                        <Link
                          href={`${MENU_OBSERVACIONES_AULA}/${o.observacionId}`}
                          className="text-primary underline"
                        >
                          {formatDate(o.fecha)}
                        </Link>
                      </th>
                      <td className="p-3">{o.observador}</td>
                      {DESEMPENOS.map((d) => {
                        const nivel = o.niveles[d];
                        const evolucion = o.evolucion?.[d];
                        return (
                          <td key={d} className="p-3 text-center">
                            {nivel ? NIVEL_ROMANO[nivel] : "-"}
                            {evolucion && (
                              <span className="text-muted-foreground block text-[11px]">
                                {ETIQUETA_EVOLUCION[evolucion]}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PageState>
      )}
    </div>
  );
}
