"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { RUTA_INICIO, siteConfig } from "@/config";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function NavInstitution() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          tooltip={`${siteConfig.institution.name} · ${siteConfig.institution.location.reference}`}
          className="hover:bg-sidebar-accent/70 data-[state=open]:bg-sidebar-accent group/menu-button h-12 rounded-sm p-1.5 transition-all duration-200 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
        >
          <Link
            href={RUTA_INICIO}
            aria-label={`Ir al inicio: ${siteConfig.institution.shortName}`}
            className="flex items-center gap-3"
          >
            {/* Logo sin recuadro, centrado en un espacio fijo */}
            <span className="flex size-9 shrink-0 items-center justify-center">
              <Image
                src={siteConfig.branding.logo}
                alt={`Logo ${siteConfig.institution.shortName}`}
                width={36}
                height={36}
                priority
                className="size-9 object-contain"
              />
            </span>

            {/* Datos Institucionales elegantes y nítidos */}
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="text-foreground group-hover/menu-button:text-primary text-sm font-bold tracking-tight transition-colors">
                {siteConfig.institution.shortName}
              </span>
              <span className="text-muted-foreground mt-0.5 truncate text-xs font-normal">
                Secundaria · {siteConfig.institution.location.reference}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
