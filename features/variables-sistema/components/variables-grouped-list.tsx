"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit02Icon, Clock01Icon, SlidersHorizontalIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { MODULO_CONFIG } from "../consts";
import { cleanDescription } from "../utils";
import type { VariableSistema } from "../types";

interface VariablesGroupedListProps {
  variables: VariableSistema[];
  onEdit: (variable: VariableSistema) => void;
  onHistorial: (variable: VariableSistema) => void;
}

export function VariablesGroupedList({
  variables,
  onEdit,
  onHistorial,
}: VariablesGroupedListProps) {
  const grouped = React.useMemo(() => {
    const map = new Map<string, VariableSistema[]>();
    for (const v of variables) {
      const list = map.get(v.modulo) || [];
      list.push(v);
      map.set(v.modulo, list);
    }
    return map;
  }, [variables]);

  if (variables.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([modulo, items]) => {
        const config = MODULO_CONFIG[modulo] || {
          label: modulo.charAt(0).toUpperCase() + modulo.slice(1),
          icon: SlidersHorizontalIcon,
        };
        const ModuleIcon = config.icon;

        return (
          <div
            key={modulo}
            className="bg-card overflow-hidden rounded-xl border shadow-2xs transition-all"
          >
            {/* Header del grupo de variables */}
            <div className="bg-muted/30 border-border/60 flex items-center justify-between border-b px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="border-primary/20 bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl border shadow-2xs">
                  <HugeiconsIcon icon={ModuleIcon} className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-foreground text-sm font-semibold">{config.label}</h3>
                  <p className="text-muted-foreground text-xs">
                    {items.length} {items.length === 1 ? "parámetro" : "parámetros"}
                  </p>
                </div>
              </div>
            </div>

            {/* Listado de variables dentro del grupo */}
            <div className="divide-border/60 divide-y">
              {items.map((v) => {
                const title = cleanDescription(v.descripcion);
                const isBoolean = v.tipo === "booleano";
                const displayValue = isBoolean
                  ? v.valor === "true" || v.valor === "1"
                    ? "Activado"
                    : "Desactivado"
                  : v.valor;

                return (
                  <div
                    key={v.id}
                    className="hover:bg-muted/15 flex flex-col justify-between gap-4 p-5 transition-colors md:flex-row md:items-center"
                  >
                    {/* Información principal de la variable */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-foreground text-sm font-semibold">{title}</h4>
                        {!v.editable && (
                          <StatusBadge tone="neutral" size="sm">
                            Solo lectura
                          </StatusBadge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-muted-foreground bg-muted/60 border-border/50 rounded border px-1.5 py-0.5 font-mono text-xs">
                          {v.codigo}
                        </span>
                        {v.motivoCambio && (
                          <>
                            <span className="text-muted-foreground/60">•</span>
                            <span className="text-muted-foreground max-w-xs truncate text-xs italic">
                              Motivo: {v.motivoCambio}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Valor actual, rango y acciones */}
                    <div className="flex shrink-0 items-center justify-between gap-5 md:justify-end">
                      <div className="text-left md:text-right">
                        <div className="flex items-baseline gap-1.5 md:justify-end">
                          <span className="text-foreground font-mono text-xl font-bold tracking-tight">
                            {displayValue}
                          </span>
                          {v.unidad && !isBoolean && (
                            <span className="text-muted-foreground text-xs font-medium">
                              {v.unidad}
                            </span>
                          )}
                        </div>
                        {v.valorMinimo !== null && v.valorMaximo !== null && (
                          <p className="text-muted-foreground text-xs">
                            Rango: {v.valorMinimo} a {v.valorMaximo} {v.unidad || ""}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onHistorial(v)}
                          aria-label={`Consultar historial de cambios de ${title}`}
                          className="text-muted-foreground hover:text-foreground h-9 px-3 text-xs"
                        >
                          <HugeiconsIcon icon={Clock01Icon} className="mr-1.5 size-3.5" />
                          Historial
                        </Button>
                        {v.editable && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(v)}
                            aria-label={`Editar variable ${title}`}
                            className="h-9 gap-1.5 px-3 text-xs font-medium"
                          >
                            <HugeiconsIcon icon={Edit02Icon} className="size-3.5" />
                            Editar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
