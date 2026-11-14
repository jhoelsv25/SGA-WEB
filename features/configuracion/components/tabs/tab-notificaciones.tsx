"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  CheckmarkCircle02Icon,
  Notification03Icon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { usePushNotifications } from "@/features/notificaciones";
import { useVariablesQuery, useUpdateVariableMutation } from "@/features/variables-sistema";

export function TabNotificaciones() {
  const { data: variables = [], isLoading } = useVariablesQuery();
  const updateVariableMutation = useUpdateVariableMutation();
  const {
    isSupported: isPushSupported,
    isSubscribed: isPushSubscribed,
    permission: pushPermission,
    isLoading: isPushLoading,
    subscribe: subscribePush,
    unsubscribe: unsubscribePush,
    testNotification: testPushNotification,
  } = usePushNotifications();

  const getBoolVariable = React.useCallback(
    (codigo: string, defaultValue = true): boolean => {
      const v = variables.find((item) => item.codigo === codigo);
      if (!v) return defaultValue;
      return v.valor.toLowerCase() === "true" || v.valor === "1";
    },
    [variables],
  );

  const handleToggleVariable = (codigo: string, descripcion: string) => {
    const valorActual = getBoolVariable(codigo);
    updateVariableMutation.mutate({
      codigo,
      payload: {
        valor: String(!valorActual),
        motivoCambio: `Preferencia de "${descripcion}" actualizada desde Configuración`,
      },
    });
  };

  return (
    <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-base font-bold">Canales y Reglas de Notificación</CardTitle>
          <CardDescription className="text-xs">
            Avisos automáticos a la comunidad educativa sincronizados en tiempo real con la base de
            datos
          </CardDescription>
        </div>
        <Badge variant="outline" className="border-emerald-500/40 text-[10px] text-emerald-600">
          Sincronizado con BD
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : (
          <div className="divide-border/40 divide-y rounded-xl border">
            {/* Switch 1: Inasistencias */}
            <div className="flex items-center justify-between p-3.5">
              <div className="space-y-0.5 pr-4">
                <p className="text-foreground text-xs font-semibold">
                  Aviso instantáneo de inasistencia a apoderados
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Envía notificación al portal del apoderado si el estudiante no registra asistencia
                  antes del límite.
                </p>
              </div>
              <Switch
                checked={getBoolVariable("notificacion.aviso_inasistencia_apoderado", true)}
                disabled={updateVariableMutation.isPending}
                onCheckedChange={() =>
                  handleToggleVariable(
                    "notificacion.aviso_inasistencia_apoderado",
                    "Aviso de inasistencia a apoderados",
                  )
                }
              />
            </div>

            {/* Switch 2: Cierre de Sesión */}
            <div className="flex items-center justify-between p-3.5">
              <div className="space-y-0.5 pr-4">
                <p className="text-foreground text-xs font-semibold">
                  Recordatorio de cierre de sesión de clase
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Alerta al docente al término del horario académico si tiene sesiones pendientes de
                  registrar.
                </p>
              </div>
              <Switch
                checked={getBoolVariable("notificacion.recordatorio_sesiones_docente", true)}
                disabled={updateVariableMutation.isPending}
                onCheckedChange={() =>
                  handleToggleVariable(
                    "notificacion.recordatorio_sesiones_docente",
                    "Recordatorio de sesiones a docentes",
                  )
                }
              />
            </div>

            {/* Switch 3: Nuevo Dispositivo */}
            <div className="flex items-center justify-between p-3.5">
              <div className="space-y-0.5 pr-4">
                <p className="text-foreground text-xs font-semibold">
                  Alerta de inicio de sesión en nuevo dispositivo
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Notifica al administrador cuando una cuenta de dirección o docente ingresa desde
                  una nueva IP.
                </p>
              </div>
              <Switch
                checked={getBoolVariable("notificacion.alerta_nuevo_dispositivo", true)}
                disabled={updateVariableMutation.isPending}
                onCheckedChange={() =>
                  handleToggleVariable(
                    "notificacion.alerta_nuevo_dispositivo",
                    "Alerta de nuevo dispositivo",
                  )
                }
              />
            </div>
          </div>
        )}

        {/* Suscripción Web Push en este dispositivo */}
        <div className="border-border/60 bg-muted/20 flex flex-col justify-between gap-3 rounded-xl border p-3.5 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <HugeiconsIcon icon={Notification03Icon} className="text-primary size-4" />
              <span className="text-foreground text-xs font-semibold">
                Notificaciones Push en este dispositivo
              </span>
              {!isPushSupported ? (
                <Badge variant="outline" className="text-[10px]">
                  No soportado
                </Badge>
              ) : isPushSubscribed ? (
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-600"
                >
                  Suscripción activa
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-[10px] text-amber-600"
                >
                  {pushPermission === "denied" ? "Permiso bloqueado" : "No suscrito"}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-[11px]">
              {!isPushSupported
                ? "Tu navegador actual no soporta notificaciones Web Push."
                : pushPermission === "denied"
                  ? "Bloqueaste las notificaciones en este navegador. Habilítalas en la configuración del sitio para suscribirte."
                  : isPushSubscribed
                    ? "Este navegador está suscrito y recibirá alertas en tiempo real."
                    : "Activa las notificaciones push para recibir avisos en este dispositivo aunque cierres la pestaña."}
            </p>
          </div>

          {isPushSupported && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {isPushSubscribed ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPushLoading}
                    onClick={() => void testPushNotification()}
                  >
                    Probar Push
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isPushLoading}
                    onClick={() => void unsubscribePush()}
                  >
                    Desactivar
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  disabled={isPushLoading || pushPermission === "denied"}
                  onClick={() => void subscribePush()}
                >
                  {isPushLoading ? "Verificando..." : "Activar notificaciones Push"}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Acceso a módulos de emisión */}
        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
          <div className="bg-muted/30 border-border/40 space-y-2 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-xs font-semibold">Comunicados Oficiales</span>
              <HugeiconsIcon icon={BubbleChatIcon} className="text-primary size-3.5" />
            </div>
            <p className="text-muted-foreground text-[11px]">
              Emisión de circulares y comunicados con acuse de recibo.
            </p>
            <Button asChild variant="link" size="sm" className="h-6 p-0 text-xs font-medium">
              <Link href="/admin/comunicados">Ir a Comunicados →</Link>
            </Button>
          </div>

          <div className="bg-muted/30 border-border/40 space-y-2 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-xs font-semibold">Bitácora y Trazabilidad</span>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5 text-emerald-500" />
            </div>
            <p className="text-muted-foreground text-[11px]">
              Registro auditable inmutable de eventos y alertas.
            </p>
            <Button asChild variant="link" size="sm" className="h-6 p-0 text-xs font-medium">
              <Link href="/admin/audit">Ver Bitácora →</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
