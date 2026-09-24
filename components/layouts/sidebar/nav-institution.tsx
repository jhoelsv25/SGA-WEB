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
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
        >
          <Link href={siteConfig.routes.home} className="flex items-center gap-3">
            <div className="bg-card ring-border flex size-9 shrink-0 items-center justify-center rounded-xl p-1 shadow-xs ring-1">
              <Image
                src={siteConfig.branding.logo}
                alt={`Logo ${siteConfig.institution.shortName}`}
                width={28}
                height={28}
                priority
                className="object-contain"
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground truncate font-bold tracking-tight">
                  {siteConfig.institution.shortName}
                </span>
                <span className="bg-primary/10 text-primary border-primary/20 py-0.2 shrink-0 rounded-sm border px-1 text-[9px] font-bold">
                  2026
                </span>
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
