"use client";

import * as React from "react";
import { UserSwitchIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDocentesQuery } from "@/features/docentes/hooks/use-docentes";
import { useAsignarReemplazo } from "../hooks";
import type { Sesion } from "../types";

function Formulario({ sesion, onCerrar }: { sesion: Sesion; onCerrar: () => void }) {
  const [docenteId, setDocenteId] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const { data } = useDocentesQuery({ limit: 100, estado: "activo" });
  const asignar = useAsignarReemplazo();

  const opciones = (data?.data ?? [])
    .filter((d) => d.id !== sesion.docenteId)
    .map((d) => ({ value: d.id, label: d.persona.nombreCompleto, description: d.codigo }));

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!docenteId) {
      setError("Elija el docente de reemplazo.");
      return;
    }
    asignar.mutate({ id: sesion.id, docenteId }, { onSuccess: onCerrar });
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Docente de reemplazo *</Label>
        <SelectOption
          options={opciones}
          value={docenteId}
          onSelect={setDocenteId}
          placeholder="Seleccione un docente"
          searchPlaceholder="Buscar docente"
          emptyMessage="No hay otros docentes activos."
        />
        {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      </div>
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={asignar.isPending} className="min-h-10 gap-2">
          {asignar.isPending && <Spinner className="size-4" />}
          Asignar reemplazo
        </Button>
      </div>
    </form>
  );
}

export function ModalReemplazo({
  sesion,
  onOpenChange,
}: {
  sesion: Sesion | null;
  onOpenChange: (abierto: boolean) => void;
}) {
  return (
    <Modal
      open={Boolean(sesion)}
      onOpenChange={onOpenChange}
      title="Asignar reemplazo"
      description={
        sesion
          ? `${sesion.cursoNombre} · ${sesion.seccionNombre} · ${sesion.horaInicio}–${sesion.horaFin}. Desde ahora solo el reemplazo podrá firmarla.`
          : undefined
      }
      icon={UserSwitchIcon}
      size="md"
    >
      {sesion && (
        <Formulario key={sesion.id} sesion={sesion} onCerrar={() => onOpenChange(false)} />
      )}
    </Modal>
  );
}
