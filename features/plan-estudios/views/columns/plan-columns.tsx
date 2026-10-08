"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { PlanActions } from "./plan-actions";
import type { PlanEstudioItem } from "../../types";

interface GetPlanColumnsOptions {
  onEditHoras: (item: PlanEstudioItem) => void;
  onRemove: (item: PlanEstudioItem) => Promise<void>;
  isRemoving?: boolean;
}

export function getPlanColumns({
  onEditHoras,
  onRemove,
  isRemoving,
}: GetPlanColumnsOptions): ColumnDef<PlanEstudioItem>[] {
  return [
    {
      id: "codigo",
      accessorFn: (row) => row.curso.codigo,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
      cell: ({ row }) => {
        const curso = row.original.curso;
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
      id: "nombre",
      accessorFn: (row) => row.curso.nombre,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Asignatura" />,
      cell: ({ row }) => {
        const curso = row.original.curso;
        return (
          <div>
            <p className="text-foreground font-semibold">{curso.nombre}</p>
            {curso.descripcion && (
              <p className="text-muted-foreground line-clamp-1 text-[11px]">{curso.descripcion}</p>
            )}
          </div>
        );
      },
    },
    {
      id: "areaCurricular",
      accessorFn: (row) => row.curso.areaCurricularNombre,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Área Curricular" />,
      cell: ({ row }) => (
        <Badge variant="secondary" className="rounded-lg px-2.5 py-0.5 text-[11px] font-medium">
          {row.original.curso.areaCurricularNombre}
        </Badge>
      ),
    },
    {
      accessorKey: "horasSemanales",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Horas Semanales" className="justify-center" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <div className="border-border/60 bg-muted/30 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1">
            <span className="text-foreground text-xs font-bold">{row.original.horasSemanales}</span>
            <span className="text-muted-foreground text-[10px]">hrs/sem</span>
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <PlanActions
            item={row.original}
            onEditHoras={onEditHoras}
            onRemove={onRemove}
            isRemoving={isRemoving}
          />
        </div>
      ),
    },
  ];
}
