"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon, HeadsetIcon } from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config";
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
    <div className="bg-card ring-border/80 border-border/80 flex flex-col gap-2 rounded-2xl border p-3 shadow-xs ring-1 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-xl">
            <HugeiconsIcon icon={HeadsetIcon} className="size-4" />
          </div>
          <div className="leading-tight">
            <div className="text-foreground text-xs font-bold">Mesa de Ayuda</div>
            <div className="text-muted-foreground text-[10.5px]">Soporte institucional</div>
          </div>
        </div>

        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">
          Online
        </span>
      </div>

      <div className="border-border/50 flex items-center justify-between border-t pt-2 text-[11px]">
        <Link
          href="/dashboard/help"
          className="text-primary font-semibold transition-colors hover:underline"
        >
          Guía y Tutoriales
        </Link>
        <a
          href={`mailto:${siteConfig.institution.contact.supportEmail}`}
          className="text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          Contacto
        </a>
      </div>
    </div>
  );
}
