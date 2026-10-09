"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { DocenteActions } from "./docente-actions";
import type { Docente } from "../../types/docentes.types";

interface GetDocenteColumnsOptions {
  onEdit: (docente: Docente) => void;
  onCesar: (docente: Docente) => void;
  onPrintCarne?: (docente: Docente) => void;
  onReemitirCredencial?: (docente: Docente) => void;
  onVerHistorial?: (docente: Docente) => void;
}

export function getDocenteColumns({
  onEdit,
  onCesar,
  onPrintCarne,
  onReemitirCredencial,
  onVerHistorial,
}: GetDocenteColumnsOptions): ColumnDef<Docente>[] {
  return [
    {
      id: "docente",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
      cell: ({ row }) => {
        const d = row.original;
        const p = d.persona;
        return (
          <div className="flex items-center gap-3">
            <UserAvatar name={p.nombreCompleto} avatar={p.fotoUrl ?? undefined} />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium">{p.nombreCompleto}</span>
                <span className="text-primary bg-primary/10 rounded px-1.5 py-0.5 font-mono text-[11px] font-bold">
                  {d.codigo}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                <span className="font-mono uppercase">{p.tipoDocumento}</span>: {p.numeroDocumento}
                {p.correo && ` · ${p.correo}`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "especialidad",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Especialidad" />,
      cell: ({ row }) => {
        const esp = row.original.especialidad;
        return esp ? (
          <span className="text-foreground text-xs font-medium">{esp}</span>
        ) : (
          <span className="text-muted-foreground text-xs italic">Sin especialidad</span>
        );
      },
    },
    {
      accessorKey: "tipoContrato",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contrato" />,
      cell: ({ row }) => {
        const contrato = row.original.tipoContrato;
        const labels: Record<string, { label: string; className: string }> = {
          nombrado: {
            label: "Nombrado",
            className: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
          },
          contratado: {
            label: "Contratado",
            className:
              "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          },
          practicante: {
            label: "Practicante",
            className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
          },
        };
        const info = labels[contrato] ?? { label: contrato, className: "" };
        return (
          <Badge variant="outline" className={`text-xs ${info.className}`}>
            {info.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "jornadaHoras",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Jornada" />,
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {row.original.jornadaHoras} hrs
        </Badge>
      ),
    },
    {
      accessorKey: "estado",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const estado = row.original.estado;
        if (estado === "activo") {
          return (
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              Activo
            </Badge>
          );
        }
        if (estado === "licencia") {
          return (
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              Licencia
            </Badge>
          );
        }
        return (
          <Badge
            variant="outline"
            className="border-muted-foreground/30 bg-muted/40 text-muted-foreground"
          >
            Cesado
          </Badge>
        );
      },
    },
    {
      accessorKey: "cargoVigente",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cargo Vigente" />,
      cell: ({ row }) => {
        const cargo = row.original.cargoVigente;
        return cargo ? (
          <span className="text-foreground text-xs">{cargo}</span>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => (
        <DocenteActions
          docente={row.original}
          onEdit={onEdit}
          onCesar={onCesar}
          onPrintCarne={onPrintCarne}
          onReemitirCredencial={onReemitirCredencial}
          onVerHistorial={onVerHistorial}
        />
      ),
    },
  ];
}
