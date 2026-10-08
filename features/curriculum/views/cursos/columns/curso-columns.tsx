"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { CursoActions } from "./curso-actions";
import type { Curso } from "../../../types";

interface GetCursoColumnsOptions {
  onEdit: (curso: Curso) => void;
  onDeactivate: (curso: Curso) => Promise<void>;
  onReactivate: (curso: Curso) => Promise<void>;
  isDeactivating?: boolean;
}

export function getCursoColumns({
  onEdit,
  onDeactivate,
  onReactivate,
  isDeactivating,
}: GetCursoColumnsOptions): ColumnDef<Curso>[] {
  return [
    {
      accessorKey: "codigo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
      cell: ({ row }) => {
        const curso = row.original;
        return (
          <div className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-full border border-black/10 dark:border-white/10"
              style={{ backgroundColor: curso.colorHex || "#2563EB" }}
              title={`Color: ${curso.colorHex || "#2563EB"}`}
            />
            <span className="text-foreground font-mono font-bold">{curso.codigo}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre del Curso" />,
      cell: ({ row }) => (
        <span className="text-foreground font-semibold">{row.original.nombre}</span>
      ),
    },
    {
      id: "areaCurricular",
      accessorFn: (row) => row.areaCurricularNombre,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Área Curricular" />,
      cell: ({ row }) => (
        <Badge variant="secondary" className="rounded-lg px-2.5 py-0.5 text-[11px] font-medium">
          {row.original.areaCurricularNombre}
        </Badge>
      ),
    },
    {
      accessorKey: "descripcion",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-1 max-w-xs text-xs">
          {row.original.descripcion || "—"}
        </span>
      ),
    },
    {
      accessorKey: "activo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
      ),
      cell: ({ row }) => {
        const activo = row.original.activo;
        return (
          <div className="flex justify-center">
            {activo ? (
              <Badge
                variant="default"
                className="rounded-lg border border-emerald-600/30 bg-emerald-600/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400"
              >
                Activo
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground rounded-lg px-2 py-0.5 text-[10px] font-semibold"
              >
                Inactivo
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <CursoActions
            curso={row.original}
            onEdit={onEdit}
            onDeactivate={onDeactivate}
            onReactivate={onReactivate}
            isDeactivating={isDeactivating}
          />
        </div>
      ),
    },
  ];
}
