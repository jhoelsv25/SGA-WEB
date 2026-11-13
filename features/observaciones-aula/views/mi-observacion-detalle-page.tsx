"use client";

import * as React from "react";
import { Task01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Spinner } from "@/components/common/spinner";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/formatters/date";
import { Campo, ResumenNiveles } from "../components";
import { MENU_MIS_OBSERVACIONES } from "../consts";
import { useComentarObservacion, useMarcarEnterado, useMiObservacion } from "../hooks";
import type { MiObservacionDetalle } from "../types";
import { horaCorta } from "../utils";

function Comentario({ id, detalle }: { id: string; detalle: MiObservacionDetalle }) {
  const comentar = useComentarObservacion();
  const [texto, setTexto] = React.useState("");
  const [error, setError] = React.useState<string>();

  if (detalle.comentario) {
    return (
      <div className="bg-muted/40 rounded-xl p-3 text-sm">
        <p className="font-medium">Su comentario</p>
        <p className="text-muted-foreground">{detalle.comentario.texto}</p>
      </div>
    );
  }
  if (!detalle.puedeComentar) {
    return (
      <p className="text-muted-foreground text-sm">
        {detalle.fechaLimiteComentario
          ? `El plazo para dejar su comentario venció el ${formatDate(detalle.fechaLimiteComentario)}.`
          : "Ya no puede dejar un comentario."}
      </p>
    );
  }
  return (
    <form
      noValidate
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!texto.trim()) {
          setError("Escriba su comentario.");
          return;
        }
        setError(undefined);
        comentar.mutate({ id, texto: texto.trim() });
      }}
    >
      <Campo
        id="mi-comentario"
        etiqueta="Su comentario (una sola vez)"
        error={error}
        ayuda={
          detalle.fechaLimiteComentario
            ? `Puede comentar hasta el ${formatDate(detalle.fechaLimiteComentario)}. No cambia la calificación.`
            : "No cambia la calificación."
        }
      >
        <Textarea
          id="mi-comentario"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={1000}
          rows={4}
          disabled={comentar.isPending}
        />
      </Campo>
      <Button type="submit" className="min-h-11 gap-2" disabled={comentar.isPending}>
        {comentar.isPending && <Spinner className="size-4" />}
        Enviar comentario
      </Button>
    </form>
  );
}

function Contenido({ id, detalle }: { id: string; detalle: MiObservacionDetalle }) {
  const enterado = useMarcarEnterado();
  const { observacion: o } = detalle;
  const completa = o.estado === "retroalimentada";

  return (
    <div className="space-y-6">
      <div className="border-border/70 bg-card grid gap-3 rounded-2xl border p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-xs">Fecha y hora</p>
          <p className="font-medium">
            {formatDate(o.fecha)} a las {o.hora}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Curso</p>
          <p className="font-medium">
            {o.curso} · {o.grado} {o.seccion}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Observador</p>
          <p className="font-medium">{o.observador}</p>
        </div>
        {o.estado === "cancelada" && (
          <div>
            <p className="text-muted-foreground text-xs">Estado</p>
            <p className="font-medium">
              Cancelada{o.motivoCancelacion ? `: ${o.motivoCancelacion}` : ""}
            </p>
          </div>
        )}
      </div>

      {completa && (
        <>
          {o.reunion?.fecha && (
            <section aria-labelledby="mi-reunion" className="space-y-1">
              <h2 id="mi-reunion" className="text-base font-semibold">
                Reunión de retroalimentación
              </h2>
              <p className="text-sm">
                {formatDate(o.reunion.fecha)} · {horaCorta(o.reunion.horaInicio)} a{" "}
                {horaCorta(o.reunion.horaFin)}
              </p>
              <p className="text-muted-foreground text-sm">{o.reunion.resumen}</p>
            </section>
          )}
          <section aria-labelledby="mi-niveles" className="space-y-3">
            <h2 id="mi-niveles" className="text-base font-semibold">
              Niveles por desempeño
            </h2>
            <ResumenNiveles calificaciones={detalle.calificaciones ?? []} />
          </section>
          {(detalle.evidencias?.length ?? 0) > 0 && (
            <section aria-labelledby="mi-evidencias" className="space-y-3">
              <h2 id="mi-evidencias" className="text-base font-semibold">
                Evidencias observadas
              </h2>
              <ul className="space-y-2 text-sm">
                {detalle.evidencias?.map((e, i) => (
                  <li key={`${e.desempeno}-${i}`} className="bg-muted/40 rounded-xl p-3">
                    <span className="font-medium">D{e.desempeno}:</span> {e.texto}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section aria-labelledby="mi-compromisos" className="space-y-3">
            <h2 id="mi-compromisos" className="text-base font-semibold">
              Compromisos de mejora
            </h2>
            {(detalle.compromisos?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground text-sm">No se acordaron compromisos.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {detalle.compromisos?.map((c) => (
                  <li
                    key={c.compromisoId}
                    className="border-border/70 bg-card space-y-1 rounded-xl border p-3"
                  >
                    <p>
                      <span className="font-medium">D{c.desempeno}:</span> {c.descripcion}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Revisión: {formatDate(c.fechaRevision)}
                    </p>
                    <StatusBadge
                      tone={
                        c.estado === "cumplido"
                          ? "success"
                          : c.estado === "no_cumplido"
                            ? "danger"
                            : c.vencido
                              ? "danger"
                              : "warning"
                      }
                    >
                      {c.estado === "cumplido"
                        ? "Cumplido"
                        : c.estado === "no_cumplido"
                          ? "No cumplido"
                          : c.vencido
                            ? "Revisión vencida"
                            : "Pendiente"}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section aria-labelledby="mi-enterado" className="space-y-3">
            <h2 id="mi-enterado" className="text-base font-semibold">
              Su respuesta
            </h2>
            {o.enteradoEn ? (
              <p className="text-sm">Se dio por enterado el {formatDate(o.enteradoEn)}.</p>
            ) : (
              <Button
                type="button"
                className="min-h-11 gap-2"
                disabled={enterado.isPending}
                onClick={() => enterado.mutate(id)}
              >
                {enterado.isPending && <Spinner className="size-4" />}
                Me doy por enterado
              </Button>
            )}
            <Comentario id={id} detalle={detalle} />
          </section>
        </>
      )}
    </div>
  );
}

export function MiObservacionDetallePage({ id }: { id: string }) {
  const { data, isLoading, isError, error, refetch } = useMiObservacion(id);
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-2 duration-300">
      <PageHeader
        title="Mi observación"
        description="Resultado de la visita a su aula."
        icon={Task01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Mis observaciones", href: MENU_MIS_OBSERVACIONES },
          { label: "Detalle" },
        ]}
      />
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
      >
        {data && <Contenido id={id} detalle={data} />}
      </PageState>
    </div>
  );
}
