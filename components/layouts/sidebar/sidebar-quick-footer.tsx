"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarQuickFooter() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-1.5 py-1">
        <Link
          href="/dashboard/help"
          className="text-muted-foreground hover:text-primary hover:bg-sidebar-accent flex size-8 items-center justify-center rounded-lg transition-colors"
          title="Centro de Ayuda"
        >
          <HugeiconsIcon icon={HelpCircleIcon} className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-2 py-0.5">
      <Link
        href="/dashboard/help"
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs font-medium transition-colors"
      >
        <HugeiconsIcon
          icon={HelpCircleIcon}
          className="text-muted-foreground/80 size-3.5 shrink-0"
        />
        <span>Ayuda y Soporte</span>
      </Link>

      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
        Online
      </span>
    </div>
  );
}
