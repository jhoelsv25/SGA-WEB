"use client";

import * as React from "react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { ListaAsistenciaSesion } from "./components";
import { useGuardarAsistencia, useListaSesion } from "./hooks";
import type {
  EstadoAsistencia,
  EstadoMarcableDocente,
  ListaAsistenciaSesion as Lista,
} from "./types";

interface AsistenciaSesionPageProps {
  sesionId?: string;
}

function estadosIniciales(lista: Lista): Record<string, EstadoAsistencia> {
  return Object.fromEntries(lista.estudiantes.map((e) => [e.matriculaId, e.estado]));
}

function ResumenLista({ estados }: { estados: Record<string, EstadoAsistencia> }) {
  const valores = Object.values(estados);
  const cuenta = (estado: EstadoAsistencia) => valores.filter((v) => v === estado).length;
  return (
    <p className="text-muted-foreground text-sm" aria-live="polite">
      {cuenta("presente")} presentes · {cuenta("tardanza")} tardanzas · {cuenta("falta")} faltas
    </p>
  );
}

function FormularioSesion({ lista }: { lista: Lista }) {
  const guardar = useGuardarAsistencia(lista.sesionId);
  const [estados, setEstados] = React.useState<Record<string, EstadoAsistencia>>(() =>
    estadosIniciales(lista),
  );

  const cambiar = (matriculaId: string, estado: EstadoMarcableDocente) =>
    setEstados((previo) => ({ ...previo, [matriculaId]: estado }));

  const enviar = () => {
    const excepciones = Object.entries(estados)
      .filter(([, estado]) => estado === "tardanza" || estado === "falta")
      .map(([matriculaId, estado]) => ({
        matriculaId,
        estado: estado as EstadoMarcableDocente,
      }));
    guardar.mutate(excepciones);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ResumenLista estados={estados} />
        {!lista.editable && (
          <p role="status" className="text-warning-text text-sm font-medium">
            La asistencia de esta sesión ya no se puede modificar.
          </p>
        )}
      </div>
      <ListaAsistenciaSesion
        estudiantes={lista.estudiantes}
        estados={estados}
        editable={lista.editable}
        onCambiar={cambiar}
      />
      {lista.editable && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={enviar}
            disabled={guardar.isPending}
            className="min-h-10 gap-2"
          >
            {guardar.isPending && <Spinner className="size-4" />}
            Guardar asistencia
          </Button>
        </div>
      )}
    </div>
  );
}

export function AsistenciaSesionPage({ sesionId }: AsistenciaSesionPageProps) {
  const { data, dataUpdatedAt, isLoading, isError, error, refetch } = useListaSesion(sesionId);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Asistencia"
        description={
          data
            ? `${data.cursoNombre} · ${data.seccionNombre} · ${data.fecha.slice(0, 10).split("-").reverse().join("/")}. Todos quedan presentes; marque solo tardanzas y faltas.`
            : "Tome la asistencia de su sesión de clase."
        }
        icon={UserGroupIcon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Asistencia" }]}
      />

      {!sesionId ? (
        <EmptyState
          title="Elija una sesión de clase"
          description="La asistencia se toma desde la sesión que firmó. Abra «Asistencia» desde esa sesión."
          icon={UserGroupIcon}
        />
      ) : (
        <PageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
          errorTitle="No se pudo abrir la asistencia"
        >
          {data && <FormularioSesion key={dataUpdatedAt} lista={data} />}
        </PageState>
      )}
    </div>
  );
}
