"use client";

import * as React from "react";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { guardarArchivoEnNavegador } from "@/features/consolidado-docente";
import { toast } from "@/lib/toast";
import { descargarMatrizExcel } from "../api";
import { NIVELES, NIVEL_ROMANO } from "../consts";
import { useMatriz } from "../hooks";
import { Dato } from "./tab-cronograma";

const TODOS = "todos";
const DESEMPENOS = [1, 2, 3, 4, 5];

/** Último nivel vigente de cada docente por desempeño, con exportación a Excel. */
export function TabMatriz() {
  const [nivel, setNivel] = React.useState(TODOS);
  const [desempeno, setDesempeno] = React.useState(TODOS);
  const [descargando, setDescargando] = React.useState(false);
  const filtros = {
    nivel: nivel === TODOS ? undefined : Number(nivel),
    desempeno: desempeno === TODOS ? undefined : Number(desempeno),
  };
  const { data, isLoading, isError, error, refetch } = useMatriz(filtros);

  const exportar = async () => {
    setDescargando(true);
    try {
      guardarArchivoEnNavegador(await descargarMatrizExcel(filtros));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo exportar el Excel.");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-[14rem]">
          <SelectOption
            options={[
              { value: TODOS, label: "Todos los niveles" },
              ...NIVELES.map((n) => ({
                value: String(n.nivel),
                label: `Nivel ${n.romano} · ${n.nombre}`,
              })),
            ]}
            value={nivel}
            onSelect={setNivel}
          />
        </div>
        <div className="w-full sm:max-w-[14rem]">
          <SelectOption
            options={[
              { value: TODOS, label: "Todos los desempeños" },
              ...DESEMPENOS.map((d) => ({ value: String(d), label: `Desempeño ${d}` })),
            ]}
            value={desempeno}
            onSelect={setDesempeno}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="min-h-10 gap-2 sm:ml-auto"
          disabled={descargando}
          onClick={() => void exportar()}
        >
          {descargando && <Spinner className="size-4" />}
          Exportar a Excel
        </Button>
      </div>
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={data?.matriz.length === 0}
        empty={{ title: "Sin resultados", description: "Ningún docente coincide con los filtros." }}
      >
        {data && (
          <>
            <div className="border-border/70 bg-card grid gap-3 rounded-2xl border p-4 sm:grid-cols-3">
              <Dato
                etiqueta="Observaciones realizadas"
                valor={String(data.cobertura.total.realizadas)}
              />
              <Dato etiqueta="Meta del año" valor={String(data.cobertura.total.meta)} />
              <Dato
                etiqueta="Cobertura de la meta"
                valor={`${data.cobertura.total.porcentaje} %`}
              />
            </div>
            <div className="border-border/80 bg-card overflow-x-auto rounded-2xl border">
              <table className="w-full text-sm">
                <caption className="sr-only">Nivel vigente de cada docente por desempeño</caption>
                <thead className="bg-muted/50 text-left text-xs">
                  <tr>
                    <th scope="col" className="p-3">
                      Docente
                    </th>
                    {DESEMPENOS.map((d) => (
                      <th key={d} scope="col" className="p-3 text-center">
                        D{d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.matriz.map((fila) => (
                    <tr key={fila.docenteId} className="border-border/60 border-t">
                      <th scope="row" className="p-3 text-left font-medium">
                        {fila.docenteNombre}
                      </th>
                      {DESEMPENOS.map((d) => {
                        const celda = fila.niveles[d];
                        return (
                          <td key={d} className="p-3 text-center">
                            {celda ? (
                              NIVEL_ROMANO[celda.nivel]
                            ) : (
                              <span className="text-muted-foreground">Sin calificar</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </PageState>
    </div>
  );
}
