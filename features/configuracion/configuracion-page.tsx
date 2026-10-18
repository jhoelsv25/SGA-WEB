"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings02Icon,
  School01Icon,
  SlidersHorizontalIcon,
  Clock01Icon,
  ComputerIcon,
  SecurityLockIcon,
  Notification01Icon,
  CheckmarkCircle02Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/config";
import { toast } from "@/lib/toast";

export function ConfiguracionPage() {
  const [tabActiva, setTabActiva] = React.useState("institucion");

  // Estados de configuración de seguridad interactiva
  const [seguridadSettings, setSeguridadSettings] = React.useState({
    bloqueoIntentos: true,
    caducidadInactividad: true,
    requerirPinMarcacion: true,
    registroIpEquipos: true,
  });

  // Estados de configuración de notificaciones
  const [notifSettings, setNotifSettings] = React.useState({
    alertaInasistenciaApoderado: true,
    recordatorioSesionesDocente: true,
    notificarNuevoEquipo: true,
  });

  const handleToggleSeguridad = (key: keyof typeof seguridadSettings) => {
    setSeguridadSettings((prev) => {
      const nuevo = { ...prev, [key]: !prev[key] };
      toast.success("Preferencia de seguridad actualizada");
      return nuevo;
    });
  };

  const handleToggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings((prev) => {
      const nuevo = { ...prev, [key]: !prev[key] };
      toast.success("Preferencia de notificación actualizada");
      return nuevo;
    });
  };

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Configuración del Sistema"
        description="Centro integral de parámetros institucionales, reglas de asistencia, turnos y seguridad."
        icon={Settings02Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Configuración" }]}
      />

      {/* Layout de Settings de Verdad con Tabs y Panel */}
      <Tabs
        value={tabActiva}
        onValueChange={setTabActiva}
        className="flex flex-col gap-6 lg:flex-row lg:items-start"
      >
        {/* Navegación lateral de Ajustes */}
        <div className="w-full lg:w-64 lg:shrink-0">
          <div className="bg-card border-border/60 rounded-2xl border p-2 shadow-2xs">
            <div className="px-3 py-2">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Ajustes Generales
              </span>
            </div>
            <TabsList
              variant="line"
              className="flex w-full flex-row gap-1 overflow-x-auto lg:flex-col lg:items-stretch lg:overflow-visible"
            >
              <TabsTrigger
                value="institucion"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary justify-start gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={School01Icon} className="size-4 shrink-0" />
                <span>Institución y Sede</span>
              </TabsTrigger>

              <TabsTrigger
                value="variables"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary justify-start gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={SlidersHorizontalIcon} className="size-4 shrink-0" />
                <span>Variables y Reglas</span>
              </TabsTrigger>

              <TabsTrigger
                value="turnos"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary justify-start gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={Clock01Icon} className="size-4 shrink-0" />
                <span>Turnos y Horarios</span>
              </TabsTrigger>

              <TabsTrigger
                value="equipos"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary justify-start gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={ComputerIcon} className="size-4 shrink-0" />
                <span>Equipos en Red</span>
              </TabsTrigger>

              <div className="my-1 border-t px-3 pt-2">
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Políticas y Sistema
                </span>
              </div>

              <TabsTrigger
                value="seguridad"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary justify-start gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={SecurityLockIcon} className="size-4 shrink-0" />
                <span>Seguridad y Cuentas</span>
              </TabsTrigger>

              <TabsTrigger
                value="notificaciones"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary justify-start gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={Notification01Icon} className="size-4 shrink-0" />
                <span>Notificaciones</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Panel de Contenido de Configuración */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* TAB 1: INSTITUCIÓN Y SEDE */}
          <TabsContent value="institucion" className="m-0 space-y-4 outline-none">
            <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
              <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-base font-bold">
                    Datos de la Institución Educativa
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Identificación oficial y parámetros legales del colegio
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                  <Link href="/admin/institucion">
                    <HugeiconsIcon icon={Edit02Icon} className="size-3.5" />
                    Editar Datos
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-muted/30 border-border/40 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[11px]">
                      Nombre de la I.E.
                    </span>
                    <span className="text-foreground text-sm font-semibold">
                      {siteConfig.institution.name}
                    </span>
                  </div>

                  <div className="bg-muted/30 border-border/40 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[11px]">Código Modular</span>
                    <span className="text-foreground font-mono text-sm font-semibold">0345678</span>
                  </div>

                  <div className="bg-muted/30 border-border/40 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[11px]">DRE / UGEL</span>
                    <span className="text-foreground text-sm font-semibold">
                      DRE Huancavelica · UGEL Angaraes
                    </span>
                  </div>

                  <div className="bg-muted/30 border-border/40 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[11px]">Nivel Educativo</span>
                    <span className="text-foreground text-sm font-semibold">
                      Secundaria de Menores
                    </span>
                  </div>

                  <div className="bg-muted/30 border-border/40 rounded-xl border p-3 sm:col-span-2">
                    <span className="text-muted-foreground block text-[11px]">
                      Dirección y Sede
                    </span>
                    <span className="text-foreground text-sm font-semibold">
                      Jr. Bolognesi S/N, Lircay, Angaraes, Huancavelica
                    </span>
                  </div>
                </div>

                <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-xl border p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="text-primary size-4 shrink-0"
                    />
                    <span className="text-foreground">
                      Los datos institucionales se reflejan automáticamente en libretas, reportes y
                      comunicados oficiales.
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary shrink-0 text-[10px]"
                  >
                    Sincronizado
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: VARIABLES Y REGLAS */}
          <TabsContent value="variables" className="m-0 space-y-4 outline-none">
            <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
              <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-base font-bold">
                    Reglas de Asistencia y Tolerancias
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Parámetros para el cálculo de tardanzas, inasistencias y plazos de descargo
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                  <Link href="/admin/variables">
                    <HugeiconsIcon icon={SlidersHorizontalIcon} className="size-3.5" />
                    Gestionar Variables
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="divide-border/40 divide-y rounded-xl border">
                  <div className="flex items-center justify-between p-3.5 text-xs">
                    <div>
                      <p className="text-foreground font-semibold">
                        Tolerancia de ingreso (minutos)
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Minutos permitidos después de la hora oficial antes de registrar tardanza.
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs font-bold">
                      15 min
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3.5 text-xs">
                    <div>
                      <p className="text-foreground font-semibold">
                        Límite de tardanzas para falta
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Cantidad acumulada de tardanzas bimestrales que equivalen a 1 falta
                        injustificada.
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs font-bold">
                      3 tardanzas
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3.5 text-xs">
                    <div>
                      <p className="text-foreground font-semibold">
                        Plazo para justificar inasistencia
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Tiempo hábil que tiene el apoderado o docente para presentar justificación
                        médica o laboral.
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs font-bold">
                      48 horas
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3.5 text-xs">
                    <div>
                      <p className="text-foreground font-semibold">
                        Ponderación de evaluación mínima
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Porcentaje de asistencia requerido para tener derecho a evaluación
                        ordinaria.
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs font-bold">
                      70%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: TURNOS Y HORARIOS */}
          <TabsContent value="turnos" className="m-0 space-y-4 outline-none">
            <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
              <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-base font-bold">Jornadas y Turnos Escolares</CardTitle>
                  <CardDescription className="text-xs">
                    Horarios oficiales de entrada, salida y ventanas de marcado por turno
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                  <Link href="/admin/turnos">
                    <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                    Configurar Turnos
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="bg-muted/30 border-border/50 space-y-2 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-sm font-bold">Turno Mañana</span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 text-[10px] text-emerald-600"
                      >
                        Activo
                      </Badge>
                    </div>
                    <div className="text-muted-foreground space-y-1 text-xs">
                      <p className="flex justify-between">
                        <span>Entrada oficial:</span>
                        <strong className="text-foreground font-mono">07:45 a. m.</strong>
                      </p>
                      <p className="flex justify-between">
                        <span>Tolerancia máxima:</span>
                        <strong className="text-foreground font-mono">08:00 a. m.</strong>
                      </p>
                      <p className="flex justify-between">
                        <span>Salida oficial:</span>
                        <strong className="text-foreground font-mono">01:30 p. m.</strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 border-border/50 space-y-2 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-sm font-bold">Turno Tarde</span>
                      <Badge variant="secondary" className="text-[10px]">
                        Opcional
                      </Badge>
                    </div>
                    <div className="text-muted-foreground space-y-1 text-xs">
                      <p className="flex justify-between">
                        <span>Entrada oficial:</span>
                        <strong className="text-foreground font-mono">01:45 p. m.</strong>
                      </p>
                      <p className="flex justify-between">
                        <span>Tolerancia máxima:</span>
                        <strong className="text-foreground font-mono">02:00 p. m.</strong>
                      </p>
                      <p className="flex justify-between">
                        <span>Salida oficial:</span>
                        <strong className="text-foreground font-mono">06:30 p. m.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: EQUIPOS EN RED */}
          <TabsContent value="equipos" className="m-0 space-y-4 outline-none">
            <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
              <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-base font-bold">
                    Control de Equipos y Terminales
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Dispositivos habilitados para registrar asistencia, marcaciones o firmar
                    sesiones
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                  <Link href="/admin/equipos">
                    <HugeiconsIcon icon={ComputerIcon} className="size-3.5" />
                    Gestionar Equipos
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="bg-muted/20 border-border/40 space-y-3 rounded-xl border p-4">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={SecurityLockIcon}
                      className="size-4 shrink-0 text-emerald-500"
                    />
                    <span className="text-foreground text-xs font-semibold">
                      Seguridad de red activa (Control IP y Token)
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Solo los equipos registrados con token autorizado pueden operar en modo Kiosko
                    biométrico o realizar marcaciones presenciales de docentes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: SEGURIDAD Y CUENTAS */}
          <TabsContent value="seguridad" className="m-0 space-y-4 outline-none">
            <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
              <CardHeader className="border-border/40 border-b pb-4">
                <CardTitle className="text-base font-bold">
                  Políticas de Seguridad y Autenticación
                </CardTitle>
                <CardDescription className="text-xs">
                  Configura los mecanismos de protección contra accesos no autorizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="divide-border/40 divide-y rounded-xl border">
                  <div className="flex items-center justify-between p-3.5">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-foreground text-xs font-semibold">
                        Bloqueo automático por intentos fallidos
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Bloquea la cuenta tras 3 intentos consecutivos erróneos de contraseña o PIN.
                      </p>
                    </div>
                    <Switch
                      checked={seguridadSettings.bloqueoIntentos}
                      onCheckedChange={() => handleToggleSeguridad("bloqueoIntentos")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-foreground text-xs font-semibold">
                        Caducidad de sesión por inactividad
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Cierra la sesión automáticamente si no se detecta interacción durante 30
                        minutos.
                      </p>
                    </div>
                    <Switch
                      checked={seguridadSettings.caducidadInactividad}
                      onCheckedChange={() => handleToggleSeguridad("caducidadInactividad")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-foreground text-xs font-semibold">
                        Requerir PIN para marcación en Kiosko
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Exige el PIN personal de 4 dígitos además del DNI al marcar asistencia en
                        terminales.
                      </p>
                    </div>
                    <Switch
                      checked={seguridadSettings.requerirPinMarcacion}
                      onCheckedChange={() => handleToggleSeguridad("requerirPinMarcacion")}
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
                      checked={seguridadSettings.registroIpEquipos}
                      onCheckedChange={() => handleToggleSeguridad("registroIpEquipos")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 6: NOTIFICACIONES */}
          <TabsContent value="notificaciones" className="m-0 space-y-4 outline-none">
            <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
              <CardHeader className="border-border/40 border-b pb-4">
                <CardTitle className="text-base font-bold">
                  Canales y Reglas de Notificación
                </CardTitle>
                <CardDescription className="text-xs">
                  Avisos automáticos a la comunidad educativa y alertas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="divide-border/40 divide-y rounded-xl border">
                  <div className="flex items-center justify-between p-3.5">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-foreground text-xs font-semibold">
                        Aviso instantáneo de inasistencia a apoderados
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Envía notificación al portal del apoderado si el estudiante no registra
                        asistencia antes del límite.
                      </p>
                    </div>
                    <Switch
                      checked={notifSettings.alertaInasistenciaApoderado}
                      onCheckedChange={() => handleToggleNotif("alertaInasistenciaApoderado")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-foreground text-xs font-semibold">
                        Recordatorio de cierre de sesión de clase
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Alerta al docente al término del horario académico si tiene sesiones
                        pendientes de registrar.
                      </p>
                    </div>
                    <Switch
                      checked={notifSettings.recordatorioSesionesDocente}
                      onCheckedChange={() => handleToggleNotif("recordatorioSesionesDocente")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-foreground text-xs font-semibold">
                        Alerta de inicio de sesión en nuevo dispositivo
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Notifica al administrador cuando una cuenta de dirección o docente ingresa
                        desde una nueva IP.
                      </p>
                    </div>
                    <Switch
                      checked={notifSettings.notificarNuevoEquipo}
                      onCheckedChange={() => handleToggleNotif("notificarNuevoEquipo")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
