"use client";

import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";
import { Key01Icon, AlertCircleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

interface TempPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  tempPassword: string;
  actionTitle?: string;
}

function getAmbiguousCharInfo(char: string): { isAmbiguous: boolean; label?: string } {
  switch (char) {
    case "1":
      return { isAmbiguous: true, label: "número uno (1)" };
    case "l":
      return { isAmbiguous: true, label: "letra L minúscula (l)" };
    case "I":
      return { isAmbiguous: true, label: "letra I mayúscula (I)" };
    case "0":
      return { isAmbiguous: true, label: "número cero (0)" };
    case "O":
      return { isAmbiguous: true, label: "letra O mayúscula (O)" };
    default:
      return { isAmbiguous: false };
  }
}

export function TempPasswordModal({
  open,
  onOpenChange,
  username,
  tempPassword,
  actionTitle = "Contraseña temporal generada",
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
        <div className="border-warning/30 bg-warning/10 text-warning-text flex items-start gap-3 rounded-lg border p-3.5 text-sm">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="text-warning-text mt-0.5 size-5 shrink-0"
          />
          <div>
            <p className="font-semibold">Atención de seguridad</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Esta clave solo se muestra una sola vez. Al iniciar sesión por primera vez, el usuario
              estará obligado a cambiarla.
            </p>
          </div>
        </div>

        <div className="bg-muted/40 space-y-3 rounded-lg border p-4">
          <div className="text-muted-foreground text-xs font-medium">
            Contraseña temporal para <strong className="text-foreground">{username}</strong>:
          </div>
          <div className="bg-background flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex flex-wrap items-center gap-1.5 font-mono text-base font-bold select-all"
              aria-label={`Contraseña temporal: ${tempPassword}`}
            >
              {tempPassword.split("").map((char, index) => {
                const info = getAmbiguousCharInfo(char);
                return (
                  <span
                    key={`char-${index}`}
                    className={cn(
                      "inline-flex h-8 min-w-7 items-center justify-center rounded px-1.5 text-center transition-colors",
                      info.isAmbiguous
                        ? "border-primary/25 bg-primary/10 text-primary border font-black"
                        : "bg-muted/50 text-foreground",
                    )}
                    title={info.label ? `${char} (${info.label})` : undefined}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
            <CopyButton
              value={tempPassword}
              label="Copiar"
              showToast={true}
              toastMessage="Contraseña copiada al portapapeles"
              variant="outline"
              className="h-9 shrink-0 text-xs"
            />
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Los caracteres ambiguos (<span className="text-primary font-bold">1</span>/
            <span className="text-primary font-bold">l</span>,{" "}
            <span className="text-primary font-bold">0</span>/
            <span className="text-primary font-bold">O</span>) están resaltados para evitar
            confusiones al transcribirlos.
          </p>
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
