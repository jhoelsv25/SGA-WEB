"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, FilterIcon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";

interface SidebarMenuFiltroProps {
  valor: string;
  onCambiar: (valor: string) => void;
}

/** Filtra las opciones del menú lateral (el buscador general está en la cabecera). */
export function SidebarMenuFiltro({ valor, onCambiar }: SidebarMenuFiltroProps) {
  return (
    <div className="relative">
      <HugeiconsIcon
        icon={FilterIcon}
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
      />
      <Input
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && valor) {
            e.stopPropagation();
            onCambiar("");
          }
        }}
        placeholder="Buscar en el menú..."
        aria-label="Buscar en el menú"
        autoComplete="off"
        className="border-sidebar-border bg-card dark:bg-sidebar-accent h-9 rounded-2xl pr-9 pl-9 text-xs"
      />
      {valor && (
        <button
          type="button"
          onClick={() => onCambiar("")}
          aria-label="Limpiar búsqueda del menú"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 outline-none focus-visible:ring-2"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
        </button>
      )}
    </div>
  );
}
