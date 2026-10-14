"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { LockKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMatriculasQuery } from "@/features/matriculas/hooks";
import { useCrearObservacionMutation } from "../../hooks";
import { OPCIONES_TIPO_OBSERVACION } from "../../constants";
import type { TipoObservacion } from "../../types";

export interface CrearObservacionFormProps {
  defaultMatriculaId?: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function CrearObservacionForm({
  defaultMatriculaId,
  onCancel,
  onSuccess,
}: CrearObservacionFormProps) {
  const todayStr = React.useMemo(() => new Date().toISOString().split("T")[0], []);

  const [matriculaId, setMatriculaId] = React.useState(defaultMatriculaId ?? "");
  const [fecha, setFecha] = React.useState(todayStr);
  const [tipo, setTipo] = React.useState<TipoObservacion>("conductual");
  const [observacion, setObservacion] = React.useState("");
  const [seguimiento, setSeguimiento] = React.useState("");
  const [derivadoA, setDerivadoA] = React.useState("");
  const [esConfidencial, setEsConfidencial] = React.useState(false);

  // Carga de estudiantes
  const { data: matriculasData, isLoading: isLoadingMatriculas } = useMatriculasQuery({
    limit: 100,
    estado: "matriculado",
  });

  const opcionesEstudiantes = React.useMemo(() => {
    return (matriculasData?.data ?? []).map((m) => ({
      value: m.id,
      label: `${m.estudiante.apellidos}, ${m.estudiante.nombres} (${m.gradoNombre} ${m.seccionNombre})`,
    }));
  }, [matriculasData?.data]);

  const crearMutation = useCrearObservacionMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matriculaId || !observacion.trim() || !fecha) return;

    crearMutation.mutate({
      matriculaId,
      fecha,
      tipo,
      observacion: observacion.trim(),
      seguimiento: seguimiento.trim() || undefined,
      derivadoA: derivadoA.trim() || undefined,
      esConfidencial,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      {/* Selector de Estudiante */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Estudiante</Label>
        <SelectOption
          value={matriculaId}
          onSelect={setMatriculaId}
          options={opcionesEstudiantes}
          placeholder="Seleccione un estudiante..."
          disabled={isLoadingMatriculas || Boolean(defaultMatriculaId) || crearMutation.isPending}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Fecha */}
        <div className="space-y-2">
          <Label htmlFor="obs-fecha">Fecha</Label>
          <Input
            id="obs-fecha"
            type="date"
            max={todayStr}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            disabled={crearMutation.isPending}
          />
        </div>

        {/* Tipo de Observación */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Área / Tipo</Label>
          <SelectOption
            value={tipo}
            onSelect={(val: TipoObservacion) => setTipo(val)}
            options={OPCIONES_TIPO_OBSERVACION}
            placeholder="Seleccionar área..."
            disabled={crearMutation.isPending}
          />
        </div>
      </div>

      {/* Observación */}
      <div className="space-y-2">
        <Label htmlFor="obs-texto">Observación</Label>
        <Textarea
          id="obs-texto"
          placeholder="Detalle los hallazgos del acompañamiento tutorial o psicopedagógico..."
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          required
          rows={3}
          maxLength={2000}
          disabled={crearMutation.isPending}
        />
      </div>

      {/* Seguimiento */}
      <div className="space-y-2">
        <Label htmlFor="obs-seguimiento">Compromisos / Plan de Seguimiento (opcional)</Label>
        <Textarea
          id="obs-seguimiento"
          placeholder="Acciones o acuerdos acordados con el estudiante o apoderado..."
          value={seguimiento}
          onChange={(e) => setSeguimiento(e.target.value)}
          rows={2}
          maxLength={2000}
          disabled={crearMutation.isPending}
        />
      </div>

      {/* Derivado a */}
      <div className="space-y-2">
        <Label htmlFor="obs-derivado">Derivado a (opcional)</Label>
        <Input
          id="obs-derivado"
          placeholder="Ej. Departamento de Psicología, DEMUNA, Centro de Salud..."
          value={derivadoA}
          onChange={(e) => setDerivadoA(e.target.value)}
          maxLength={100}
          disabled={crearMutation.isPending}
        />
      </div>

      {/* Switch de Confidencialidad */}
      <div className="border-border bg-muted/30 flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <div className="text-foreground flex items-center gap-1.5 text-sm font-medium">
            <HugeiconsIcon
              icon={LockKeyIcon}
              className="h-4 w-4 text-purple-600 dark:text-purple-400"
            />
            Marcar como confidencial
          </div>
          <p className="text-muted-foreground text-xs">
            Solo podrán leerla el autor, el tutor de aula, el director, el apoderado y el
            estudiante.
          </p>
        </div>
        <Switch
          checked={esConfidencial}
          onCheckedChange={setEsConfidencial}
          disabled={crearMutation.isPending}
        />
      </div>

      <div className="flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={crearMutation.isPending}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={crearMutation.isPending || !matriculaId || !observacion.trim()}
          className="gap-2"
        >
          {crearMutation.isPending && <Spinner className="size-4" />}
          {crearMutation.isPending ? "Guardando..." : "Guardar Observación"}
        </Button>
      </div>
    </form>
  );
}
