"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAnularMatriculaMutation,
  useCambiarSeccionMutation,
  useRetirarMatriculaMutation,
  useTrasladarMatriculaMutation,
} from "../hooks";
import { useSeccionesQuery } from "@/features/secciones";
import type { Seccion } from "@/features/secciones/types";
import type { MatriculaItem } from "../types";

export type OperacionMatriculaTipo = "retirar" | "trasladar" | "cambiar-seccion" | "anular" | null;

interface ModalOperacionMatriculaProps {
  matricula: MatriculaItem | null;
  tipo: OperacionMatriculaTipo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalOperacionMatricula({
  matricula,
  tipo,
  open,
  onOpenChange,
}: ModalOperacionMatriculaProps) {
  const [fecha, setFecha] = React.useState(new Date().toISOString().split("T")[0]);
  const [motivo, setMotivo] = React.useState("");
  const [colegioDestino, setColegioDestino] = React.useState("");
  const [nuevaSeccionId, setNuevaSeccionId] = React.useState("");

  const { data: seccionesData } = useSeccionesQuery();

  const retirarMutation = useRetirarMatriculaMutation(() => onOpenChange(false));
  const trasladarMutation = useTrasladarMatriculaMutation(() => onOpenChange(false));
  const cambiarSeccionMutation = useCambiarSeccionMutation(() => onOpenChange(false));
  const anularMutation = useAnularMatriculaMutation(() => onOpenChange(false));

  // Filtrar secciones del mismo grado (regla HU3)
  const seccionesMismoGrado = React.useMemo(() => {
    if (!seccionesData || !matricula) return [];
    return (seccionesData as Seccion[]).filter(
      (s: Seccion) =>
        s.gradoId === matricula.gradoId && s.id !== matricula.seccionId && s.estado === "activa",
    );
  }, [seccionesData, matricula]);

  if (!matricula || !tipo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tipo === "retirar") {
      if (!motivo.trim()) {
        toast.error("Indique el motivo del retiro.");
        return;
      }
      retirarMutation.mutate({
        id: matricula.id,
        payload: { fechaRetiro: fecha, motivoRetiro: motivo.trim() },
      });
    } else if (tipo === "trasladar") {
      if (!colegioDestino.trim()) {
        toast.error("Indique el colegio de destino.");
        return;
      }
      trasladarMutation.mutate({
        id: matricula.id,
        payload: {
          fechaRetiro: fecha,
          colegioDestino: colegioDestino.trim(),
          motivo: motivo.trim() || undefined,
        },
      });
    } else if (tipo === "cambiar-seccion") {
      if (!nuevaSeccionId) {
        toast.error("Seleccione la nueva sección del mismo grado.");
        return;
      }
      if (!motivo.trim()) {
        toast.error("Indique el motivo del cambio de sección.");
        return;
      }
      cambiarSeccionMutation.mutate({
        id: matricula.id,
        payload: { nuevaSeccionId, motivo: motivo.trim() },
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tipo === "retirar" && "Retiro de Estudiante"}
            {tipo === "trasladar" && "Traslado a Otro Colegio"}
            {tipo === "cambiar-seccion" && "Cambio de Sección (Mismo Grado)"}
            {tipo === "anular" && "¿Anular Matrícula Registrada por Error?"}
          </DialogTitle>
          <DialogDescription>
            Estudiante:{" "}
            <strong className="text-foreground">
              {matricula.estudiante.apellidos}, {matricula.estudiante.nombres}
            </strong>{" "}
            ({matricula.gradoNombre} &quot;{matricula.seccionNombre}&quot;)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {tipo === "anular" ? (
            <div className="text-muted-foreground space-y-2 text-sm">
              <p>
                Esta acción eliminará la matrícula y liberará la vacante en{" "}
                {matricula.seccionNombre}.
              </p>
              <div className="bg-destructive/10 text-destructive rounded-md border p-3 text-xs">
                <strong>Regla de integridad:</strong> Solo se puede anular si el estudiante aún no
                registra asistencias ni entregas de tareas. Si ya cuenta con actividad, debe
                registrarse como Retirado.
              </div>
            </div>
          ) : (
            <>
              {/* Fecha para Retiro o Traslado */}
              {(tipo === "retirar" || tipo === "trasladar") && (
                <div className="space-y-1">
                  <Label htmlFor="fecha-op">Fecha de Salida</Label>
                  <Input
                    id="fecha-op"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                  <p className="text-muted-foreground text-[11px]">
                    A partir de esta fecha se desactiva su cuenta y credencial de marcación.
                  </p>
                </div>
              )}

              {/* Colegio de destino para traslado */}
              {tipo === "trasladar" && (
                <div className="space-y-1">
                  <Label htmlFor="col-dest">
                    Colegio de Destino <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="col-dest"
                    placeholder="Ej. I.E. Emblemática Melitón Carvajal"
                    value={colegioDestino}
                    onChange={(e) => setColegioDestino(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Nueva sección para cambio de sección */}
              {tipo === "cambiar-seccion" && (
                <div className="space-y-1">
                  <Label htmlFor="sec-dest">Nueva Sección ({matricula.gradoNombre})</Label>
                  <Select value={nuevaSeccionId} onValueChange={setNuevaSeccionId}>
                    <SelectTrigger id="sec-dest">
                      <SelectValue placeholder="Seleccione sección destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {seccionesMismoGrado.map((sec: Seccion) => (
                        <SelectItem key={sec.id} value={sec.id}>
                          Sección &quot;{sec.nombre}&quot; (Vacantes libres:{" "}
                          {sec.vacantes - sec.matriculados})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {seccionesMismoGrado.length === 0 && (
                    <p className="text-destructive text-xs">
                      No hay otras secciones activas con vacantes en este grado.
                    </p>
                  )}
                </div>
              )}

              {/* Motivo para retiro, traslado o cambio */}
              <div className="space-y-1">
                <Label htmlFor="motivo-op">
                  Motivo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="motivo-op"
                  placeholder={
                    tipo === "cambiar-seccion"
                      ? "Ej. Ajuste de convivencia o afinidad horaria"
                      : "Ej. Cambio de domicilio familiar"
                  }
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={tipo === "anular" || tipo === "retirar" ? "destructive" : "default"}
              disabled={isPending}
            >
              {isPending ? "Procesando..." : "Confirmar Operación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
