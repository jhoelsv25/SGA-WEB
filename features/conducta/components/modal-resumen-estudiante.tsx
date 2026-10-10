"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartLineData02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useResumenConductaQuery } from "../hooks";
import { FichaResumenConducta } from "./ficha-resumen-conducta";

interface ModalResumenEstudianteProps {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={ChartLineData02Icon} className="text-primary" />
            Ficha de Convivencia y Conducta
          </DialogTitle>
          <DialogDescription>
            Historial consolidado por periodos académicos del año escolar en curso.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-3">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ) : resumen ? (
          <FichaResumenConducta resumen={resumen} />
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No se encontró información de conducta para esta matrícula.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
