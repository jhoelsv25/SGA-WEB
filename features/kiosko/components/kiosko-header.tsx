"use client";

import * as React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { School01Icon, VolumeHighIcon, VolumeOffIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { siteConfig } from "@/config/site";
import { resolveBackendUrl } from "@/lib/api-client";
import type { Institucion } from "@/features/institucion/types";
import type { Equipo, ValidarEquipoResponse } from "@/features/equipos/types";

interface KioskoHeaderProps {
  institucion?: Institucion | null;
  equipo?: ValidarEquipoResponse["equipo"] | Equipo | null;
  sonidoHabilitado: boolean;
  onAlternarSonido: () => void;
}

export function KioskoHeader({
  institucion,
  equipo,
  sonidoHabilitado,
  onAlternarSonido,
}: KioskoHeaderProps) {
  const nombreInstitucion = institucion?.nombre || siteConfig.institution.name;
  const esSesiones = equipo?.proposito === "sesiones";

  return (
    <header className="border-border/80 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
      {/* Identidad y datos del equipo */}
      <div className="flex items-center gap-3 sm:gap-4">
        {institucion?.logoUrl ? (
          <div className="border-border/60 bg-muted/40 relative flex size-14 shrink-0 items-center justify-center rounded-2xl border p-2 shadow-2xs">
            <Image
              src={resolveBackendUrl(institucion.logoUrl)}
              alt="Insignia institucional"
              width={56}
              height={56}
              className="max-h-full max-w-full object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="border-primary/20 bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-2xl border shadow-2xs">
            <HugeiconsIcon icon={School01Icon} className="size-7" aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0">
          <h1 className="text-foreground truncate text-base font-bold tracking-tight sm:text-lg">
            {nombreInstitucion}
          </h1>
          <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-foreground font-semibold">
              {equipo?.nombre || "Terminal Kiosko"}
            </span>
            {equipo?.ubicacion && (
              <>
                <span aria-hidden="true">•</span>
                <span>{equipo.ubicacion}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controles de accesibilidad, sonido y tema */}
      <div className="flex items-center gap-2 sm:gap-3">
        <StatusBadge tone="brand" dot size="sm" className="hidden sm:inline-flex">
          {esSesiones ? "Kiosko de Sesiones" : "Terminal Autorizada"}
        </StatusBadge>

        {/* Botón de alternar audio */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-pressed={sonidoHabilitado}
          aria-label={
            sonidoHabilitado ? "Silenciar audio y voz del kiosko" : "Activar audio y voz del kiosko"
          }
          onClick={onAlternarSonido}
          className="size-11 shrink-0 rounded-full"
        >
          <HugeiconsIcon
            icon={sonidoHabilitado ? VolumeHighIcon : VolumeOffIcon}
            className="size-5"
            aria-hidden="true"
          />
        </Button>

        {/* Conmutador de modo claro y oscuro */}
        <ThemeToggle className="border-border/80 size-11 shrink-0 rounded-full border" />
      </div>
    </header>
  );
}
