"use client";

import * as React from "react";
import { TIEMPO_INACTIVIDAD_REINICIO_MS } from "../consts";

interface UseInactividadProps {
  activo: boolean;
  onInactividad: () => void;
  tiempoMs?: number;
}

/**
 * Hook que activa un temporizador de reinicio automático tras inactividad.
 * Borra el código ingresado tras 20 segundos de desuso para proteger la privacidad
 * y dejar la pantalla lista para la siguiente persona en la fila.
 */
export function useInactividad({
  activo,
  onInactividad,
  tiempoMs = TIEMPO_INACTIVIDAD_REINICIO_MS,
}: UseInactividadProps) {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const reiniciarTemporizador = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (activo) {
      timerRef.current = setTimeout(() => {
        onInactividad();
      }, tiempoMs);
    }
  }, [activo, onInactividad, tiempoMs]);

  React.useEffect(() => {
    reiniciarTemporizador();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [reiniciarTemporizador]);

  return { reiniciarTemporizador };
}
