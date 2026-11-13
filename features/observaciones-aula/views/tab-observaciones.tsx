"use client";

import * as React from "react";
import Link from "next/link";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import { EstadoObservacionBadge } from "../components";
import { MENU_OBSERVACIONES_AULA, OPCIONES_ESTADO } from "../consts";
import { useObservaciones } from "../hooks";
import type { EstadoObservacion } from "../types";
import { descripcionCurso, horaCorta, nombreDocente } from "../utils";

const TODOS = "todos";

export function TabObservaciones() {
  const [estado, setEstado] = React.useState<string>(TODOS);
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useObservaciones({
    estado: estado === TODOS ? undefined : (estado as EstadoObservacion),
  });
  return (
    <div className="space-y-4">
      <div className="w-full sm:max-w-xs">
        <SelectOption
          options={[{ value: TODOS, label: "Todos los estados" }, ...OPCIONES_ESTADO]}
          value={estado}
          onSelect={setEstado}
        />
      </div>
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={data.length === 0}
        empty={{
          title: "Sin observaciones",
          description:
            estado === TODOS
              ? "Programe la primera desde el cronograma."
              : "No hay observaciones en este estado.",
        }}
      >
        <ul className="space-y-3">
          {data.map((o) => (
            <li
              key={o.id}
              className="border-border/80 bg-card flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold">{nombreDocente(o)}</p>
                <p className="text-muted-foreground text-xs">{descripcionCurso(o)}</p>
                <p className="text-xs">
                  {formatDate(o.fecha)} · {horaCorta(o.horaInicioProgramada)} · Observador:{" "}
                  {o.observadorNombre}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {o.vencida && <span className="text-destructive text-xs font-medium">Vencida</span>}
                <EstadoObservacionBadge estado={o.estado} />
                <Button asChild variant="outline" className="min-h-10">
                  <Link href={`${MENU_OBSERVACIONES_AULA}/${o.id}`}>Abrir</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </PageState>
    </div>
  );
}
