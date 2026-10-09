"use client";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

interface CredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nombreCompleto: string;
  codigoDocente: string;
  nombreUsuario: string;
  tempPassword?: string | null;
  codigoCredencial: string;
  pin: string;
}

export function CredentialsModal({
  open,
  onOpenChange,
  nombreCompleto,
  codigoDocente,
  nombreUsuario,
  tempPassword,
  codigoCredencial,
  pin,
}: CredentialsModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Credenciales del Docente Emitidas"
      description="Guarde estos datos ahora. Por seguridad, el PIN y la contraseña temporal solo se muestran una vez."
      icon={CheckmarkCircle02Icon}
      size="md"
    >
      <div className="space-y-4">
        {/* Identificación del docente */}
        <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5">
          <p className="text-muted-foreground text-xs">Docente asignado</p>
          <p className="text-foreground text-sm font-semibold">{nombreCompleto}</p>
          <p className="text-muted-foreground font-mono text-xs">Código: {codigoDocente}</p>
        </div>

        {/* Credenciales de Acceso Web (si aplica) */}
        {tempPassword ? (
          <div className="border-border/60 space-y-3 rounded-xl border p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-xs font-semibold">Cuenta de Acceso Web</span>
              <CopyButton
                value={`Usuario: ${nombreUsuario}\nContraseña: ${tempPassword}`}
                label="Copiar acceso"
                showToast={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-muted/40 rounded-lg p-2.5">
                <span className="text-muted-foreground block text-[11px]">Usuario</span>
                <p className="text-foreground pt-0.5 font-mono font-semibold">{nombreUsuario}</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-2.5">
                <span className="text-muted-foreground block text-[11px]">Contraseña temporal</span>
                <p className="text-primary pt-0.5 font-mono font-semibold">{tempPassword}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Credenciales de Kiosko / Marcación */}
        <div className="border-border/60 space-y-3 rounded-xl border p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-semibold">
              Credencial de Marcación (Kiosko)
            </span>
            <CopyButton
              value={`Código: ${codigoCredencial}\nPIN: ${pin}`}
              label="Copiar credencial"
              showToast={true}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted/40 rounded-lg p-2.5">
              <span className="text-muted-foreground block text-[11px]">Código Credencial</span>
              <p className="text-foreground pt-0.5 font-mono font-semibold">{codigoCredencial}</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-2.5">
              <span className="text-muted-foreground block text-[11px]">PIN de Marcación</span>
              <p className="pt-0.5 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {pin}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-full px-5 text-xs font-semibold shadow-md"
          >
            Entendido y cerrado
          </Button>
        </div>
      </div>
    </Modal>
  );
}
