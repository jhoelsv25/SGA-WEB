"use client";

import * as React from "react";

function suscribirConexion(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot(): boolean {
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  return true;
}

/**
 * Hook para monitorear el estado real de conexión de red del navegador y del terminal.
 *
 * Utiliza React.useSyncExternalStore para sincronizarse de forma óptima con los eventos
 * nativos 'online' y 'offline' del navegador sin provocar re-renderizados en cascada.
 */
export function useConexionRed() {
  const estaEnLinea = React.useSyncExternalStore(suscribirConexion, getSnapshot, getServerSnapshot);

  return { estaEnLinea };
}
