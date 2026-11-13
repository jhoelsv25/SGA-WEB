"use client";

import Link from "next/link";
import { Task01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import { MENU_MIS_OBSERVACIONES } from "../consts";
import { useMisObservaciones } from "../hooks";

/** Vista del docente: avisos de próximas visitas y observaciones ya retroalimentadas. */
export function MisObservacionesPage() {
  const { data, isLoading, isError, error, refetch } = useMisObservaciones();
  const vacio = data && data.proximas.length === 0 && data.retroalimentadas.length === 0;

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-2 duration-300">
      <PageHeader
        title="Mis observaciones"
        description="Avisos de visitas a su aula y sus observaciones una vez retroalimentadas."
        icon={Task01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Mis observaciones" },
        ]}
      />
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={Boolean(vacio)}
        empty={{
          title: "Aún no tiene observaciones",
          description: "Cuando se programe una visita a su aula, la verá aquí.",
        }}
      >
        {data && (
          <div className="space-y-8">
            {data.proximas.length > 0 && (
              <section aria-labelledby="titulo-proximas" className="space-y-3">
                <h2 id="titulo-proximas" className="text-base font-semibold">
                  Próximas visitas
                </h2>
                <ul className="space-y-2">
                  {data.proximas.map((p) => (
                    <li
                      key={p.id}
                      className="border-border/80 bg-card rounded-2xl border p-4 text-sm"
                    >
                      <p className="font-medium">
                        {formatDate(p.fecha)} a las {p.hora}
                      </p>
                      <p className="text-muted-foreground">
                        {p.curso} · {p.grado} {p.seccion} · Observador: {p.observador}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {data.retroalimentadas.length > 0 && (
              <section aria-labelledby="titulo-retro-mias" className="space-y-3">
                <h2 id="titulo-retro-mias" className="text-base font-semibold">
                  Observaciones retroalimentadas
                </h2>
                <ul className="space-y-3">
                  {data.retroalimentadas.map((o) => {
                    const pendientes = o.compromisos.filter((c) => c.estado === "pendiente").length;
                    return (
                      <li
                        key={o.id}
                        className="border-border/80 bg-card flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">
                            {formatDate(o.fecha)} · {o.curso}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {o.grado} {o.seccion} · Observador: {o.observador}
                          </p>
                          <p className="text-xs">
                            {pendientes > 0
                              ? `${pendientes} compromiso(s) pendiente(s)`
                              : "Sin compromisos pendientes"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {o.enteradoEn ? (
                            <StatusBadge tone="success">Enterado</StatusBadge>
                          ) : (
                            <StatusBadge tone="warning">Sin enterar</StatusBadge>
                          )}
                          <Button asChild variant="outline" className="min-h-10">
                            <Link href={`${MENU_MIS_OBSERVACIONES}/${o.id}`}>Ver</Link>
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        )}
      </PageState>
    </div>
  );
}
