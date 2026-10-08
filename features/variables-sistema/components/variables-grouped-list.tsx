"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Edit02Icon,
  Clock01Icon,
  ShieldCheckIcon,
  Audit01Icon,
  Clock02Icon,
  TeacherIcon,
  Award01Icon,
  ComputerIcon,
  UserGroupIcon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VariableSistema } from "../types";

interface VariablesGroupedListProps {
  variables: VariableSistema[];
  onEdit: (variable: VariableSistema) => void;
  onHistorial: (variable: VariableSistema) => void;
}

const MODULO_CONFIG: Record<
  string,
  {
    label: string;
    icon: IconSvgElement;
    color: string;
  }
> = {
  seguridad: {
    label: "Seguridad y Accesos",
    icon: ShieldCheckIcon,
    color:
      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
  },
  auditoria: {
    label: "Bitácora y Auditoría",
    icon: Audit01Icon,
    color:
      "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
  },
  sesiones: {
    label: "Asistencia y Sesiones de Clase",
    icon: Clock02Icon,
    color:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  },
  supervision: {
    label: "Supervisión y Ausencias Docentes",
    icon: TeacherIcon,
    color:
      "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  },
  aula_virtual: {
    label: "Aula Virtual y Calificación",
    icon: ComputerIcon,
    color:
      "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
  },
  libretas: {
    label: "Libretas del SIAGIE",
    icon: Award01Icon,
    color:
      "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
  },
  organizacion: {
    label: "Organización y Jornada Escolar",
    icon: SlidersHorizontalIcon,
    color:
      "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800",
  },
  convivencia: {
    label: "Convivencia y Conducta",
    icon: UserGroupIcon,
    color:
      "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800",
  },
};

function cleanDescription(desc: string): string {
  if (!desc) return "";
  return desc
    .replace(/\s*\((RF-[^)]*|P-[^)]*)\)/gi, "")
    .replace(/\s*\(\s*\)/g, "")
    .trim();
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
    return (
      <div className="bg-card rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          No se encontraron variables de configuración.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([modulo, items]) => {
        const config = MODULO_CONFIG[modulo] || {
          label: modulo.charAt(0).toUpperCase() + modulo.slice(1),
          icon: SlidersHorizontalIcon,
          color:
            "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200",
        };
        const ModuleIcon = config.icon;

        return (
          <div
            key={modulo}
            className="bg-card overflow-hidden rounded-xl border shadow-sm transition-all"
          >
            {/* Header del Grupo de Variables */}
            <div className="bg-muted/25 flex items-center justify-between border-b px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${config.color}`}
                >
                  <HugeiconsIcon icon={ModuleIcon} className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-foreground text-sm font-semibold">{config.label}</h3>
                  <p className="text-muted-foreground text-xs">
                    {items.length} {items.length === 1 ? "parámetro" : "parámetros"}
                  </p>
                </div>
              </div>
            </div>

            {/* Listado de Variables dentro del Grupo */}
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
                    {/* Información Principal de la Variable */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-foreground text-sm font-semibold">{title}</h4>
                        {!v.editable && (
                          <Badge
                            variant="secondary"
                            className="border border-amber-200/60 bg-amber-50 text-[10px] text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400"
                          >
                            Solo lectura
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-muted-foreground bg-muted/60 border-border/50 rounded border px-1.5 py-0.5 font-mono text-[11px]">
                          {v.codigo}
                        </span>
                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-muted-foreground capitalize">Tipo: {v.tipo}</span>
                        {v.motivoCambio && (
                          <>
                            <span className="text-muted-foreground/60">•</span>
                            <span className="text-muted-foreground max-w-xs truncate italic">
                              Motivo: {v.motivoCambio}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Valor Actual, Rango y Acciones */}
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
                          <p className="text-muted-foreground text-[11px]">
                            Rango: {v.valorMinimo} a {v.valorMaximo} {v.unidad || ""}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onHistorial(v)}
                          title="Consultar historial de cambios"
                          className="text-muted-foreground hover:text-foreground h-8 px-2.5 text-xs"
                        >
                          <HugeiconsIcon icon={Clock01Icon} className="mr-1.5 h-3.5 w-3.5" />
                          Historial
                        </Button>
                        {v.editable && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(v)}
                            className="h-8 gap-1.5 px-3 text-xs font-medium"
                          >
                            <HugeiconsIcon icon={Edit02Icon} className="h-3.5 w-3.5" />
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
