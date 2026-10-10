"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LockKeyIcon, Note01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMatriculasQuery } from "@/features/matriculas/hooks";
import { useCrearObservacionMutation } from "../hooks";
import type { TipoObservacion } from "../types";

interface ModalCrearObservacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMatriculaId?: string;
}

export function ModalCrearObservacion({
  open,
  onOpenChange,
  defaultMatriculaId,
}: ModalCrearObservacionProps) {
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
  const matriculas = matriculasData?.data ?? [];

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setObservacion("");
      setSeguimiento("");
      setDerivadoA("");
      setEsConfidencial(false);
    }
    onOpenChange(newOpen);
  };

  const crearMutation = useCrearObservacionMutation({
    onSuccess: () => {
      handleClose(false);
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Note01Icon} className="text-primary" />
              Nueva Observación Formativa / Tutorial
            </DialogTitle>
            <DialogDescription>
              Registre acompañamiento pedagógico, socioemocional o acuerdos con la familia.
            </DialogDescription>
          </DialogHeader>

          {/* Selector de Estudiante */}
          <div className="space-y-2">
            <Label htmlFor="obs-estudiante">Estudiante</Label>
            <Select
              value={matriculaId}
              onValueChange={setMatriculaId}
              disabled={isLoadingMatriculas || Boolean(defaultMatriculaId)}
            >
              <SelectTrigger id="obs-estudiante">
                <SelectValue placeholder="Seleccione un estudiante..." />
              </SelectTrigger>
              <SelectContent className="max-h-[220px]">
                {matriculas.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.estudiante.apellidos}, {m.estudiante.nombres} ({m.gradoNombre}{" "}
                    {m.seccionNombre})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              />
            </div>

            {/* Tipo de Observación */}
            <div className="space-y-2">
              <Label htmlFor="obs-tipo">Área / Tipo</Label>
              <Select value={tipo} onValueChange={(val) => setTipo(val as TipoObservacion)}>
                <SelectTrigger id="obs-tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academica">Académica</SelectItem>
                  <SelectItem value="conductual">Conductual</SelectItem>
                  <SelectItem value="socioemocional">Socioemocional</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                  <SelectItem value="familiar">Familiar</SelectItem>
                </SelectContent>
              </Select>
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
            <Switch checked={esConfidencial} onCheckedChange={setEsConfidencial} />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={crearMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={crearMutation.isPending}>
              {crearMutation.isPending ? "Guardando..." : "Guardar Observación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
