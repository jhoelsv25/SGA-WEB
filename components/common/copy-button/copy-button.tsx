"use client";

import * as React from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> {
  value: string;
  label?: string;
  displayValue?: string;
  truncate?: boolean;
  truncateLength?: number;
  iconOnly?: boolean;
  showToast?: boolean;
  toastMessage?: string;
  variant?: "ghost" | "outline" | "badge" | "inline";
}

export function CopyButton({
  value,
  label,
  displayValue,
  truncate = false,
  truncateLength = 8,
  iconOnly = false,
  showToast = false,
  toastMessage = "Copiado al portapapeles",
  variant = "inline",
  className,
  title,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.(e);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      if (showToast) {
        toast.success(toastMessage);
      }
    } catch {
      toast.error("No se pudo copiar al portapapeles");
    }
  };

  const formattedText = React.useMemo(() => {
    if (displayValue) return displayValue;
    if (truncate && value.length > truncateLength * 2) {
      return `${value.slice(0, truncateLength)}...${value.slice(-4)}`;
    }
    return value;
  }, [value, displayValue, truncate, truncateLength]);

  const defaultTitle = title ?? `Copiar ${label ?? value}`;

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={defaultTitle}
        aria-label={defaultTitle}
        className={cn(
          "focus-visible:ring-primary/40 inline-flex size-6 cursor-pointer items-center justify-center rounded-md transition-colors outline-none focus:outline-none focus-visible:ring-1",
          "hover:bg-muted text-muted-foreground hover:text-foreground",
          copied && "text-emerald-500 hover:text-emerald-500",
          className,
        )}
        {...props}
      >
        <HugeiconsIcon
          icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
          size={13}
          strokeWidth={2}
          className={cn(copied && "text-emerald-500")}
        />
      </button>
    );
  }

  if (variant === "badge") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={defaultTitle}
        aria-label={defaultTitle}
        className={cn(
          "focus-visible:ring-primary/40 inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs transition-all outline-none focus:outline-none focus-visible:ring-1",
          "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
          copied &&
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          className,
        )}
        {...props}
      >
        {label ? <span className="text-foreground/70 font-sans font-semibold">{label}</span> : null}
        <span>{formattedText}</span>
        <HugeiconsIcon
          icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
          size={11}
          className={cn(copied ? "text-emerald-500" : "opacity-60")}
        />
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={defaultTitle}
        aria-label={defaultTitle}
        className={cn(
          "focus-visible:ring-primary/40 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all outline-none focus:outline-none focus-visible:ring-1",
          "border-border/60 bg-background hover:bg-muted text-foreground",
          copied && "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
          className,
        )}
        {...props}
      >
        {label ? <span className="text-muted-foreground">{label}</span> : null}
        <span className="font-mono">{formattedText}</span>
        <HugeiconsIcon
          icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
          size={12}
          className={cn(copied ? "text-emerald-500" : "text-muted-foreground")}
        />
      </button>
    );
  }

  // variant === "inline" (default)
  return (
    <button
      type="button"
      onClick={handleCopy}
      title={defaultTitle}
      aria-label={defaultTitle}
      className={cn(
        "group focus-visible:ring-primary/40 inline-flex cursor-pointer items-center gap-1 rounded-xs font-mono text-xs transition-colors outline-none focus:outline-none focus-visible:ring-1",
        "text-muted-foreground hover:text-foreground",
        copied && "font-semibold text-emerald-500 hover:text-emerald-500",
        className,
      )}
      {...props}
    >
      {label ? <span className="font-sans font-medium">{label}</span> : null}
      <span>{formattedText}</span>
      <HugeiconsIcon
        icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
        size={11}
        className={cn(
          "transition-opacity",
          copied ? "text-emerald-500 opacity-100" : "opacity-60 group-hover:opacity-100",
        )}
      />
    </button>
  );
}
