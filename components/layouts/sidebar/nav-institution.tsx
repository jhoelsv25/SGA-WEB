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
          className="hover:bg-sidebar-accent/50 data-[state=open]:bg-sidebar-accent h-auto rounded-2xl p-2.5 transition-all duration-200"
        >
          <Link href={siteConfig.routes.home} className="flex items-center gap-3">
            {/* Logo en contenedor idéntico al del Login (rounded-2xl, shadow-md, ring-1) */}
            <div className="bg-card ring-border/80 relative flex size-11 shrink-0 items-center justify-center rounded-2xl p-1.5 shadow-md ring-1 transition-transform duration-200 group-hover/menu-button:scale-105">
              <Image
                src={siteConfig.branding.logo}
                alt={`Logo ${siteConfig.institution.shortName}`}
                width={32}
                height={32}
                priority
                className="object-contain"
              />
            </div>

            {/* Datos Institucionales con píldora y tipografía alineada al Login */}
            <div className="grid flex-1 text-left leading-tight">
              <div>
                <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                  {siteConfig.institution.shortName}
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-foreground text-[14px] font-extrabold tracking-tight">
                  I.E. <span className="font-black italic">Carmelitas</span>
                </span>
                <span className="text-muted-foreground/75 text-[10px] font-semibold">2026</span>
              </div>
              <span className="text-muted-foreground truncate text-[11px]">
                {siteConfig.institution.location.reference}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
