"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";
import type { Institucion } from "@/features/institucion/types";
import { COLA_SIN_CONEXION_HABILITADA } from "../consts";

interface KioskoFooterProps {
  institucion?: Institucion | null;
  estaEnLinea: boolean;
  totalPendientes?: number;
  enviandoCola?: boolean;
}

export function KioskoFooter({
  institucion,
  estaEnLinea,
  totalPendientes = 0,
  enviandoCola = false,
}: KioskoFooterProps) {
  const telefonoSoporte =
    institucion?.telefono ||
    siteConfig.institution.contact.supportPhone ||
    siteConfig.institution.contact.phone;

  // Con COLA_SIN_CONEXION_HABILITADA = false, nada cambia respecto de T13
  let textoConexion: string;
  let puntoColorClase: string;

  if (!COLA_SIN_CONEXION_HABILITADA) {
    textoConexion = estaEnLinea
      ? "En línea • Conectado a SGA API"
      : "Sin conexión • Modo sin conexión";
    puntoColorClase = estaEnLinea
      ? "bg-success shadow-success/40 shadow-xs"
      : "bg-destructive animate-pulse";
  } else {
    // Con la bandera activa, reflejar los datos reales de la cola
    if (!estaEnLinea) {
      textoConexion = `Sin conexión · ${totalPendientes} pendientes`;
      puntoColorClase = "bg-destructive animate-pulse";
    } else if (enviandoCola || totalPendientes > 0) {
      textoConexion = `En línea · enviando ${totalPendientes}`;
      puntoColorClase = "bg-warning shadow-warning/40 shadow-xs animate-pulse";
    } else {
      textoConexion = "En línea • Conectado a SGA API";
      puntoColorClase = "bg-success shadow-success/40 shadow-xs";
    }
  }

  return (
    <footer className="text-muted-foreground border-border/80 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs">
      {/* Indicador de conexión real con soporte de eventos online / offline y estado de cola */}
      <div className="flex items-center gap-2 font-medium" aria-live="polite" aria-atomic="true">
        <span
          className={`size-2.5 rounded-full transition-colors ${puntoColorClase}`}
          aria-hidden="true"
        />
        <span className={estaEnLinea ? "text-foreground" : "text-destructive font-semibold"}>
          {textoConexion}
        </span>
      </div>

      {/* Información de soporte oficial sin datos ficticios */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        {telefonoSoporte && (
          <span>
            Soporte TI: <strong className="text-foreground">{telefonoSoporte}</strong>
          </span>
        )}
        <span className="hidden sm:inline" aria-hidden="true">
          •
        </span>
        <span className="hidden sm:inline">{siteConfig.institution.contact.schedule}</span>
      </div>
    </footer>
  );
}
