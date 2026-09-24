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
          className="hover:bg-sidebar-accent/70 data-[state=open]:bg-sidebar-accent h-13 rounded-xl p-2 transition-all duration-200"
        >
          <Link href={siteConfig.routes.home} className="flex items-center gap-3">
            {/* Logo contenedor con gradiente sutil y sombra limpia */}
            <div className="bg-background ring-border/80 relative flex size-10 shrink-0 items-center justify-center rounded-xl p-1.5 shadow-xs ring-1 transition-transform duration-200 group-hover/menu-button:scale-105">
              <Image
                src={siteConfig.branding.logo}
                alt={`Logo ${siteConfig.institution.shortName}`}
                width={30}
                height={30}
                priority
                className="object-contain"
              />
            </div>

            {/* Datos Institucionales */}
            <div className="grid flex-1 text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground text-[14px] font-bold tracking-tight">
                  {siteConfig.institution.shortName}
                </span>
                <span className="bg-primary/10 text-primary border-primary/25 rounded-md border px-1.5 py-0.5 text-[9.5px] font-bold tracking-wide">
                  2026
                </span>
              </div>
              <span className="text-muted-foreground/90 truncate text-[11.5px] font-medium">
                {siteConfig.institution.location.reference}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
