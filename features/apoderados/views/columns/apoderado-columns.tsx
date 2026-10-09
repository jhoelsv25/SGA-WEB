"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { ApoderadoActions } from "./apoderado-actions";
import type { Apoderado } from "../../types/apoderados.types";

interface GetApoderadoColumnsOptions {
  onEdit: (apoderado: Apoderado) => void;
  onDelete: (apoderado: Apoderado) => void;
}

const gradoLabels: Record<string, string> = {
  sin_estudios: "Sin estudios",
  primaria: "Primaria",
  secundaria: "Secundaria",
  tecnica: "Técnica",
  universitaria: "Universitaria",
  posgrado: "Posgrado",
};

export function getApoderadoColumns({
  onEdit,
  onDelete,
}: GetApoderadoColumnsOptions): ColumnDef<Apoderado>[] {
  return [
    {
      id: "apoderado",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Apoderado" />,
      cell: ({ row }) => {
        const a = row.original;
        const p = a.persona;
        return (
          <div className="flex items-center gap-3">
            <UserAvatar name={p.nombreCompleto} avatar={p.fotoUrl ?? undefined} />
            <div className="space-y-0.5">
              <span className="text-foreground text-sm font-medium">{p.nombreCompleto}</span>
              <p className="text-muted-foreground text-xs">
                <span className="font-mono uppercase">{p.tipoDocumento}</span>: {p.numeroDocumento}
                {p.celular && ` · ${p.celular}`}
              </p>
              {p.correo && (
                <p className="text-muted-foreground max-w-50 truncate text-[11px]">{p.correo}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "laboral",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Datos Laborales" />,
      cell: ({ row }) => {
        const a = row.original;
        const ocupacion = a.ocupacion;
        const centro = a.centroLaboral;
        const grado = a.gradoInstruccion ? gradoLabels[a.gradoInstruccion] : null;

        return (
          <div className="space-y-1">
            <p className="text-foreground text-xs font-medium">{ocupacion || "No especificada"}</p>
            {centro && (
              <p className="text-muted-foreground max-w-45 truncate text-[11px]">{centro}</p>
            )}
            {grado && (
              <Badge variant="outline" className="bg-muted/40 px-1.5 py-0 text-[10px]">
                {grado}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "estudiantes",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estudiantes a Cargo" />,
      cell: ({ row }) => {
        const ests = row.original.estudiantes;
        if (!ests || ests.length === 0) {
          return <span className="text-muted-foreground text-xs italic">Sin hijos vinculados</span>;
        }

        return (
          <div className="flex max-w-[320px] flex-wrap gap-1.5">
            {ests.map((e) => (
              <div
                key={e.estudianteId}
                className="bg-muted/60 border-border/60 flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px]"
              >
                <span className="text-foreground max-w-37 truncate font-medium">
                  {e.nombreCompleto}
                </span>
                <span className="text-muted-foreground text-[10px]">({e.parentesco})</span>
                {e.esPrincipal && (
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-primary px-1 py-0 text-[9px]"
                  >
                    Principal
                  </Badge>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "cuenta",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cuenta" />,
      cell: ({ row }) => {
        const u = row.original.usuario;
        return u ? (
          <div className="space-y-0.5">
            <span className="text-foreground font-mono text-xs font-medium">{u.nombreUsuario}</span>
            <Badge
              variant="outline"
              className={`px-1.5 py-0 text-[10px] ${
                u.estado === "activo"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {u.estado}
            </Badge>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">Sin cuenta</span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ApoderadoActions apoderado={row.original} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
