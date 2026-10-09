"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, RefreshIcon, SecurityLockIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface KioskoPantallaNoAutorizadoProps {
  tieneTokenLocal: boolean;
  horaActual?: string;
  onReintentar: () => void;
}

export function KioskoPantallaNoAutorizado({
  tieneTokenLocal,
  horaActual,
  onReintentar,
}: KioskoPantallaNoAutorizadoProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-background flex min-h-screen flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="border-destructive/30 bg-card w-full max-w-md space-y-6 rounded-3xl border p-8 shadow-2xl">
        <div className="border-destructive/20 bg-destructive/10 text-destructive mx-auto flex size-20 items-center justify-center rounded-3xl border shadow-inner">
          <HugeiconsIcon icon={SecurityLockIcon} className="size-10" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="border-destructive/30 bg-destructive/15 text-destructive inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
            <HugeiconsIcon icon={Alert02Icon} className="size-3.5" aria-hidden="true" />
            Terminal No Habilitada
          </span>
          <h1 className="text-foreground text-xl font-extrabold tracking-tight">
            Este equipo no está autorizado. Comuníquese con el área de TI.
          </h1>
          <p className="text-muted-foreground pt-1 text-xs leading-relaxed">
            Para operar este kiosko de asistencia o firma de sesiones, el personal de Soporte TI
            debe registrar y autorizar este navegador desde el panel de administración.
          </p>
        </div>

        <div className="border-border/80 bg-muted/40 space-y-2 rounded-xl border p-3.5 text-left font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estado clave local:</span>
            <span
              className={
                tieneTokenLocal
                  ? "text-warning-text font-semibold"
                  : "text-destructive font-semibold"
              }
            >
              {tieneTokenLocal ? "Token presente pero inactivo" : "Sin clave configurada"}
            </span>
          </div>
          {horaActual && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hora del sistema:</span>
              <span className="text-foreground">{horaActual}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={onReintentar}
            className="h-12 w-full gap-2 rounded-2xl text-xs font-bold"
          >
            <HugeiconsIcon icon={RefreshIcon} className="size-4" aria-hidden="true" />
            Reintentar Verificación
          </Button>

          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground hover:text-foreground h-11 w-full text-xs"
          >
            <Link href="/login">Acceso para Soporte TI y Administrador</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
