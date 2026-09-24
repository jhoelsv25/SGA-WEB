"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Settings02Icon,
  Notification01Icon,
  Logout01Icon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons";
import { useLogout } from "@/features/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

export interface UserProfileData {
  name: string;
  email: string;
  avatar?: string;
  roleLabel?: string;
}

export interface NavUserProps {
  user?: UserProfileData;
}

const DEFAULT_USER: UserProfileData = {
  name: "Usuario Institucional",
  email: "usuario@carmelitas.edu.pe",
  roleLabel: "Docente / Directivo",
};

export function NavUser({ user = DEFAULT_USER }: NavUserProps) {
  const { isMobile } = useSidebar();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-foreground truncate font-semibold">{user.name}</span>
                <span className="text-muted-foreground truncate text-[11px]">{user.email}</span>
              </div>

              <HugeiconsIcon
                icon={MoreVerticalIcon}
                className="ml-auto size-4 shrink-0 opacity-70"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl p-1.5 shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 px-1.5 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {initials || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="text-foreground truncate font-bold">{user.name}</span>
                  <span className="text-muted-foreground truncate text-[11px]">{user.email}</span>
                  {user.roleLabel && (
                    <span className="text-primary mt-0.5 inline-block text-[10px] font-semibold">
                      {user.roleLabel}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/profile"
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <HugeiconsIcon icon={UserIcon} className="size-4 shrink-0" />
                  <span>Mi Perfil</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/notifications"
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <HugeiconsIcon icon={Notification01Icon} className="size-4 shrink-0" />
                  <span>Notificaciones</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <HugeiconsIcon icon={Settings02Icon} className="size-4 shrink-0" />
                  <span>Preferencias</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              disabled={isLoggingOut}
              onClick={() => logout()}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive flex cursor-pointer items-center gap-2.5"
            >
              <HugeiconsIcon icon={Logout01Icon} className="size-4 shrink-0" />
              <span>{isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
