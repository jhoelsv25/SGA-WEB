"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function NavInstitution() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          tooltip={`${siteConfig.institution.name} · ${siteConfig.institution.location.reference}`}
          className="hover:bg-sidebar-accent/70 data-[state=open]:bg-sidebar-accent group/menu-button h-13 rounded-2xl p-2 transition-all duration-200"
        >
          <Link href={siteConfig.routes.home} className="flex items-center gap-3">
            {/* Logo en contenedor premium con sutil gradiente y brillo */}
            <div className="from-primary/15 via-primary/5 border-primary/20 group-hover/menu-button:border-primary/40 relative flex size-10 shrink-0 items-center justify-center rounded-xl border bg-linear-to-br to-transparent p-1.5 shadow-xs transition-all duration-300 group-hover/menu-button:scale-[1.02] group-hover/menu-button:shadow-sm">
              <Image
                src={siteConfig.branding.logo}
                alt={`Logo ${siteConfig.institution.shortName}`}
                width={26}
                height={26}
                priority
                className="object-contain drop-shadow-xs"
              />
            </div>

            {/* Datos Institucionales elegantes y nítidos */}
            <div className="grid flex-1 text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground group-hover/menu-button:text-primary text-[13.5px] font-bold tracking-tight transition-colors">
                  {siteConfig.institution.shortName}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="size-1 animate-pulse rounded-full bg-emerald-500" />
                  2026
                </span>
              </div>
              <span className="text-muted-foreground/75 mt-0.5 truncate text-[11px] font-normal">
                Secundaria · {siteConfig.institution.location.reference}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
