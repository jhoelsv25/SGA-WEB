"use client";

import * as React from "react";
import { CheckmarkCircle02Icon, FileEditIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { ModalTexto } from "./components";
import {
  useAprobarJustificacion,
  useJustificacionesSolicitadas,
  useRechazarJustificacion,
} from "./hooks";
import type { Sesion } from "./types";

const fechaCorta = (iso: string): string => iso.slice(0, 10).split("-").reverse().join("/");

export function JustificacionesSesionPage() {
  const { data = [], isLoading, isError, error, refetch } = useJustificacionesSolicitadas();
  const aprobar = useAprobarJustificacion();
  const rechazar = useRechazarJustificacion();
  const [aRechazar, setARechazar] = React.useState<Sesion | null>(null);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Justificaciones de sesiones"
        description="Sesiones no cumplidas cuya justificación pidió el docente."
        icon={CheckmarkCircle02Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Justificaciones de sesiones" },
        ]}
      />
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron cargar las justificaciones"
        isEmpty={data.length === 0}
        empty={{
          title: "No hay justificaciones por revisar",
          description: "Cuando un docente solicite una, aparecerá aquí.",
          icon: CheckmarkCircle02Icon,
        }}
      >
        <ul className="space-y-3">
          {data.map((s) => (
            <li key={s.id} className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-semibold">{s.docenteNombre}</p>
                  <p className="text-muted-foreground text-sm">
                    {fechaCorta(s.fecha)} · {s.horaInicio}–{s.horaFin} · {s.cursoNombre} ·{" "}
                    {s.seccionNombre}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Motivo:</span> {s.justificacion?.motivo}
                  </p>
                  {s.justificacion?.documentoUrl && (
                    <a
                      href={s.justificacion.documentoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-sm font-medium underline"
                    >
                      Ver documento
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-10"
                    onClick={() => setARechazar(s)}
                  >
                    Rechazar
                  </Button>
                  <Button
                    type="button"
                    className="min-h-10 gap-2"
                    disabled={aprobar.isPending}
                    onClick={() => aprobar.mutate(s.id)}
                  >
                    {aprobar.isPending && aprobar.variables === s.id && (
                      <Spinner className="size-4" />
                    )}
                    Aprobar
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </PageState>

      <ModalTexto
        abierto={Boolean(aRechazar)}
        clave={aRechazar?.id ?? ""}
        onOpenChange={(abierto) => !abierto && setARechazar(null)}
        titulo="Rechazar justificación"
        descripcion={
          aRechazar ? `${aRechazar.docenteNombre} · ${fechaCorta(aRechazar.fecha)}` : undefined
        }
        icono={FileEditIcon}
        etiqueta="Comentario"
        placeholder="Ej. No presentó documento"
        mensajeRequerido="Indique el motivo del rechazo."
        textoBoton="Rechazar"
        pendiente={rechazar.isPending}
        onEnviar={({ texto }) =>
          aRechazar &&
          rechazar.mutate(
            { id: aRechazar.id, comentario: texto },
            { onSuccess: () => setARechazar(null) },
          )
        }
      />
    </div>
  );
}
