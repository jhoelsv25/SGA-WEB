"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  BookOpen01Icon,
  ChartBarLineIcon,
  Comment01Icon,
  ShieldAlertIcon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface AulaTabsNavProps {
  unidadesCount: number;
  puedeAdministrar: boolean;
  puedeVerModeracion?: boolean;
  esDirectivo: boolean;
  esApoderado: boolean;
}

export function AulaTabsNav({
  unidadesCount,
  puedeAdministrar,
  puedeVerModeracion = false,
  esDirectivo,
  esApoderado,
}: AulaTabsNavProps) {
  return (
    <div className="border-border/80 bg-card/90 flex flex-col gap-3 rounded-2xl border p-2 shadow-xs backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      {/* Lista de pestañas horizontales modernas */}
      <TabsList className="flex h-auto w-full scrollbar-none items-center justify-start gap-1.5 overflow-x-auto bg-transparent p-0 sm:w-auto">
        {/* Pestaña: Materiales */}
        <TabsTrigger
          value="materiales"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground hover:bg-muted/70 group flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-medium transition-all duration-200 data-[state=active]:font-semibold data-[state=active]:shadow-xs sm:text-sm"
        >
          <HugeiconsIcon icon={BookOpen01Icon} size={18} />
          <span>
            <span className="hidden xl:inline">Materiales de Reforzamiento</span>
            <span className="inline xl:hidden">Materiales</span>
          </span>
          {unidadesCount > 0 && (
            <span className="bg-muted text-muted-foreground ml-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
              {unidadesCount}
            </span>
          )}
        </TabsTrigger>

        {/* Pestaña: Tareas y Evaluaciones */}
        <TabsTrigger
          value="tareas"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground hover:bg-muted/70 group flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-medium transition-all duration-200 data-[state=active]:font-semibold data-[state=active]:shadow-xs sm:text-sm"
        >
          <HugeiconsIcon icon={Task01Icon} size={18} />
          <span>
            <span className="hidden xl:inline">Tareas y Evaluaciones</span>
            <span className="inline xl:hidden">Tareas</span>
          </span>
        </TabsTrigger>

        {/* Pestaña: Muro */}
        {!esApoderado && (
          <TabsTrigger
            value="muro"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground hover:bg-muted/70 group flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-medium transition-all duration-200 data-[state=active]:font-semibold data-[state=active]:shadow-xs sm:text-sm"
          >
            <HugeiconsIcon icon={Comment01Icon} size={18} />
            <span>Muro</span>
          </TabsTrigger>
        )}

        {/* Pestañas para Docentes y Directivos */}
        {puedeAdministrar || esDirectivo ? (
          <>
            <TabsTrigger
              value="libro-notas"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground hover:bg-muted/70 group flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-medium transition-all duration-200 data-[state=active]:font-semibold data-[state=active]:shadow-xs sm:text-sm"
            >
              <HugeiconsIcon icon={ChartBarLineIcon} size={18} />
              <span>
                <span className="hidden xl:inline">Libro de Calificaciones</span>
                <span className="inline xl:hidden">Calificaciones</span>
              </span>
            </TabsTrigger>

            {(puedeAdministrar || puedeVerModeracion) && (
              <TabsTrigger
                value="moderacion"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground hover:bg-muted/70 group flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-medium transition-all duration-200 data-[state=active]:font-semibold data-[state=active]:shadow-xs sm:text-sm"
              >
                <HugeiconsIcon icon={ShieldAlertIcon} size={18} />
                <span>Moderación</span>
              </TabsTrigger>
            )}
          </>
        ) : (
          <TabsTrigger
            value="mis-notas"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground hover:bg-muted/70 group flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-medium transition-all duration-200 data-[state=active]:font-semibold data-[state=active]:shadow-xs sm:text-sm"
          >
            <HugeiconsIcon icon={Award01Icon} size={18} />
            <span>
              <span className="hidden xl:inline">
                {esApoderado ? "Calificaciones" : "Mis Calificaciones"}
              </span>
              <span className="inline xl:hidden">{esApoderado ? "Notas" : "Mis Notas"}</span>
            </span>
          </TabsTrigger>
        )}
      </TabsList>

      {/* Indicador contextual de rol en el aula */}
      <div className="hidden items-center gap-2 pr-2 sm:flex">
        {esDirectivo && (
          <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold">
            <span className="bg-primary size-1.5 rounded-full" />
            Supervisión Directiva
          </span>
        )}
        {puedeAdministrar && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Docente de Aula
          </span>
        )}
        {!esDirectivo && !puedeAdministrar && !esApoderado && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            <span className="size-1.5 rounded-full bg-blue-500" />
            Estudiante
          </span>
        )}
        {esApoderado && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Apoderado
          </span>
        )}
      </div>
    </div>
  );
}
