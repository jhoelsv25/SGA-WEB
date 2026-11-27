import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { EmptyStateProps } from "./types";

export function EmptyState({
  title,
  description,
  icon = Folder01Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border/60 bg-card flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center",
        className,
      )}
    >
      <div className="bg-muted/80 text-muted-foreground flex size-12 items-center justify-center rounded-xl">
        <HugeiconsIcon icon={icon} size={24} strokeWidth={2} aria-hidden="true" />
      </div>

      <h3 className="text-foreground mt-4 text-base font-semibold">{title}</h3>

      {description && (
        <p className="text-muted-foreground mt-1.5 max-w-sm text-sm">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
