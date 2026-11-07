"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { DatePicker } from "@/components/common/date-picker";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon, UserRemove01Icon } from "@hugeicons/core-free-icons";
import {
  useCesarDocenteMutation,
  useReactivarDocenteMutation,
} from "@/features/docentes/hooks/use-docentes";
import {
  useDarDeBajaEstudianteMutation,
  useReactivarEstudianteMutation,
} from "@/features/estudiantes/hooks/use-estudiantes";
import { formatToIsoDate, parseIsoDate } from "@/features/docentes/utils/dates";
import type { Persona } from "../../types/personas.types";
import type { TipoFichaAcademica } from "../../utils/ficha-academica";
import { MOTIVO_BAJA_MIN } from "../baja-ficha-actual-field";

export type AccionFicha = "baja" | "reactivar";

interface FichaBajaModalProps {
  persona: Persona | null;
  tipo: TipoFichaAcademica;
  accion: AccionFicha;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** RF-007 V4: dar de baja (con motivo) o reactivar la ficha de docente/estudiante de una persona. */
export function FichaBajaModal({ persona, tipo, accion, open, onOpenChange }: FichaBajaModalProps) {
  const [motivo, setMotivo] = React.useState("");
  const [fecha, setFecha] = React.useState(formatToIsoDate(new Date()));
  const [error, setError] = React.useState<string | null>(null);

  const cesar = useCesarDocenteMutation();
  const reactivarDocente = useReactivarDocenteMutation();
  const bajaEstudiante = useDarDeBajaEstudianteMutation();
  const reactivarEstudiante = useReactivarEstudianteMutation();

  const isPending =
    cesar.isPending ||
    reactivarDocente.isPending ||
    bajaEstudiante.isPending ||
    reactivarEstudiante.isPending;

  if (!persona) return null;

  const fichaId = tipo === "docente" ? persona.fichas.docenteId : persona.fichas.estudianteId;
  const etiqueta = tipo === "docente" ? "docente" : "estudiante";
  const esBaja = accion === "baja";

  const cerrar = (abierto: boolean) => {
    if (!abierto) {
      setMotivo("");
      setError(null);
    }
    onOpenChange(abierto);
  };

  const confirmar = async () => {
    if (!fichaId) return;

    if (esBaja && motivo.trim().length < MOTIVO_BAJA_MIN) {
      setError(`Indique el motivo de la baja (mínimo ${MOTIVO_BAJA_MIN} caracteres).`);
      return;
    }
    setError(null);

    try {
      if (esBaja && tipo === "docente") {
        await cesar.mutateAsync({
          id: fichaId,
          input: { fechaCese: fecha, motivo: motivo.trim() },
        });
      } else if (esBaja) {
        await bajaEstudiante.mutateAsync({ id: fichaId, input: { motivo: motivo.trim(), fecha } });
      } else if (tipo === "docente") {
        await reactivarDocente.mutateAsync({ id: fichaId });
      } else {
        await reactivarEstudiante.mutateAsync({ id: fichaId });
      }
      cerrar(false);
    } catch {
      // El error (p. ej. cursos asignados o matrícula activa) se muestra en el toast de la mutación
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={cerrar}
      title={esBaja ? `Dar de baja la ficha de ${etiqueta}` : `Reactivar la ficha de ${etiqueta}`}
      description={
        esBaja
          ? "La ficha queda en el historial como dada de baja; no se elimina."
          : "La persona no debe tener la otra ficha académica vigente."
      }
      icon={UserRemove01Icon}
      size="md"
    >
      <div className="space-y-4">
        <div className="border-border/70 rounded-xl border p-3 text-xs">
          <p className="text-foreground text-sm font-medium">{persona.nombreCompleto}</p>
          <p className="text-muted-foreground font-mono">
            {persona.tipoDocumento.toUpperCase()}: {persona.numeroDocumento}
          </p>
        </div>

        {esBaja ? (
          <>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                {tipo === "docente" ? "Fecha de cese *" : "Fecha de baja *"}
              </Label>
              <DatePicker
                date={parseIsoDate(fecha)}
                onSelect={(date) => setFecha(formatToIsoDate(date))}
                disabled={isPending}
                clearable={false}
                dateFormat="dd/MM/yyyy"
                placeholder="Seleccionar fecha"
                className="w-full"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="motivoFichaBaja" className="text-sm font-medium">
                Motivo *
              </Label>
              <Textarea
                id="motivoFichaBaja"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej. Término de contrato, retiro voluntario…"
                disabled={isPending}
                aria-invalid={Boolean(error)}
                className="min-h-20 text-xs"
              />
              {error && <p className="text-destructive text-xs font-medium">{error}</p>}
            </div>
            <p className="text-muted-foreground text-xs">
              {tipo === "docente"
                ? "No se puede dar de baja a un docente con cursos asignados en el año académico vigente."
                : "No se puede dar de baja a un estudiante con matrícula activa; retírelo o trasládelo primero desde Matrícula."}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground text-xs">
            Se reactivará la ficha de {etiqueta}. Si perdió su credencial de marcación o su cargo,
            deberá emitirlos de nuevo.
          </p>
        )}

        <div className="flex justify-end gap-2.5 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => cerrar(false)}
            disabled={isPending}
            className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cancelar</span>
          </Button>
          <Button
            type="button"
            onClick={() => void confirmar()}
            disabled={isPending || !fichaId}
            className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
          >
            {isPending ? (
              <Spinner className="size-3.5" />
            ) : (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
            )}
            <span>{esBaja ? "Dar de baja" : "Reactivar"}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
