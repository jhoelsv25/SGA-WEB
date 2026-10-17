"use client";

import * as React from "react";
import {
  Cancel01Icon,
  FlashIcon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  BellIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "../hooks";

const PUSH_TOAST_DISMISSED_KEY = "sga_push_toast_dismissed_until";

export function PushNotificationPromptToast() {
  const { isSupported, isSubscribed, permission, isLoading, subscribe } = usePushNotifications();

  const [isVisible, setIsVisible] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Verificar si el navegador soporta push
    if (!isSupported || isSubscribed || permission === "denied") {
      return;
    }

    // Verificar si ya fue descartado en localStorage
    try {
      const stored = localStorage.getItem(PUSH_TOAST_DISMISSED_KEY);
      if (stored) {
        const until = Number(stored);
        if (Date.now() < until) {
          return;
        }
      }
    } catch {
      // ignore
    }

    // Retardo de cortesía de 3.5 segundos para no interrumpir la carga inicial
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [isSupported, isSubscribed, permission]);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      try {
        // Guardar por 7 días en localStorage
        localStorage.setItem(
          PUSH_TOAST_DISMISSED_KEY,
          (Date.now() + 7 * 24 * 60 * 60 * 1000).toString(),
        );
      } catch {
        // ignore
      }
    }, 250);
  };

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      handleDismiss();
    }
  };

  if (!isVisible || !isSupported || isSubscribed || permission === "denied") {
    return null;
  }

  return (
    <div
      className={`fixed right-5 bottom-5 z-50 w-90 max-w-[calc(100vw-2.5rem)] transition-all duration-300 ${
        isClosing
          ? "animate-out fade-out slide-out-to-bottom-4 zoom-out-95"
          : "animate-in fade-in slide-in-from-bottom-5 duration-500"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="border-primary/25 bg-card/95 dark:bg-card/90 dark:border-primary/30 relative overflow-hidden rounded-2xl border p-4.5 shadow-2xl backdrop-blur-xl">
        {/* Glow difuminado de fondo */}
        <div className="bg-primary/20 pointer-events-none absolute -top-10 -right-10 size-32 rounded-full blur-2xl" />

        {/* Botón X de cerrar en la esquina */}
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground absolute top-3 right-3 rounded-full p-1 transition-colors"
          title="No mostrar por ahora"
          aria-label="Cerrar aviso"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          {/* Icono con badge y pulso */}
          <div className="relative shrink-0">
            <div className="bg-primary/15 text-primary border-primary/25 flex size-10 items-center justify-center rounded-xl border shadow-sm">
              <HugeiconsIcon icon={BellIcon} className="size-5" />
            </div>
            <span className="absolute -top-1 -right-1 flex size-2.5">
              <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75" />
              <span className="bg-primary relative inline-flex size-2.5 rounded-full" />
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-foreground text-xs font-bold tracking-tight">
              ¿Activar notificaciones en este equipo?
            </h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Recibe avisos de exámenes y tareas por vencer, notas y comunicados incluso con la
              pantalla apagada.
            </p>
          </div>
        </div>

        {/* Chips de beneficios */}
        <div className="border-border/50 text-muted-foreground my-3 flex items-center gap-3 border-y py-2 text-[10px]">
          <span className="flex items-center gap-1 font-medium">
            <HugeiconsIcon icon={Clock01Icon} className="text-primary size-3" />
            30 min antes
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium">
            <HugeiconsIcon icon={FlashIcon} className="text-primary size-3" />
            Sin app abierta
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3 text-emerald-500" />
            Seguro
          </span>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-2 pt-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground h-8 px-3 text-xs"
          >
            Ahora no
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSubscribe}
            disabled={isLoading}
            className="shadow-primary/25 hover:shadow-primary/35 h-8 gap-1.5 px-3.5 text-xs font-semibold shadow-md transition-all hover:shadow-lg"
          >
            <HugeiconsIcon icon={BellIcon} className="size-3.5" />
            {isLoading ? "Activando..." : "Activar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
