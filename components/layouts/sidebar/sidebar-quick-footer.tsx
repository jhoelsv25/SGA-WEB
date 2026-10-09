"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SidebarLeftIcon } from "@hugeicons/core-free-icons";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SidebarQuickFooter() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const etiqueta = isCollapsed ? "Expandir menú lateral" : "Contraer menú lateral";

  return (
    <div className={isCollapsed ? "flex justify-center py-1" : "flex justify-end p-1"}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={etiqueta}
            className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent focus-visible:ring-ring/40 flex size-10 items-center justify-center rounded-xl transition-colors outline-none focus-visible:ring-2"
          >
            <HugeiconsIcon icon={SidebarLeftIcon} className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={isCollapsed ? "right" : "top"}>{etiqueta} (Ctrl+B)</TooltipContent>
      </Tooltip>
    </div>
  );
}
