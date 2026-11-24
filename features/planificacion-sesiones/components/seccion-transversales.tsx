"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompetencias, useEnfoques } from "../hooks";
import type { EnfoquePlanificado, TransversalPlanificada } from "../types";

interface Props {
  transversales: TransversalPlanificada[];
  enfoques: EnfoquePlanificado[];
  onTransversales: (v: TransversalPlanificada[]) => void;
  onEnfoques: (v: EnfoquePlanificado[]) => void;
  disabled?: boolean;
}

const alternar = (l: string[], x: string) => (l.includes(x) ? l.filter((y) => y !== x) : [...l, x]);

/** Competencias transversales (con sus capacidades) y enfoques con valores y acciones. */
export function SeccionTransversales({
  transversales,
  enfoques,
  onTransversales,
  onEnfoques,
  disabled,
}: Props) {
  const { data: todas = [] } = useCompetencias();
  const { data: catalogo = [] } = useEnfoques();
  const delCatalogo = todas.filter((c) => c.tipo === "transversal");

  const marcarTransversal = (id: string, marcado: boolean) =>
    onTransversales(
      marcado
        ? [...transversales, { competenciaId: id, capacidades: [] }]
        : transversales.filter((t) => t.competenciaId !== id),
    );

  const marcarEnfoque = (id: string, marcado: boolean) =>
    onEnfoques(
      marcado
        ? [...enfoques, { enfoqueId: id, valores: [], acciones: [] }]
        : enfoques.filter((e) => e.enfoqueId !== id),
    );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Competencias transversales</h3>
        {delCatalogo.map((c) => {
          const t = transversales.find((x) => x.competenciaId === c.id);
          return (
            <div key={c.id} className="space-y-2">
              <Label className="flex items-start gap-2 text-sm font-normal">
                <Checkbox
                  checked={Boolean(t)}
                  disabled={disabled}
                  onCheckedChange={(v) => marcarTransversal(c.id, v === true)}
                />
                <span>{c.nombre}</span>
              </Label>
              {t && (
                <div className="space-y-2 pl-6">
                  {c.capacidades.map((cap) => (
                    <Label key={cap} className="flex items-start gap-2 text-xs font-normal">
                      <Checkbox
                        checked={t.capacidades.includes(cap)}
                        disabled={disabled}
                        onCheckedChange={() =>
                          onTransversales(
                            transversales.map((x) =>
                              x.competenciaId === c.id
                                ? { ...x, capacidades: alternar(x.capacidades, cap) }
                                : x,
                            ),
                          )
                        }
                      />
                      <span>{cap}</span>
                    </Label>
                  ))}
                  <Input
                    aria-label={`Desempeño de ${c.nombre}`}
                    placeholder="Desempeño (opcional)"
                    disabled={disabled}
                    value={t.desempeno ?? ""}
                    onChange={(e) =>
                      onTransversales(
                        transversales.map((x) =>
                          x.competenciaId === c.id ? { ...x, desempeno: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Enfoques transversales</h3>
        {catalogo.map((e) => {
          const sel = enfoques.find((x) => x.enfoqueId === e.id);
          return (
            <div key={e.id} className="space-y-2">
              <Label className="flex items-start gap-2 text-sm font-normal">
                <Checkbox
                  checked={Boolean(sel)}
                  disabled={disabled}
                  onCheckedChange={(v) => marcarEnfoque(e.id, v === true)}
                />
                <span>{e.nombre}</span>
              </Label>
              {sel && (
                <div className="space-y-2 pl-6">
                  {e.valores.map((v) => (
                    <div key={v.id} className="space-y-1">
                      <Label className="flex items-start gap-2 text-xs font-medium">
                        <Checkbox
                          checked={sel.valores.includes(v.nombre)}
                          disabled={disabled}
                          onCheckedChange={() =>
                            onEnfoques(
                              enfoques.map((x) =>
                                x.enfoqueId === e.id
                                  ? { ...x, valores: alternar(x.valores, v.nombre) }
                                  : x,
                              ),
                            )
                          }
                        />
                        <span>{v.nombre}</span>
                      </Label>
                      {sel.valores.includes(v.nombre) &&
                        v.acciones.map((a) => (
                          <Label
                            key={a}
                            className="text-muted-foreground flex items-start gap-2 pl-6 text-xs font-normal"
                          >
                            <Checkbox
                              checked={sel.acciones.includes(a)}
                              disabled={disabled}
                              onCheckedChange={() =>
                                onEnfoques(
                                  enfoques.map((x) =>
                                    x.enfoqueId === e.id
                                      ? { ...x, acciones: alternar(x.acciones, a) }
                                      : x,
                                  ),
                                )
                              }
                            />
                            <span>{a}</span>
                          </Label>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
