"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { ESTADOS_MARCACION_CONFIG } from "../consts";
import type { AvisoKiosko } from "../types";

interface KioskoAvisoResultadoProps {
  aviso: AvisoKiosko | null;
  onCerrar: () => void;
}

export function KioskoAvisoResultado({ aviso, onCerrar }: KioskoAvisoResultadoProps) {
  if (!aviso) return null;

  const esError = aviso.tipo === "error";
  const esExito = aviso.tipo === "exito";

  return (
    <aside
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="animate-in fade-in slide-in-from-top-4 fixed inset-x-4 top-6 z-50 mx-auto max-w-xl duration-200"
    >
      <div
        className={`border-border/80 bg-card/98 relative rounded-3xl border p-6 shadow-2xl backdrop-blur-md transition-all ${
          esError
            ? "border-destructive/40 shadow-destructive/10"
            : esExito
              ? "border-success/40 shadow-success/10"
              : "border-info/40 shadow-info/10"
        }`}
      >
        {/* Botón de cierre manual accesible */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onCerrar}
          aria-label="Cerrar aviso de marcación"
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4 rounded-full"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" aria-hidden="true" />
        </Button>

        <div className="flex items-start gap-4">
          {/* Icono semántico del estado */}
          <div
            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border ${
              esError
                ? "border-destructive/20 bg-destructive/10 text-destructive"
                : esExito
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-info/20 bg-info/10 text-info"
            }`}
          >
            <HugeiconsIcon
              icon={
                esError ? AlertCircleIcon : esExito ? CheckmarkCircle02Icon : InformationCircleIcon
              }
              className="size-8"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-2 pr-6">
            {/* Título o Nombre de la persona */}
            <h2 className="text-foreground text-lg font-extrabold tracking-tight sm:text-xl">
              {aviso.persona ? aviso.persona.nombre : aviso.titulo}
            </h2>

            {/* Metadatos de la marcación si existen */}
            {aviso.persona && (
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {/* Insignia de rol */}
                <span className="border-border bg-muted/60 text-foreground rounded-lg border px-2.5 py-0.5 text-xs font-semibold capitalize">
                  {aviso.persona.rol}
                </span>

                {/* Insignia de estado de marcación */}
                {aviso.estado && (
                  <StatusBadge tone={ESTADOS_MARCACION_CONFIG[aviso.estado].tone} dot size="sm">
                    {ESTADOS_MARCACION_CONFIG[aviso.estado].label}
                  </StatusBadge>
                )}

                {/* Hora de marcación */}
                {aviso.hora && (
                  <span className="text-muted-foreground font-mono text-xs font-semibold">
                    Hora: {aviso.hora}
                  </span>
                )}
              </div>
            )}

            {/* Mensaje descriptivo legible a distancia */}
            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              {aviso.mensaje}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
