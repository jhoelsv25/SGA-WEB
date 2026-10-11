"use client";

import * as React from "react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { DetalleAsistenciaEstudiante, SelectorBimestre, useRangoBimestre } from "./components";
import { useMisEstudiantes } from "./hooks";

export function MiAsistenciaPage() {
  const { data: estudiantes = [], isLoading, isError, error, refetch } = useMisEstudiantes();
  const { bimestres, bimestreId, setElegido, rango } = useRangoBimestre();
  const [elegido, setEstudiante] = React.useState("");
  const estudianteId = elegido || estudiantes[0]?.estudianteId || "";

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Asistencia"
        description="Entradas al colegio, tardanzas, faltas y asistencia por curso, con totales."
        icon={UserGroupIcon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Asistencia" }]}
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar la información"
        isEmpty={estudiantes.length === 0}
        empty={{
          title: "No hay estudiantes vinculados",
          description: "Su cuenta aún no tiene estudiantes cuya asistencia pueda consultar.",
          icon: UserGroupIcon,
        }}
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-3">
            {estudiantes.length > 1 && (
              <div className="w-full max-w-72">
                <SelectOption
                  options={estudiantes.map((e) => ({
                    value: e.estudianteId,
                    label: e.nombreCompleto,
                    description: e.seccion ?? undefined,
                  }))}
                  value={estudianteId}
                  onSelect={setEstudiante}
                  placeholder="Estudiante"
                />
              </div>
            )}
            <SelectorBimestre bimestres={bimestres} valor={bimestreId} onCambiar={setElegido} />
          </div>
          {estudianteId && rango ? (
            <DetalleAsistenciaEstudiante estudianteId={estudianteId} rango={rango} />
          ) : (
            <EmptyState
              title="Elija un bimestre"
              description="Aún no hay bimestres configurados para este año académico."
              icon={UserGroupIcon}
            />
          )}
        </div>
      </PageState>
    </div>
  );
}
