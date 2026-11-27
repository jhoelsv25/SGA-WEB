"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { tituloMes } from "../../utils";

interface NavegacionMesProps {
  anio: number;
  mes: number;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  onHoy: () => void;
}

export function NavegacionMes({
  anio,
  mes,
  onMesAnterior,
  onMesSiguiente,
  onHoy,
}: NavegacionMesProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="outline"
        onClick={onHoy}
        className="bg-card h-9 rounded-full px-5 pointer-coarse:h-11"
      >
        Hoy
      </Button>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Mes anterior"
          onClick={onMesAnterior}
          className="size-9 rounded-full pointer-coarse:size-11"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Mes siguiente"
          onClick={onMesSiguiente}
          className="size-9 rounded-full pointer-coarse:size-11"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
        </Button>
      </div>
      <h2 className="text-foreground text-xl whitespace-nowrap xl:min-w-48" aria-live="polite">
        {tituloMes(anio, mes)}
      </h2>
    </div>
  );
}
