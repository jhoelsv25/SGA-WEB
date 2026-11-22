"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, PlusSignIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { ConfirmDialog, type ConfirmVariant } from "@/components/common/confirm-dialog";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
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
          title="Año académico"
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
        title="Año académico"
        description="Crea el año, completa los cuatro bimestres y controla cuándo está en curso, cerrado o reabierto."
        icon={Calendar03Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Configuración" },
          { label: "Año académico" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/academic-years/cierre">
                <HugeiconsIcon icon={RefreshIcon} className="size-4" />
                Cierre y promoción
              </Link>
            </Button>
            <Button onClick={() => setCrearAbierto(true)}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Nuevo año
            </Button>
          </div>
        }
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron obtener los años académicos"
        isEmpty={anios.length === 0}
        empty={{
          icon: Calendar03Icon,
          title: "Todavía no hay un año académico.",
          description:
            "Al crearlo queda en planificado, con los bimestres I al IV, hasta que lo inicies.",
          action: <Button onClick={() => setCrearAbierto(true)}>Crear el primer año</Button>,
        }}
      >
        <div className="flex flex-col gap-4">
          {anios.length > 1 ? (
            <AnioLista
              anios={anios}
              seleccionadoId={seleccionado?.id ?? null}
              onSeleccionar={setSeleccionadoId}
            />
          ) : null}
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
                  titulo: "Iniciar el año académico",
                  detalle: "El año pasará a en curso y será el que usen las demás pantallas.",
                  variant: "info",
                  accion: () => iniciar.mutate(seleccionado.id),
                })
              }
              onCerrar={() =>
                setConfirmacion({
                  titulo: "Cerrar el año académico",
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
      </PageState>

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
