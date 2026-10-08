"use client";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";
import { Key01Icon, AlertCircleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface TempPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  tempPassword: string;
  actionTitle?: string;
}

export function TempPasswordModal({
  open,
  onOpenChange,
  username,
  tempPassword,
  actionTitle = "Contraseña Temporal Generada",
}: TempPasswordModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={actionTitle}
      description={`Copia y entrega esta credencial al usuario "${username}". No se volverá a mostrar.`}
      icon={Key01Icon}
      size="md"
      preventClose={true}
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3.5 text-sm text-amber-800 dark:text-amber-300">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
          />
          <div>
            <p className="font-semibold">Atención de seguridad</p>
            <p className="text-xs opacity-90">
              Esta clave solo se muestra una sola vez. Al iniciar sesión por primera vez, el usuario
              estará obligado a cambiarla.
            </p>
          </div>
        </div>

        <div className="bg-muted/40 rounded-lg border p-4">
          <div className="text-muted-foreground mb-2 text-xs font-medium">
            Contraseña temporal para <strong className="text-foreground">{username}</strong>:
          </div>
          <div className="bg-background flex items-center justify-between rounded-md border p-3">
            <span className="text-primary font-mono text-lg font-bold tracking-wider">
              {tempPassword}
            </span>
            <CopyButton
              value={tempPassword}
              label="Copiar"
              showToast={true}
              toastMessage="Contraseña copiada al portapapeles"
              variant="outline"
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="shadow-primary/20 h-10 w-full gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md sm:w-auto"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
            <span>Entendido, cerrar</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
