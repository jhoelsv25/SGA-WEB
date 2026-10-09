"use client";

import * as React from "react";
import { formatearFecha, formatearHora } from "../utils/formato";

/**
 * Hook para mantener sincronizado el reloj digital del kiosko en tiempo real.
 *
 * Se actualiza cada segundo y provee la fecha y hora formateadas para la pantalla
 * de gran escala de portería.
 */
export function useRelojDigital() {
  const [fechaActual, setFechaActual] = React.useState<Date | null>(null);

  React.useEffect(() => {
    // Sincronización inicial asíncrona tras hidratación
    const inicial = setTimeout(() => {
      setFechaActual(new Date());
    }, 0);

    const intervalo = setInterval(() => {
      setFechaActual(new Date());
    }, 1000);

    return () => {
      clearTimeout(inicial);
      clearInterval(intervalo);
    };
  }, []);

  const horaFormateada = React.useMemo(() => {
    if (!fechaActual) return "--:--:--";
    return formatearHora(fechaActual);
  }, [fechaActual]);

  const fechaFormateada = React.useMemo(() => {
    if (!fechaActual) return "";
    return formatearFecha(fechaActual);
  }, [fechaActual]);

  return {
    fechaActual: fechaActual ?? new Date(),
    horaFormateada,
    fechaFormateada,
    listo: Boolean(fechaActual),
  };
}
