"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  InformationCircleIcon,
  HelpCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { ConfirmDialogProps, ConfirmVariant } from "./types";

const variantConfig: Record<
  ConfirmVariant,
  {
    icon: typeof Alert02Icon;
    iconWrapperClass: string;
    buttonClass: string;
  }
> = {
  danger: {
    icon: Alert02Icon,
    iconWrapperClass:
      "bg-destructive/10 text-destructive border border-destructive/20 ring-4 ring-destructive/5",
    buttonClass:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm font-semibold",
  },
  warning: {
    icon: Alert02Icon,
    iconWrapperClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ring-4 ring-amber-500/5",
    buttonClass: "bg-amber-600 text-white hover:bg-amber-700 shadow-sm font-semibold",
  },
  info: {
    icon: InformationCircleIcon,
    iconWrapperClass: "bg-primary/10 text-primary border border-primary/20 ring-4 ring-primary/5",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-semibold",
  },
  default: {
    icon: HelpCircleIcon,
    iconWrapperClass: "bg-muted text-foreground border border-border ring-4 ring-muted/20",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-semibold",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const loading = isLoading || internalLoading;

  const currentVariant = variantConfig[variant];

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !loading && onOpenChange(val)}>
      <DialogContent
        className="border-border/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md sm:max-w-md"
        showCloseButton={!loading}
        onInteractOutside={(e) => {
          if (loading) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (loading) e.preventDefault();
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-2xl shadow-2xs transition-transform",
              currentVariant.iconWrapperClass,
            )}
          >
            <HugeiconsIcon icon={currentVariant.icon} size={22} strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-foreground font-heading text-base font-bold tracking-tight sm:text-lg">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          </div>
        </div>

        <DialogFooter className="border-border/60 bg-muted/30 -mx-6 mt-4 -mb-6 flex flex-col-reverse gap-2 rounded-b-2xl border-t px-6 py-4 sm:flex-row sm:justify-end sm:gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="border-border/70 text-foreground hover:bg-muted h-9 cursor-pointer rounded-xl px-4 text-xs font-medium sm:text-sm"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "h-9 cursor-pointer rounded-xl px-4 text-xs font-semibold transition-all active:scale-[0.98] sm:text-sm",
              currentVariant.buttonClass,
            )}
          >
            {loading && (
              <HugeiconsIcon
                icon={Loading03Icon}
                size={15}
                strokeWidth={2}
                className="mr-1.5 animate-spin"
              />
            )}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
