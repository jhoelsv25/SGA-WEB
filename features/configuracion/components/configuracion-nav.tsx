"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { MENU_ITEMS } from "../consts";
import type { TabConfiguracion } from "../types";

interface ConfiguracionNavProps {
  tabActiva: TabConfiguracion;
  onSelectTab: (tab: TabConfiguracion) => void;
}

export function ConfiguracionNav({ tabActiva, onSelectTab }: ConfiguracionNavProps) {
  const itemsGeneral = React.useMemo(() => MENU_ITEMS.filter((i) => i.grupo === "general"), []);
  const itemsPoliticas = React.useMemo(() => MENU_ITEMS.filter((i) => i.grupo === "politicas"), []);

  return (
    <nav aria-label="Secciones de configuración" className="space-y-4 lg:col-span-4 xl:col-span-3">
      <div className="bg-card border-border/60 space-y-4 rounded-2xl border p-3 shadow-2xs">
        {/* Grupo 1: Ajustes Generales */}
        <div className="space-y-1">
          <span className="text-muted-foreground block px-2.5 text-[10px] font-bold tracking-wider uppercase">
            Ajustes Generales
          </span>
          <div className="space-y-0.5">
            {itemsGeneral.map((item) => {
              const activa = tabActiva === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all ${
                    activa
                      ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        activa
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <HugeiconsIcon icon={item.icono} className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs">{item.label}</p>
                      <p className="text-muted-foreground hidden truncate text-[10px] xl:block">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className={`size-3.5 shrink-0 transition-transform ${
                      activa
                        ? "text-primary translate-x-0.5 opacity-100"
                        : "opacity-0 group-hover:opacity-60"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Separador */}
        <div className="border-border/40 border-t" />

        {/* Grupo 2: Políticas y Sistema */}
        <div className="space-y-1">
          <span className="text-muted-foreground block px-2.5 text-[10px] font-bold tracking-wider uppercase">
            Políticas y Sistema
          </span>
          <div className="space-y-0.5">
            {itemsPoliticas.map((item) => {
              const activa = tabActiva === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all ${
                    activa
                      ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        activa
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <HugeiconsIcon icon={item.icono} className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs">{item.label}</p>
                      <p className="text-muted-foreground hidden truncate text-[10px] xl:block">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className={`size-3.5 shrink-0 transition-transform ${
                      activa
                        ? "text-primary translate-x-0.5 opacity-100"
                        : "opacity-0 group-hover:opacity-60"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
