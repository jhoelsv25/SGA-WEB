"use client";

import * as React from "react";
import {
  Notification01Icon,
  Notification03Icon,
  CheckmarkCircle02Icon,
  FlashIcon,
  SmartPhone01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePushNotifications } from "../hooks";

interface PushNotificationBannerProps {
  className?: string;
  variant?: "card" | "banner";
}

const PUSH_CARD_DISMISSED_KEY = "sga_push_banner_dismissed_until";

export function PushNotificationBanner({
  className = "",
  variant = "card",
}: PushNotificationBannerProps) {
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    subscribe,
    unsubscribe,
    testNotification,
  } = usePushNotifications();

  const [probando, setProbando] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = localStorage.getItem(PUSH_CARD_DISMISSED_KEY);
      if (stored) {
        return Date.now() < Number(stored);
      }
    } catch {
      // ignore
    }
    return false;
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      // Ocultar durante 7 días para no incomodar al usuario
      localStorage.setItem(
        PUSH_CARD_DISMISSED_KEY,
        (Date.now() + 7 * 24 * 60 * 60 * 1000).toString(),
      );
    } catch {
      // ignore
    }
  };

  if (!isSupported) {
    return null;
  }

  // Si no está suscrito y el usuario ya lo descartó, no se muestra
  if (!isSubscribed && isDismissed) {
    return null;
  }

  const handleTest = async () => {
    setProbando(true);
    try {
      await testNotification();
    } finally {
      setTimeout(() => setProbando(false), 2000);
    }
  };

  if (variant === "banner" && isSubscribed) {
    return null;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSubscribed
          ? "via-background to-background border-emerald-500/30 bg-linear-to-r from-emerald-950/20 dark:from-emerald-950/40"
          : "border-primary/30 from-primary/10 via-background to-background dark:from-primary/20 bg-linear-to-r"
      } p-5 shadow-lg backdrop-blur-sm ${className}`}
    >
      {/* Círculo difuminado de fondo para efecto glow */}
      <div
        className={`pointer-events-none absolute -top-12 -right-12 size-40 rounded-full opacity-30 blur-3xl ${
          isSubscribed ? "bg-emerald-500" : "bg-primary"
        }`}
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Lado izquierdo: Icono con efecto onda + textos explicativos */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div
              className={`flex size-12 items-center justify-center rounded-2xl shadow-inner transition-colors ${
                isSubscribed
                  ? "border border-emerald-500/20 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-primary/15 text-primary border-primary/20 border"
              }`}
            >
              <HugeiconsIcon
                icon={isSubscribed ? CheckmarkCircle02Icon : Notification03Icon}
                className="size-6 transition-transform duration-300 hover:scale-110"
              />
            </div>
            {/* Punto de estado activo con animación ping */}
            {isSubscribed && (
              <span className="absolute -top-1 -right-1 flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="border-background relative inline-flex size-3 rounded-full border-2 bg-emerald-500" />
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-foreground text-sm font-bold tracking-tight">
                {isSubscribed
                  ? "Notificaciones Push activas en este dispositivo"
                  : "Activa Notificaciones Push en este equipo"}
              </h3>
              <Badge
                variant="outline"
                className={`text-[10px] font-semibold tracking-wider uppercase ${
                  isSubscribed
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-primary/30 bg-primary/10 text-primary"
                }`}
              >
                {isSubscribed ? "Dispositivo Vinculado" : "PWA Ready"}
              </Badge>
            </div>

            <p className="text-muted-foreground max-w-xl text-xs leading-relaxed">
              {isSubscribed
                ? "Recibirás alertas nativas en tu pantalla de exámenes por vencer, tareas vencidas y comunicados urgentes, incluso si la página está cerrada."
                : "Recibe alertas nativas instantáneas en tu celular o computadora. No te pierdas vencimientos de exámenes ni comunicados importantes."}
            </p>

            {/* Micro-beneficios con chips elegantes */}
            <div className="text-muted-foreground/90 flex flex-wrap items-center gap-3 pt-1 text-[11px]">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Clock01Icon} className="text-primary size-3.5" />
                30 y 15 min antes
              </span>
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={SmartPhone01Icon} className="text-primary size-3.5" />
                Segundo plano & móvil
              </span>
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={FlashIcon} className="text-primary size-3.5" />
                Instantáneo
              </span>
            </div>
          </div>
        </div>

        {/* Lado derecho: Botones de Acción */}
        <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:self-center">
          {isSubscribed ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={probando}
                className="h-9 gap-1.5 border-emerald-500/30 text-xs font-medium hover:bg-emerald-500/10 hover:text-emerald-600"
              >
                <HugeiconsIcon icon={FlashIcon} className="size-3.5" />
                {probando ? "Enviando..." : "Probar en este equipo"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => unsubscribe()}
                disabled={isLoading}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 text-xs"
              >
                Desvincular
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => subscribe()}
                disabled={isLoading}
                className="shadow-primary/20 hover:shadow-primary/30 h-9.5 gap-2 px-4 text-xs font-semibold shadow-md transition-all hover:shadow-lg"
              >
                <HugeiconsIcon icon={Notification01Icon} className="size-4" />
                {isLoading
                  ? "Configurando..."
                  : permission === "denied"
                    ? "Permiso bloqueado"
                    : "Activar en este dispositivo"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground h-9.5 px-3 text-xs"
                title="No mostrar por 7 días"
              >
                Ahora no
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
