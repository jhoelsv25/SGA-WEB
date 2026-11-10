"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { DECISIONES_CONSOLIDADO_CONFIG, ESTADOS_CONSOLIDADO_CONFIG } from "../../consts";
import type { ConsolidadoResumenItem } from "../../types";
import { formatearHoras } from "../../utils";
import { ConsolidadoActions } from "./consolidado-actions";

export interface GetConsolidadoColumnsOptions {
  esDirectorOAdmin?: boolean;
  onVerDetalle: (id: string) => void;
  onDescargarPdf: (id: string) => void;
  onAbrirDecision: (item: ConsolidadoResumenItem) => void;
  onAbrirReabrir: (item: ConsolidadoResumenItem) => void;
  onAbrirCerrar: (item: ConsolidadoResumenItem) => void;
  onAbrirHistorial: (item: ConsolidadoResumenItem) => void;
  onResolverSolicitud: (consolidadoId: string) => void;
}

export function getConsolidadoColumns(
  options: GetConsolidadoColumnsOptions,
): ColumnDef<ConsolidadoResumenItem>[] {
  return [
    {
      accessorKey: "docenteNombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Docente" />,
      cell: ({ row }) => {
        const c = row.original;
        const tieneSolicitudes = (c.solicitudesPendientesCount ?? 0) > 0;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground text-xs font-semibold">{c.docenteNombre}</span>
            <span className="text-muted-foreground font-mono text-[11px]">DNI: {c.docenteDni}</span>
            {tieneSolicitudes && (
              <div className="pt-0.5">
                <Badge
                  variant="destructive"
                  className="animate-pulse cursor-pointer text-[10px]"
                  onClick={() => options.onResolverSolicitud(c.id)}
                >
                  {c.solicitudesPendientesCount} solicitud pendiente
                </Badge>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Versión" className="justify-center" />
      ),
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex justify-center">
            <Badge variant={c.vigente ? "default" : "outline"} className="text-xs">
              v{c.version}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "sesiones",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sesiones (Prog/Cumpl)" />
      ),
      cell: ({ row }) => {
        const c = row.original;
        const tasa =
          c.sesionesProgramadas > 0
            ? Math.round(
                ((c.sesionesCumplidas + c.sesionesJustificadas) / c.sesionesProgramadas) * 100,
              )
            : 0;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono text-xs font-bold">
                {c.sesionesCumplidas} / {c.sesionesProgramadas}
              </span>
              <span className="text-muted-foreground font-mono text-[11px]">({tasa}%)</span>
            </div>
            <div className="text-muted-foreground flex flex-wrap gap-1.5 text-[10px]">
              {c.sesionesParciales > 0 && <span>Parc: {c.sesionesParciales}</span>}
              {c.sesionesNoCumplidas > 0 && (
                <span className="text-destructive font-medium">
                  No cumpl: {c.sesionesNoCumplidas}
                </span>
              )}
              {c.sesionesJustificadas > 0 && (
                <span className="font-medium text-blue-500">Justif: {c.sesionesJustificadas}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "horas",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Horas pedagógicas" />,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-foreground font-mono text-xs font-semibold">
              {formatearHoras(c.horasDictadas)} / {formatearHoras(c.horasProgramadas)}
            </span>
            <span className="text-muted-foreground text-[11px]">
              {formatearHoras(c.horasPerdidas)} perdidas
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "minutosTotalFuera",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tiempo Fuera" />,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-foreground font-mono text-xs font-semibold">
              {c.tiempoTotalFueraTexto}
            </span>
            <span className="text-muted-foreground text-[11px]">
              {c.totalAusencias} ausencias registradas
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "estado",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" className="justify-center" />
      ),
      cell: ({ row }) => {
        const estado = row.original.estado;
        const config = ESTADOS_CONSOLIDADO_CONFIG[estado] ?? {
          label: estado,
          variant: "secondary" as const,
        };
        return (
          <div className="flex justify-center">
            <Badge variant={config.variant} className={config.className}>
              {config.label}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "decision",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Decisión" className="justify-center" />
      ),
      cell: ({ row }) => {
        const decision = row.original.decision;
        const config = DECISIONES_CONSOLIDADO_CONFIG[decision] ?? {
          label: decision,
          variant: "outline" as const,
        };
        return (
          <div className="flex justify-center">
            <Badge variant={config.variant} className={config.className}>
              {config.label}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ConsolidadoActions
            consolidado={row.original}
            esDirectorOAdmin={options.esDirectorOAdmin}
            onVerDetalle={options.onVerDetalle}
            onDescargarPdf={options.onDescargarPdf}
            onAbrirDecision={options.onAbrirDecision}
            onAbrirReabrir={options.onAbrirReabrir}
            onAbrirCerrar={options.onAbrirCerrar}
            onAbrirHistorial={options.onAbrirHistorial}
            onResolverSolicitud={options.onResolverSolicitud}
          />
        </div>
      ),
    },
  ];
}
