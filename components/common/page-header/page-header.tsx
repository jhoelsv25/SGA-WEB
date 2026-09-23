import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { PageHeaderProps } from "./types";

export function PageHeader({
  title,
  description,
  icon,
  breadcrumbs,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumbs"
            className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium"
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${crumb.label}-${index}`}>
                  {index > 0 && (
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={12}
                      strokeWidth={2}
                      className="opacity-50"
                    />
                  )}
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn(isLast && "text-foreground font-semibold")}>
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {icon && (
            <div className="bg-secondary text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={icon} size={22} strokeWidth={2} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
        </div>

        {description && <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2 sm:self-start">{actions}</div>}
    </div>
  );
}
