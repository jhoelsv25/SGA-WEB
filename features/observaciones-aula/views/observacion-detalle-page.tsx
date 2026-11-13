"use client";

import * as React from "react";
import Link from "next/link";
import { Task01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/formatters/date";
import {
  Campo,
  EstadoObservacionBadge,
  ListaCompromisos,
  ModalCancelar,
  ModalCorregirCalificacion,
  ModalReobservacion,
  ModalReprogramar,
  PanelCalificacion,
  PanelNotas,
  PanelProtocolo,
  PanelRetroalimentacion,
  ResumenNiveles,
} from "../components";
import { MENU_OBSERVACIONES_AULA } from "../consts";
import { useActorObservacion, useDetalleObservacion, useIniciarObservacion } from "../hooks";
import type { Calificacion, DetalleObservacion } from "../types";
import { descripcionCurso, horaActual, horaCorta, nombreDocente } from "../utils";

function IniciarObservacion({ id }: { id: string }) {
  const iniciar = useIniciarObservacion();
  const [horaInicio, setHoraInicio] = React.useState(horaActual);
  const [estudiantes, setEstudiantes] = React.useState("");
  const [error, setError] = React.useState<string>();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const cantidad = Number(estudiantes);
    if (!horaInicio || estudiantes === "" || !Number.isInteger(cantidad) || cantidad < 0) {
      setError("Indique la hora de inicio y los estudiantes presentes.");
      return;
    }
    setError(undefined);
    iniciar.mutate({ id, horaInicio, estudiantesPresentes: cantidad });
  };

  return (
    <form
      onSubmit={enviar}
      className="border-border/70 space-y-3 rounded-2xl border p-4"
      noValidate
    >
      <h2 className="text-base font-semibold">Iniciar la observación</h2>
      <p className="text-muted-foreground text-sm">Solo se puede iniciar el día programado.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo id="ini-hora" etiqueta="Hora de inicio *">
          <Input
            id="ini-hora"
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            disabled={iniciar.isPending}
          />
        </Campo>
        <Campo id="ini-estudiantes" etiqueta="Estudiantes presentes *" error={error}>
          <Input
            id="ini-estudiantes"
            type="number"
            inputMode="numeric"
            min={0}
            max={200}
            value={estudiantes}
            onChange={(e) => setEstudiantes(e.target.value)}
            disabled={iniciar.isPending}
          />
        </Campo>
      </div>
      <Button type="submit" className="min-h-11 gap-2" disabled={iniciar.isPending}>
        {iniciar.isPending && <Spinner className="size-4" />}
        Iniciar y abrir ficha de notas
      </Button>
    </form>
  );
}

function Historial({ detalle }: { detalle: DetalleObservacion }) {
  const versiones = detalle.historialCalificaciones.filter((c) => c.version > 1);
  if (detalle.cambios.length === 0 && versiones.length === 0 && !detalle.comentario) return null;
  return (
    <section aria-labelledby="titulo-historial" className="space-y-3">
      <h2 id="titulo-historial" className="text-base font-semibold">
        Historial
      </h2>
      <ul className="space-y-2 text-sm">
        {detalle.cambios.map((c) => (
          <li key={c.id} className="bg-muted/40 rounded-xl p-3">
            <p className="font-medium">
              {c.tipo === "reprogramacion"
                ? `Reprogramada: ${formatDate(c.fechaAnterior)} → ${formatDate(c.fechaNueva)}`
                : "Cancelada"}
            </p>
            <p className="text-muted-foreground">{c.motivo}</p>
          </li>
        ))}
        {versiones.map((c) => (
          <li key={c.id} className="bg-muted/40 rounded-xl p-3">
            <p className="font-medium">
              Desempeño {c.desempeno}: versión {c.version}, nivel {c.nivel}
            </p>
            {c.motivoCambio && <p className="text-muted-foreground">{c.motivoCambio}</p>}
          </li>
        ))}
        {detalle.comentario && (
          <li className="bg-muted/40 rounded-xl p-3">
            <p className="font-medium">Comentario del docente</p>
            <p className="text-muted-foreground">{detalle.comentario.texto}</p>
          </li>
        )}
      </ul>
    </section>
  );
}

function Contenido({ detalle }: { detalle: DetalleObservacion }) {
  const actor = useActorObservacion();
  const { observacion: obs } = detalle;
  const esObservador = actor.esAdministrador || obs.observadorUsuarioId === actor.usuarioId;
  const [reprogramar, setReprogramar] = React.useState(false);
  const [cancelar, setCancelar] = React.useState(false);
  const [reobservar, setReobservar] = React.useState(false);
  const [aCorregir, setACorregir] = React.useState<Calificacion | null>(null);
  const cerradas = ["notas_cerradas", "calificada", "retroalimentada"].includes(obs.estado);

  return (
    <div className="space-y-6">
      <div className="border-border/70 bg-card grid gap-3 rounded-2xl border p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-xs">Docente</p>
          <p className="font-medium">{nombreDocente(obs)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Curso y sección</p>
          <p className="font-medium">{descripcionCurso(obs)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Fecha y hora</p>
          <p className="font-medium">
            {formatDate(obs.fecha)} · {horaCorta(obs.horaInicioProgramada)} a{" "}
            {horaCorta(obs.horaFinProgramada)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Observador</p>
          <p className="font-medium">{obs.observadorNombre}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Bimestre</p>
          <p className="font-medium">{obs.periodoNombre}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Estado</p>
          <EstadoObservacionBadge estado={obs.estado} />
          {obs.vencida && (
            <span className="text-destructive ml-2 text-xs font-medium">Vencida</span>
          )}
        </div>
        {obs.minutosTotales !== null && (
          <div>
            <p className="text-muted-foreground text-xs">Duración real</p>
            <p className="font-medium">
              {obs.minutosTotales} min · {obs.estudiantesPresentes ?? "-"} estudiantes
            </p>
          </div>
        )}
        {obs.observacionAnteriorId && (
          <div>
            <p className="text-muted-foreground text-xs">Reobservación de</p>
            <Link
              href={`${MENU_OBSERVACIONES_AULA}/${obs.observacionAnteriorId}`}
              className="text-primary font-medium underline"
            >
              Ver observación anterior
            </Link>
          </div>
        )}
      </div>

      {obs.estado === "cancelada" && (
        <p
          role="note"
          className="border-destructive/30 bg-destructive/10 rounded-xl border p-3 text-sm"
        >
          Observación cancelada: {obs.motivoCancelacion ?? "sin motivo registrado"}.
        </p>
      )}

      {obs.estado === "programada" && (
        <div className="space-y-4">
          {esObservador && <IniciarObservacion id={obs.id} />}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => setReprogramar(true)}
            >
              Reprogramar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => setCancelar(true)}
            >
              Cancelar observación
            </Button>
          </div>
        </div>
      )}

      {obs.estado === "en_observacion" && esObservador && (
        <PanelNotas
          observacion={obs}
          desempenos={detalle.instrumento.desempenos}
          notas={detalle.notas}
        />
      )}
      {obs.estado === "en_observacion" && !esObservador && (
        <p className="text-muted-foreground text-sm">
          La observación está en curso. Solo el observador asignado toma las notas.
        </p>
      )}

      {obs.estado === "notas_cerradas" && esObservador && <PanelCalificacion observacion={obs} />}
      {obs.estado === "notas_cerradas" && !esObservador && (
        <p className="text-muted-foreground text-sm">Pendiente de calificar por el observador.</p>
      )}

      {cerradas && detalle.calificaciones.length > 0 && (
        <section aria-labelledby="titulo-niveles" className="space-y-3">
          <h2 id="titulo-niveles" className="text-base font-semibold">
            Niveles por desempeño
          </h2>
          <ResumenNiveles
            calificaciones={detalle.calificaciones}
            onCorregir={actor.puedeCorregir ? setACorregir : undefined}
          />
        </section>
      )}

      {obs.estado === "calificada" && esObservador && (
        <PanelRetroalimentacion
          observacion={obs}
          calificaciones={detalle.calificaciones}
          compromisos={detalle.compromisos}
        />
      )}
      {obs.estado === "calificada" && !esObservador && (
        <p className="text-muted-foreground text-sm">
          Pendiente de retroalimentación por el observador.
        </p>
      )}

      {obs.estado === "retroalimentada" && (
        <>
          <section aria-labelledby="titulo-reunion" className="space-y-2">
            <h2 id="titulo-reunion" className="text-base font-semibold">
              Reunión de retroalimentación
            </h2>
            <p className="text-sm">
              {formatDate(obs.retroFecha)} · {horaCorta(obs.retroHoraInicio)} a{" "}
              {horaCorta(obs.retroHoraFin)}
            </p>
            <p className="text-muted-foreground text-sm">{obs.retroResumen}</p>
            <p className="text-muted-foreground text-xs">
              {obs.enteradoEn
                ? `El docente se dio por enterado el ${formatDate(obs.enteradoEn)}.`
                : "El docente aún no se dio por enterado."}
            </p>
          </section>
          <section aria-labelledby="titulo-compromisos" className="space-y-3">
            <h2 id="titulo-compromisos" className="text-base font-semibold">
              Compromisos de mejora
            </h2>
            <ListaCompromisos
              compromisos={detalle.compromisos}
              puedeCerrar={esObservador}
              onSugerirReobservacion={() => setReobservar(true)}
            />
            {esObservador && (
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => setReobservar(true)}
              >
                Programar reobservación
              </Button>
            )}
          </section>
          <PanelProtocolo
            observacionId={obs.id}
            archivos={detalle.archivos}
            puedeSubir={esObservador}
          />
        </>
      )}

      {cerradas && detalle.notas.length > 0 && (
        <section aria-labelledby="titulo-notas-ro" className="space-y-3">
          <h2 id="titulo-notas-ro" className="text-base font-semibold">
            Notas de la observación
          </h2>
          <ul className="space-y-2 text-sm">
            {detalle.notas.map((n) => (
              <li key={n.id} className="bg-muted/40 rounded-xl p-3">
                <span className="font-medium">D{n.desempeno}:</span> {n.texto}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Historial detalle={detalle} />

      <ModalReprogramar id={obs.id} abierto={reprogramar} onOpenChange={setReprogramar} />
      <ModalCancelar id={obs.id} abierto={cancelar} onOpenChange={setCancelar} />
      <ModalReobservacion id={obs.id} abierto={reobservar} onOpenChange={setReobservar} />
      <ModalCorregirCalificacion
        observacionId={obs.id}
        calificacion={aCorregir}
        onOpenChange={(abierto) => !abierto && setACorregir(null)}
      />
    </div>
  );
}

export function ObservacionDetallePage({ id }: { id: string }) {
  const { data, isLoading, isError, error, refetch } = useDetalleObservacion(id);
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-2 duration-300">
      <PageHeader
        title="Observación de aula"
        description="Toma de notas, calificación y retroalimentación."
        icon={Task01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Observaciones de aula", href: MENU_OBSERVACIONES_AULA },
          { label: "Detalle" },
        ]}
      />
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
      >
        {data && <Contenido detalle={data} />}
      </PageState>
    </div>
  );
}
