"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShieldCheckIcon,
  CheckmarkCircle02Icon,
  ComputerIcon,
  Alert02Icon,
  ArrowRight01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import type { Equipo } from "../../types";

interface AutorizarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipo: Equipo | null;
  onConfirmAutorizar: (equipoId: string) => Promise<void>;
  isAuthorizing?: boolean;
}

export function AutorizarModal({
  open,
  onOpenChange,
  equipo,
  onConfirmAutorizar,
  isAuthorizing = false,
}: AutorizarModalProps) {
  const router = useRouter();
  const [autorizadoExitoso, setAutorizadoExitoso] = React.useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setAutorizadoExitoso(false);
    }
    onOpenChange(newOpen);
  };

  if (!equipo) return null;

  const handleAutorizar = async () => {
    try {
      await onConfirmAutorizar(equipo.id);
      setAutorizadoExitoso(true);
    } catch {
      // Manejado por el hook
    }
  };

  const handleOpenKiosko = () => {
    onOpenChange(false);
    router.push("/kiosko");
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={autorizadoExitoso ? "Equipo autorizado con éxito" : "Autorizar este dispositivo"}
      description={
        autorizadoExitoso
          ? "Este navegador ha sido vinculado exitosamente para operar el kiosko."
          : "Habilita esta computadora o tableta para operar como terminal del colegio."
      }
      icon={ShieldCheckIcon}
      size="lg"
    >
      <div className="space-y-5 py-2">
        {autorizadoExitoso ? (
          <div className="space-y-5 py-4 text-center">
            <div className="border-success/20 bg-success/10 text-success mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-foreground text-base font-bold">
                Equipo autorizado. Ya puede usarse como kiosko.
              </h4>
              <p className="text-muted-foreground mx-auto max-w-md text-xs">
                La autorización se guardó de forma segura en este navegador. Ahora puedes abrir la
                pantalla del kiosko en pantalla completa.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                <span>Cerrar y permanecer aquí</span>
              </Button>
              <Button
                type="button"
                onClick={handleOpenKiosko}
                className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                <span>Abrir modo kiosko</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-muted/30 space-y-3 rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-xl p-2.5">
                  <HugeiconsIcon icon={ComputerIcon} className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-foreground text-sm font-bold">{equipo.nombre}</h4>
                  <p className="text-muted-foreground text-xs">
                    Ubicación:{" "}
                    <span className="text-foreground font-medium">{equipo.ubicacion}</span>
                  </p>
                </div>
              </div>

              <div className="text-muted-foreground flex items-center gap-2 border-t pt-2 text-xs">
                <span>
                  Propósito:{" "}
                  <strong className="text-foreground capitalize">{equipo.proposito}</strong>
                </span>
                <span>•</span>
                <span>
                  Tipo: <strong className="text-foreground capitalize">{equipo.tipo}</strong>
                </span>
              </div>
            </div>

            <div className="border-warning/25 bg-warning/10 text-foreground flex items-start gap-3 rounded-xl border p-3.5 text-xs leading-relaxed">
              <HugeiconsIcon icon={Alert02Icon} className="text-warning mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <strong>Asegúrate de estar en el equipo físico correspondiente:</strong> Al
                confirmar la autorización, este navegador quedará habilitado para operar como
                kiosko. Sin este paso, no se podrán registrar asistencias.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isAuthorizing}
                className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                <span>Cancelar</span>
              </Button>
              <Button
                type="button"
                onClick={handleAutorizar}
                disabled={isAuthorizing}
                className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
              >
                {isAuthorizing ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <HugeiconsIcon icon={ShieldCheckIcon} className="size-3.5" />
                )}
                <span>
                  {isAuthorizing ? "Autorizando dispositivo..." : "Autorizar este dispositivo"}
                </span>
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
