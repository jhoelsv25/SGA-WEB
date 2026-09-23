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
        className={`size-8 rounded-lg transition-all ${
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
        className={`size-8 rounded-lg transition-all ${
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
