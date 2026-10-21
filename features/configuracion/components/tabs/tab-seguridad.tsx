"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SlidersHorizontalIcon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useVariablesQuery, useUpdateVariableMutation } from "@/features/variables-sistema";

export function TabSeguridad() {
  const { data: variables = [], isLoading } = useVariablesQuery();
  const updateVariableMutation = useUpdateVariableMutation();

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

  const variablesNumericas = React.useMemo(() => {
    return (variables || []).filter(
      (v) => (v.modulo === "seguridad" || v.modulo === "auditoria") && v.tipo !== "booleano",
    );
  }, [variables]);

  return (
    <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-base font-bold">
            Políticas de Seguridad y Autenticación
          </CardTitle>
          <CardDescription className="text-xs">
            Parámetros de protección contra accesos no autorizados sincronizados con la BD
          </CardDescription>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
          <Link href="/admin/variables">
            <HugeiconsIcon icon={SlidersHorizontalIcon} className="size-3.5" />
            Editar Políticas
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        ) : (
          <>
            {/* Switches de Políticas Booleanas */}
            <div className="divide-border/40 divide-y rounded-xl border">
              <div className="flex items-center justify-between p-3.5">
                <div className="space-y-0.5 pr-4">
                  <p className="text-foreground text-xs font-semibold">
                    Bloqueo automático por intentos fallidos
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Bloquea la cuenta al superar el límite configurado de intentos erróneos.
                  </p>
                </div>
                <Switch
                  checked={getBoolVariable("seguridad.bloqueo_intentos_habilitado", true)}
                  disabled={updateVariableMutation.isPending}
                  onCheckedChange={() =>
                    handleToggleVariable(
                      "seguridad.bloqueo_intentos_habilitado",
                      "Bloqueo por intentos",
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3.5">
                <div className="space-y-0.5 pr-4">
                  <p className="text-foreground text-xs font-semibold">
                    Caducidad de sesión por inactividad
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Cierra la sesión automáticamente tras el tiempo de inactividad estipulado.
                  </p>
                </div>
                <Switch
                  checked={getBoolVariable("seguridad.caducidad_inactividad_habilitado", true)}
                  disabled={updateVariableMutation.isPending}
                  onCheckedChange={() =>
                    handleToggleVariable(
                      "seguridad.caducidad_inactividad_habilitado",
                      "Caducidad por inactividad",
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3.5">
                <div className="space-y-0.5 pr-4">
                  <p className="text-foreground text-xs font-semibold">
                    Requerir PIN para marcación en Kiosko
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Exige el PIN personal además del DNI al registrar asistencia presencial.
                  </p>
                </div>
                <Switch
                  checked={getBoolVariable("seguridad.requerir_pin_kiosko", true)}
                  disabled={updateVariableMutation.isPending}
                  onCheckedChange={() =>
                    handleToggleVariable("seguridad.requerir_pin_kiosko", "Requerir PIN en kiosko")
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3.5">
                <div className="space-y-0.5 pr-4">
                  <p className="text-foreground text-xs font-semibold">
                    Registro obligatorio de IP en auditoría
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Guarda la dirección IP del cliente en cada evento de la bitácora inmutable.
                  </p>
                </div>
                <Switch
                  checked={getBoolVariable("seguridad.registro_ip_equipos", true)}
                  disabled={updateVariableMutation.isPending}
                  onCheckedChange={() =>
                    handleToggleVariable(
                      "seguridad.registro_ip_equipos",
                      "Registro de IP en auditoría",
                    )
                  }
                />
              </div>
            </div>

            {/* Parámetros numéricos vigentes */}
            {variablesNumericas.length > 0 && (
              <div className="divide-border/40 divide-y rounded-xl border">
                {variablesNumericas.map((v) => (
                  <div key={v.codigo} className="flex items-center justify-between p-3 text-xs">
                    <div>
                      <p className="text-foreground font-semibold">{v.descripcion}</p>
                      <p className="text-muted-foreground font-mono text-[10px]">{v.codigo}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs font-bold">
                      {v.valor} {v.unidad || ""}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
              <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0 text-amber-600" />
              <span>
                Las políticas de seguridad se aplican de manera estricta en el backend al momento de
                autenticar usuarios o validar sesiones.
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
