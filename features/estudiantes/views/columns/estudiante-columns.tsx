"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { formatDate } from "@/lib/formatters/date";
import { calcularEdad } from "../../utils/edad.util";
import { EstudianteActions } from "./estudiante-actions";
import type { Estudiante, EstadoEstudiante } from "../../types/estudiantes.types";

interface GetEstudianteColumnsOptions {
  onEdit: (estudiante: Estudiante) => void;
  onDelete: (estudiante: Estudiante) => void;
  onPrintCarne?: (estudiante: Estudiante) => void;
  onReemitirCredencial?: (estudiante: Estudiante) => void;
  onVerHistorial?: (estudiante: Estudiante) => void;
}

const estadoBadges: Record<EstadoEstudiante, { label: string; className: string }> = {
  activo: {
    label: "Activo",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  retirado: {
    label: "Retirado",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
  },
  trasladado: {
    label: "Trasladado",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  egresado: {
    label: "Egresado",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
};

export function getEstudianteColumns({
  onEdit,
  onDelete,
  onPrintCarne,
  onReemitirCredencial,
  onVerHistorial,
}: GetEstudianteColumnsOptions): ColumnDef<Estudiante>[] {
  return [
    {
      id: "estudiante",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estudiante" />,
      cell: ({ row }) => {
        const e = row.original;
        const p = e.persona;
        return (
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/estudiantes/${e.id}`}
              className="shrink-0 transition-opacity hover:opacity-85"
              title="Ver expediente completo"
            >
              <UserAvatar name={p.nombreCompleto} avatar={p.fotoUrl ?? undefined} />
            </Link>
            <div className="space-y-0.5">
              <Link
                href={`/admin/estudiantes/${e.id}`}
                className="text-foreground hover:text-primary block font-medium transition-colors"
                title="Ver expediente completo"
              >
                {p.nombreCompleto}
              </Link>
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
      accessorKey: "codigo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Código SIAGIE" />,
      cell: ({ row }) => (
        <span className="text-primary bg-primary/10 inline-block rounded-md px-2 py-0.5 font-mono text-xs font-semibold">
          {row.original.codigo}
        </span>
      ),
    },
    {
      id: "nacimiento",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nacimiento / Edad" />,
      cell: ({ row }) => {
        const fechaNac = row.original.persona.fechaNacimiento;
        if (!fechaNac) {
          return <span className="text-muted-foreground text-xs">—</span>;
        }
        const edad = calcularEdad(fechaNac);
        return (
          <div className="space-y-0.5">
            <span className="text-foreground block font-mono text-xs">
              {formatDate(fechaNac, "dd/MM/yyyy")}
            </span>
            {edad !== null && (
              <span className="text-muted-foreground block text-[11px]">{edad} años</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "fechaIngreso",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Ingreso" />,
      cell: ({ row }) => {
        const fecha = row.original.fechaIngreso;
        return (
          <span className="text-foreground font-mono text-xs">
            {fecha ? formatDate(fecha, "dd/MM/yyyy") : "-"}
          </span>
        );
      },
    },
    {
      id: "discapacidad",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Condición" />,
      cell: ({ row }) => {
        const e = row.original;
        if (e.tieneDiscapacidad) {
          return (
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-700 dark:text-amber-300"
            >
              {e.detalleDiscapacidad || "Discapacidad"}
            </Badge>
          );
        }
        return <span className="text-muted-foreground text-xs">Regular</span>;
      },
    },
    {
      id: "salud",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Salud / Sangre" />,
      cell: ({ row }) => {
        const e = row.original;
        const detalles = [e.grupoSanguineo && `Tipo ${e.grupoSanguineo}`, e.seguroSalud].filter(
          Boolean,
        );

        return detalles.length > 0 ? (
          <span className="text-foreground text-xs">{detalles.join(" · ")}</span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        );
      },
    },
    {
      accessorKey: "estado",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => {
        const estado = row.original.estado;
        const conf = estadoBadges[estado] ?? {
          label: estado,
          className: "bg-muted text-muted-foreground",
        };
        return (
          <Badge variant="outline" className={`font-semibold ${conf.className}`}>
            {conf.label}
          </Badge>
        );
      },
    },
    {
      id: "credencial",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Marcación" />,
      cell: ({ row }) => {
        const cred = row.original.credencial;
        return cred?.activa ? (
          <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {cred.codigo}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs italic">Sin carné</span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <EstudianteActions
          estudiante={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onPrintCarne={onPrintCarne}
          onReemitirCredencial={onReemitirCredencial}
          onVerHistorial={onVerHistorial}
        />
      ),
    },
  ];
}
