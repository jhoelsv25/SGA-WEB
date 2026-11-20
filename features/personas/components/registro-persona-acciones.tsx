"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Camera01Icon,
  FileImportIcon,
  MoreHorizontalIcon,
  RefreshIcon,
  Search01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CargarFotosModal, ImportarModal } from "@/features/importacion";
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
  /** Ítems extra del menú ⋯ (p. ej. Exportar Excel). */
  extraMenuItems?: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

/** Botones estándar de la barra de cada listado de personas: Buscar, Registrar y Cargar masivo. */
export function RegistroPersonaAcciones({
  destino,
  tipoImportacion,
  onVincular,
  onRegistrar,
  onImportSuccess,
  extraMenuItems,
  onRefresh,
  isRefreshing = false,
}: RegistroPersonaAccionesProps) {
  const [buscarOpen, setBuscarOpen] = React.useState(false);
  const [masivoOpen, setMasivoOpen] = React.useState(false);
  const [fotosOpen, setFotosOpen] = React.useState(false);

  const esEstudianteODocente = tipoImportacion === "estudiantes" || tipoImportacion === "docentes";

  return (
    <>
      <Button variant="outline" size="sm" onClick={onRegistrar} className="h-10 gap-2">
        <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
        Registrar {destino}
      </Button>
      <Button size="sm" onClick={() => setBuscarOpen(true)} className="h-10 gap-2">
        <HugeiconsIcon icon={Search01Icon} className="h-4 w-4" />
        Buscar persona
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="size-10" aria-label="Más acciones">
            <HugeiconsIcon icon={MoreHorizontalIcon} className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onSelect={() => setMasivoOpen(true)}>
            <HugeiconsIcon icon={FileImportIcon} className="h-4 w-4" />
            Cargar masivo (Excel)
          </DropdownMenuItem>
          {esEstudianteODocente && (
            <DropdownMenuItem onSelect={() => setFotosOpen(true)}>
              <HugeiconsIcon icon={Camera01Icon} className="h-4 w-4" />
              Cargar fotos masivas
            </DropdownMenuItem>
          )}
          {extraMenuItems}
          {onRefresh ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={isRefreshing} onSelect={() => onRefresh()}>
                <HugeiconsIcon icon={RefreshIcon} className="h-4 w-4" />
                Actualizar lista
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

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
      {esEstudianteODocente && (
        <CargarFotosModal
          open={fotosOpen}
          onOpenChange={setFotosOpen}
          tipo={tipoImportacion as "estudiantes" | "docentes"}
          onSuccess={onImportSuccess ?? onRefresh}
        />
      )}
    </>
  );
}
