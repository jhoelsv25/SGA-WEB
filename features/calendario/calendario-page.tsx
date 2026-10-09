"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useListFilters } from "@/hooks/use-list-filters";
import { calendarioFilterDefs } from "./config";
import { EventoModal } from "./components/modals/evento-modal";
import {
  useCalendarioQuery,
  useDeleteEventoMutation,
  useEsAdministrador,
  usePuedeRegistrarCalendario,
} from "./hooks";
import type { EventoCalendario } from "./types";
import { desplazarMes } from "./utils";
import { CalendarioDelMes } from "./views";

export function CalendarioPage() {
  const puedeRegistrar = usePuedeRegistrarCalendario();
  const esAdmin = useEsAdministrador();
  const { anio: anioLectivo, cargando: cargandoAnio } = useAnioLectivo();
  const anioId = anioLectivo?.id;
  const listFilters = useListFilters(calendarioFilterDefs, { resetPageOnFilter: false });
  const [cursores, setCursores] = React.useState<Record<string, { anio?: number; mes?: number }>>(
    {},
  );
  const cursor = anioId ? (cursores[anioId] ?? {}) : {};
  const consulta = useCalendarioQuery(cursor.mes, cursor.anio, anioId, !cargandoAnio);
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
        description={
          anioLectivo
            ? `Eventos del año académico ${anioLectivo.anio}. Los días sin clases quedan marcados y no cuentan como sesión.`
            : "Eventos del año académico. Los días sin clases quedan marcados y no cuentan como sesión."
        }
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

      <PageState
        isLoading={cargandoAnio || consulta.isLoading}
        isError={consulta.isError}
        error={consulta.error}
        onRetry={() => void consulta.refetch()}
        errorTitle="No se pudo cargar el calendario"
        errorProps={{
          description: (
            <div className="space-y-3">
              <p>{(consulta.error as Error)?.message || "No hay un año académico en curso."}</p>
              {esAdmin ? (
                <div>
                  <Button asChild size="sm">
                    <Link href="/admin/academic-years">Ir al año académico</Link>
                  </Button>
                </div>
              ) : null}
            </div>
          ),
        }}
      >
        {data && anioVisible && mesVisible ? (
          <CalendarioDelMes
            anioVisible={anioVisible}
            mesVisible={mesVisible}
            anioEscolar={data.anio}
            desde={data.desde}
            hasta={data.hasta}
            eventos={data.eventos}
            busqueda={listFilters.getString("q")}
            tipo={listFilters.getString("tipo")}
            clases={listFilters.getString("clases")}
            listFilters={listFilters}
            isRefreshing={consulta.isFetching}
            onRefresh={() => {
              void consulta.refetch();
            }}
            puedeRegistrar={puedeRegistrar}
            onMesAnterior={() => {
              if (!anioId) return;
              setCursores((actual) => ({
                ...actual,
                [anioId]: desplazarMes(anioVisible, mesVisible, -1),
              }));
            }}
            onMesSiguiente={() => {
              if (!anioId) return;
              setCursores((actual) => ({
                ...actual,
                [anioId]: desplazarMes(anioVisible, mesVisible, 1),
              }));
            }}
            onSeleccionarDia={puedeRegistrar ? (dia) => setFormulario({ dia }) : undefined}
            onEditar={(evento) => setFormulario({ evento })}
            onEliminar={setAEliminar}
          />
        ) : null}
      </PageState>

      <EventoModal
        open={formulario !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setFormulario(null);
        }}
        evento={formulario?.evento}
        dia={formulario?.dia}
        anioAcademicoId={data?.anioAcademicoId ?? ""}
      />
      <ConfirmDialog
        open={aEliminar !== null}
        onOpenChange={(abierto) => {
          if (!abierto) setAEliminar(null);
        }}
        title="Eliminar evento"
        description={`Se quitará «${aEliminar?.titulo ?? ""}» del calendario escolar.`}
        variant="danger"
        confirmText="Eliminar"
        onConfirm={() => {
          if (aEliminar) eliminar.mutate(aEliminar.id);
        }}
      />
    </div>
  );
}
