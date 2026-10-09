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
import { StatusBadge } from "@/components/common/status-badge";
import { getAuditActionMeta } from "../../../consts";

export interface GetAuditColumnsOptions {
  onViewDetail: (item: AuditLogItem) => void;
}

export function getAuditColumns({
  onViewDetail,
}: GetAuditColumnsOptions): ColumnDef<AuditLogItem>[] {
  return [
    {
      accessorKey: "registradoEn",
      header: "Fecha y hora",
      cell: ({ row }) => {
        const dateStr = row.original.registradoEn;
        return (
          <div className="flex flex-col gap-0.5">
            <div className="text-foreground flex items-center gap-1.5 text-xs font-medium">
              <HugeiconsIcon icon={Clock01Icon} className="text-primary size-3.5 shrink-0" />
              <span>{formatDateTime(dateStr)}</span>
            </div>
            <span className="text-muted-foreground ml-5 text-xs">
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
            <div className="border-border bg-muted/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
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
        const actionMeta = getAuditActionMeta(action);

        return (
          <StatusBadge tone={actionMeta.tone} dot size="sm">
            {actionMeta.label}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "entidad",
      header: "Módulo",
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
          <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
            <HugeiconsIcon icon={ComputerIcon} className="size-3.5 shrink-0" />
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
            aria-label={`Ver detalle del evento #${row.original.id}`}
          >
            <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
            <span>Ver detalle</span>
          </Button>
        );
      },
    },
  ];
}
