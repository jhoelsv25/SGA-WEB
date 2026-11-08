"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth";
import { EquiposAccesoTable } from "@/features/equipos-acceso";
import {
  DIAS_LABORABLES,
  DIAS_SEMANA,
  MAX_HORAS_PROGRAMACION,
  useGuardarProgramacionBiometrico,
  useProgramacionBiometrico,
  useSincronizacionesReloj,
  type HoraProgramada,
} from "@/features/biometrico";
import { cn } from "@/lib/utils";

const FORMATO_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

function claveHorarios(horarios: HoraProgramada[]): string {
  return JSON.stringify(horarios.map((h) => [h.hora, h.dias, h.activa]));
}

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime())
    ? "—"
    : fecha.toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" });
}

export function TabBiometrico() {
  const { data: sesion } = useSession();
  const roles = sesion?.user?.roles ?? [];
  const puedeEditar =
    sesion?.user?.activeRoleName === "Administrador" || roles.includes("Administrador");
  // Mismos roles que exige la API en /equipos-acceso
  const puedeAprobarEquipos = ["Administrador", "Soporte TI"].some(
    (rol) => sesion?.user?.activeRoleName === rol || roles.includes(rol),
  );

  const programacion = useProgramacionBiometrico();
  const sincronizaciones = useSincronizacionesReloj();
  const guardar = useGuardarProgramacionBiometrico();

  // Borrador local: mientras es null se muestra lo guardado en el servidor
  const [borrador, setBorrador] = React.useState<HoraProgramada[] | null>(null);
  const guardados = programacion.data?.horarios;
  const horarios = React.useMemo(() => borrador ?? guardados ?? [], [borrador, guardados]);
  const setHorarios = (fn: (previo: HoraProgramada[]) => HoraProgramada[]) =>
    setBorrador(fn(horarios));

  const repetidas = React.useMemo(() => {
    const vistas = new Set<string>();
    const repetidas = new Set<string>();
    for (const h of horarios) {
      if (vistas.has(h.hora)) repetidas.add(h.hora);
      vistas.add(h.hora);
    }
    return repetidas;
  }, [horarios]);

  const hayInvalida = horarios.some((h) => !FORMATO_HORA.test(h.hora) || h.dias === "");
  const hayCambios =
    guardados !== undefined && claveHorarios(horarios) !== claveHorarios(guardados);
  const puedeGuardar = puedeEditar && hayCambios && !hayInvalida && repetidas.size === 0;

  function cambiar(indice: number, cambio: Partial<HoraProgramada>) {
    setHorarios((previo) => previo.map((h, i) => (i === indice ? { ...h, ...cambio } : h)));
  }

  function alternarDia(indice: number, dia: string) {
    const actual = new Set(horarios[indice]?.dias.split(",").filter(Boolean));
    if (actual.has(dia)) actual.delete(dia);
    else actual.add(dia);
    cambiar(indice, { dias: [...actual].sort().join(",") });
  }

  function agregar() {
    setHorarios((previo) => [...previo, { hora: "", dias: DIAS_LABORABLES, activa: true }]);
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
        <CardHeader className="border-border/40 border-b pb-4">
          <CardTitle className="text-base font-bold">Horas de sincronización del reloj</CardTitle>
          <CardDescription className="text-xs">
            El programa del reloj, instalado en la computadora del colegio, trae las marcas del
            reloj a estas horas. Cada hora es una tarea programada de Windows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {programacion.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ) : (
            <>
              {horarios.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No hay horas programadas. Sin horas, el reloj solo se sincroniza cuando alguien lo
                  inicia en el programa.
                </p>
              )}

              <ul className="space-y-2">
                {horarios.map((h, i) => {
                  const invalida = h.hora !== "" && !FORMATO_HORA.test(h.hora);
                  const repetida = repetidas.has(h.hora);
                  return (
                    <li
                      key={i}
                      className="border-border/50 flex flex-wrap items-center gap-3 rounded-xl border p-3"
                    >
                      <Input
                        type="time"
                        value={h.hora}
                        disabled={!puedeEditar}
                        aria-label="Hora de sincronización"
                        aria-invalid={invalida || repetida}
                        onChange={(e) => cambiar(i, { hora: e.target.value })}
                        className="h-9 w-32"
                      />
                      <div className="flex gap-1" role="group" aria-label="Días de la semana">
                        {DIAS_SEMANA.map((d) => {
                          const marcado = h.dias.split(",").includes(d.valor);
                          return (
                            <button
                              key={d.valor}
                              type="button"
                              title={d.largo}
                              aria-pressed={marcado}
                              disabled={!puedeEditar}
                              onClick={() => alternarDia(i, d.valor)}
                              className={cn(
                                "size-8 rounded-full border text-xs font-semibold transition-colors disabled:cursor-not-allowed",
                                marcado
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border text-muted-foreground hover:bg-muted",
                              )}
                            >
                              {d.corto}
                            </button>
                          );
                        })}
                      </div>
                      <label className="ml-auto flex items-center gap-2 text-xs">
                        <Switch
                          checked={h.activa}
                          disabled={!puedeEditar}
                          onCheckedChange={(v) => cambiar(i, { activa: v })}
                        />
                        {h.activa ? "Activa" : "Pausada"}
                      </label>
                      {puedeEditar && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="Quitar hora"
                          onClick={() => setHorarios((p) => p.filter((_, j) => j !== i))}
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                        </Button>
                      )}
                      {(repetida || invalida || h.dias === "") && (
                        <p className="text-destructive w-full text-[11px]">
                          {repetida
                            ? "Esta hora está repetida."
                            : invalida
                              ? "Escriba una hora válida."
                              : "Elija al menos un día."}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>

              {puedeEditar ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    disabled={horarios.length >= MAX_HORAS_PROGRAMACION}
                    onClick={agregar}
                  >
                    <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
                    Agregar hora
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 text-xs font-semibold"
                    disabled={!puedeGuardar || guardar.isPending}
                    onClick={() => guardar.mutate(horarios, { onSuccess: () => setBorrador(null) })}
                  >
                    {guardar.isPending ? "Guardando…" : "Guardar horas"}
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-[11px]">
                  Solo el Administrador puede cambiar las horas.
                </p>
              )}

              <p className="bg-muted/40 text-muted-foreground rounded-xl p-3 text-[11px]">
                Guardar las horas no crea las tareas: en la computadora del reloj, abra el programa
                y pulse «Crear y sincronizar tareas programadas». Si el equipo estaba apagado a la
                hora indicada, la sincronización se hace una vez al encenderlo.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
        <CardHeader className="border-border/40 border-b pb-4">
          <CardTitle className="text-base font-bold">Última sincronización</CardTitle>
          <CardDescription className="text-xs">
            Por reloj, según lo entregado a la base
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {sincronizaciones.isLoading ? (
            <Skeleton className="h-14 w-full rounded-xl" />
          ) : (sincronizaciones.data ?? []).length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-xs">
              Aún no hay sincronizaciones registradas.
            </p>
          ) : (
            <ul className="divide-border/40 divide-y rounded-xl border">
              {(sincronizaciones.data ?? []).map((s) => (
                <li key={s.relojSerie} className="flex flex-wrap justify-between gap-2 p-3 text-xs">
                  <div>
                    <p className="text-foreground font-semibold">Reloj {s.relojSerie}</p>
                    <p className="text-muted-foreground text-[11px]">{s.equipo ?? "—"}</p>
                  </div>
                  <div className="text-right">
                    <p>Sincronizó: {formatearFecha(s.ultimaSincronizacion)}</p>
                    <p className="text-muted-foreground text-[11px]">
                      Última marca: {formatearFecha(s.ultimaMarca)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {puedeAprobarEquipos && (
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
          <CardHeader className="border-border/40 border-b pb-4">
            <CardTitle className="text-base font-bold">Equipos del programa del reloj</CardTitle>
            <CardDescription className="text-xs">
              Cuando el programa del reloj se conecta por primera vez desde una computadora, la
              solicitud queda <strong>pendiente</strong> y no envía marcas hasta que un
              administrador la autorice aquí.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <EquiposAccesoTable />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
