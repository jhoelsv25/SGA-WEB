"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEstudiantesQuery } from "@/features/estudiantes/hooks/use-estudiantes";
import type { Estudiante } from "@/features/estudiantes/types/estudiantes.types";

interface ModalBuscarEstudianteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Estudiante elegido: se abre la matrícula con él ya seleccionado. */
  onSeleccionar: (estudiante: Estudiante) => void;
}

export function ModalBuscarEstudiante({
  open,
  onOpenChange,
  onSeleccionar,
}: ModalBuscarEstudianteProps) {
  const [termino, setTermino] = React.useState("");
  const [busqueda, setBusqueda] = React.useState("");

  const { data, isFetching } = useEstudiantesQuery({
    estado: "activo",
    search: busqueda || undefined,
    limit: 20,
  });
  const estudiantes = data?.data ?? [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Buscar estudiante"
      description="Busca por DNI, nombres o apellidos y elige al estudiante a matricular."
      icon={Search01Icon}
      size="lg"
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

        <ul className="max-h-80 divide-y overflow-y-auto rounded-xl border">
          {isFetching ? (
            <li className="text-muted-foreground p-4 text-center text-xs">Buscando...</li>
          ) : estudiantes.length === 0 ? (
            <li className="text-muted-foreground p-4 text-center text-xs">
              No se encontraron estudiantes activos.
            </li>
          ) : (
            estudiantes.map((est) => (
              <li key={est.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSeleccionar(est);
                    onOpenChange(false);
                  }}
                  className="hover:bg-muted/60 flex w-full flex-col px-4 py-2.5 text-left"
                >
                  <span className="text-sm font-medium">
                    {est.persona.nombreCompleto ||
                      `${est.persona.apellidoPaterno}, ${est.persona.nombres}`}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Doc: {est.persona.numeroDocumento}
                    {est.codigo ? ` · SIAGIE: ${est.codigo}` : ""}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </Modal>
  );
}
