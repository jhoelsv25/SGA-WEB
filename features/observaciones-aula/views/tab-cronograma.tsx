"use client";

import { PageState } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { useCronograma } from "../hooks";

/** Cobertura por docente: realizadas, programadas y meta del año. */
export function TabCronograma({ onProgramar }: { onProgramar: (docenteId: string) => void }) {
  const { data, isLoading, isError, error, refetch } = useCronograma();
  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => void refetch()}
      isEmpty={data?.docentes.length === 0}
      empty={{ title: "No hay docentes activos", description: "Aún no hay a quién observar." }}
    >
      {data && (
        <div className="space-y-4">
          <div className="border-border/70 bg-card grid gap-3 rounded-2xl border p-4 sm:grid-cols-4">
            <Dato etiqueta="Meta por docente" valor={String(data.meta)} />
            <Dato etiqueta="Realizadas" valor={String(data.total.realizadas)} />
            <Dato etiqueta="Programadas" valor={String(data.total.programadas)} />
            <Dato etiqueta="Cobertura de la meta" valor={`${data.total.porcentaje} %`} />
          </div>
          <div className="border-border/80 bg-card overflow-x-auto rounded-2xl border">
            <table className="w-full text-sm">
              <caption className="sr-only">Cobertura de observaciones por docente</caption>
              <thead className="bg-muted/50 text-left text-xs">
                <tr>
                  <th scope="col" className="p-3">
                    Docente
                  </th>
                  <th scope="col" className="p-3 text-right">
                    Realizadas
                  </th>
                  <th scope="col" className="p-3 text-right">
                    Programadas
                  </th>
                  <th scope="col" className="p-3 text-right">
                    Faltan para la meta
                  </th>
                  <th scope="col" className="p-3 text-right">
                    Faltan por programar
                  </th>
                  <th scope="col" className="p-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.docentes.map((d) => (
                  <tr key={d.docenteId} className="border-border/60 border-t">
                    <th scope="row" className="p-3 text-left font-medium">
                      {d.docenteNombre}
                    </th>
                    <td className="p-3 text-right">{d.realizadas}</td>
                    <td className="p-3 text-right">{d.programadas}</td>
                    <td className="p-3 text-right">{d.faltanParaMeta}</td>
                    <td className="p-3 text-right">{d.faltanPorProgramar}</td>
                    <td className="p-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="min-h-10 text-xs"
                        onClick={() => onProgramar(d.docenteId)}
                      >
                        Programar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageState>
  );
}

export function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{etiqueta}</p>
      <p className="text-xl font-semibold">{valor}</p>
    </div>
  );
}
