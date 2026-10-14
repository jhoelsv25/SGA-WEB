"use client";

import { useState } from "react";
import { UserAdd01Icon, Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { SelectOption } from "@/components/common/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ETIQUETA_ESTADO } from "../../constants";
import type { EstudianteLibreta } from "../../types";

interface ModalAsignarArchivoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nombreArchivo: string;
  estudiantes: EstudianteLibreta[];
  onAsignar: (matriculaId: string, motivo: string) => void;
}

export function ModalAsignarArchivo({
  open,
  onOpenChange,
  nombreArchivo,
  estudiantes,
  onAsignar,
}: ModalAsignarArchivoProps) {
  const [matriculaId, setMatriculaId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const elegido = estudiantes.find((item) => item.matriculaId === matriculaId);
  const exigeMotivo = Boolean(elegido?.estado && elegido.estado !== "pendiente");

  return (
    <Modal
      open={open}
      onOpenChange={(siguiente) => {
        if (!siguiente) {
          setMatriculaId("");
          setMotivo("");
          setError(null);
        }
        onOpenChange(siguiente);
      }}
      title="Asignar archivo"
      description={`Indica a qué estudiante corresponde ${nombreArchivo}.`}
      icon={UserAdd01Icon}
      size="lg"
    >
      <form
        className="space-y-4"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();
          if (!matriculaId) {
            setError("Elige el estudiante.");
            return;
          }
          if (exigeMotivo && !motivo.trim()) {
            setError("Escribe el motivo del reemplazo.");
            return;
          }
          onAsignar(matriculaId, motivo.trim());
          setMatriculaId("");
          setMotivo("");
          setError(null);
          onOpenChange(false);
        }}
      >
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Estudiante *</Label>
          <SelectOption
            options={estudiantes.map((item) => ({
              value: item.matriculaId,
              label: item.nombreCompleto,
              description: item.estado ? ETIQUETA_ESTADO[item.estado] : "Sin libreta",
            }))}
            value={matriculaId || undefined}
            onSelect={setMatriculaId}
            placeholder="Elige el estudiante"
            searchPlaceholder="Buscar estudiante"
          />
          <p className="text-muted-foreground text-xs">
            El archivo queda en la sección elegida al inicio de la carga.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="motivo-asignacion" className="text-sm font-medium">
            Motivo del reemplazo {exigeMotivo ? "*" : "(Opcional)"}
          </Label>
          <Textarea
            id="motivo-asignacion"
            value={motivo}
            onChange={(evento) => setMotivo(evento.target.value)}
            placeholder="Por qué se reemplaza la libreta ya publicada"
            rows={3}
          />
          <p className="text-muted-foreground text-xs">
            Obligatorio si esa libreta ya fue publicada. El reemplazo no cambia si quedó a tiempo o
            fuera de plazo.
          </p>
        </div>

        {error ? <p className="text-destructive text-xs font-medium">{error}</p> : null}

        <div className="flex justify-end gap-2.5 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cancelar</span>
          </Button>
          <Button
            type="submit"
            className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
            <span>Asignar</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
