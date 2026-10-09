"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";
import type { Institucion } from "@/features/institucion/types";

interface KioskoFooterProps {
  institucion?: Institucion | null;
  estaEnLinea: boolean;
}

export function KioskoFooter({ institucion, estaEnLinea }: KioskoFooterProps) {
  const telefonoSoporte =
    institucion?.telefono ||
    siteConfig.institution.contact.supportPhone ||
    siteConfig.institution.contact.phone;

  return (
    <footer className="text-muted-foreground border-border/80 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs">
      {/* Indicador de conexión real con soporte de eventos online / offline */}
      <div className="flex items-center gap-2 font-medium">
        <span
          className={`size-2.5 rounded-full transition-colors ${
            estaEnLinea ? "bg-success shadow-success/40 shadow-xs" : "bg-destructive animate-pulse"
          }`}
          aria-hidden="true"
        />
        <span className={estaEnLinea ? "text-foreground" : "text-destructive font-semibold"}>
          {estaEnLinea ? "En línea • Conectado a SGA API" : "Sin conexión • Modo sin conexión"}
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
