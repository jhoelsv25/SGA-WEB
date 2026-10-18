"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileImportIcon, Search01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ImportarModal } from "@/features/importacion/components/modals/importar-modal";
import type { TipoImportacion } from "@/features/importacion/types/importacion.types";
import { BuscarPersonaModal, type DestinoFichaUnica } from "./modals/buscar-persona-modal";
import type { Persona } from "../types/personas.types";

interface RegistroPersonaAccionesProps {
  destino: DestinoFichaUnica;
  tipoImportacion: TipoImportacion;
  /** Persona elegida en la búsqueda: abre el registro con la persona ya vinculada. */
  onVincular: (persona: Persona) => void;
  /** Abre el registro directo, con los campos de una persona nueva. */
  onRegistrar: () => void;
  onImportSuccess?: () => void;
}

/** Botones estándar de la barra de cada listado de personas: Buscar, Registrar y Cargar masivo. */
export function RegistroPersonaAcciones({
  destino,
  tipoImportacion,
  onVincular,
  onRegistrar,
  onImportSuccess,
}: RegistroPersonaAccionesProps) {
  const [buscarOpen, setBuscarOpen] = React.useState(false);
  const [masivoOpen, setMasivoOpen] = React.useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setBuscarOpen(true)} className="h-8 gap-1.5 text-xs">
        <HugeiconsIcon icon={Search01Icon} className="h-4 w-4" />
        Buscar
      </Button>
      <Button size="sm" variant="outline" onClick={onRegistrar} className="h-8 gap-1.5 text-xs">
        <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
        Registrar
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setMasivoOpen(true)}
        className="h-8 gap-1.5 text-xs"
      >
        <HugeiconsIcon icon={FileImportIcon} className="h-4 w-4" />
        Cargar masivo
      </Button>

      {buscarOpen && (
        <BuscarPersonaModal
          open
          onOpenChange={setBuscarOpen}
          destino={destino}
          onSeleccionar={onVincular}
        />
      )}
      <ImportarModal
        open={masivoOpen}
        onOpenChange={setMasivoOpen}
        tipo={tipoImportacion}
        onSuccess={onImportSuccess}
      />
    </>
  );
}
