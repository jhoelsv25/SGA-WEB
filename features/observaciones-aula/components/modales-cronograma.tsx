"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { SelectOption } from "@/components/common/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCargaDocenteQuery } from "@/features/carga-academica/hooks";
import {
  useCancelarObservacion,
  useCronograma,
  useProgramarObservacion,
  useProgramarReobservacion,
  useReprogramarObservacion,
} from "../hooks";
import { Campo, MensajeError, PieFormulario } from "./campo";

interface Cierre {
  onOpenChange: (abierto: boolean) => void;
}

// ------------------------------------------------------------------ programar
function FormularioProgramar({
  onOpenChange,
  docenteInicial,
}: Cierre & { docenteInicial?: string }) {
  const { data: cronograma, isLoading: cargandoDocentes } = useCronograma();
  const programar = useProgramarObservacion();
  const [docenteId, setDocenteId] = React.useState<string | undefined>(docenteInicial);
  const [cursoSeccionId, setCursoSeccionId] = React.useState<string | undefined>();
  const [fecha, setFecha] = React.useState("");
  const [horaInicio, setHoraInicio] = React.useState("");
  const [errores, setErrores] = React.useState<Record<string, string>>({});
  const { data: carga, isLoading: cargandoCursos } = useCargaDocenteQuery(
    docenteId ?? "",
    Boolean(docenteId),
  );

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const nuevos: Record<string, string> = {};
    if (!docenteId) nuevos.docente = "Elija al docente.";
    if (!cursoSeccionId) nuevos.curso = "Elija el curso y la sección.";
    if (!fecha) nuevos.fecha = "Indique la fecha.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0 || !docenteId || !cursoSeccionId) return;
    programar.mutate(
      { docenteId, cursoSeccionId, fecha, horaInicio: horaInicio || undefined },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <Campo id="obs-docente" etiqueta="Docente *" error={errores.docente}>
        <SelectOption
          options={(cronograma?.docentes ?? []).map((d) => ({
            value: d.docenteId,
            label: d.docenteNombre,
          }))}
          value={docenteId}
          onSelect={(valor) => {
            setDocenteId(valor);
            setCursoSeccionId(undefined);
          }}
          placeholder={cargandoDocentes ? "Cargando docentes..." : "Elija al docente"}
          searchPlaceholder="Buscar docente"
          disabled={cargandoDocentes || programar.isPending}
        />
      </Campo>
      <Campo id="obs-curso" etiqueta="Curso y sección *" error={errores.curso}>
        <SelectOption
          options={(carga?.cursos ?? []).map((c) => ({
            value: c.cursoSeccionId,
            label: `${c.cursoNombre} · ${c.gradoNumero}.° ${c.seccionNombre}`,
          }))}
          value={cursoSeccionId}
          onSelect={setCursoSeccionId}
          placeholder={
            !docenteId
              ? "Primero elija al docente"
              : cargandoCursos
                ? "Cargando cursos..."
                : "Elija el curso"
          }
          disabled={!docenteId || cargandoCursos || programar.isPending}
          emptyMessage="El docente no tiene cursos asignados."
        />
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="obs-fecha" etiqueta="Fecha *" error={errores.fecha}>
          <Input
            id="obs-fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            disabled={programar.isPending}
            aria-invalid={Boolean(errores.fecha)}
          />
        </Campo>
        <Campo
          id="obs-hora"
          etiqueta="Hora de inicio (opcional)"
          ayuda="Solo si el docente dicta el curso en varios bloques ese día."
        >
          <Input
            id="obs-hora"
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            disabled={programar.isPending}
          />
        </Campo>
      </div>
      <p className="text-muted-foreground text-xs">
        El observador será usted. Se avisará al docente con la anticipación que fija el sistema.
      </p>
      <PieFormulario
        onCancelar={() => onOpenChange(false)}
        textoEnviar="Programar"
        cargando={programar.isPending}
      />
    </form>
  );
}

export function ModalProgramar({
  abierto,
  onOpenChange,
  docenteInicial,
}: Cierre & { abierto: boolean; docenteInicial?: string }) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Programar observación de aula"
      description="Elija al docente, el curso y la fecha. Debe coincidir con su horario."
      size="lg"
    >
      {abierto && (
        <FormularioProgramar onOpenChange={onOpenChange} docenteInicial={docenteInicial} />
      )}
    </Modal>
  );
}

// ------------------------------------------------------------------ reprogramar
function FormularioReprogramar({ id, onOpenChange }: Cierre & { id: string }) {
  const reprogramar = useReprogramarObservacion();
  const [fecha, setFecha] = React.useState("");
  const [horaInicio, setHoraInicio] = React.useState("");
  const [motivo, setMotivo] = React.useState("");
  const [errores, setErrores] = React.useState<Record<string, string>>({});

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const nuevos: Record<string, string> = {};
    if (!fecha) nuevos.fecha = "Indique la nueva fecha.";
    if (!motivo.trim()) nuevos.motivo = "Indique el motivo.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    reprogramar.mutate(
      { id, fecha, horaInicio: horaInicio || undefined, motivo: motivo.trim() },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="rep-fecha" etiqueta="Nueva fecha *" error={errores.fecha}>
          <Input
            id="rep-fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            disabled={reprogramar.isPending}
          />
        </Campo>
        <Campo id="rep-hora" etiqueta="Hora de inicio (opcional)">
          <Input
            id="rep-hora"
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            disabled={reprogramar.isPending}
          />
        </Campo>
      </div>
      <Campo id="rep-motivo" etiqueta="Motivo *" error={errores.motivo}>
        <Textarea
          id="rep-motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          maxLength={500}
          disabled={reprogramar.isPending}
        />
      </Campo>
      <PieFormulario
        onCancelar={() => onOpenChange(false)}
        textoEnviar="Reprogramar"
        cargando={reprogramar.isPending}
      />
    </form>
  );
}

export function ModalReprogramar({
  id,
  abierto,
  onOpenChange,
}: Cierre & { id: string; abierto: boolean }) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Reprogramar observación"
      description="Se avisará al docente de la nueva fecha. Queda en el historial."
    >
      {abierto && <FormularioReprogramar id={id} onOpenChange={onOpenChange} />}
    </Modal>
  );
}

// ------------------------------------------------------------------ cancelar
function FormularioCancelar({ id, onOpenChange }: Cierre & { id: string }) {
  const cancelar = useCancelarObservacion();
  const [motivo, setMotivo] = React.useState("");
  const [error, setError] = React.useState<string>();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!motivo.trim()) {
      setError("Indique el motivo.");
      return;
    }
    setError(undefined);
    cancelar.mutate({ id, motivo: motivo.trim() }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <Campo id="can-motivo" etiqueta="Motivo *" error={error}>
        <Textarea
          id="can-motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          maxLength={500}
          disabled={cancelar.isPending}
        />
      </Campo>
      <PieFormulario
        onCancelar={() => onOpenChange(false)}
        textoEnviar="Cancelar observación"
        cargando={cancelar.isPending}
      />
    </form>
  );
}

export function ModalCancelar({
  id,
  abierto,
  onOpenChange,
}: Cierre & { id: string; abierto: boolean }) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Cancelar observación"
      description="La observación no se borra: queda cancelada con su motivo en el historial."
    >
      {abierto && <FormularioCancelar id={id} onOpenChange={onOpenChange} />}
    </Modal>
  );
}

// ------------------------------------------------------------------ reobservación
function FormularioReobservacion({ id, onOpenChange }: Cierre & { id: string }) {
  const reobservar = useProgramarReobservacion();
  const [fecha, setFecha] = React.useState("");
  const [horaInicio, setHoraInicio] = React.useState("");
  const [error, setError] = React.useState<string>();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!fecha) {
      setError("Indique la fecha.");
      return;
    }
    setError(undefined);
    reobservar.mutate(
      { id, fecha, horaInicio: horaInicio || undefined },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="reo-fecha" etiqueta="Fecha *" error={error}>
          <Input
            id="reo-fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            disabled={reobservar.isPending}
          />
        </Campo>
        <Campo id="reo-hora" etiqueta="Hora de inicio (opcional)">
          <Input
            id="reo-hora"
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            disabled={reobservar.isPending}
          />
        </Campo>
      </div>
      {reobservar.isError && <MensajeError>{reobservar.error.message}</MensajeError>}
      <PieFormulario
        onCancelar={() => onOpenChange(false)}
        textoEnviar="Programar reobservación"
        cargando={reobservar.isPending}
      />
    </form>
  );
}

export function ModalReobservacion({
  id,
  abierto,
  onOpenChange,
}: Cierre & { id: string; abierto: boolean }) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Programar reobservación"
      description="Una nueva visita enlazada a esta observación, con el mismo docente y curso."
    >
      {abierto && <FormularioReobservacion id={id} onOpenChange={onOpenChange} />}
    </Modal>
  );
}
