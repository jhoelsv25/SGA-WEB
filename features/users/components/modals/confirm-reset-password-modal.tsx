"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Key01Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  LockPasswordIcon,
  DiceIcon,
} from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/user-avatar";
import { Badge } from "@/components/ui/badge";
import { PasswordInput } from "@/features/auth/components/password-input";
import { Spinner } from "@/components/common/spinner";
import { cn } from "@/lib/utils";
import type { UserItem } from "../../types/users.types";

interface ConfirmResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserItem | null;
  isLoading?: boolean;
  onConfirm: (nuevaContrasena?: string) => Promise<void>;
}

export function ConfirmResetPasswordModal({
  open,
  onOpenChange,
  user,
  isLoading = false,
  onConfirm,
}: ConfirmResetPasswordModalProps) {
  const [modo, setModo] = React.useState<"automatica" | "manual">("automatica");
  const [manualPassword, setManualPassword] = React.useState("");

  const handleClose = () => {
    if (isLoading) return;
    setModo("automatica");
    setManualPassword("");
    onOpenChange(false);
  };

  if (!user) return null;

  const p = user.persona;
  const fullName = `${p.apellidoPaterno} ${p.apellidoMaterno ?? ""}, ${p.nombres}`.trim();

  // Validaciones para modo manual
  const hasMinLength = manualPassword.length >= 8;
  const hasLetter = /[A-Za-z]/.test(manualPassword);
  const hasNumber = /\d/.test(manualPassword);
  const isManualValid = hasMinLength && hasLetter && hasNumber;

  const canSubmit = modo === "automatica" || isManualValid;

  const handleExecute = async () => {
    if (!canSubmit || isLoading) return;
    await onConfirm(modo === "manual" ? manualPassword.trim() : undefined);
    setModo("automatica");
    setManualPassword("");
  };

  return (
    <Modal
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          handleClose();
        } else if (!isLoading) {
          onOpenChange(true);
        }
      }}
      title="Restablecer contraseña de usuario"
      description="Define el método para generar una nueva contraseña temporal de acceso."
      icon={Key01Icon}
      size="md"
    >
      <div className="space-y-4">
        {/* Tarjeta de usuario afectado */}
        <div className="border-border/70 bg-muted/30 flex items-center justify-between rounded-xl border p-3">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar name={fullName} avatar={p.fotoUrl ?? undefined} />
            <div className="min-w-0">
              <p className="text-foreground truncate text-xs font-bold">{fullName}</p>
              <p className="text-muted-foreground font-mono text-[11px]">
                <span className="uppercase">{p.tipoDocumento}</span>: {p.numeroDocumento} ·{" "}
                <strong className="text-foreground">{user.nombreUsuario}</strong>
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary shrink-0 text-xs font-semibold"
          >
            {user.rol.nombre}
          </Badge>
        </div>

        {/* Advertencia preventiva de seguridad */}
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
          />
          <p className="leading-relaxed">
            <strong>Acción sensible:</strong> Al restablecer la contraseña, se revocarán de
            inmediato todas las sesiones activas del usuario y se le obligará a crear una clave
            definitiva en su próximo ingreso.
          </p>
        </div>

        {/* Selector de modo: Automática vs Manual */}
        <div className="space-y-2">
          <label className="text-foreground block text-xs font-semibold">
            Método de asignación de clave:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setModo("automatica")}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all",
                modo === "automatica"
                  ? "border-primary bg-primary/5 text-primary font-bold shadow-2xs"
                  : "border-border/70 hover:bg-muted/50 text-muted-foreground",
              )}
            >
              <HugeiconsIcon icon={DiceIcon} className="size-4 shrink-0" />
              <div>
                <p className="leading-tight">Generar automática</p>
                <p className="text-muted-foreground text-[10px] font-normal">
                  Clave segura al azar
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setModo("manual")}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all",
                modo === "manual"
                  ? "border-primary bg-primary/5 text-primary font-bold shadow-2xs"
                  : "border-border/70 hover:bg-muted/50 text-muted-foreground",
              )}
            >
              <HugeiconsIcon icon={LockPasswordIcon} className="size-4 shrink-0" />
              <div>
                <p className="leading-tight">Escribir manual</p>
                <p className="text-muted-foreground text-[10px] font-normal">Definida por admin</p>
              </div>
            </button>
          </div>
        </div>

        {/* Campo de contraseña manual con checklist */}
        {modo === "manual" && (
          <div className="border-border/80 bg-card space-y-3 rounded-xl border p-3 shadow-2xs">
            <div>
              <label
                htmlFor="manual-temp-password"
                className="text-foreground mb-1 block text-xs font-medium"
              >
                Nueva contraseña temporal *
              </label>
              <PasswordInput
                id="manual-temp-password"
                value={manualPassword}
                onChange={(e) => setManualPassword(e.target.value)}
                placeholder="Ej. Temporal2026*"
                className="h-9 text-xs"
                autoFocus
              />
            </div>

            {/* Checklist de requisitos de seguridad */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <span
                className={cn(
                  "flex items-center gap-1",
                  hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                )}
              >
                <HugeiconsIcon
                  icon={hasMinLength ? CheckmarkCircle02Icon : Cancel01Icon}
                  className="size-3"
                />
                Mínimo 8 caracteres
              </span>
              <span
                className={cn(
                  "flex items-center gap-1",
                  hasLetter ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                )}
              >
                <HugeiconsIcon
                  icon={hasLetter ? CheckmarkCircle02Icon : Cancel01Icon}
                  className="size-3"
                />
                Al menos una letra
              </span>
              <span
                className={cn(
                  "flex items-center gap-1",
                  hasNumber ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                )}
              >
                <HugeiconsIcon
                  icon={hasNumber ? CheckmarkCircle02Icon : Cancel01Icon}
                  className="size-3"
                />
                Al menos un número
              </span>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="border-border/60 flex items-center justify-end gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
            className="h-9 rounded-xl px-4 text-xs font-medium"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => void handleExecute()}
            disabled={!canSubmit || isLoading}
            className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
          >
            {isLoading ? (
              <>
                <Spinner className="size-3.5" />
                <span>Restableciendo...</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Key01Icon} className="size-3.5" />
                <span>Confirmar y restablecer</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
