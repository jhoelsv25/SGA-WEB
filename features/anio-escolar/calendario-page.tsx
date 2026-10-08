"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
  Delete02Icon,
  PencilEdit01Icon,
  PlusSignIcon,
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
import { CalendarioMes } from "./components/calendario-mes";
import { ETIQUETAS_EVENTO, EventoForm } from "./components/evento-form";
import {
  useCalendarioQuery,
  useCreateEventoMutation,
  useDeleteEventoMutation,
  useEsAdministrador,
  usePuedeRegistrarCalendario,
  useUpdateEventoMutation,
} from "./hooks";
import type { EventoCalendario } from "./types";
import { desplazarMes, formatoFecha, tituloMes } from "./utils";

export function CalendarioPage() {
  const puedeRegistrar = usePuedeRegistrarCalendario();
  const esAdmin = useEsAdministrador();
  const [cursor, setCursor] = React.useState<{ anio?: number; mes?: number }>({});
  const consulta = useCalendarioQuery(cursor.mes, cursor.anio);
  const crear = useCreateEventoMutation();
  const editar = useUpdateEventoMutation();
  const eliminar = useDeleteEventoMutation();
  const [formulario, setFormulario] = React.useState<null | {
    evento?: EventoCalendario;
    dia?: string;
  }>(null);
  const [aEliminar, setAEliminar] = React.useState<EventoCalendario | null>(null);

  const data = consulta.data;
  const anioVisible = cursor.anio ?? (data ? Number(data.desde.slice(0, 4)) : undefined);
  const mesVisible = cursor.mes ?? (data ? Number(data.desde.slice(5, 7)) : undefined);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Calendario escolar"
        description="Eventos del año en curso. Los días sin clases quedan marcados y no cuentan como sesión."
        icon={Calendar03Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Calendario" }]}
        actions={
          puedeRegistrar ? (
            <Button onClick={() => setFormulario({})}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Registrar evento
            </Button>
          ) : null
        }
      />

      {consulta.isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Spinner className="text-primary size-8" />
          <p className="text-muted-foreground text-xs">Cargando el calendario...</p>
        </div>
      ) : consulta.isError ? (
        <div className="border-destructive/20 bg-destructive/5 flex h-64 flex-col items-center justify-center gap-3 rounded-xl border p-8 text-center">
          <HugeiconsIcon icon={AlertCircleIcon} className="text-destructive size-10" />
          <p className="text-sm">
            {(consulta.error as Error)?.message || "No hay un año escolar en curso."}
          </p>
          {esAdmin ? (
            <Button asChild>
              <Link href="/admin/academic-years">Ir al año escolar</Link>
            </Button>
          ) : null}
        </div>
      ) : data && anioVisible && mesVisible ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_20rem]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>{tituloMes(anioVisible, mesVisible)}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Mes anterior"
                  onClick={() => setCursor(desplazarMes(anioVisible, mesVisible, -1))}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Mes siguiente"
                  onClick={() => setCursor(desplazarMes(anioVisible, mesVisible, 1))}
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-xs">Año escolar {data.anio}</p>
              <CalendarioMes
                anio={anioVisible}
                mes={mesVisible}
                diasSinClases={data.diasSinClases}
                eventos={data.eventos}
                onSeleccionarDia={puedeRegistrar ? (dia) => setFormulario({ dia }) : undefined}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eventos del mes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {data.eventos.length === 0 ? (
                <p className="text-muted-foreground text-sm">Este mes no tiene eventos.</p>
              ) : (
                data.eventos.map((evento) => (
                  <div key={evento.id} className="flex flex-col gap-2 rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{evento.titulo}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatoFecha(evento.fechaInicio)}
                          {evento.fechaFin !== evento.fechaInicio
                            ? ` – ${formatoFecha(evento.fechaFin)}`
                            : ""}
                        </p>
                      </div>
                      <Badge variant={evento.suspendeClases ? "destructive" : "outline"}>
                        {evento.suspendeClases ? "Sin clases" : ETIQUETAS_EVENTO[evento.tipo]}
                      </Badge>
                    </div>
                    {puedeRegistrar ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => setFormulario({ evento })}
                        >
                          <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5"
                          onClick={() => setAEliminar(evento)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                          Eliminar
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
              {!puedeRegistrar ? (
                <p className="text-muted-foreground text-xs">
                  Puedes ver el calendario. Registrar, editar o eliminar requiere el permiso de
                  calendario.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Dialog
        open={formulario !== null}
        onOpenChange={(abierto) => !abierto && setFormulario(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formulario?.evento ? "Editar evento" : "Registrar evento"}</DialogTitle>
            <DialogDescription>
              Un feriado o una suspensión suspende clases. Las sesiones ya firmadas se conservan.
            </DialogDescription>
          </DialogHeader>
          {formulario ? (
            <EventoForm
              key={formulario.evento?.id ?? formulario.dia ?? "nuevo"}
              evento={
                formulario.evento ??
                (formulario.dia
                  ? {
                      id: "",
                      anioAcademicoId: data?.anioAcademicoId ?? "",
                      titulo: "",
                      descripcion: null,
                      tipo: "feriado",
                      fechaInicio: formulario.dia,
                      fechaFin: formulario.dia,
                      suspendeClases: true,
                    }
                  : null)
              }
              isSubmitting={crear.isPending || editar.isPending}
              onCancel={() => setFormulario(null)}
              onSubmit={async (values) => {
                if (formulario.evento) {
                  await editar.mutateAsync({ id: formulario.evento.id, payload: values });
                } else {
                  await crear.mutateAsync(values);
                }
                setFormulario(null);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={aEliminar !== null}
        onOpenChange={(abierto) => !abierto && setAEliminar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar evento</AlertDialogTitle>
            <AlertDialogDescription>
              Se quitará «{aEliminar?.titulo}» del calendario escolar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="gap-1.5">
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="gap-1.5"
              onClick={() => {
                if (aEliminar) eliminar.mutate(aEliminar.id);
                setAEliminar(null);
              }}
            >
              <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
