"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridTableIcon, LayoutGridIcon } from "@hugeicons/core-free-icons";
import type { ListToolbarViewMode } from "../types";

interface ListToolbarViewToggleProps {
  viewMode: ListToolbarViewMode;
  onViewModeChange: (mode: ListToolbarViewMode) => void;
}

export function ListToolbarViewToggle({ viewMode, onViewModeChange }: ListToolbarViewToggleProps) {
  return (
    <div className="border-border/70 bg-muted/40 flex items-center rounded-xl border p-0.5 shadow-2xs">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onViewModeChange("table")}
        title="Vista de Tabla"
        aria-label="Vista de tabla"
        aria-pressed={viewMode === "table"}
        className={`focus-visible:ring-primary/40 size-8 rounded-lg transition-all outline-none focus-visible:ring-2 ${
          viewMode === "table"
            ? "bg-background text-foreground dark:bg-card shadow-2xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <HugeiconsIcon icon={GridTableIcon} size={16} />
        <span className="sr-only">Vista Tabla</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onViewModeChange("list")}
        title="Vista de Tarjetas"
        aria-label="Vista de tarjetas"
        aria-pressed={viewMode === "list"}
        className={`focus-visible:ring-primary/40 size-8 rounded-lg transition-all outline-none focus-visible:ring-2 ${
          viewMode === "list"
            ? "bg-background text-foreground dark:bg-card shadow-2xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <HugeiconsIcon icon={LayoutGridIcon} size={16} />
        <span className="sr-only">Vista Tarjetas</span>
      </Button>
    </div>
  );
}
