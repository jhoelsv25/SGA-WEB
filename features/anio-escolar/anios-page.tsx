"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  PlayIcon,
  PlusSignIcon,
  RefreshIcon,
  SquareLock01Icon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnioForm } from "./components/anio-form";
import { BimestresForm } from "./components/bimestres-form";
import { CampoFecha } from "./components/campo-fecha";
import {
  useAniosQuery,
  useCerrarAnioMutation,
  useCerrarBimestreMutation,
  useCreateAnioMutation,
  useEsAdministrador,
  useGuardarBimestresMutation,
  useIniciarAnioMutation,
  useIniciarBimestreMutation,
  useReabrirAnioMutation,
  useUpdateAnioMutation,
} from "./hooks";
import {
  fechasAnioSchema,
  reabrirSchema,
  type FechasAnioFormValues,
  type ReabrirFormValues,
} from "./schemas";
import type { AnioAcademico, EstadoAnio, EstadoBimestre } from "./types";
import { formatoFecha } from "./utils";

const ESTADO_ANIO: Record<EstadoAnio, string> = {
  planificado: "Planificado",
  en_curso: "En curso",
  cerrado: "Cerrado",
  reabierto: "Reabierto",
};

const ESTADO_BIMESTRE: Record<EstadoBimestre, string> = {
  planificado: "Planificado",
  en_curso: "En curso",
  cerrado: "Cerrado",
};

export function AniosPage() {
  const esAdmin = useEsAdministrador();
  const { data: anios = [], isLoading, isError, error, refetch } = useAniosQuery(esAdmin);
  const crear = useCreateAnioMutation();
  const actualizar = useUpdateAnioMutation();
  const guardar = useGuardarBimestresMutation();
  const iniciar = useIniciarAnioMutation();
  const cerrar = useCerrarAnioMutation();
  const reabrir = useReabrirAnioMutation();
  const iniciarBimestre = useIniciarBimestreMutation();
  const cerrarBimestre = useCerrarBimestreMutation();

  const [crearAbierto, setCrearAbierto] = React.useState(false);
  const [reabrirAbierto, setReabrirAbierto] = React.useState(false);
  const [confirmacion, setConfirmacion] = React.useState<null | {
    titulo: string;
    detalle: string;
    accion: () => void;
  }>(null);
  const [seleccionadoId, setSeleccionadoId] = React.useState<string | null>(null);

  const seleccionado = anios.find((anio) => anio.id === seleccionadoId) ?? anios[0] ?? null;

  if (!esAdmin) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Año escolar"
          description="La apertura del año y los bimestres las confirma el administrador."
          icon={Calendar03Icon}
        />
        <Card>
          <CardContent className="text-muted-foreground py-8 text-sm">
            Puedes consultar el calendario del año en curso.{" "}
            <Link href="/admin/calendario" className="text-primary font-medium">
              Abrir calendario
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Año escolar"
        description="Crea el año, completa los cuatro bimestres y controla cuándo está en curso, cerrado o reabierto."
        icon={Calendar03Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Configuración" },
          { label: "Año escolar" },
        ]}
        actions={
          <Button onClick={() => setCrearAbierto(true)}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Nuevo año
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Spinner className="text-primary size-8" />
          <p className="text-muted-foreground text-xs">Cargando años escolares...</p>
        </div>
      ) : isError ? (
        <div className="border-destructive/20 bg-destructive/5 flex h-64 flex-col items-center justify-center gap-4 rounded-xl border p-8 text-center">
          <HugeiconsIcon icon={AlertCircleIcon} className="text-destructive size-10" />
          <p className="text-muted-foreground text-sm">
            {(error as Error)?.message || "No se pudieron obtener los años escolares."}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : anios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-8">
            <p className="text-sm font-medium">Todavía no hay un año escolar.</p>
            <p className="text-muted-foreground text-sm">
              Al crearlo queda en planificado, con los bimestres I al IV, hasta que lo inicies.
            </p>
            <Button onClick={() => setCrearAbierto(true)}>Crear el primer año</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
          <div className="flex flex-col gap-2">
            {anios.map((anio) => (
              <button
                key={anio.id}
                type="button"
                onClick={() => setSeleccionadoId(anio.id)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left ${
                  seleccionado?.id === anio.id ? "border-primary bg-primary/5" : "bg-card"
                }`}
              >
                <span className="text-sm font-semibold">{anio.anio}</span>
                <Badge variant={anio.estado === "en_curso" ? "default" : "outline"}>
                  {ESTADO_ANIO[anio.estado]}
                </Badge>
              </button>
            ))}
          </div>
          {seleccionado ? (
            <DetalleAnio
              anio={seleccionado}
              guardandoFechas={actualizar.isPending}
              guardandoBimestres={guardar.isPending}
              onGuardarFechas={async (values) => {
                await actualizar.mutateAsync({
                  id: seleccionado.id,
                  payload: {
                    nombre: values.nombre?.trim() || undefined,
                    fechaInicio: values.fechaInicio,
                    fechaFin: values.fechaFin,
                  },
                });
              }}
              onGuardarBimestres={async (values) => {
                await guardar.mutateAsync({ id: seleccionado.id, bimestres: values.bimestres });
              }}
              onIniciar={() =>
                setConfirmacion({
                  titulo: "Iniciar el año escolar",
                  detalle: "El año pasará a en curso y será el que usen las demás pantallas.",
                  accion: () => iniciar.mutate(seleccionado.id),
                })
              }
              onCerrar={() =>
                setConfirmacion({
                  titulo: "Cerrar el año escolar",
                  detalle: "Solo se cierra si los cuatro bimestres ya están cerrados.",
                  accion: () => cerrar.mutate(seleccionado.id),
                })
              }
              onReabrir={() => setReabrirAbierto(true)}
              onIniciarBimestre={(bimestreId) =>
                setConfirmacion({
                  titulo: "Iniciar bimestre",
                  detalle: "Debe cerrarse el bimestre anterior y solo puede haber uno en curso.",
                  accion: () => iniciarBimestre.mutate({ anioId: seleccionado.id, bimestreId }),
                })
              }
              onCerrarBimestre={(bimestreId) =>
                setConfirmacion({
                  titulo: "Cerrar bimestre",
                  detalle:
                    "Después no se podrán registrar ni modificar sesiones ni ausencias de esas fechas.",
                  accion: () => cerrarBimestre.mutate({ anioId: seleccionado.id, bimestreId }),
                })
              }
            />
          ) : null}
        </div>
      )}

      <Dialog open={crearAbierto} onOpenChange={setCrearAbierto}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo año escolar</DialogTitle>
            <DialogDescription>
              Queda en planificado hasta que completes los bimestres e inicies el año.
            </DialogDescription>
          </DialogHeader>
          <AnioForm
            isSubmitting={crear.isPending}
            onCancel={() => setCrearAbierto(false)}
            onSubmit={async (values) => {
              await crear.mutateAsync({
                anio: values.anio,
                nombre: values.nombre,
                fechaInicio: values.fechaInicio,
                fechaFin: values.fechaFin,
                bimestres: values.bimestres,
              });
              setCrearAbierto(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={reabrirAbierto} onOpenChange={setReabrirAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reabrir año cerrado</DialogTitle>
            <DialogDescription>
              Indica el motivo y la fecha límite. Al día siguiente el año vuelve a cerrado.
            </DialogDescription>
          </DialogHeader>
          {seleccionado ? (
            <ReabrirForm
              isSubmitting={reabrir.isPending}
              onCancel={() => setReabrirAbierto(false)}
              onSubmit={async (values) => {
                await reabrir.mutateAsync({ id: seleccionado.id, payload: values });
                setReabrirAbierto(false);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmacion !== null}
        onOpenChange={(abierto) => !abierto && setConfirmacion(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmacion?.titulo}</AlertDialogTitle>
            <AlertDialogDescription>{confirmacion?.detalle}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="gap-1.5">
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="gap-1.5"
              onClick={() => {
                confirmacion?.accion();
                setConfirmacion(null);
              }}
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetalleAnio({
  anio,
  onGuardarFechas,
  onGuardarBimestres,
  onIniciar,
  onCerrar,
  onReabrir,
  onIniciarBimestre,
  onCerrarBimestre,
  guardandoFechas,
  guardandoBimestres,
}: {
  anio: AnioAcademico;
  onGuardarFechas: (values: FechasAnioFormValues) => Promise<void>;
  onGuardarBimestres: (values: {
    bimestres: { numero: number; fechaInicio: string; fechaFin: string }[];
  }) => Promise<void>;
  onIniciar: () => void;
  onCerrar: () => void;
  onReabrir: () => void;
  onIniciarBimestre: (id: string) => void;
  onCerrarBimestre: (id: string) => void;
  guardandoFechas: boolean;
  guardandoBimestres: boolean;
}) {
  const form = useForm<FechasAnioFormValues>({
    resolver: zodResolver(fechasAnioSchema),
    values: {
      nombre: anio.nombre ?? "",
      fechaInicio: anio.fechaInicio,
      fechaFin: anio.fechaFin,
    },
  });
  const planificado = anio.estado === "planificado";
  const abierto = anio.estado === "en_curso" || anio.estado === "reabierto";
  const bimestres = [...anio.bimestres].sort((a, b) => a.numero - b.numero);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Año {anio.anio}</CardTitle>
          <Badge>{ESTADO_ANIO[anio.estado]}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {anio.estado === "reabierto" ? (
            <p className="text-sm">
              Reabierto hasta {formatoFecha(anio.reabiertoHasta)}
              {anio.motivoReapertura ? `. Motivo: ${anio.motivoReapertura}` : ""}.
            </p>
          ) : null}
          <form
            className="grid gap-3 sm:grid-cols-3"
            onSubmit={form.handleSubmit(async (values) => {
              await onGuardarFechas(values);
            })}
          >
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <Label htmlFor="nombre-anio">Denominación</Label>
              <Input id="nombre-anio" disabled={!planificado} {...form.register("nombre")} />
            </div>
            <CampoFecha
              control={form.control}
              name="fechaInicio"
              label="Inicio"
              disabled={!planificado}
            />
            <CampoFecha
              control={form.control}
              name="fechaFin"
              label="Fin"
              disabled={!planificado}
              error={form.formState.errors.fechaFin?.message}
            />
            {planificado ? (
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={guardandoFechas}
                  className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
                >
                  {guardandoFechas ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                  )}
                  <span>Guardar fechas</span>
                </Button>
              </div>
            ) : null}
          </form>
          <div className="flex flex-wrap gap-2">
            {planificado ? (
              <Button onClick={onIniciar} className="gap-1.5">
                <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
                Iniciar año
              </Button>
            ) : null}
            {abierto ? (
              <Button variant="outline" onClick={onCerrar} className="gap-1.5">
                <HugeiconsIcon icon={SquareLock01Icon} className="size-3.5" />
                Cerrar año
              </Button>
            ) : null}
            {anio.estado === "cerrado" ? (
              <Button onClick={onReabrir} className="gap-1.5">
                <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
                Reabrir
              </Button>
            ) : null}
            <Button variant="ghost" asChild className="gap-1.5">
              <Link href="/admin/calendario">
                <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                Ver calendario
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bimestres</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {bimestres.map((bimestre) => (
            <div
              key={bimestre.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">
                  {bimestre.nombre} · {formatoFecha(bimestre.fechaInicio)} –{" "}
                  {formatoFecha(bimestre.fechaFin)}
                </p>
                <p className="text-muted-foreground text-xs">{ESTADO_BIMESTRE[bimestre.estado]}</p>
              </div>
              {abierto && bimestre.estado === "planificado" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onIniciarBimestre(bimestre.id)}
                  className="gap-1.5"
                >
                  <HugeiconsIcon icon={PlayIcon} className="size-3.5" />
                  Iniciar
                </Button>
              ) : null}
              {bimestre.estado === "en_curso" ? (
                <Button size="sm" onClick={() => onCerrarBimestre(bimestre.id)} className="gap-1.5">
                  <HugeiconsIcon icon={SquareLock01Icon} className="size-3.5" />
                  Cerrar bimestre
                </Button>
              ) : null}
            </div>
          ))}
          {bimestres.length < 4 && planificado ? (
            <p className="text-muted-foreground text-sm">
              Complete las fechas de los 4 bimestres antes de iniciar el año.
            </p>
          ) : null}
          <BimestresForm
            key={`${anio.id}-${anio.fechaInicio}-${anio.fechaFin}-${anio.bimestres.map((item) => item.fechaFin).join("-")}`}
            anio={anio}
            isSubmitting={guardandoBimestres}
            onSubmit={onGuardarBimestres}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ReabrirForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  onSubmit: (values: ReabrirFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const form = useForm<ReabrirFormValues>({
    resolver: zodResolver(reabrirSchema),
    defaultValues: { motivo: "", fechaLimite: "" },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="motivo">Motivo</Label>
        <Input
          id="motivo"
          aria-invalid={Boolean(form.formState.errors.motivo)}
          {...form.register("motivo")}
        />
        {form.formState.errors.motivo ? (
          <p className="text-destructive text-xs">{form.formState.errors.motivo.message}</p>
        ) : null}
      </div>
      <CampoFecha
        control={form.control}
        name="fechaLimite"
        label="Fecha límite"
        error={form.formState.errors.fechaLimite?.message}
      />
      <div className="flex justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isSubmitting ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
          )}
          <span>Reabrir</span>
        </Button>
      </div>
    </form>
  );
}
