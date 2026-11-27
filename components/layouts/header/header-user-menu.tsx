"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout01Icon,
  School01Icon,
  UserIcon,
  SecurityLockIcon,
  Settings02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config";
import { useLogout } from "@/features/auth";
import { cn, getInitials } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useOptionalDashboardRole } from "../dashboard-role-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MiPerfilModal } from "./mi-perfil-modal";
import { CambiarPasswordModal } from "./cambiar-password-modal";
import type { UserProfileData } from "../sidebar/nav-user";

export interface HeaderUserMenuProps {
  user?: UserProfileData;
}

export function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const { state, isMobile } = useSidebar();
  const contraida = state === "collapsed" && !isMobile;
  const [perfilModalOpen, setPerfilModalOpen] = React.useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // RF-001 V3: el rol se elige al iniciar sesión; aquí solo se muestra el activo
  const dashboard = useOptionalDashboardRole();
  const nombre = user?.name ?? "";
  const rolActivo = dashboard?.rolActivo || user?.roleLabel || "";
  const iniciales = getInitials(nombre) || "U";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "hover:bg-sidebar-accent aria-expanded:bg-sidebar-accent h-13 w-full justify-start gap-2.5 rounded-sm px-2",
              contraida && "size-10 justify-center p-0",
            )}
            aria-label={`Menú de usuario${rolActivo ? `, rol ${rolActivo}` : ""}`}
          >
            <Avatar className="ring-border/80 size-9 shrink-0 rounded-lg ring-1 after:rounded-lg">
              <AvatarImage src={user?.avatar} alt="" />
              <AvatarFallback className="bg-primary/10 text-primary rounded-lg text-xs font-bold">
                {iniciales}
              </AvatarFallback>
            </Avatar>

            <div
              className={cn(
                "flex min-w-0 flex-1 flex-col text-left leading-tight",
                contraida && "hidden",
              )}
            >
              <span className="text-foreground truncate text-sm font-semibold">{nombre}</span>
              {rolActivo ? (
                <span className="text-muted-foreground truncate text-xs font-normal">
                  Rol: {rolActivo}
                </span>
              ) : null}
            </div>
            {!contraida && (
              <HugeiconsIcon
                icon={UnfoldMoreIcon}
                className="text-muted-foreground size-4 shrink-0"
              />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-68 rounded-2xl p-2"
          side={isMobile ? "top" : "right"}
          align="end"
          sideOffset={14}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 px-2 py-2 text-left">
              <Avatar className="ring-primary/20 size-10 rounded-xl ring-1">
                <AvatarImage src={user?.avatar} alt="" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {iniciales}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 leading-tight">
                <span className="text-foreground truncate text-sm font-bold">{nombre}</span>
                {user?.email ? (
                  <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                ) : null}
                {rolActivo ? (
                  <span className="text-primary mt-1 text-xs font-semibold">Rol: {rolActivo}</span>
                ) : null}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1.5" />

          <div className="bg-muted/50 text-muted-foreground my-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs">
            <HugeiconsIcon icon={School01Icon} className="text-primary size-3.5 shrink-0" />
            <span className="truncate font-semibold">{siteConfig.institution.badge}</span>
          </div>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Opción Mi Perfil */}
          <DropdownMenuItem
            onClick={() => setPerfilModalOpen(true)}
            className="flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium"
          >
            <HugeiconsIcon icon={UserIcon} className="text-primary size-4 shrink-0" />
            <span>Mi perfil</span>
          </DropdownMenuItem>

          {/* Opción Cambiar Contraseña */}
          <DropdownMenuItem
            onClick={() => setPasswordModalOpen(true)}
            className="flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium"
          >
            <HugeiconsIcon icon={SecurityLockIcon} className="text-primary size-4 shrink-0" />
            <span>Cambiar contraseña</span>
          </DropdownMenuItem>

          {/* Opción Configuración del Sistema */}
          <DropdownMenuItem asChild>
            <Link
              href="/admin/configuracion"
              className="flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium"
            >
              <HugeiconsIcon icon={Settings02Icon} className="text-primary size-4 shrink-0" />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5" />

          <DropdownMenuItem
            disabled={isLoggingOut}
            onClick={() => logout()}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium"
          >
            <HugeiconsIcon icon={Logout01Icon} className="size-4 shrink-0" />
            <span>{isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal Mi Perfil */}
      <MiPerfilModal
        open={perfilModalOpen}
        onOpenChange={setPerfilModalOpen}
        user={user}
        currentUser={dashboard?.currentUser}
        rolActivo={rolActivo}
        onOpenCambiarPassword={() => setPasswordModalOpen(true)}
      />

      {/* Modal Cambiar Contraseña */}
      <CambiarPasswordModal open={passwordModalOpen} onOpenChange={setPasswordModalOpen} />
    </>
  );
}
