"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  ServerStack01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function HeaderMonitoringPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground transition-colors"
          aria-label="Centro de Monitoreo"
          title="Centro de Monitoreo del Sistema"
        >
          <HugeiconsIcon icon={Activity01Icon} className="size-4.5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 overflow-hidden rounded-2xl border-none p-0 shadow-2xl"
      >
        <div className="bg-muted/40 border-border/50 border-b p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 animate-pulse rounded-full bg-emerald-500" />
              <h4 className="text-foreground text-xs font-bold">Centro de Monitoreo</h4>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Operativo
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-[11px]">
            Estado de los servicios y actividad pedagógica
          </p>
        </div>

        <div className="space-y-3 p-3.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/30 rounded-xl p-2.5">
              <span className="text-muted-foreground block text-[10.5px] font-medium">
                Asistencia Hoy
              </span>
              <span className="text-foreground mt-0.5 block text-base font-bold">96.4%</span>
              <span className="text-[9.5px] font-medium text-emerald-600 dark:text-emerald-400">
                137 presentes
              </span>
            </div>

            <div className="bg-muted/30 rounded-xl p-2.5">
              <span className="text-muted-foreground block text-[10.5px] font-medium">
                Clases Activas
              </span>
              <span className="text-foreground mt-0.5 block text-base font-bold">18 / 24</span>
              <span className="text-muted-foreground text-[9.5px] font-medium">Turno Mañana</span>
            </div>
          </div>

          <div className="text-muted-foreground flex items-center justify-between px-1 py-0.5 text-xs">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={ServerStack01Icon}
                className="text-muted-foreground/80 size-3.5"
              />
              <span className="text-[11px]">Servidor institucional</span>
            </div>
            <span className="font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              24ms · Óptimo
            </span>
          </div>

          <div className="text-muted-foreground flex items-center justify-between px-1 py-0.5 text-xs">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="text-muted-foreground/80 size-3.5"
              />
              <span className="text-[11px]">Base de datos SGA</span>
            </div>
            <span className="text-foreground/80 text-[11px] font-medium">Sincronizado</span>
          </div>
        </div>

        <div className="bg-muted/20 border-border/50 flex items-center justify-between border-t px-3.5 py-2.5">
          <span className="text-muted-foreground text-[10.5px]">I.E. Carmelinas · 2026</span>
          <Link
            href="/dashboard/principal/analytics"
            className="text-primary inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
          >
            <span>Ver analítica completa</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
