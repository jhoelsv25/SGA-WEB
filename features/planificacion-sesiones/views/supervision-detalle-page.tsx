"use client";

import * as React from "react";
import Link from "next/link";
import { File02Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VistaDocumento } from "../components";
import { useComentarPlanificacion, useDocumento, usePlanificacionSupervision } from "../hooks";

/** El supervisor ve la sesión planificada y deja comentarios; no la edita. */
export function SupervisionDetallePage({ id }: { id: string }) {
  const plan = usePlanificacionSupervision(id);
  const documento = useDocumento(id, true);
  const comentar = useComentarPlanificacion(id);
  const [texto, setTexto] = React.useState("");

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-2 duration-300">
      <PageHeader
        title="Sesión planificada"
        description="Solo lectura. Puede dejar un comentario al docente."
        icon={File02Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Sesiones de hoy", href: "/admin/sesiones-hoy" },
          { label: "Planificación" },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/sesiones-hoy">Volver</Link>
          </Button>
        }
      />
      <PageState
        isLoading={plan.isLoading}
        isError={plan.isError}
        error={plan.error}
        onRetry={() => void plan.refetch()}
      >
        {plan.data && (
          <div className="space-y-6">
            <p className="text-sm">
              {plan.data.docenteNombre} · {plan.data.bloque.cursoNombre} ·{" "}
              {plan.data.bloque.gradoNombre} {plan.data.bloque.seccionNombre}
            </p>
            {documento.data && <VistaDocumento doc={documento.data} />}
            <section className="space-y-3">
              <h2 className="text-base font-semibold">Comentarios</h2>
              <ul className="space-y-1 text-sm">
                {plan.data.comentarios.map((c) => (
                  <li key={c.id}>
                    <span className="font-medium">{c.autor}:</span> {c.texto}
                  </li>
                ))}
                {plan.data.comentarios.length === 0 && (
                  <li className="text-muted-foreground">Aún no hay comentarios.</li>
                )}
              </ul>
              <Textarea
                rows={3}
                aria-label="Nuevo comentario"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <Button
                disabled={!texto.trim() || comentar.isPending}
                onClick={() => comentar.mutate(texto.trim(), { onSuccess: () => setTexto("") })}
              >
                Enviar comentario
              </Button>
            </section>
          </div>
        )}
      </PageState>
    </div>
  );
}
