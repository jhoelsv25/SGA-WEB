"use client";

import { Modal } from "@/components/common/modal";
import { Clock01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { Spinner } from "@/components/common/spinner";
import { formatDateTime } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";
import { useVariableHistorialQuery } from "../../hooks";
import { cleanDescription } from "../../utils";
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
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Historial de versiones"
      description={`Registro de cambios de valor, justificaciones y autores de «${cleanDescription(variable.descripcion)}» (${variable.codigo}).`}
      icon={Clock01Icon}
      size="2xl"
      footer={
        <div className="flex w-full justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cerrar</span>
          </Button>
        </div>
      }
    >
      <div className="flex-1 py-1 pr-1">
        {isLoading ? (
          <div className="flex h-36 flex-col items-center justify-center gap-2">
            <Spinner className="size-6" />
            <p className="text-muted-foreground text-xs">Cargando historial...</p>
          </div>
        ) : historial.length === 0 ? (
          <p className="text-muted-foreground p-6 text-center text-sm">
            No se encontraron registros en el historial.
          </p>
        ) : (
          <div className="space-y-3">
            {historial.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  item.vigente ? "border-primary/25 bg-primary/5" : "border-border/60 bg-muted/20",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-foreground font-mono text-base font-bold">
                      {item.valor}
                    </span>
                    {item.unidad && (
                      <span className="text-muted-foreground text-xs font-normal">
                        {item.unidad}
                      </span>
                    )}
                    {item.vigente ? (
                      <StatusBadge tone="success" dot size="sm">
                        Vigente
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral" size="sm">
                        Inactivo
                      </StatusBadge>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {formatDateTime(item.creadoEn)}
                  </span>
                </div>

                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground font-medium">Motivo: </span>
                  <span className="text-foreground">
                    {item.motivoCambio || "Sin motivo registrado"}
                  </span>
                </div>

                {item.actualizadoPorNombre && (
                  <div className="text-muted-foreground mt-1 text-xs">
                    <span>Modificado por: </span>
                    <span className="text-foreground font-medium">{item.actualizadoPorNombre}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
