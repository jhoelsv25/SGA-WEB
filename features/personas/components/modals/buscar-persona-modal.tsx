"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PersonaResultados, type DestinoFichaUnica } from "../persona-resultados";
import type { Persona } from "../../types/personas.types";

export type { DestinoFichaUnica };

interface BuscarPersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destino: DestinoFichaUnica;
  /** Texto inicial de la búsqueda (DNI o nombre). */
  terminoInicial?: string;
  onSeleccionar: (persona: Persona) => void;
}

export function BuscarPersonaModal({
  open,
  onOpenChange,
  destino,
  terminoInicial = "",
  onSeleccionar,
}: BuscarPersonaModalProps) {
  const [termino, setTermino] = React.useState(terminoInicial);
  const [busqueda, setBusqueda] = React.useState(terminoInicial.trim());

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Buscar en el padrón único"
      description="Busca por DNI, nombres o apellidos y elige la persona a vincular."
      size="4xl"
    >
      <div className="space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setBusqueda(termino.trim());
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            />
            <Input
              autoFocus
              placeholder="DNI, nombres o apellidos..."
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <Button type="submit" size="sm" className="h-10 rounded-full px-5 text-xs">
            Buscar
          </Button>
        </form>
        <PersonaResultados
          key={busqueda}
          busqueda={busqueda}
          destino={destino}
          onSeleccionar={(persona) => {
            onSeleccionar(persona);
            onOpenChange(false);
          }}
        />
      </div>
    </Modal>
  );
}
