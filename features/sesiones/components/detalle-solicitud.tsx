"use client";

import { Spinner } from "@/components/common/spinner";
import { useDetalleJustificacion } from "../hooks";

/** Detalle de una solicitud: muestra el contador de permisos personales que calcula la API. */
export function DetalleSolicitud({ id }: { id: string }) {
  const { data, isLoading, isError } = useDetalleJustificacion(id);

  if (isLoading) {
    return (
      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        <Spinner className="size-3.5" /> Cargando detalle…
      </p>
    );
  }
  if (isError || !data) {
    return <p className="text-destructive text-xs font-medium">No se pudo cargar el detalle.</p>;
  }
  const { solicitud, permisosPersonales } = data;
  return (
    <div className="border-border/60 bg-muted/40 space-y-1.5 rounded-xl border p-3 text-sm">
      {permisosPersonales ? (
        <p className="font-medium">{permisosPersonales.mensaje}</p>
      ) : (
        <p className="text-muted-foreground text-xs">
          El contador de permisos personales aplica solo a ese motivo.
        </p>
      )}
      <p className="text-muted-foreground text-xs">
        Solicitada hace {solicitud.antiguedadDias}{" "}
        {solicitud.antiguedadDias === 1 ? "día hábil" : "días hábiles"}.
      </p>
    </div>
  );
}
