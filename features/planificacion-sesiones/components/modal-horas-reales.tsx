"use client";

import * as React from "react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRegistrarHorasReales } from "../hooks";

export interface SesionHorasReales {
  id: string;
  cursoNombre: string;
  seccionNombre: string;
  docenteNombre: string;
  horaInicio: string;
  horaFin: string;
}

function Formulario({ sesion, onCerrar }: { sesion: SesionHorasReales; onCerrar: () => void }) {
  const [enAula, setEnAula] = React.useState(true);
  const [inicio, setInicio] = React.useState(sesion.horaInicio.slice(0, 5));
  const [fin, setFin] = React.useState(sesion.horaFin.slice(0, 5));
  const [observacion, setObservacion] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const registrar = useRegistrarHorasReales();

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (enAula && (!inicio || !fin || fin <= inicio)) {
      setError("La hora de salida debe ser posterior a la de entrada.");
      return;
    }
    setError(null);
    registrar.mutate(
      {
        sesionId: sesion.id,
        payload: {
          enAula,
          horaInicio: enAula ? inicio : undefined,
          horaFin: enAula ? fin : undefined,
          observacion: observacion.trim() || undefined,
        },
      },
      { onSuccess: onCerrar },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">¿Estuvo el docente en el aula?</legend>
        <div className="flex gap-2" role="group">
          <Button
            type="button"
            variant={enAula ? "default" : "outline"}
            aria-pressed={enAula}
            onClick={() => setEnAula(true)}
          >
            Sí, estuvo
          </Button>
          <Button
            type="button"
            variant={!enAula ? "default" : "outline"}
            aria-pressed={!enAula}
            onClick={() => setEnAula(false)}
          >
            No estuvo
          </Button>
        </div>
      </fieldset>
      {enAula && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="hr-inicio">Hora real de entrada *</Label>
            <Input
              id="hr-inicio"
              type="time"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hr-fin">Hora real de salida *</Label>
            <Input id="hr-fin" type="time" value={fin} onChange={(e) => setFin(e.target.value)} />
          </div>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="hr-obs">Observación</Label>
        <Textarea
          id="hr-obs"
          rows={2}
          maxLength={500}
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-destructive text-xs font-medium">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={registrar.isPending} className="min-h-10 gap-2">
          {registrar.isPending && <Spinner className="size-4" />}
          Guardar
        </Button>
      </div>
    </form>
  );
}

/** El supervisor anota las horas en que realmente vio al docente en el aula. */
export function ModalHorasReales({
  sesion,
  onOpenChange,
}: {
  sesion: SesionHorasReales | null;
  onOpenChange: (abierto: boolean) => void;
}) {
  return (
    <Modal
      open={Boolean(sesion)}
      onOpenChange={onOpenChange}
      title="Horas reales en el aula"
      description={
        sesion
          ? `${sesion.docenteNombre} · ${sesion.cursoNombre} ${sesion.seccionNombre} · programada ${sesion.horaInicio}–${sesion.horaFin}.`
          : undefined
      }
      icon={Clock01Icon}
      size="md"
    >
      {sesion && (
        <Formulario key={sesion.id} sesion={sesion} onCerrar={() => onOpenChange(false)} />
      )}
    </Modal>
  );
}
