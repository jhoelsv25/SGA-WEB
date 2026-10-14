"use client";

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatearFecha, tituloBimestre } from "../constants";
import type { PeriodoLibreta } from "../types";

interface PanelProgramarLibretasProps {
  periodos: PeriodoLibreta[];
  onProgramar: (periodo: PeriodoLibreta) => void;
}

export function PanelProgramarLibretas({ periodos, onProgramar }: PanelProgramarLibretasProps) {
  const programados = periodos.filter((periodo) => periodo.programada).length;

  return (
    <div className="space-y-4">
      <div className="border-primary/20 bg-primary/5 flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="text-primary mt-0.5 size-5 shrink-0"
        />
        <p>
          <span className="font-semibold">Programar no sube archivos.</span> Crea una libreta
          pendiente por cada estudiante matriculado y guarda la fecha límite. Publicar ese día o
          antes queda a tiempo; después, fuera de plazo.
        </p>
      </div>

      {periodos.length === 0 ? (
        <p className="text-muted-foreground text-sm">Este año no tiene bimestres.</p>
      ) : (
        <>
          <p className="text-sm">
            <span className="font-semibold">
              {programados} de {periodos.length}
            </span>{" "}
            {periodos.length === 1 ? "bimestre tiene" : "bimestres tienen"} fecha límite.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {periodos.map((periodo) => (
              <li key={periodo.id} className="bg-card flex flex-col rounded-xl border p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {tituloBimestre(periodo.nombre)}
                  </h3>
                  <StatusBadge
                    tone={periodo.programada ? "success" : "neutral"}
                    dot
                    className="shrink-0"
                  >
                    {periodo.programada ? "Programado" : "Sin programar"}
                  </StatusBadge>
                </div>
                <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                  {periodo.programada
                    ? `Los docentes publican hasta el ${formatearFecha(periodo.fechaLimite)}. Cambiar la fecha solo afecta a las libretas que aún no se subieron.`
                    : "Todavía no hay fecha límite. Sin esto, nadie puede subir las libretas de este bimestre."}
                </p>
                <Button
                  type="button"
                  variant={periodo.programada ? "outline" : "default"}
                  className="mt-4 w-full"
                  onClick={() => onProgramar(periodo)}
                >
                  {periodo.programada ? "Cambiar fecha límite" : "Fijar fecha límite"}
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
