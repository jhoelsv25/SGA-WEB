"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AuditLogItem } from "../../../types/audit.types";
import { formatDateTime, formatRelativeTime } from "@/lib/formatters/date";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  ComputerIcon,
  Layers01Icon,
  EyeIcon,
  Robot01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface GetAuditColumnsOptions {
  onViewDetail: (item: AuditLogItem) => void;
}

export function getAuditColumns({
  onViewDetail,
}: GetAuditColumnsOptions): ColumnDef<AuditLogItem>[] {
  return [
    {
      accessorKey: "registradoEn",
      header: "Fecha y Hora",
      cell: ({ row }) => {
        const dateStr = row.original.registradoEn;
        return (
          <div className="flex flex-col gap-0.5">
            <div className="text-foreground flex items-center gap-1.5 text-xs font-medium">
              <HugeiconsIcon icon={Clock01Icon} className="text-primary size-3.5 shrink-0" />
              <span>{formatDateTime(dateStr)}</span>
            </div>
            <span className="text-muted-foreground ml-5 text-[10.5px]">
              {formatRelativeTime(dateStr)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "usuario",
      header: "Usuario",
      cell: ({ row }) => {
        const username = row.original.usuario;
        const isSystem = !username || username.toLowerCase() === "sistema";

        if (isSystem) {
          return (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
              <HugeiconsIcon icon={Robot01Icon} className="size-3.5" />
              <span>Sistema</span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary border-primary/20 flex size-7 items-center justify-center rounded-full border text-xs font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-foreground text-xs font-semibold">{username}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "accion",
      header: "Acción",
      cell: ({ row }) => {
        const action = row.original.accion;

        const getBadgeStyle = () => {
          switch (action.toLowerCase()) {
            case "crear":
              return {
                style:
                  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                dot: "bg-emerald-500",
              };
            case "actualizar":
              return {
                style: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
                dot: "bg-sky-500",
              };
            case "eliminar":
              return {
                style: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                dot: "bg-rose-500",
              };
            case "iniciar_sesion":
              return {
                style: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
                dot: "bg-violet-500 animate-pulse",
              };
            case "cerrar_sesion":
              return {
                style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                dot: "bg-amber-500",
              };
            default:
              return {
                style: "bg-muted text-muted-foreground border-border",
                dot: "bg-muted-foreground/60",
              };
          }
        };

        const config = getBadgeStyle();

        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize",
              config.style,
            )}
          >
            <span className={cn("size-1.5 shrink-0 rounded-full", config.dot)} />
            <span>{action.replace("_", " ")}</span>
          </span>
        );
      },
    },
    {
      accessorKey: "entidad",
      header: "Entidad / Módulo",
      cell: ({ row }) => {
        const entity = row.original.entidad;
        return (
          <div className="text-foreground flex items-center gap-1.5 text-xs font-medium">
            <HugeiconsIcon icon={Layers01Icon} className="text-muted-foreground size-3.5" />
            <span className="capitalize">{entity}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "direccionIp",
      header: "Dirección IP",
      cell: ({ row }) => {
        const ip = row.original.direccionIp;
        return (
          <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-[11px]">
            <HugeiconsIcon icon={ComputerIcon} className="size-3" />
            <span>{ip || "::1"}</span>
          </div>
        );
      },
    },
    {
      id: "acciones",
      header: "Detalle",
      cell: ({ row }) => {
        return (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(row.original)}
            className="hover:bg-primary/10 hover:text-primary h-8 gap-1.5 rounded-full px-3 text-xs transition-colors"
          >
            <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
            <span>Ver detalle</span>
          </Button>
        );
      },
    },
  ];
}
