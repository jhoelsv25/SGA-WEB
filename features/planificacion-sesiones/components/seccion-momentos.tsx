"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MOMENTOS } from "../consts";
import type { GuardarPlanificacionPayload, Momento } from "../types";
import { sumaMinutos } from "../utils";

type MomentoForm = NonNullable<GuardarPlanificacionPayload["momentos"]>[number];

interface Props {
  valor: MomentoForm[];
  minutosBloque: number;
  onChange: (v: MomentoForm[]) => void;
  disabled?: boolean;
}

export function SeccionMomentos({ valor, minutosBloque, onChange, disabled }: Props) {
  const de = (m: Momento): MomentoForm => valor.find((x) => x.momento === m) ?? { momento: m };
  const poner = (m: Momento, parche: Partial<MomentoForm>) => {
    const otros = valor.filter((x) => x.momento !== m);
    onChange([...otros, { ...de(m), ...parche }]);
  };
  const total = sumaMinutos(valor);
  const cuadra = total === minutosBloque;

  return (
    <div className="space-y-4">
      {MOMENTOS.map((m) => (
        <div key={m.codigo} className="space-y-1.5">
          <div className="flex items-end justify-between gap-3">
            <Label htmlFor={`m-${m.codigo}`} className="text-sm font-medium">
              {m.nombre} <span className="text-muted-foreground font-normal">· {m.ayuda}</span>
            </Label>
            <div className="flex items-center gap-1.5 text-xs">
              <Input
                type="number"
                min={0}
                className="h-8 w-20"
                aria-label={`Minutos de ${m.nombre}`}
                disabled={disabled}
                value={de(m.codigo).minutos ?? ""}
                onChange={(e) =>
                  poner(m.codigo, {
                    minutos: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
              />
              <span>min</span>
            </div>
          </div>
          <Textarea
            id={`m-${m.codigo}`}
            rows={5}
            className="text-base"
            placeholder={m.ejemplo}
            disabled={disabled}
            value={de(m.codigo).actividades ?? ""}
            onChange={(e) => poner(m.codigo, { actividades: e.target.value })}
          />
        </div>
      ))}
      <p
        role="status"
        className={cuadra ? "text-success-text text-xs" : "text-warning-text text-xs font-medium"}
      >
        {total} de {minutosBloque} minutos del bloque
        {cuadra ? "" : ". Para marcarla como lista, los minutos deben sumar el bloque."}
      </p>
    </div>
  );
}
