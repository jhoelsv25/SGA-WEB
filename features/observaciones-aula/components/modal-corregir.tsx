"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { SelectOption } from "@/components/common/select";
import { Textarea } from "@/components/ui/textarea";
import { NIVELES } from "../consts";
import { useCorregirCalificacion } from "../hooks";
import type { Calificacion } from "../types";
import { Campo, PieFormulario } from "./campo";

function Formulario({
  observacionId,
  calificacion,
  onOpenChange,
}: {
  observacionId: string;
  calificacion: Calificacion;
  onOpenChange: (abierto: boolean) => void;
}) {
  const corregir = useCorregirCalificacion();
  const [nivel, setNivel] = React.useState<string>(String(calificacion.nivel));
  const [motivo, setMotivo] = React.useState("");
  const [error, setError] = React.useState<string>();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!motivo.trim()) {
      setError("Indique el motivo del cambio.");
      return;
    }
    setError(undefined);
    corregir.mutate(
      {
        id: observacionId,
        desempeno: calificacion.desempeno,
        nivel: Number(nivel) === calificacion.nivel ? undefined : Number(nivel),
        motivo: motivo.trim(),
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <Campo id="cor-nivel" etiqueta="Nivel">
        <SelectOption
          options={NIVELES.map((n) => ({
            value: String(n.nivel),
            label: `${n.romano} · ${n.nombre}`,
          }))}
          value={nivel}
          onSelect={setNivel}
          disabled={corregir.isPending}
        />
      </Campo>
      <Campo id="cor-motivo" etiqueta="Motivo del cambio *" error={error}>
        <Textarea
          id="cor-motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          maxLength={500}
          disabled={corregir.isPending}
        />
      </Campo>
      <PieFormulario
        onCancelar={() => onOpenChange(false)}
        textoEnviar="Guardar corrección"
        cargando={corregir.isPending}
      />
    </form>
  );
}

/** Corrección de una calificación ya cerrada: solo Director o Administrador, con motivo. */
export function ModalCorregirCalificacion({
  observacionId,
  calificacion,
  onOpenChange,
}: {
  observacionId: string;
  calificacion: Calificacion | null;
  onOpenChange: (abierto: boolean) => void;
}) {
  return (
    <Modal
      open={calificacion !== null}
      onOpenChange={onOpenChange}
      title={calificacion ? `Corregir desempeño ${calificacion.desempeno}` : "Corregir"}
      description="Se genera una versión nueva; la anterior queda en el historial."
    >
      {calificacion && (
        <Formulario
          key={`${calificacion.desempeno}-${calificacion.version}`}
          observacionId={observacionId}
          calificacion={calificacion}
          onOpenChange={onOpenChange}
        />
      )}
    </Modal>
  );
}
