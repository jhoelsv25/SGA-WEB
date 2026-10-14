"use client";

import { File02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearFecha } from "../../constants";
import { useHistorialLibretaQuery } from "../../hooks";

interface ModalHistorialLibretaProps {
  libretaId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ModalHistorialLibreta({ libretaId, onOpenChange }: ModalHistorialLibretaProps) {
  const { data, isLoading, isError } = useHistorialLibretaQuery(libretaId ?? undefined);

  return (
    <Modal
      open={Boolean(libretaId)}
      onOpenChange={onOpenChange}
      title="Historial de la libreta"
      description={
        data
          ? `Archivos publicados del ${data.bimestre}, del más reciente al más antiguo.`
          : "Archivos publicados de esta libreta."
      }
      icon={File02Icon}
      size="lg"
    >
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : null}
      {isError ? <p className="text-destructive text-sm">No se pudo cargar el historial.</p> : null}
      {data && data.archivos.length === 0 ? (
        <p className="text-muted-foreground text-sm">Esta libreta aún no tiene archivos.</p>
      ) : null}
      {data && data.archivos.length > 0 ? (
        <ul className="space-y-2">
          {data.archivos.map((archivo) => (
            <li key={archivo.id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{archivo.nombreOriginal}</p>
                <Badge variant={archivo.vigencia === 1 ? "success" : "secondary"}>
                  Vigencia {archivo.vigencia}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {archivo.subidoPorNombre} · {formatearFecha(archivo.subidoEn)} ·{" "}
                {archivo.asignacion === "manual" ? "Asignación manual" : "Asignación automática"}
              </p>
              {archivo.motivo ? <p className="mt-1 text-xs">Motivo: {archivo.motivo}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </Modal>
  );
}
