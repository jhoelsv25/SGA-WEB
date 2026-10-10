"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Location01Icon, Coffee01Icon, Book02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { BloqueHorarioVista } from "../types";
import { obtenerEstilosContraste } from "../utils";

interface BloqueCardProps {
  bloque: BloqueHorarioVista;
  className?: string;
  compacto?: boolean;
}

export function BloqueCard({ bloque, className, compacto = false }: BloqueCardProps) {
  const esReceso = bloque.tipoBloque === "receso";

  if (esReceso) {
    return (
      <div
        role="article"
        tabIndex={0}
        aria-label={`Receso escolar de ${bloque.horaInicio} a ${bloque.horaFin}`}
        className={cn(
          "border-border/80 bg-muted/70 hover:bg-muted text-muted-foreground focus-visible:ring-ring flex flex-col justify-between rounded-xl border border-dashed transition-colors focus-visible:ring-2 focus-visible:outline-none",
          compacto ? "p-2.5 text-xs" : "p-3 text-sm",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 font-medium">
            <HugeiconsIcon icon={Coffee01Icon} className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="font-semibold">{bloque.cursoNombre}</span>
          </div>
          <span className="text-muted-foreground/80 font-mono text-[11px] font-medium">
            {bloque.duracionMinutos} min
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1 text-[11px]">
          <HugeiconsIcon icon={Clock01Icon} className="size-3 shrink-0" aria-hidden="true" />
          <span className="font-mono">
            {bloque.horaInicio} – {bloque.horaFin}
          </span>
        </div>
      </div>
    );
  }

  const { colorTexto, colorSecundario, colorBorde, fondoEstilo } = obtenerEstilosContraste(
    bloque.colorHex,
  );

  const descripcionAccesible = [
    `Clase de ${bloque.cursoNombre}`,
    `de ${bloque.horaInicio} a ${bloque.horaFin}`,
    bloque.subtitulo ? bloque.subtitulo : null,
    bloque.aula ? `en aula ${bloque.aula}` : null,
    bloque.esBloqueDoble ? "bloque doble" : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      role="article"
      tabIndex={0}
      aria-label={descripcionAccesible}
      style={{
        ...fondoEstilo,
        color: colorTexto,
        borderColor: colorBorde,
      }}
      className={cn(
        "focus-visible:ring-ring relative flex flex-col justify-between rounded-xl border shadow-xs transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:outline-none",
        compacto ? "p-2.5" : "p-3.5",
        className,
      )}
    >
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Book02Icon}
              className="size-3.5 shrink-0 opacity-80"
              aria-hidden="true"
            />
            <h4
              style={{ color: colorTexto }}
              className={cn("line-clamp-2 font-bold", compacto ? "text-xs" : "text-sm")}
            >
              {bloque.cursoNombre}
            </h4>
          </div>

          {bloque.esBloqueDoble && (
            <span
              style={{
                backgroundColor: colorBorde,
                color: colorTexto,
              }}
              className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
            >
              Doble
            </span>
          )}
        </div>

        {bloque.subtitulo && (
          <p
            style={{ color: colorSecundario }}
            className={cn("line-clamp-1 font-medium", compacto ? "text-[11px]" : "text-xs")}
          >
            {bloque.subtitulo}
          </p>
        )}
      </div>

      <div
        style={{ color: colorSecundario }}
        className="mt-2.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px]"
      >
        <div className="flex items-center gap-1 font-mono">
          <HugeiconsIcon
            icon={Clock01Icon}
            className="size-3 shrink-0 opacity-80"
            aria-hidden="true"
          />
          <span>
            {bloque.horaInicio} – {bloque.horaFin}
          </span>
        </div>

        {bloque.aula && (
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Location01Icon}
              className="size-3 shrink-0 opacity-80"
              aria-hidden="true"
            />
            <span className="line-clamp-1">{bloque.aula}</span>
          </div>
        )}
      </div>
    </div>
  );
}
