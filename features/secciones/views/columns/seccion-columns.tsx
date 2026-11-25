"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { BookOpen01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
      header: "Grado y Sección",
      cell: ({ row }) => {
        const seccion = row.original;
        return (
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary border-primary/20 inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-bold shadow-2xs">
              {seccion.nombre}
            </span>
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-semibold">{seccion.gradoNombre}</span>
              {seccion.aula ? (
                <span className="text-muted-foreground text-xs">Aula: {seccion.aula}</span>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "matriculados",
      header: "Ocupación",
      cell: ({ row }) => {
        const { matriculados, vacantes } = row.original;
        const libres = Math.max(0, vacantes - matriculados);
        const porcentaje =
          vacantes > 0 ? Math.min(100, Math.round((matriculados / vacantes) * 100)) : 0;
        const barColor =
          porcentaje >= 100 ? "bg-rose-500" : porcentaje >= 85 ? "bg-amber-500" : "bg-emerald-500";

        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-foreground text-sm font-semibold tabular-nums">
                {matriculados}
              </span>
              <span className="text-muted-foreground text-xs tabular-nums">/ {vacantes}</span>
              <span className="text-muted-foreground text-[11px] tabular-nums">
                {libres === 0 ? "· Completa" : `· ${libres} disp.`}
              </span>
            </div>
            <div className="bg-muted h-1.5 w-28 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
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
          return (
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-[11px] font-medium text-amber-700 dark:text-amber-300"
            >
              Sin tutor
            </Badge>
          );
        }
        return (
          <div className="flex flex-col">
            <span className="text-foreground max-w-55 truncate text-xs font-medium">
              {tutor.nombreCompleto}
            </span>
            <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
              {tutor.codigo}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "cursosSinDocente",
      header: "Carga Académica",
      cell: ({ row }) => {
        const { id, cursosSinDocente, totalCursos } = row.original;
        const asignados = Math.max(0, totalCursos - cursosSinDocente);
        const href = `/admin/secciones/${id}/carga`;

        if (totalCursos === 0) {
          return (
            <Link href={href} className="inline-flex hover:opacity-80">
              <Badge variant="outline" className="text-muted-foreground gap-1 text-[11px]">
                <HugeiconsIcon icon={BookOpen01Icon} className="size-3" />
                Sin cursos en plan
              </Badge>
            </Link>
          );
        }

        if (cursosSinDocente === 0) {
          return (
            <Link href={href} className="inline-flex hover:opacity-80">
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                {asignados} / {totalCursos} completos
              </Badge>
            </Link>
          );
        }

        return (
          <Link href={href} className="inline-flex hover:opacity-80">
            <Badge
              variant="outline"
              className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-[11px] font-medium text-amber-700 dark:text-amber-300"
            >
              <HugeiconsIcon icon={BookOpen01Icon} className="size-3.5" />
              {asignados} / {totalCursos} · {cursosSinDocente} pend.
            </Badge>
          </Link>
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
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-300"
            >
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
