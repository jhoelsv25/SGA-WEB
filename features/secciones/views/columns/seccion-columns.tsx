"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ESTADO_SECCION_LABELS } from "../../consts";
import type { Seccion } from "../../types";
import { SeccionActions } from "./seccion-actions";

interface SeccionColumnsOptions {
  puedeGestionar: boolean;
  onEdit?: (seccion: Seccion) => void;
  onCerrar?: (seccion: Seccion) => Promise<void>;
  isCerrando?: boolean;
}

export function getSeccionColumns({
  puedeGestionar,
  onEdit,
  onCerrar,
  isCerrando,
}: SeccionColumnsOptions): ColumnDef<Seccion>[] {
  return [
    {
      accessorKey: "gradoNombre",
      header: "Grado",
      cell: ({ row }) => {
        const seccion = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-foreground text-sm font-semibold">{seccion.gradoNombre}</span>
            <span className="text-muted-foreground text-xs">
              {seccion.gradoNumero}.° secundaria
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "nombre",
      header: "Sección",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="bg-secondary text-secondary-foreground inline-flex size-7 items-center justify-center rounded-md text-xs font-bold shadow-2xs">
              {row.original.nombre}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "aula",
      header: "Aula",
      cell: ({ row }) => {
        const aula = row.original.aula;
        if (!aula) {
          return <span className="text-muted-foreground text-xs italic">Sin aula</span>;
        }
        return <span className="text-foreground text-sm font-medium">{aula}</span>;
      },
    },
    {
      accessorKey: "vacantes",
      header: "Vacantes",
      cell: ({ row }) => {
        return (
          <span className="text-foreground text-sm font-semibold tabular-nums">
            {row.original.vacantes}
          </span>
        );
      },
    },
    {
      accessorKey: "matriculados",
      header: "Matriculados",
      cell: ({ row }) => {
        const { matriculados, vacantes } = row.original;
        return (
          <div className="flex items-center gap-1.5">
            <span className="text-foreground text-sm font-semibold tabular-nums">
              {matriculados}
            </span>
            <span className="text-muted-foreground text-xs">/ {vacantes}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "tutor",
      header: "Tutor",
      cell: ({ row }) => {
        const tutor = row.original.tutor;
        if (!tutor) {
          return <span className="text-muted-foreground text-xs italic">Sin tutor</span>;
        }
        return (
          <div className="flex flex-col">
            <span className="text-foreground max-w-[200px] truncate text-xs font-medium">
              {tutor.nombreCompleto}
            </span>
            <span className="text-muted-foreground text-[11px] tabular-nums">{tutor.codigo}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "cursosSinDocente",
      header: "Cursos sin docente",
      cell: ({ row }) => {
        const { cursosSinDocente, totalCursos } = row.original;
        if (totalCursos === 0) {
          return <span className="text-muted-foreground text-xs italic">Sin cursos</span>;
        }
        if (cursosSinDocente === 0) {
          return (
            <Badge
              variant="outline"
              className="text-foreground border-border text-[11px] font-normal"
            >
              Todos asignados ({totalCursos})
            </Badge>
          );
        }
        return (
          <Badge
            variant="secondary"
            className="border-destructive/20 bg-destructive/10 text-destructive text-[11px] font-normal"
          >
            {cursosSinDocente} de {totalCursos} sin asignar
          </Badge>
        );
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.original.estado;
        const label = ESTADO_SECCION_LABELS[estado] ?? estado;
        if (estado === "activa") {
          return (
            <Badge variant="default" className="text-xs">
              {label}
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="text-muted-foreground text-xs font-normal">
            {label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => {
        return (
          <SeccionActions
            seccion={row.original}
            puedeGestionar={puedeGestionar}
            onEdit={onEdit}
            onCerrar={onCerrar}
            isCerrando={isCerrando}
          />
        );
      },
    },
  ];
}
