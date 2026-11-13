"use client";

import * as React from "react";
import { CheckmarkCircle02Icon, FileEditIcon } from "@hugeicons/core-free-icons";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth";
import { formatDate } from "@/lib/formatters/date";
import { DetalleSolicitud, ModalTexto } from "./components";
import {
  esConfirmacionDeTope,
  useAprobarJustificacion,
  useJustificacionesSolicitadas,
  useMotivosJustificacion,
  useRechazarJustificacion,
} from "./hooks";
import type { SolicitudJustificacion } from "./types";

const TODOS = "todos";

/** Quienes resuelven las justificaciones; el Director solo consulta (P-49). */
const ROLES_RESUELVEN = ["Subdirector", "Administrador"];

export function JustificacionesSesionPage() {
  const { data: sesion } = useSession();
  const rolActivo = sesion?.user.activeRoleName ?? sesion?.user.roles?.[0] ?? "";
  const puedeResolver = ROLES_RESUELVEN.includes(rolActivo);
  const [motivo, setMotivo] = React.useState<string>(TODOS);
  const [soloVencidas, setSoloVencidas] = React.useState(false);
  const { data: motivos = [] } = useMotivosJustificacion();
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useJustificacionesSolicitadas({
    motivo: motivo === TODOS ? undefined : motivo,
    vencidas: soloVencidas,
  });
  const aprobar = useAprobarJustificacion();
  const rechazar = useRechazarJustificacion();
  const [aRechazar, setARechazar] = React.useState<SolicitudJustificacion | null>(null);
  const [verDetalle, setVerDetalle] = React.useState<string | null>(null);
  /** Aprobación que superaría el tope de permisos: espera la confirmación del aprobador. */
  const [aConfirmar, setAConfirmar] = React.useState<{
    solicitud: SolicitudJustificacion;
    mensaje: string;
  } | null>(null);

  const hayFiltros = motivo !== TODOS || soloVencidas;

  const aprobarSolicitud = (solicitud: SolicitudJustificacion) =>
    aprobar.mutate(
      { id: solicitud.id },
      {
        onError: (e) => {
          if (esConfirmacionDeTope(e)) setAConfirmar({ solicitud, mensaje: e.message });
        },
      },
    );

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Justificaciones de sesiones"
        description="Sesiones no cumplidas cuya justificación pidió el docente, de la más antigua a la más reciente."
        icon={CheckmarkCircle02Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Justificaciones de sesiones" },
        ]}
      />

      <div className="border-border/80 bg-card flex flex-col gap-3 rounded-2xl border p-3.5 shadow-xs sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SelectOption
            options={[
              { value: TODOS, label: "Todos los motivos" },
              ...motivos.map((m) => ({ value: m.codigo, label: m.etiqueta })),
            ]}
            value={motivo}
            onSelect={setMotivo}
            placeholder="Motivo"
          />
        </div>
        <button
          type="button"
          aria-pressed={soloVencidas}
          onClick={() => setSoloVencidas((v) => !v)}
          className={`min-h-10 rounded-xl border px-3 text-xs font-semibold transition-all ${
            soloVencidas
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-border/80 text-muted-foreground hover:text-foreground"
          }`}
        >
          Solo vencidas
        </button>
        {hayFiltros && (
          <Button
            type="button"
            variant="ghost"
            className="min-h-10 text-xs"
            onClick={() => {
              setMotivo(TODOS);
              setSoloVencidas(false);
            }}
          >
            Quitar filtros
          </Button>
        )}
      </div>

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron cargar las justificaciones"
        isEmpty={data.length === 0}
        empty={{
          title: hayFiltros
            ? "Ninguna solicitud cumple los filtros"
            : "No hay justificaciones por revisar",
          description: hayFiltros
            ? "Pruebe quitando algún filtro."
            : "Cuando un docente solicite una, aparecerá aquí.",
          icon: CheckmarkCircle02Icon,
        }}
      >
        <ul className="space-y-3">
          {data.map((s) => (
            <li key={s.id} className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{s.docenteNombre}</p>
                    {s.vencida && (
                      <StatusBadge tone="danger" size="sm">
                        Vencida
                      </StatusBadge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(s.fecha)} · {s.horaInicio}–{s.horaFin} · {s.cursoNombre} ·{" "}
                    {s.seccionNombre}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Motivo:</span> {s.justificacion?.motivo}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {s.justificacion?.solicitadaEn
                      ? `Solicitada el ${formatDate(s.justificacion.solicitadaEn.slice(0, 10))} · `
                      : ""}
                    {s.antiguedadDias} {s.antiguedadDias === 1 ? "día hábil" : "días hábiles"} sin
                    respuesta
                  </p>
                  {s.justificacion?.documentoUrl ? (
                    <a
                      href={s.justificacion.documentoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-sm font-medium underline"
                    >
                      Ver documento
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-xs">Sin documento adjunto</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="min-h-10 text-xs"
                    aria-expanded={verDetalle === s.id}
                    onClick={() => setVerDetalle((actual) => (actual === s.id ? null : s.id))}
                  >
                    {verDetalle === s.id ? "Ocultar detalle" : "Ver detalle"}
                  </Button>
                  {puedeResolver ? (
                    <>
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
                        onClick={() => aprobarSolicitud(s)}
                      >
                        {aprobar.isPending && aprobar.variables?.id === s.id && (
                          <Spinner className="size-4" />
                        )}
                        Aprobar
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground self-center text-xs">
                      Solo consulta: la resuelve el Subdirector.
                    </p>
                  )}
                </div>
              </div>
              {verDetalle === s.id && (
                <div className="mt-3">
                  <DetalleSolicitud id={s.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </PageState>

      <ConfirmDialog
        open={Boolean(aConfirmar)}
        onOpenChange={(abierto) => !abierto && setAConfirmar(null)}
        title="Superará el tope de permisos personales"
        description={aConfirmar?.mensaje}
        variant="warning"
        confirmText="Aprobar de todos modos"
        cancelText="Cancelar"
        isLoading={aprobar.isPending}
        onConfirm={() => {
          if (!aConfirmar) return;
          aprobar.mutate(
            { id: aConfirmar.solicitud.id, confirmarTope: true },
            { onSuccess: () => setAConfirmar(null) },
          );
        }}
      />

      <ModalTexto
        abierto={Boolean(aRechazar)}
        clave={aRechazar?.id ?? ""}
        onOpenChange={(abierto) => !abierto && setARechazar(null)}
        titulo="Rechazar justificación"
        descripcion={
          aRechazar ? `${aRechazar.docenteNombre} · ${formatDate(aRechazar.fecha)}` : undefined
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
