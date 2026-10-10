"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/common/select";

import {
  useAnularMatriculaMutation,
  useCambiarSeccionMutation,
  useRetirarMatriculaMutation,
  useTrasladarMatriculaMutation,
} from "../../hooks";
import { useSeccionesQuery } from "@/features/secciones";
import type { Seccion } from "@/features/secciones/types";
import type { MatriculaItem } from "../../types";

export type OperacionMatriculaTipo = "retirar" | "trasladar" | "cambiar-seccion" | "anular" | null;

interface OperacionMatriculaFormProps {
  matricula: MatriculaItem;
  tipo: Exclude<OperacionMatriculaTipo, null>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function OperacionMatriculaForm({
  matricula,
  tipo,
  onSuccess,
  onCancel,
}: OperacionMatriculaFormProps) {
  const [fecha, setFecha] = React.useState(new Date().toISOString().split("T")[0]);
  const [motivo, setMotivo] = React.useState("");
  const [colegioDestino, setColegioDestino] = React.useState("");
  const [nuevaSeccionId, setNuevaSeccionId] = React.useState("");

  const { data: seccionesData } = useSeccionesQuery();

  const retirarMutation = useRetirarMatriculaMutation(onSuccess);
  const trasladarMutation = useTrasladarMatriculaMutation(onSuccess);
  const cambiarSeccionMutation = useCambiarSeccionMutation(onSuccess);
  const anularMutation = useAnularMatriculaMutation(onSuccess);

  // Secciones disponibles del mismo grado para cambio de sección
  const seccionesMismoGrado = React.useMemo(() => {
    if (!seccionesData || !matricula) return [];
    return (seccionesData as Seccion[])
      .filter(
        (s: Seccion) =>
          s.gradoId === matricula.gradoId && s.id !== matricula.seccionId && s.estado === "activa",
      )
      .map((s: Seccion) => {
        const disponibles = s.vacantes - s.matriculados;
        return {
          value: s.id,
          label: `Sección ${s.nombre}`,
          description: `${disponibles} vacantes libres`,
          disabled: disponibles <= 0,
        };
      });
  }, [seccionesData, matricula]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tipo === "retirar") {
      if (!fecha) return toast.error("La fecha de retiro es obligatoria.");
      if (!motivo.trim()) return toast.error("El motivo de retiro es obligatorio.");
      retirarMutation.mutate({
        id: matricula.id,
        payload: { fechaRetiro: fecha, motivoRetiro: motivo.trim() },
      });
    } else if (tipo === "trasladar") {
      if (!fecha) return toast.error("La fecha de traslado es obligatoria.");
      if (!colegioDestino.trim()) return toast.error("El colegio de destino es obligatorio.");
      trasladarMutation.mutate({
        id: matricula.id,
        payload: {
          fechaRetiro: fecha,
          colegioDestino: colegioDestino.trim(),
          motivo: motivo.trim() || undefined,
        },
      });
    } else if (tipo === "cambiar-seccion") {
      if (!nuevaSeccionId) return toast.error("Seleccione la sección de destino.");
      cambiarSeccionMutation.mutate({
        id: matricula.id,
        payload: { nuevaSeccionId, motivo: motivo.trim() || "Cambio de sección a solicitud" },
      });
    } else if (tipo === "anular") {
      anularMutation.mutate(matricula.id);
    }
  };

  const isPending =
    retirarMutation.isPending ||
    trasladarMutation.isPending ||
    cambiarSeccionMutation.isPending ||
    anularMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Resumen del estudiante */}
      <div className="border-border/70 bg-muted/40 space-y-1 rounded-xl border p-3 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estudiante:</span>
          <span className="text-foreground font-semibold">
            {matricula.estudiante.apellidos}, {matricula.estudiante.nombres}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Grado y Sección:</span>
          <span className="text-foreground font-medium">
            {matricula.gradoNombre} - {matricula.seccionNombre}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Código de Matrícula:</span>
          <span className="text-primary font-mono font-semibold">{matricula.codigo}</span>
        </div>
      </div>

      {/* Operación: Retiro */}
      {tipo === "retirar" && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Fecha de Retiro <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="h-10 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Motivo del Retiro <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Ej: Cambio de domicilio, motivos familiares..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="h-10 text-xs"
              required
            />
          </div>

          <p className="text-muted-foreground rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-[11px] dark:text-amber-400">
            Al registrar el retiro, las credenciales de marcación escolar y el acceso al portal del
            alumno se desactivarán automáticamente.
          </p>
        </>
      )}

      {/* Operación: Traslado */}
      {tipo === "trasladar" && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Fecha de Traslado <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="h-10 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Colegio de Destino <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Nombre oficial de la I.E. de destino..."
              value={colegioDestino}
              onChange={(e) => setColegioDestino(e.target.value)}
              className="h-10 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Motivo (Opcional)</Label>
            <Input
              placeholder="Anotaciones complementarias del traslado..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="h-10 text-xs"
            />
          </div>

          <p className="text-muted-foreground rounded-xl border border-purple-500/20 bg-purple-500/10 p-2.5 text-[11px] dark:text-purple-300">
            El traslado liberará la vacante en la sección actual y revocará el acceso institucional
            del estudiante.
          </p>
        </>
      )}

      {/* Operación: Cambiar Sección */}
      {tipo === "cambiar-seccion" && (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            Nueva Sección ({matricula.gradoNombre}) <span className="text-destructive">*</span>
          </Label>
          <SelectOption
            options={seccionesMismoGrado}
            value={nuevaSeccionId}
            onSelect={(val) => setNuevaSeccionId(val)}
            placeholder="Seleccionar nueva sección..."
            searchPlaceholder="Buscar sección..."
            className="h-10 text-xs"
          />
          {seccionesMismoGrado.length === 0 && (
            <p className="text-destructive text-[11px]">
              No hay otras secciones activas en este grado para realizar el cambio.
            </p>
          )}
        </div>
      )}

      {/* Operación: Anular Matrícula */}
      {tipo === "anular" && (
        <div className="border-destructive/20 bg-destructive/10 text-destructive space-y-2 rounded-xl border p-3.5 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
            <span>Confirmación de Anulación</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Esta acción eliminará el registro de matrícula por haberse realizado por error. Solo se
            permite si el estudiante{" "}
            <strong>no tiene asistencias registradas ni notas de tareas</strong> en el sistema.
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="border-border/40 flex justify-end gap-2 border-t pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
          className="h-9 rounded-full px-4 text-xs"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant={tipo === "anular" ? "destructive" : "default"}
          size="sm"
          disabled={isPending}
          className="h-9 rounded-full px-4 text-xs shadow-xs"
        >
          {isPending
            ? "Procesando..."
            : tipo === "anular"
              ? "Confirmar Anulación"
              : tipo === "retirar"
                ? "Confirmar Retiro"
                : tipo === "trasladar"
                  ? "Confirmar Traslado"
                  : "Confirmar Cambio"}
        </Button>
      </div>
    </form>
  );
}
