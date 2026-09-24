"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Settings02Icon,
  Notification01Icon,
  Logout01Icon,
  School01Icon,
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
import { Button } from "@/components/ui/button";
import type { UserProfileData } from "../sidebar/nav-user";

export interface HeaderUserMenuProps {
  user?: UserProfileData;
}

const DEFAULT_USER: UserProfileData = {
  name: "Usuario Institucional",
  email: "usuario@carmelitas.edu.pe",
  roleLabel: "Docente / Directivo",
};

export function HeaderUserMenu({ user = DEFAULT_USER }: HeaderUserMenuProps) {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-accent/60 h-9.5 gap-2.5 rounded-full px-1.5 py-1 transition-all md:px-2"
          aria-label="Menú de usuario"
        >
          <Avatar className="ring-border/80 size-7.5 shrink-0 rounded-full shadow-2xs ring-1">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="hidden text-left leading-none md:flex md:flex-col">
            <span className="text-foreground max-w-[120px] truncate text-[12.5px] font-semibold lg:max-w-[150px]">
              {user.name}
            </span>
            <span className="text-muted-foreground/90 max-w-[120px] truncate text-[10.5px] font-medium lg:max-w-[150px]">
              {user.roleLabel || user.email}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 rounded-xl p-1.5 shadow-xl" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2.5 px-2.5 py-2 text-left text-sm">
            <Avatar className="ring-primary/20 size-9 rounded-xl shadow-2xs ring-1">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-tight">
              <span className="text-foreground truncate font-bold">{user.name}</span>
              <span className="text-muted-foreground truncate text-[11px]">{user.email}</span>
              {user.roleLabel && (
                <div className="mt-1">
                  <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9.5px] font-bold">
                    {user.roleLabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        <div className="bg-muted/40 text-muted-foreground mb-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px]">
          <HugeiconsIcon icon={School01Icon} className="text-primary size-3.5 shrink-0" />
          <span className="truncate font-medium">I.E. Carmelitas · Lircay</span>
        </div>

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/profile"
              className="flex cursor-pointer items-center gap-2.5 text-xs font-medium"
            >
              <HugeiconsIcon icon={UserIcon} className="size-4 shrink-0" />
              <span>Mi Perfil</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/notifications"
              className="flex cursor-pointer items-center gap-2.5 text-xs font-medium"
            >
              <HugeiconsIcon icon={Notification01Icon} className="size-4 shrink-0" />
              <span>Notificaciones</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/settings"
              className="flex cursor-pointer items-center gap-2.5 text-xs font-medium"
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
          className="text-destructive focus:bg-destructive/10 focus:text-destructive flex cursor-pointer items-center gap-2.5 text-xs font-medium"
        >
          <HugeiconsIcon icon={Logout01Icon} className="size-4 shrink-0" />
          <span>{isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
