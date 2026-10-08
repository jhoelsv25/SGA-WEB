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
      title={
        autorizadoExitoso ? "¡Equipo Autorizado con Éxito!" : "Autorizar este Dispositivo Físico"
      }
      description={
        autorizadoExitoso
          ? "Este navegador ha sido vinculado exitosamente con la clave del kiosko."
          : "Vincula esta computadora o tableta para operar como terminal del colegio."
      }
      icon={ShieldCheckIcon}
      size="lg"
    >
      <div className="space-y-5 py-2">
        {autorizadoExitoso ? (
          <div className="space-y-5 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-foreground text-base font-bold">
                Equipo autorizado. Ya puede usarse como kiosko.
              </h4>
              <p className="text-muted-foreground mx-auto max-w-md text-xs">
                La clave criptográfica ha quedado guardada de forma segura en este navegador. Ahora
                puedes abrir la pantalla del kiosko en modo pantalla completa.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
                Cerrar y Permanecer en Administración
              </Button>
              <Button
                onClick={handleOpenKiosko}
                className="gap-2 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                Abrir Modo Kiosko Ahora
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

            <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
              <HugeiconsIcon
                icon={Alert02Icon}
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
              />
              <div>
                <strong>Asegúrate de estar en el equipo físico correspondiente:</strong> Al
                presionar el botón de autorización, se generará y guardará un token criptográfico
                local en este navegador específico. Sin esta clave, la pantalla del kiosko no se
                abrirá.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isAuthorizing}
              >
                Cancelar
              </Button>
              <Button onClick={handleAutorizar} disabled={isAuthorizing} className="gap-2 px-5">
                {isAuthorizing ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Generando clave de autorización...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={ShieldCheckIcon} className="h-4 w-4" />
                    Autorizar Este Dispositivo
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
