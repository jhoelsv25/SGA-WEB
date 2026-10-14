"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartLineData02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { useResumenConductaQuery } from "../../hooks";
import { FichaResumenConducta } from "../cards/ficha-resumen-conducta";

export interface ModalResumenEstudianteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matriculaId: string | null;
}

export function ModalResumenEstudiante({
  open,
  onOpenChange,
  matriculaId,
}: ModalResumenEstudianteProps) {
  const { data: resumen, isLoading } = useResumenConductaQuery(
    matriculaId ?? undefined,
    Boolean(open && matriculaId),
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Ficha de Convivencia y Conducta"
      description="Historial consolidado por periodos académicos del año escolar en curso."
      icon={ChartLineData02Icon}
      size="xl"
    >
      {isLoading ? (
        <div className="space-y-4 py-4">
          <Skeleton className="h-16 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      ) : resumen ? (
        <div className="py-2">
          <FichaResumenConducta resumen={resumen} />
        </div>
      ) : (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No se encontró información de conducta para esta matrícula.
        </div>
      )}
    </Modal>
  );
}
