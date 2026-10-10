"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { CursoDocenteItem } from "../../types";

export function getDocenteCargaColumns(): ColumnDef<CursoDocenteItem>[] {
  return [
    {
      id: "gradoSeccion",
      header: "Grado y Sección",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="space-y-0.5">
            <span className="text-foreground font-semibold">{c.gradoNumero}.°</span>
            <span className="text-muted-foreground block text-xs">
              Sección &ldquo;{c.seccionNombre}&rdquo;
            </span>
          </div>
        );
      },
    },
    {
      id: "curso",
      header: "Curso",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={BookOpen01Icon} className="text-primary size-4 shrink-0" />
            <span className="text-foreground font-semibold">{c.cursoNombre}</span>
          </div>
        );
      },
    },
    {
      id: "horas",
      header: () => <div className="text-center">Horas asignadas</div>,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 font-semibold">
              <span className="text-foreground">{c.horas}</span>
              <span className="text-muted-foreground text-xs font-normal">hrs/sem</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Sección</div>,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex justify-end">
            <Button
              asChild
              variant="ghost"
              size="sm"
              aria-label={`Ver carga de la sección ${c.gradoNumero}.° ${c.seccionNombre}`}
              className="min-h-11 rounded-full text-xs sm:min-h-8"
            >
              <Link href={`/admin/secciones/${c.seccionId}/carga`}>
                <span>Ver sección</span>
                <HugeiconsIcon icon={ArrowLeft02Icon} className="ml-1 size-3.5 rotate-180" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
}
