"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/common/spinner";
import { useVariableHistorialQuery } from "../../hooks";
import type { VariableSistema } from "../../types";

interface HistorialVariableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variable: VariableSistema | null;
}

export function HistorialVariableModal({
  open,
  onOpenChange,
  variable,
}: HistorialVariableModalProps) {
  const { data: historial = [], isLoading } = useVariableHistorialQuery(
    open && variable ? variable.codigo : null,
  );

  if (!variable) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Historial de Versiones</DialogTitle>
            <Badge variant="outline" className="text-xs">
              {variable.codigo}
            </Badge>
          </div>
          <DialogDescription>
            Registro de todos los cambios de valor, justificaciones y autores de esta variable.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex h-36 items-center justify-center">
              <Spinner className="text-primary h-6 w-6" />
            </div>
          ) : historial.length === 0 ? (
            <p className="text-muted-foreground p-4 text-center text-sm">
              No se encontraron registros en el historial.
            </p>
          ) : (
            <div className="space-y-3">
              {historial.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border p-3.5 transition-colors ${
                    item.vigente
                      ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-mono text-base font-bold">
                        {item.valor}{" "}
                        {item.unidad && (
                          <span className="text-muted-foreground text-xs font-normal">
                            {item.unidad}
                          </span>
                        )}
                      </span>
                      {item.vigente ? (
                        <Badge
                          variant="default"
                          className="bg-emerald-600 text-[11px] text-white hover:bg-emerald-700"
                        >
                          Vigente
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground text-[11px]">
                          Vigencia 0 (Inactivo)
                        </Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {new Date(item.creadoEn).toLocaleString("es-PE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <div className="mt-2 text-xs">
                    <span className="text-muted-foreground font-semibold">Motivo: </span>
                    <span className="text-foreground">
                      {item.motivoCambio || "Sin motivo registrado"}
                    </span>
                  </div>

                  {item.actualizadoPorNombre && (
                    <div className="text-muted-foreground mt-1 text-xs">
                      <span>Modificado por: </span>
                      <span className="text-foreground font-medium">
                        {item.actualizadoPorNombre}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
