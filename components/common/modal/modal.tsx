"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalProps, ModalSize } from "./types";
import { HugeiconsIcon } from "@hugeicons/react";

const sizeClasses: Record<ModalSize, string> = {
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  "6xl": "sm:max-w-6xl",
  "7xl": "sm:max-w-7xl",
  "8xl": "sm:max-w-8xl",
  "9xl": "sm:max-w-9xl",
  "10xl": "sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw]",
  full: "sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] h-[90vh]",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  footer,
  size = "md",
  showClose = true,
  className,
  preventClose = false,
  closeOnInteractOutside,
  closeOnEscapeKeyDown,
}: ModalProps) {
  // Por defecto si preventClose es true, no permite cerrar al hacer clic afuera
  const shouldPreventInteractOutside = preventClose || closeOnInteractOutside === false;

  const shouldPreventEscapeKeyDown = preventClose || closeOnEscapeKeyDown === false;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (preventClose && !val) return;
        onOpenChange(val);
      }}
    >
      <DialogContent
        showCloseButton={showClose}
        className={cn(sizeClasses[size], size === "full" && "flex flex-col", className)}
        onInteractOutside={(e) => {
          if (shouldPreventInteractOutside) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (shouldPreventEscapeKeyDown) {
            e.preventDefault();
          }
        }}
      >
        {(title || description || icon) && (
          <DialogHeader
            className={cn(
              "border-border/60 border-b pb-3.5",
              icon && "flex flex-row items-start gap-3.5 space-y-0 text-left",
            )}
          >
            {icon && (
              <div className="border-primary/20 bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-2xs">
                <HugeiconsIcon icon={icon} size={20} strokeWidth={2} />
              </div>
            )}
            <div className="grid gap-1">
              {title && (
                <DialogTitle className="text-foreground text-lg font-bold tracking-tight">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
                  {description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>
        )}

        <div
          className={cn(
            "pt-2 pb-1",
            size === "full"
              ? "flex-1 overflow-y-auto pr-1"
              : "max-h-[calc(88vh-8rem)] overflow-y-auto pr-1",
          )}
        >
          {children}
        </div>

        {footer && (
          <DialogFooter className={cn(size === "full" && "mt-auto")}>{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
