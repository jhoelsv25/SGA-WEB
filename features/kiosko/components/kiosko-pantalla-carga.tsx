"use client";

import * as React from "react";
import { Spinner } from "@/components/common/spinner";

export function KioskoPantallaCarga() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-background flex min-h-screen flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="border-border/80 bg-card/90 mb-4 rounded-3xl border p-5 shadow-xl">
        <Spinner className="text-primary size-10" />
      </div>
      <h2 className="text-foreground text-lg font-bold tracking-tight">
        Iniciando Terminal SGA...
      </h2>
      <p className="text-muted-foreground mt-1 max-w-sm text-xs">
        Verificando autorización y seguridad del dispositivo
      </p>
    </div>
  );
}
