"use client";

import * as React from "react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { DataTable } from "@/components/common/data-table";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { useHistorialVersionesQuery } from "../../hooks";
import type { ConsolidadoResumenItem } from "../../types";
import { getHistorialVersionesColumns } from "../../views/columns";

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

  const columns = React.useMemo(() => getHistorialVersionesColumns(), []);

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
      <div className="py-1">
        {isLoading ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10">
            <Spinner className="size-6" />
            <p className="text-xs">Cargando versiones anteriores...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={historial}
            pagination={false}
            caption="Historial de versiones y motivos de cambio del consolidado"
            emptyMessage="No se encontraron versiones anteriores registradas para este consolidado."
          />
        )}
      </div>
    </Modal>
  );
}
