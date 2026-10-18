"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Mail01Icon,
  SecurityLockIcon,
  School01Icon,
  CheckmarkCircle02Icon,
  Key01Icon,
} from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config";
import { getInitials } from "@/lib/utils";
import type { CurrentUser } from "@/features/auth/types/auth.types";
import type { UserProfileData } from "../sidebar/nav-user";

interface MiPerfilModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserProfileData;
  currentUser?: CurrentUser | null;
  rolActivo?: string;
  onOpenCambiarPassword?: () => void;
  onOpenCambiarPin?: () => void;
}

export function MiPerfilModal({
  open,
  onOpenChange,
  user,
  currentUser,
  rolActivo,
  onOpenCambiarPassword,
  onOpenCambiarPin,
}: MiPerfilModalProps) {
  const nombre = user?.name ?? currentUser?.firstName ?? "Usuario";
  const email = user?.email ?? currentUser?.email ?? "No registrado";
  const username = currentUser?.username ?? "";
  const iniciales = getInitials(nombre) || "U";
  const institucion =
    currentUser?.institutionName || siteConfig.institution.name || siteConfig.institution.badge;

  const roles = currentUser?.roles || (rolActivo ? [rolActivo] : []);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Mi Perfil Institucional"
      description="Información de tu cuenta y credenciales en el sistema"
      icon={UserIcon}
      size="md"
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {onOpenCambiarPassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onOpenCambiarPassword();
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={SecurityLockIcon} className="text-primary size-3.5" />
                Cambiar clave
              </Button>
            )}
            {onOpenCambiarPin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onOpenCambiarPin();
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={Key01Icon} className="text-primary size-3.5" />
                Mi PIN
              </Button>
            )}
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1">
        {/* Encabezado con Avatar y Estado de Cuenta */}
        <div className="bg-muted/40 border-border/60 flex items-center gap-3.5 rounded-2xl border p-3.5">
          <Avatar className="ring-primary/20 size-14 rounded-2xl shadow-xs ring-2">
            <AvatarImage src={user?.avatar} alt={nombre} />
            <AvatarFallback className="bg-primary/10 text-primary text-base font-bold">
              {iniciales}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-foreground truncate text-sm font-bold">{nombre}</h3>
              <Badge
                variant="outline"
                className="gap-1 border-emerald-500/40 text-[10px] text-emerald-600 dark:text-emerald-400"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Activo
              </Badge>
            </div>
            {username && <p className="text-muted-foreground font-mono text-xs">@{username}</p>}
            {rolActivo && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary text-[11px] font-semibold"
              >
                Rol actual: {rolActivo}
              </Badge>
            )}
          </div>
        </div>

        {/* Detalles de Información de Contacto e Institución */}
        <div className="divide-border/40 divide-y rounded-xl border">
          <div className="flex items-center gap-3 p-3 text-xs">
            <HugeiconsIcon icon={Mail01Icon} className="text-muted-foreground size-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-[11px]">Correo Institucional</span>
              <span className="text-foreground block truncate font-medium">{email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 text-xs">
            <HugeiconsIcon icon={School01Icon} className="text-muted-foreground size-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-[11px]">Institución Educativa</span>
              <span className="text-foreground block truncate font-medium">{institucion}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 text-xs">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="text-muted-foreground size-4 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-[11px]">Roles Asignados</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {roles.map((r) => (
                  <Badge key={r} variant="outline" className="text-[10px] capitalize">
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
