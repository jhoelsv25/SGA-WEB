"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon, SidebarLeftIcon } from "@hugeicons/core-free-icons";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SidebarQuickFooter() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-1.5 py-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard/help"
              className="text-muted-foreground hover:text-primary hover:bg-sidebar-accent flex size-8 items-center justify-center rounded-xl transition-colors"
              aria-label="Centro de Ayuda"
            >
              <HugeiconsIcon icon={HelpCircleIcon} className="size-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Centro de Ayuda</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent flex size-8 items-center justify-center rounded-xl transition-colors"
              aria-label="Expandir barra lateral"
            >
              <HugeiconsIcon icon={SidebarLeftIcon} className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Expandir menú (⌘B)</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-1">
      {/* Tarjeta de estado de conectividad y versión */}
      <div className="bg-sidebar-accent/40 border-sidebar-border/60 hover:bg-sidebar-accent/60 flex items-center justify-between rounded-full border px-3 py-1.5 transition-colors">
        <Link
          href="/dashboard/help"
          className="text-muted-foreground/80 hover:text-foreground flex items-center gap-2 text-xs font-medium transition-colors"
        >
          <HugeiconsIcon
            icon={HelpCircleIcon}
            className="text-muted-foreground group-hover:text-primary size-3.5 shrink-0 transition-colors"
          />
          <span>Ayuda y Soporte</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            v2.1
          </span>
          <button
            type="button"
            onClick={toggleSidebar}
            className="text-muted-foreground/60 hover:text-foreground hover:bg-sidebar-accent/80 rounded-md p-1 transition-colors"
            title="Colapsar menú lateral"
          >
            <HugeiconsIcon icon={SidebarLeftIcon} className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
