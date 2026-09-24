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
          className="hover:bg-sidebar-accent/60 data-[state=open]:bg-sidebar-accent h-auto rounded-xl p-2 transition-all duration-200"
        >
          <Link href={siteConfig.routes.home} className="flex items-center gap-2.5">
            {/* Logo en contenedor sutil y estilizado */}
            <div className="bg-card border-border/70 relative flex size-10 shrink-0 items-center justify-center rounded-xl border p-1.5 shadow-2xs transition-transform duration-200 group-hover/menu-button:scale-105">
              <Image
                src={siteConfig.branding.logo}
                alt={`Logo ${siteConfig.institution.shortName}`}
                width={28}
                height={28}
                priority
                className="object-contain"
              />
            </div>

            {/* Datos Institucionales limpios y jerarquizados */}
            <div className="grid flex-1 text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground text-[13.5px] font-bold tracking-tight">
                  {siteConfig.institution.shortName}
                </span>
                <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9.5px] font-semibold">
                  2026
                </span>
              </div>
              <span className="text-muted-foreground/80 mt-0.5 truncate text-[11px] font-normal">
                {siteConfig.institution.location.reference}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
