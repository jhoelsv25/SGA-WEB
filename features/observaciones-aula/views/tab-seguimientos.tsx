"use client";

import Link from "next/link";
import { PageState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import { MENU_OBSERVACIONES_AULA } from "../consts";
import { useSeguimientos } from "../hooks";

/** Compromisos de mejora cuya fecha de revisión llegó. */
export function TabSeguimientos() {
  const { data = [], isLoading, isError, error, refetch } = useSeguimientos();
  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => void refetch()}
      isEmpty={data.length === 0}
      empty={{
        title: "Sin seguimientos por revisar",
        description: "No hay compromisos con la revisión vencida o de hoy.",
      }}
    >
      <ul className="space-y-3">
        {data.map((c) => (
          <li
            key={c.id}
            className="border-border/80 bg-card flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                {c.docenteApellido}, {c.docenteNombre} · Desempeño {c.desempeno}
              </p>
              <p className="text-sm">{c.descripcion}</p>
              <p className="text-muted-foreground text-xs">
                Revisión: {formatDate(c.fechaRevision)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {c.vencido && <StatusBadge tone="danger">Vencido</StatusBadge>}
              <Button asChild variant="outline" className="min-h-10">
                <Link href={`${MENU_OBSERVACIONES_AULA}/${c.observacionId}`}>
                  Abrir observación
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </PageState>
  );
}
