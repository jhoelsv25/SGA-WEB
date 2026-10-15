"use client";

import * as React from "react";
import { UserIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocentesQuery } from "@/features/docentes/hooks/use-docentes";
import { useGenerarConsolidadoDocente } from "../../hooks";

export interface ModalGenerarIndividualProps {
  periodoId: string;
  periodoNombre: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormularioGenerarIndividualProps {
  periodoId: string;
  onCerrar: () => void;
  onSuccess?: () => void;
}

function FormularioGenerarIndividual({
  periodoId,
  onCerrar,
  onSuccess,
}: FormularioGenerarIndividualProps) {
  const [docenteId, setDocenteId] = React.useState<string>("");
  const [errorValidacion, setErrorValidacion] = React.useState<string | null>(null);

  const { data: docentesResponse, isLoading: isLoadingDocentes } = useDocentesQuery({
    limit: 100,
    estado: "activo",
  });

  const generarMutation = useGenerarConsolidadoDocente();

  const listaDocentes = React.useMemo(() => {
    const arr = docentesResponse?.data ?? [];
    return [...arr].sort((a, b) =>
      `${a.persona.apellidoPaterno} ${a.persona.apellidoMaterno}`.localeCompare(
        `${b.persona.apellidoPaterno} ${b.persona.apellidoMaterno}`,
      ),
    );
  }, [docentesResponse?.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!docenteId) {
      setErrorValidacion("Seleccione un docente de la lista.");
      return;
    }

    try {
      await generarMutation.mutateAsync({
        periodoId,
        docenteId,
      });
      onCerrar();
      onSuccess?.();
    } catch {
      // El error (ej. consolidado ya existente o bimestre abierto) es capturado y emitido por useGenerarConsolidadoDocente vía toast
    }
  };

  const isPending = generarMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="selector-docente" className="text-foreground text-xs font-semibold">
          Docente <span className="text-destructive">*</span>
        </Label>

        {isLoadingDocentes ? (
          <div className="text-muted-foreground flex items-center gap-2 py-3 text-xs">
            <Spinner className="text-primary size-4" />
            <span>Cargando catálogo de docentes...</span>
          </div>
        ) : (
          <Select
            value={docenteId}
            onValueChange={(val) => {
              setDocenteId(val);
              if (errorValidacion) setErrorValidacion(null);
            }}
            disabled={isPending}
          >
            <SelectTrigger id="selector-docente" size="sm" className="w-full text-xs">
              <SelectValue placeholder="Seleccione un docente..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {listaDocentes.map((d) => (
                <SelectItem key={d.id} value={d.id} className="text-xs">
                  {d.persona.apellidoPaterno} {d.persona.apellidoMaterno}, {d.persona.nombres} (DNI:{" "}
                  {d.persona.numeroDocumento})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {errorValidacion && (
          <p className="text-destructive text-2xs font-medium">{errorValidacion}</p>
        )}
      </div>

      <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-3">
        <Button type="button" variant="outline" size="sm" onClick={onCerrar} disabled={isPending}>
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={isPending || isLoadingDocentes}
          aria-busy={isPending}
        >
          {isPending && <Spinner className="mr-1.5 size-3.5" />}
          <span>Generar consolidado</span>
        </Button>
      </div>
    </form>
  );
}

/**
 * Modal para generar el consolidado individual de un docente en el bimestre (RF-013 HU1).
 * Valida reglas de última semana (CP-RF013-03) y preexistencia (CP-RF013-04).
 */
export function ModalGenerarIndividual({
  periodoId,
  periodoNombre,
  open,
  onOpenChange,
  onSuccess,
}: ModalGenerarIndividualProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Generar consolidado individual"
      description={`Seleccione al docente para calcular sus sesiones, firmas y ausencias en el ${periodoNombre}.`}
      icon={UserIcon}
      size="md"
    >
      {open ? (
        <FormularioGenerarIndividual
          key={periodoId}
          periodoId={periodoId}
          onCerrar={() => onOpenChange(false)}
          onSuccess={onSuccess}
        />
      ) : null}
    </Modal>
  );
}
