"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  UserRemove01Icon,
  ArrowRight01Icon,
  Exchange01Icon,
  Delete02Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
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

  // Filtrar secciones del mismo grado
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

  const configOperacion = {
    retirar: {
      title: "Retiro de Estudiante",
      desc: "Registra la baja definitiva del estudiante. Su cuenta institucional y credencial de acceso quedarán inactivas.",
      icon: UserRemove01Icon,
    },
    trasladar: {
      title: "Traslado a Otra Institución",
      desc: "Registra la transferencia del estudiante a otro colegio. Sus credenciales institucionales serán revocadas.",
      icon: ArrowRight01Icon,
    },
    "cambiar-seccion": {
      title: "Cambio de Sección",
      desc: `Transfiere al estudiante a otra sección paralela de ${matricula.gradoNombre} con vacantes disponibles.`,
      icon: Exchange01Icon,
    },
    anular: {
      title: "¿Anular Matrícula por Error?",
      desc: "Esta acción anula el registro de matrícula y libera la vacante si el estudiante aún no tiene asistencias ni calificaciones.",
      icon: Delete02Icon,
    },
  }[tipo];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={configOperacion.title}
      description={configOperacion.desc}
      icon={configOperacion.icon}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-1">
        {/* Ficha resumida del estudiante */}
        <div className="bg-muted/40 border-border/60 flex items-center justify-between rounded-lg border p-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Estudiante</span>
            <span className="text-foreground font-semibold">
              {matricula.estudiante.apellidos}, {matricula.estudiante.nombres}
            </span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground block text-[11px]">Salón Actual</span>
            <span className="text-foreground font-semibold">
              {matricula.gradoNombre} &quot;{matricula.seccionNombre}&quot;
            </span>
          </div>
        </div>

        {tipo === "anular" ? (
          <div className="border-destructive/30 bg-destructive/5 text-destructive space-y-1.5 rounded-lg border p-3.5 text-xs">
            <div className="flex items-center gap-2 font-semibold">
              <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
              <span>Condición de anulación:</span>
            </div>
            <p className="leading-relaxed">
              Solo es posible anular la matrícula si se cometió una equivocación en el registro y el
              alumno no cuenta con asistencias registradas ni notas. Si ya inició clases, debe
              registrarse como <strong>Retirado</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* Fecha de Retiro / Traslado */}
            {(tipo === "retirar" || tipo === "trasladar") && (
              <div className="space-y-1.5">
                <Label htmlFor="fecha-op" className="text-xs font-semibold">
                  Fecha Efectiva de Salida <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fecha-op"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="h-10 text-xs"
                  required
                />
              </div>
            )}

            {/* Colegio de destino para traslado */}
            {tipo === "trasladar" && (
              <div className="space-y-1.5">
                <Label htmlFor="col-dest" className="text-xs font-semibold">
                  Institución Educativa de Destino <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="col-dest"
                  placeholder="Ej. I.E. Emblemática Melitón Carvajal"
                  value={colegioDestino}
                  onChange={(e) => setColegioDestino(e.target.value)}
                  className="h-10 text-xs"
                  required
                />
              </div>
            )}

            {/* Nueva sección para cambio de sección */}
            {tipo === "cambiar-seccion" && (
              <div className="space-y-1.5">
                <Label htmlFor="sec-dest" className="text-xs font-semibold">
                  Nueva Sección ({matricula.gradoNombre}){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select value={nuevaSeccionId} onValueChange={setNuevaSeccionId}>
                  <SelectTrigger id="sec-dest" className="h-10 text-xs">
                    <SelectValue placeholder="Seleccione el nuevo salón" />
                  </SelectTrigger>
                  <SelectContent>
                    {seccionesMismoGrado.map((sec: Seccion) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        Sección &quot;{sec.nombre}&quot; ({sec.vacantes - sec.matriculados} vacantes
                        disponibles)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {seccionesMismoGrado.length === 0 && (
                  <p className="text-destructive pt-1 text-[11px]">
                    No existen otras secciones paralelas activas en este grado escolar.
                  </p>
                )}
              </div>
            )}

            {/* Motivo */}
            <div className="space-y-1.5">
              <Label htmlFor="motivo-op" className="text-xs font-semibold">
                Motivo Detallado <span className="text-destructive">*</span>
              </Label>
              <Input
                id="motivo-op"
                placeholder={
                  tipo === "cambiar-seccion"
                    ? "Ej. Ajuste de convivencia o solicitud fundamentada del apoderado"
                    : "Ej. Cambio de domicilio o viaje familiar"
                }
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="h-10 text-xs"
                required
              />
            </div>
          </>
        )}

        <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            variant={tipo === "anular" || tipo === "retirar" ? "destructive" : "default"}
            disabled={isPending}
            className="text-xs"
          >
            {isPending ? "Procesando..." : "Confirmar Operación"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
