"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { CursorPaginationProps } from "./types";

export function DataTableCursorPagination({
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  isLoading = false,
  totalCount,
  loadedCount,
}: CursorPaginationProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 px-3 py-3 sm:flex-row">
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <span className="border-border/70 bg-background text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-2xs">
          <span className="bg-primary size-1.5 rounded-full" />
          <span>
            {typeof loadedCount === "number" ? (
              <>
                <strong className="text-foreground font-bold">{loadedCount}</strong> registro(s)
                cargado(s)
              </>
            ) : typeof totalCount === "number" ? (
              <>
                Total: <strong className="text-foreground font-bold">{totalCount}</strong>{" "}
                registro(s)
              </>
            ) : (
              "Paginación por cursor"
            )}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isLoading && (
          <HugeiconsIcon
            icon={Loading03Icon}
            size={16}
            strokeWidth={2}
            className="text-muted-foreground animate-spin"
          />
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onPreviousPage}
            disabled={!hasPreviousPage || isLoading}
            aria-label="Página anterior"
            className="border-border/70 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 h-8 w-8 rounded-xl transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={2} />
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={onNextPage}
            disabled={!hasNextPage || isLoading}
            aria-label="Página siguiente"
            className="border-border/70 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 h-8 w-8 rounded-xl transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
}
