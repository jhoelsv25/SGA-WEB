"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMatriculasQuery } from "../../hooks";
import type { MatriculaItem } from "../../types";

interface ModalBuscarMatriculaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Matrícula vigente elegida (para reportes y fichas por estudiante). */
  onSeleccionar: (matricula: MatriculaItem) => void;
  title?: string;
  description?: string;
}

/** Busca estudiantes con matrícula vigente por DNI o nombre y devuelve su matrícula. */
export function ModalBuscarMatricula({
  open,
  onOpenChange,
  onSeleccionar,
  title = "Buscar estudiante",
  description = "Busca por DNI, nombres o apellidos entre los estudiantes matriculados.",
}: ModalBuscarMatriculaProps) {
  const [termino, setTermino] = React.useState("");
  const [busqueda, setBusqueda] = React.useState("");

  const { data, isFetching } = useMatriculasQuery({
    estado: "matriculado",
    search: busqueda || undefined,
    limit: 20,
  });
  const matriculas = data?.data ?? [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
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
          ) : matriculas.length === 0 ? (
            <li className="text-muted-foreground p-4 text-center text-xs">
              No se encontraron estudiantes matriculados.
            </li>
          ) : (
            matriculas.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSeleccionar(m);
                    onOpenChange(false);
                  }}
                  className="hover:bg-muted/60 flex w-full flex-col px-4 py-2.5 text-left"
                >
                  <span className="text-sm font-medium">
                    {m.estudiante.apellidos}, {m.estudiante.nombres}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Doc: {m.estudiante.numeroDocumento} · {m.gradoNumero}.° {m.seccionNombre}
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
