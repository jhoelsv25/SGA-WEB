"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { MatriculaItem } from "../../types";
import { MatriculaActions } from "./matricula-actions";

interface MatriculaColumnsOptions {
  puedeGestionar: boolean;
  onDescargarConstancia: (matricula: MatriculaItem) => void;
  onCambiarSeccion?: (matricula: MatriculaItem) => void;
  onRetirar?: (matricula: MatriculaItem) => void;
  onTrasladar?: (matricula: MatriculaItem) => void;
  onAnular?: (matricula: MatriculaItem) => void;
}

const ESTADO_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  matriculado: "default",
  retirado: "destructive",
  trasladado: "secondary",
  culminado: "outline",
};

const ESTADO_LABEL: Record<string, string> = {
  matriculado: "Matriculado",
  retirado: "Retirado",
  trasladado: "Trasladado",
  culminado: "Culminado",
};

const TIPO_LABEL: Record<string, string> = {
  nuevo: "Nuevo",
  continuador: "Continuador",
  traslado: "Traslado",
};

export function getMatriculaColumns({
  puedeGestionar,
  onDescargarConstancia,
  onCambiarSeccion,
  onRetirar,
  onTrasladar,
  onAnular,
}: MatriculaColumnsOptions): ColumnDef<MatriculaItem>[] {
  return [
    {
      accessorKey: "codigo",
      header: "Código",
      cell: ({ row }) => (
        <span className="text-primary font-mono text-xs font-semibold">{row.original.codigo}</span>
      ),
    },
    {
      accessorKey: "estudiante",
      header: "Estudiante",
      cell: ({ row }) => {
        const est = row.original.estudiante;
        return (
          <div className="flex flex-col">
            <span className="text-foreground text-sm font-medium">
              {est.apellidos}, {est.nombres}
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              Doc: {est.numeroDocumento} {est.codigo ? `· SIAGIE: ${est.codigo}` : ""}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "gradoNombre",
      header: "Grado y Sección",
      cell: ({ row }) => {
        const mat = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{mat.gradoNombre}</span>
            <span className="bg-secondary text-secondary-foreground inline-flex size-6 items-center justify-center rounded text-xs font-bold shadow-2xs">
              {mat.seccionNombre}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => {
        const tipo = row.original.tipo;
        const repitente = row.original.esRepitente;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs font-medium">
              {TIPO_LABEL[tipo] || tipo}
            </span>
            {repitente && (
              <Badge
                variant="outline"
                className="w-fit border-amber-300 text-[10px] text-amber-600"
              >
                Repitente
              </Badge>
            )}
            {row.original.colegioProcedencia && (
              <span
                className="text-muted-foreground max-w-[140px] truncate text-[10px]"
                title={row.original.colegioProcedencia}
              >
                De: {row.original.colegioProcedencia}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.original.estado;
        return (
          <div className="flex flex-col gap-0.5">
            <Badge variant={ESTADO_BADGE_VARIANT[estado] || "outline"} className="capitalize">
              {ESTADO_LABEL[estado] || estado}
            </Badge>
            {row.original.motivoRetiro && (
              <span
                className="text-destructive max-w-[140px] truncate text-[10px]"
                title={row.original.motivoRetiro}
              >
                {row.original.motivoRetiro}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "fechaMatricula",
      header: "Fecha",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">{row.original.fechaMatricula}</span>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <MatriculaActions
          matricula={row.original}
          puedeGestionar={puedeGestionar}
          onDescargarConstancia={onDescargarConstancia}
          onCambiarSeccion={onCambiarSeccion}
          onRetirar={onRetirar}
          onTrasladar={onTrasladar}
          onAnular={onAnular}
        />
      ),
    },
  ];
}
