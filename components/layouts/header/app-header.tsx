"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useOptionalDashboardRole } from "../dashboard-role-context";
import type { UserProfileData } from "../sidebar/nav-user";
import { HeaderAcademicYearSelect } from "./header-academic-year";
import { HeaderLiveClock } from "./header-live-clock";
import { HeaderMonitoringPopover } from "./header-monitoring-popover";
import { HeaderUserMenu } from "./header-user-menu";

export interface AppHeaderProps {
  user?: UserProfileData;
}

export function AppHeader({ user }: AppHeaderProps) {
  const roleContext = useOptionalDashboardRole();
  const activeUser = user ?? roleContext?.user;

  return (
    <header className="border-border/60 bg-background/95 sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3 backdrop-blur-md transition-[width,height] ease-linear md:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1 shrink-0" />
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <HeaderLiveClock />
        <HeaderAcademicYearSelect />

        <Separator
          orientation="vertical"
          className="mx-0.5 hidden data-[orientation=vertical]:h-4 sm:block"
        />

        <HeaderMonitoringPopover />

        <Button
          asChild
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground relative"
          aria-label="Ver notificaciones"
          title="Notificaciones"
        >
          <Link href="/dashboard/notifications">
            <HugeiconsIcon icon={Notification01Icon} className="size-4.5" />
            <span className="bg-primary ring-background absolute top-1.5 right-1.5 size-2 rounded-full ring-2" />
          </Link>
        </Button>

        <ThemeToggle />

        <Separator
          orientation="vertical"
          className="mx-0.5 hidden data-[orientation=vertical]:h-4 sm:block"
        />

        <HeaderUserMenu user={activeUser} />
      </div>
    </header>
  );
}
