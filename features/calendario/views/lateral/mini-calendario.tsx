"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { diasDeLaCuadricula, fechaLarga, isoDeFecha, tituloMes } from "../../utils";

const INICIALES = ["D", "L", "M", "X", "J", "V", "S"];

interface MiniCalendarioProps {
  anio: number;
  mes: number;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  onAbrirDia: (iso: string) => void;
}

export function MiniCalendario({
  anio,
  mes,
  onMesAnterior,
  onMesSiguiente,
  onAbrirDia,
}: MiniCalendarioProps) {
  const hoy = isoDeFecha(new Date());

  return (
    <div>
      <div className="flex items-center justify-between pl-1">
        <p className="text-foreground text-sm font-semibold">{tituloMes(anio, mes)}</p>
        <div className="flex">
          {[
            { etiqueta: "Mes anterior", icono: ArrowLeft01Icon, accion: onMesAnterior },
            { etiqueta: "Mes siguiente", icono: ArrowRight01Icon, accion: onMesSiguiente },
          ].map((b) => (
            <button
              key={b.etiqueta}
              type="button"
              onClick={b.accion}
              aria-label={`${b.etiqueta} en el mini calendario`}
              className="hover:bg-foreground/5 focus-visible:ring-primary flex size-7 items-center justify-center rounded-full outline-none focus-visible:ring-2"
            >
              <HugeiconsIcon icon={b.icono} className="size-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-7 justify-items-center gap-y-1">
        {INICIALES.map((inicial, i) => (
          <span key={i} aria-hidden="true" className="text-muted-foreground text-[11px]">
            {inicial}
          </span>
        ))}
        {diasDeLaCuadricula(anio, mes).map((fecha) => {
          const iso = isoDeFecha(fecha);
          if (fecha.getMonth() !== mes - 1) {
            return (
              <span
                key={iso}
                className="text-muted-foreground/60 flex size-7 items-center justify-center text-xs tabular-nums"
              >
                {fecha.getDate()}
              </span>
            );
          }
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onAbrirDia(iso)}
              aria-label={fechaLarga(iso)}
              aria-current={iso === hoy ? "date" : undefined}
              className={cn(
                "focus-visible:ring-primary flex size-7 items-center justify-center rounded-full text-xs tabular-nums outline-none focus-visible:ring-2",
                iso === hoy
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-foreground hover:bg-foreground/5",
              )}
            >
              {fecha.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
