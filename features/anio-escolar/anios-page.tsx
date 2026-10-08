"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Calendar03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { ConfirmDialog, type ConfirmVariant } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnioDetalle } from "./components/anio/anio-detalle";
import { AnioLista } from "./components/anio/anio-lista";
import { AnioModal } from "./components/modals/anio-modal";
import { ReabrirAnioModal } from "./components/modals/reabrir-anio-modal";
import {
  useAniosQuery,
  useCerrarAnioMutation,
  useCerrarBimestreMutation,
  useEsAdministrador,
  useGuardarBimestresMutation,
  useIniciarAnioMutation,
  useIniciarBimestreMutation,
  useUpdateAnioMutation,
} from "./hooks";

interface Confirmacion {
  titulo: string;
  detalle: string;
  variant: ConfirmVariant;
  accion: () => void;
}

export function AniosPage() {
  const esAdmin = useEsAdministrador();
  const { data: anios = [], isLoading, isError, error, refetch } = useAniosQuery(esAdmin);
  const actualizar = useUpdateAnioMutation();
  const guardar = useGuardarBimestresMutation();
  const iniciar = useIniciarAnioMutation();
  const cerrar = useCerrarAnioMutation();
  const iniciarBimestre = useIniciarBimestreMutation();
  const cerrarBimestre = useCerrarBimestreMutation();

  const [crearAbierto, setCrearAbierto] = React.useState(false);
  const [reabrirAbierto, setReabrirAbierto] = React.useState(false);
  const [confirmacion, setConfirmacion] = React.useState<Confirmacion | null>(null);
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
        <EmptyState
          icon={Calendar03Icon}
          title="Todavía no hay un año escolar."
          description="Al crearlo queda en planificado, con los bimestres I al IV, hasta que lo inicies."
          action={<Button onClick={() => setCrearAbierto(true)}>Crear el primer año</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
          <AnioLista
            anios={anios}
            seleccionadoId={seleccionado?.id ?? null}
            onSeleccionar={setSeleccionadoId}
          />
          {seleccionado ? (
            <AnioDetalle
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
                  variant: "info",
                  accion: () => iniciar.mutate(seleccionado.id),
                })
              }
              onCerrar={() =>
                setConfirmacion({
                  titulo: "Cerrar el año escolar",
                  detalle: "Solo se cierra si los cuatro bimestres ya están cerrados.",
                  variant: "warning",
                  accion: () => cerrar.mutate(seleccionado.id),
                })
              }
              onReabrir={() => setReabrirAbierto(true)}
              onIniciarBimestre={(bimestreId) =>
                setConfirmacion({
                  titulo: "Iniciar bimestre",
                  detalle: "Debe cerrarse el bimestre anterior y solo puede haber uno en curso.",
                  variant: "info",
                  accion: () => iniciarBimestre.mutate({ anioId: seleccionado.id, bimestreId }),
                })
              }
              onCerrarBimestre={(bimestreId) =>
                setConfirmacion({
                  titulo: "Cerrar bimestre",
                  detalle:
                    "Después no se podrán registrar ni modificar sesiones ni ausencias de esas fechas.",
                  variant: "warning",
                  accion: () => cerrarBimestre.mutate({ anioId: seleccionado.id, bimestreId }),
                })
              }
            />
          ) : null}
        </div>
      )}

      <AnioModal open={crearAbierto} onOpenChange={setCrearAbierto} />
      <ReabrirAnioModal
        open={reabrirAbierto}
        onOpenChange={setReabrirAbierto}
        anioId={seleccionado?.id ?? null}
      />
      <ConfirmDialog
        open={confirmacion !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setConfirmacion(null);
        }}
        title={confirmacion?.titulo}
        description={confirmacion?.detalle}
        variant={confirmacion?.variant ?? "default"}
        confirmText="Confirmar"
        onConfirm={() => confirmacion?.accion()}
      />
    </div>
  );
}
