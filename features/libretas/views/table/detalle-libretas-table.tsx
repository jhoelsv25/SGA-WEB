"use client";

import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/common/data-table";
import { ETIQUETA_ESTADO, formatearFecha } from "../../constants";
import type { DetalleLibreta, EstadoLibreta } from "../../types";
import { ModalHistorialLibreta } from "../../components/modals";
import { DetalleLibretaActions } from "./columns/detalle-libreta-actions";
import { getDetalleLibretaColumns } from "./columns/detalle-libreta-columns";

const VARIANTE_ESTADO: Record<EstadoLibreta, "secondary" | "success" | "warning"> = {
  pendiente: "secondary",
  a_tiempo: "success",
  fuera_de_plazo: "warning",
};

interface DetalleLibretasTableProps {
  data: DetalleLibreta[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  puedeHistorial: boolean;
}

export function DetalleLibretasTable({
  data,
  isLoading,
  isError,
  onRetry,
  puedeHistorial,
}: DetalleLibretasTableProps) {
  const [libretaId, setLibretaId] = useState<string | null>(null);
  const abrirHistorial = useCallback((id: string) => setLibretaId(id), []);
  const columns = useMemo(
    () => getDetalleLibretaColumns({ puedeHistorial, onHistorial: abrirHistorial }),
    [puedeHistorial, abrirHistorial],
  );
  const filas = useMemo(() => data, [data]);

  const tarjeta = useCallback(
    (libreta: DetalleLibreta) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">{libreta.nombreCompleto}</p>
            <p className="text-muted-foreground text-xs">{libreta.codigo}</p>
          </div>
          {puedeHistorial ? (
            <DetalleLibretaActions libreta={libreta} onHistorial={abrirHistorial} />
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant={VARIANTE_ESTADO[libreta.estado]}>{ETIQUETA_ESTADO[libreta.estado]}</Badge>
          <span className="text-muted-foreground">
            {libreta.vistoEn ? `Vista ${formatearFecha(libreta.vistoEn)}` : "Aún no vista"}
          </span>
          <span className="text-muted-foreground">
            Límite {formatearFecha(libreta.fechaLimite)}
          </span>
        </div>
      </div>
    ),
    [abrirHistorial, puedeHistorial],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={filas}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        searchKey="nombreCompleto"
        searchPlaceholder="Buscar estudiante"
        caption="Libretas de la sección"
        emptyState={{
          title: "No hay libretas en esta sección",
          description: "Cuando el bimestre esté programado, aquí aparece cada estudiante.",
        }}
        mobileCard={tarjeta}
      />
      <ModalHistorialLibreta
        libretaId={libretaId}
        onOpenChange={(abierto) => {
          if (!abierto) setLibretaId(null);
        }}
      />
    </>
  );
}
