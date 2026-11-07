"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { BuscarPersonaModal, type DestinoFichaUnica } from "./modals/buscar-persona-modal";
import type { Persona } from "../types/personas.types";

interface PersonaBuscadorFieldProps {
  destino: DestinoFichaUnica;
  value: Persona | null;
  onChange: (persona: Persona | null) => void;
  disabled?: boolean;
  id?: string;
}

/** Campo estándar para elegir una persona del padrón: botón «Buscar persona» → ventana con tabla de 5 en 5. */
export function PersonaBuscadorField({
  destino,
  value,
  onChange,
  disabled,
  id,
}: PersonaBuscadorFieldProps) {
  const [abierto, setAbierto] = React.useState(false);

  if (value) {
    return (
      <div className="border-primary/30 bg-primary/5 flex items-center justify-between rounded-lg border p-3 text-xs">
        <div className="space-y-0.5">
          <p className="text-foreground text-sm font-medium">{value.nombreCompleto}</p>
          <p className="text-muted-foreground font-mono text-xs">
            {value.tipoDocumento.toUpperCase()}: {value.numeroDocumento}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onChange(null)}
          className="h-7 text-xs"
        >
          Cambiar
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        id={id}
        type="button"
        size="sm"
        onClick={() => setAbierto(true)}
        disabled={disabled}
        className="h-10 gap-2 px-5 text-xs"
      >
        <HugeiconsIcon icon={Search01Icon} className="h-4 w-4" />
        Buscar persona
      </Button>
      {abierto && (
        <BuscarPersonaModal
          open
          onOpenChange={setAbierto}
          destino={destino}
          onSeleccionar={onChange}
        />
      )}
    </>
  );
}
