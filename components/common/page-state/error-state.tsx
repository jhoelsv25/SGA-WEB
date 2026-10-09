import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ErrorStateProps } from "./types";

export function ErrorState({
  title = "No se pudo cargar la información",
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "border-destructive/20 bg-destructive/5 flex min-h-75 flex-col items-center justify-center rounded-xl border p-8 text-center",
        className,
      )}
    >
      <div className="border-destructive/20 bg-destructive/10 text-destructive flex size-12 shrink-0 items-center justify-center rounded-xl border">
        <HugeiconsIcon icon={AlertCircleIcon} size={24} strokeWidth={2} aria-hidden="true" />
      </div>

      <h3 className="text-destructive mt-4 text-base font-semibold">{title}</h3>

      {description && (
        <p className="text-muted-foreground mt-1.5 max-w-sm text-sm">{description}</p>
      )}

      {onRetry && (
        <div className="mt-5">
          <Button type="button" variant="outline" size="sm" onClick={onRetry} className="gap-2">
            <HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={2} aria-hidden="true" />
            <span>Reintentar</span>
          </Button>
        </div>
      )}
    </div>
  );
}
