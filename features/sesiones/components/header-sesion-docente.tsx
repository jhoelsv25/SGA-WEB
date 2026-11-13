"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession } from "@/features/auth";
import { cn } from "@/lib/utils";
import { MENU_MIS_SESIONES } from "../consts";
import { useFirmarIngresoWeb, useFirmarSalidaWeb, useMiJornadaHoy } from "../hooks";
import { evaluarVentanaCliente, horaActualLima, horaDesdeMinutos, minutosDeHora } from "../utils";
import { EstadoSesionBadge } from "./estado-sesion";

export function HeaderSesionDocente() {
  const { data: session } = useSession();
  const esDocente = session?.user.activeRoleName === "Docente";
  const enVistaSimulada = Boolean(session?.user.impersonatedBy);

  const [open, setOpen] = React.useState(false);
  const [elegidaId, setElegidaId] = React.useState<string | null>(null);
  const [tema, setTema] = React.useState("");
  const [reloj, setReloj] = React.useState(horaActualLima);

  React.useEffect(() => {
    if (!esDocente) return;
    const id = setInterval(() => setReloj(horaActualLima()), 30_000);
    return () => clearInterval(id);
  }, [esDocente]);

  const { data, isLoading } = useMiJornadaHoy(esDocente);
  const firmarIngresoMutation = useFirmarIngresoWeb();
  const firmarSalidaMutation = useFirmarSalidaWeb();

  if (!esDocente) return null;

  const sesiones = data?.sesiones ?? [];
  const minutosAntes = data?.minutosAntes ?? 15;
  const elegida =
    sesiones.find((s) => s.id === elegidaId) ??
    sesiones.find((s) => s.id === data?.destacadaId) ??
    sesiones[0] ??
    null;

  const hayEnCurso = sesiones.some((s) => s.estado === "en_curso");
  const hayPorFirmarEnVentana = sesiones.some(
    (s) =>
      s.estado === "pendiente" && evaluarVentanaCliente(s, reloj.minutos, minutosAntes) === "ok",
  );

  const procesando = firmarIngresoMutation.isPending || firmarSalidaMutation.isPending;

  const handleFirmarIngreso = () => {
    if (!elegida || !tema.trim()) return;
    firmarIngresoMutation.mutate(
      { id: elegida.id, tema: tema.trim() },
      { onSuccess: () => setTema("") },
    );
  };

  const handleFirmarSalida = () => {
    if (!elegida) return;
    firmarSalidaMutation.mutate(elegida.id);
  };

  const ventanaElegida = elegida
    ? evaluarVentanaCliente(elegida, reloj.minutos, minutosAntes)
    : "antes";
  const horaApertura = elegida
    ? horaDesdeMinutos(Math.max(0, minutosDeHora(elegida.horaInicio) - minutosAntes))
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground relative h-9 gap-1.5 rounded-full px-2.5"
          aria-label="Mis clases de hoy y firma de sesión"
        >
          <HugeiconsIcon icon={BookOpen01Icon} size={17} strokeWidth={2} />
          <span className="hidden text-xs font-medium lg:inline">Mi clase</span>
          {(hayEnCurso || hayPorFirmarEnVentana) && (
            <span
              className={cn(
                "size-2 rounded-full",
                hayEnCurso ? "bg-emerald-500" : "animate-pulse bg-amber-500",
              )}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-85 max-w-[calc(100vw-1rem)] p-0 sm:w-93"
      >
        <div className="border-border/60 flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Sesiones de hoy</p>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <HugeiconsIcon icon={Clock01Icon} size={12} strokeWidth={2} />
              <span>Hora actual: {reloj.hhmm}</span>
            </p>
          </div>
          <Link
            href={MENU_MIS_SESIONES}
            onClick={() => setOpen(false)}
            className="text-primary text-xs font-medium hover:underline"
          >
            Ver historial
          </Link>
        </div>

        <div className="space-y-3 p-4">
          {isLoading ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-xs">
              <Spinner className="size-4" />
              <span>Cargando sesiones de hoy...</span>
            </div>
          ) : sesiones.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-xs">
              No tiene sesiones programadas para hoy.
            </p>
          ) : (
            <>
              <ul className="max-h-44 space-y-1.5 overflow-y-auto pr-0.5">
                {sesiones.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setElegidaId(s.id)}
                      className={cn(
                        "border-border/70 hover:border-primary/40 flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-colors",
                        s.id === elegida?.id && "border-primary bg-primary/5",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold">
                          {s.horaInicio}–{s.horaFin}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {s.cursoNombre} · {s.seccionNombre}
                        </p>
                      </div>
                      <EstadoSesionBadge sesion={s} />
                    </button>
                  </li>
                ))}
              </ul>

              {enVistaSimulada ? (
                <Badge
                  variant="outline"
                  className="w-full justify-center border-amber-500/40 bg-amber-500/10 py-1.5 text-center text-[11px] font-medium whitespace-normal text-amber-700 dark:text-amber-300"
                >
                  Firma deshabilitada en vista simulada.
                </Badge>
              ) : data && !data.firmaWebHabilitada ? (
                <p className="text-muted-foreground bg-muted/50 rounded-lg p-2.5 text-center text-xs">
                  La firma desde la web está deshabilitada. Use el kiosko autorizado.
                </p>
              ) : elegida?.estado === "pendiente" ? (
                ventanaElegida === "antes" ? (
                  <p className="text-muted-foreground bg-muted/50 rounded-lg p-2.5 text-center text-xs">
                    El ingreso se habilita a las{" "}
                    <span className="font-semibold">{horaApertura}</span>.
                  </p>
                ) : ventanaElegida === "despues" ? (
                  <p className="text-destructive bg-destructive/10 rounded-lg p-2.5 text-center text-xs">
                    El bloque ya finalizó. No se puede firmar el ingreso.
                  </p>
                ) : (
                  <div className="space-y-2 border-t pt-3">
                    <Label htmlFor="header-tema-sesion" className="text-xs font-medium">
                      Tema de la sesión *
                    </Label>
                    <Input
                      id="header-tema-sesion"
                      value={tema}
                      onChange={(e) => setTema(e.target.value)}
                      placeholder="Ej. Ecuaciones cuadráticas"
                      maxLength={500}
                      disabled={procesando}
                      className="h-9 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="w-full gap-1.5"
                      disabled={procesando || !tema.trim()}
                      onClick={handleFirmarIngreso}
                    >
                      {firmarIngresoMutation.isPending && <Spinner className="size-3.5" />}
                      Firmar ingreso
                    </Button>
                  </div>
                )
              ) : elegida?.estado === "en_curso" ? (
                <div className="space-y-2 border-t pt-3">
                  <div className="text-xs">
                    <p className="text-muted-foreground">
                      Ingreso:{" "}
                      <span className="text-foreground font-medium">{elegida.horaIngreso}</span>
                    </p>
                    <p className="text-muted-foreground line-clamp-2">
                      Tema: <span className="text-foreground font-medium">{elegida.tema}</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full gap-1.5"
                    disabled={procesando}
                    onClick={handleFirmarSalida}
                  >
                    {firmarSalidaMutation.isPending && <Spinner className="size-3.5" />}
                    Firmar salida
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
