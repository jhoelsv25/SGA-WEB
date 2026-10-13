"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileEditIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/formatters/date";
import { useEntregasDeTarea } from "../hooks";
import { CalificarEntregaModal } from "./calificar-entrega-modal";
import type { Entrega, Tarea } from "../types";

export function EntregasTareaModal({
  abierto,
  onOpenChange,
  tarea,
}: {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  tarea: Tarea | null;
}) {
  const { data: entregas = [], refetch } = useEntregasDeTarea(tarea?.id ?? "");
  const [entregaSeleccionada, setEntregaSeleccionada] = React.useState<Entrega | null>(null);

  if (!tarea) return null;

  return (
    <>
      <Dialog open={abierto} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2 pr-6">
              <DialogTitle>Entregas: {tarea.titulo}</DialogTitle>
              <StatusBadge tone="brand">{tarea.tipo.toUpperCase()}</StatusBadge>
            </div>
            <DialogDescription>
              {entregas.length} entregas registradas · Fecha límite: {formatDate(tarea.fechaLimite)}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            {entregas.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  size={32}
                  className="text-muted-foreground/60 mx-auto"
                />
                <p className="mt-2 text-sm font-medium">Aún no hay entregas de estudiantes</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Las entregas aparecerán aquí conforme los estudiantes las envíen.
                </p>
              </div>
            ) : (
              <div className="divide-y rounded-xl border">
                {entregas.map((ent) => (
                  <div
                    key={ent.id}
                    className="hover:bg-muted/30 flex flex-wrap items-center justify-between gap-3 p-3.5 transition-colors"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">
                          {ent.estudianteNombre || "Estudiante"}
                        </span>
                        {ent.codigo && (
                          <span className="text-muted-foreground font-mono text-xs">
                            ({ent.codigo})
                          </span>
                        )}
                        {ent.esTardia && <StatusBadge tone="warning">Tardía</StatusBadge>}
                        <StatusBadge
                          tone={
                            ent.estado === "calificada"
                              ? "success"
                              : ent.estado === "devuelta"
                                ? "warning"
                                : "neutral"
                          }
                        >
                          {ent.estado.toUpperCase()}
                        </StatusBadge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {ent.entregadaEn
                          ? `Entregado el ${formatDate(ent.entregadaEn)}`
                          : "En progreso"}
                        {ent.intento > 1 && ` · Intento #${ent.intento}`}
                        {ent.archivoNombre && ` · Archivo: ${ent.archivoNombre}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-bold">
                          {ent.nota !== null ? `${ent.nota.toFixed(2)} pts` : "Sin calificar"}
                        </span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 text-xs"
                        onClick={() => setEntregaSeleccionada(ent)}
                      >
                        <HugeiconsIcon icon={FileEditIcon} size={14} />
                        {ent.estado === "calificada" ? "Modificar" : "Calificar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Calificación individual */}
      <CalificarEntregaModal
        abierto={Boolean(entregaSeleccionada)}
        onOpenChange={(open) => {
          if (!open) setEntregaSeleccionada(null);
        }}
        entrega={entregaSeleccionada}
        tarea={tarea}
        onCalificada={() => {
          void refetch();
        }}
      />
    </>
  );
}
