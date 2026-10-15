"use client";

import * as React from "react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ESTADOS_CONSOLIDADO_CONFIG } from "../../consts";
import { useHistorialVersionesQuery } from "../../hooks";
import type { ConsolidadoResumenItem } from "../../types";

export interface ModalHistorialVersionesProps {
  consolidado: ConsolidadoResumenItem | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}

export function ModalHistorialVersiones({
  consolidado,
  abierto,
  onOpenChange,
}: ModalHistorialVersionesProps) {
  const { data: historial = [], isLoading } = useHistorialVersionesQuery(
    consolidado?.id ?? "",
    abierto && Boolean(consolidado?.id),
  );

  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Historial de Versiones del Consolidado"
      description={
        consolidado
          ? `Docente: ${consolidado.docenteNombre} · ${consolidado.periodoNombre}`
          : "Consulta de versiones anteriores."
      }
      icon={Clock01Icon}
      size="3xl"
    >
      <div className="py-2">
        {isLoading ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10">
            <Spinner className="size-6" />
            <p className="text-xs">Cargando versiones anteriores...</p>
          </div>
        ) : historial.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No se encontraron versiones anteriores registradas para este consolidado.
          </div>
        ) : (
          <div className="border-border/60 overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Versión</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Sesiones (Prog/Cumpl)</TableHead>
                  <TableHead>Min. Fuera</TableHead>
                  <TableHead>Motivo del Cambio</TableHead>
                  <TableHead>Generado Por</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((v) => {
                  const estCfg = ESTADOS_CONSOLIDADO_CONFIG[v.estado] ?? {
                    label: v.estado,
                    variant: "secondary" as const,
                  };
                  return (
                    <TableRow key={v.id} className={v.vigente ? "bg-muted/30 font-medium" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={v.vigente ? "default" : "outline"} className="text-xs">
                            v{v.version}
                          </Badge>
                          {v.vigente && (
                            <span className="text-primary text-[10px] font-bold tracking-wider uppercase">
                              (Vigente)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={estCfg.variant} className={estCfg.className}>
                          {estCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {v.sesionesCumplidas}/{v.sesionesProgramadas}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{v.minutosTotalFuera} min</TableCell>
                      <TableCell className="max-w-xs truncate text-xs" title={v.motivoCambio ?? ""}>
                        {v.motivoCambio || "—"}
                      </TableCell>
                      <TableCell className="text-xs">{v.generadoPorNombre}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {v.generadoEn ? new Date(v.generadoEn).toLocaleDateString("es-PE") : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Modal>
  );
}
