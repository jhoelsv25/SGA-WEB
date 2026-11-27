"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { DIAS_SEMANA_LABORALES } from "../consts";
import type { BloqueHorarioVista } from "../types";
import { BloqueCard } from "./bloque-card";

interface MiHorarioDiaProps {
  bloques: readonly BloqueHorarioVista[];
}

export function MiHorarioDia({ bloques }: MiHorarioDiaProps) {
  // Inicializar en el día actual si es de lunes a viernes, o lunes (1) por defecto
  const [diaSeleccionado, setDiaSeleccionado] = React.useState<number>(() => {
    const hoy = new Date().getDay(); // 0 = Domingo, 1 = Lunes, ..., 5 = Viernes, 6 = Sábado
    if (hoy >= 1 && hoy <= 5) return hoy;
    return 1;
  });

  const bloquesDelDia = React.useMemo(() => {
    return bloques.filter((b) => b.diaSemana === diaSeleccionado);
  }, [bloques, diaSeleccionado]);

  const infoDia = DIAS_SEMANA_LABORALES.find((d) => d.numero === diaSeleccionado);

  return (
    <div className="space-y-4">
      {/* Selector de días táctil para dispositivos móviles (mínimo 44px de alto) */}
      <nav
        aria-label="Selección de día escolar"
        className="border-border/60 bg-card flex items-center justify-between gap-1 overflow-x-auto rounded-2xl border p-1.5 shadow-xs"
      >
        {DIAS_SEMANA_LABORALES.map((dia) => {
          const estaActivo = dia.numero === diaSeleccionado;
          const cantidadBloques = bloques.filter((b) => b.diaSemana === dia.numero).length;

          return (
            <Button
              key={dia.numero}
              type="button"
              variant={estaActivo ? "default" : "ghost"}
              onClick={() => setDiaSeleccionado(dia.numero)}
              aria-current={estaActivo ? "page" : undefined}
              aria-label={`${dia.nombreCompleto}, ${cantidadBloques} bloques programados`}
              className="h-11 min-w-[44px] flex-1 flex-col justify-center rounded-xl px-2 py-1 transition-all"
            >
              <span className="text-xs leading-none font-bold">{dia.nombreCorto}</span>
              <span className="mt-1 font-mono text-[10px] leading-none opacity-80">
                {cantidadBloques} {cantidadBloques === 1 ? "bloque" : "bloques"}
              </span>
            </Button>
          );
        })}
      </nav>

      {/* Cabecera del día seleccionado */}
      <div className="border-border/60 bg-muted/20 flex items-center justify-between rounded-xl border px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-4" aria-hidden="true" />
          <h3 className="text-foreground text-sm font-bold">{infoDia?.nombreCompleto}</h3>
        </div>
        <div className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
          <HugeiconsIcon icon={Clock01Icon} className="size-3.5" aria-hidden="true" />
          <span>{bloquesDelDia.length} asignaciones</span>
        </div>
      </div>

      {/* Lista cronológica de bloques del día */}
      {bloquesDelDia.length > 0 ? (
        <div className="space-y-2.5">
          {bloquesDelDia.map((bloque) => (
            <BloqueCard key={bloque.id} bloque={bloque} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`Sin clases para el ${infoDia?.nombreCompleto.toLowerCase() ?? "día"}`}
          description="No se registran bloques pedagógicos ni recesos asignados en este día."
          className="min-h-52"
        />
      )}
    </div>
  );
}
