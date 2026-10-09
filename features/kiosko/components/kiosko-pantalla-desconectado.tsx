"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon, WifiDisconnected01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface KioskoPantallaDesconectadoProps {
  onReintentar: () => void;
}

export function KioskoPantallaDesconectado({ onReintentar }: KioskoPantallaDesconectadoProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-background flex min-h-screen flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="border-border/80 bg-card w-full max-w-md space-y-6 rounded-3xl border p-8 shadow-2xl">
        <div className="border-warning/30 bg-warning/10 text-warning mx-auto flex size-20 items-center justify-center rounded-3xl border shadow-inner">
          <HugeiconsIcon icon={WifiDisconnected01Icon} className="size-10" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="border-warning/30 bg-warning/15 text-warning-text inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
            Modo Sin Conexión
          </span>
          <h1 className="text-foreground text-xl font-extrabold tracking-tight">
            Sin conexión con el servidor
          </h1>
          <p className="text-muted-foreground pt-1 text-xs leading-relaxed">
            El terminal kiosko no puede comunicarse con los servicios del SGA. Verifique la conexión
            de red de la portería o el cable de datos.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={onReintentar}
            className="h-12 w-full gap-2 rounded-2xl text-sm font-bold shadow-md"
          >
            <HugeiconsIcon icon={RefreshIcon} className="size-4" aria-hidden="true" />
            Reintentar Conexión
          </Button>
        </div>
      </div>
    </div>
  );
}
