"use client";

import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: IconSvgElement;
  trend?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
  variant?: "primary" | "success" | "warning" | "info" | "purple";
  className?: string;
}

const VARIANTS = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "hover:border-primary/40",
  },
  success: {
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "hover:border-emerald-500/40",
  },
  warning: {
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    border: "hover:border-amber-500/40",
  },
  info: {
    bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    text: "text-sky-600 dark:text-sky-400",
    border: "hover:border-sky-500/40",
  },
  purple: {
    bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    text: "text-purple-600 dark:text-purple-400",
    border: "hover:border-purple-500/40",
  },
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "primary",
  className,
}: KpiCardProps) {
  const styles = VARIANTS[variant] || VARIANTS.primary;

  return (
    <Card
      className={cn(
        "border-border dark:border-border/30 bg-card group relative overflow-hidden rounded-2xl border p-4.5 shadow-xs transition-all duration-200 hover:shadow-sm sm:p-5",
        styles.border,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {title}
          </p>
          <p className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
        </div>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
            styles.bg,
          )}
        >
          <HugeiconsIcon icon={icon} className="size-5.5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="border-border/40 mt-3.5 flex flex-wrap items-center gap-2 border-t pt-2.5 text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
                trend.neutral
                  ? "bg-muted text-muted-foreground"
                  : trend.positive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-muted-foreground line-clamp-1">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
}
