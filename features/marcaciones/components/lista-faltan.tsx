"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { UserAvatar } from "@/components/common/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PersonaPendiente } from "../types";

export function ListaFaltan({ pendientes }: { pendientes: PersonaPendiente[] }) {
  const [busqueda, setBusqueda] = React.useState("");

  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filtrados = React.useMemo(() => {
    if (!busqueda.trim()) return pendientes;
    const term = normalizar(busqueda.trim());
    return pendientes.filter(
      (p) =>
        normalizar(p.nombreCompleto).includes(term) ||
        (p.detalle && normalizar(p.detalle).includes(term)),
    );
  }, [pendientes, busqueda]);

  if (pendientes.length === 0) {
    return (
      <div className="border-border/60 bg-card flex flex-col items-center justify-center gap-2 rounded-2xl border p-8 text-center shadow-xs">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6" />
        </div>
        <p className="text-foreground text-sm font-bold">Todos han registrado su marcación</p>
        <p className="text-muted-foreground text-xs">
          No hay personas pendientes de marcar entrada para la jornada de hoy.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/80 bg-card space-y-4 rounded-2xl border p-4 shadow-xs">
      {/* Barra superior con buscador y contador */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
          />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Filtrar por nombre o sección..."
            className="h-8.5 rounded-xl pl-8.5 text-xs shadow-2xs"
            aria-label="Buscar persona pendiente"
          />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
          <Badge variant="outline" className="gap-1 rounded-lg px-2 py-0.5 font-mono text-[11px]">
            <HugeiconsIcon icon={UserGroupIcon} className="text-muted-foreground size-3" />
            <span>
              {filtrados.length} {filtrados.length === 1 ? "persona" : "personas"}
            </span>
          </Badge>
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              className="text-primary ml-1 text-xs font-semibold hover:underline"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      {/* Grid de tarjetas de personas pendientes */}
      {filtrados.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-xs">
          No se encontraron personas pendientes que coincidan con «{busqueda}».
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((p) => (
            <div
              key={p.personaId}
              className="border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border/90 flex items-center justify-between gap-3 rounded-xl border p-2.5 shadow-2xs transition-all"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <UserAvatar name={p.nombreCompleto} className="size-8 shrink-0 text-xs" />
                <div className="min-w-0 space-y-0.5">
                  <p className="text-foreground truncate text-xs leading-tight font-semibold">
                    {p.nombreCompleto}
                  </p>
                  {p.detalle && (
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 font-mono text-[10px] leading-none"
                    >
                      {p.detalle}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary h-7 shrink-0 gap-1 rounded-lg px-2 text-[11px] font-semibold"
              >
                <Link href={`/admin/marcacion-manual?personaId=${p.personaId}`}>
                  <span>Marcar</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
