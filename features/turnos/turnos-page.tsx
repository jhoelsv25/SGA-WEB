"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import {
  useTurnosQuery,
  useCreateTurnoMutation,
  useUpdateTurnoMutation,
  useToggleTurnoActivoMutation,
} from "./hooks";
import { TurnosGrid } from "./views";
import { TurnoEditModal } from "./components/modals/turno-edit-modal";
import type { TipoPersona, Turno } from "./types";
import type { TurnoFormValues } from "./schemas";

export function TurnosPage() {
  const { data: turnos = [], isLoading, isError, error, refetch } = useTurnosQuery();

  const createMutation = useCreateTurnoMutation();
  const updateMutation = useUpdateTurnoMutation();
  const toggleMutation = useToggleTurnoActivoMutation();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedTurno, setSelectedTurno] = React.useState<Turno | null>(null);

  const handleEditTurno = (turno: Turno) => {
    setSelectedTurno(turno);
    setModalOpen(true);
  };

  const handleCreateTurno = (tipoPersona: TipoPersona) => {
    // Inicializar con valores sugeridos para ese tipo
    setSelectedTurno({
      id: "",
      tipoPersona,
      horaEntrada: tipoPersona === "docentes" ? "07:45" : "08:00",
      ventanaEntradaInicio: "06:30",
      ventanaEntradaFin: "09:30",
      horaSalida: tipoPersona === "docentes" ? "13:15" : "14:00",
      ventanaSalidaInicio: "12:30",
      ventanaSalidaFin: "15:30",
      toleranciaMinutos: 10,
      diasLaborables: [1, 2, 3, 4, 5],
      activo: true,
    });
    setModalOpen(true);
  };

  const handleToggleActivo = (turno: Turno, activo: boolean) => {
    toggleMutation.mutate({ id: turno.id, activo });
  };

  const handleModalSubmit = async (values: TurnoFormValues) => {
    if (selectedTurno?.id) {
      await updateMutation.mutateAsync({
        id: selectedTurno.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync({
        tipoPersona: values.tipoPersona,
        horaEntrada: values.horaEntrada,
        ventanaEntradaInicio: values.ventanaEntradaInicio,
        ventanaEntradaFin: values.ventanaEntradaFin,
        horaSalida: values.horaSalida,
        ventanaSalidaInicio: values.ventanaSalidaInicio,
        ventanaSalidaFin: values.ventanaSalidaFin,
        toleranciaMinutos: values.toleranciaMinutos,
        diasLaborables: values.diasLaborables,
        activo: values.activo,
      });
    }
  };

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Turnos de marcación"
        description="Define las horas oficiales de entrada y salida, ventanas de marcado y tolerancia reglamentaria por cada estamento escolar."
        icon={Clock01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Configuración", href: "/admin/configuracion" },
          { label: "Turnos" },
        ]}
      />

      {/* Banner Informativo */}
      <div className="border-primary/20 bg-primary/5 text-foreground flex items-start gap-3 rounded-xl border p-4 text-xs leading-relaxed">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="text-primary mt-0.5 h-5 w-5 shrink-0"
        />
        <div>
          <span className="text-foreground font-semibold">Reglas del cálculo de asistencia:</span>{" "}
          Las marcaciones dentro de la ventana de entrada se consideran <strong>a tiempo</strong> si
          ocurren antes de la hora oficial más la tolerancia. Posterior a este margen, se computa
          como <strong>tardanza</strong> con sus minutos exactos. Si el turno está pausado, las
          marcaciones se registran sin cómputo de tardanzas.
        </div>
      </div>

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        errorTitle="Error al cargar turnos"
      >
        <TurnosGrid
          turnos={turnos}
          onEditTurno={handleEditTurno}
          onCreateTurno={handleCreateTurno}
          onToggleActivo={handleToggleActivo}
          isToggling={toggleMutation.isPending}
        />
      </PageState>

      {/* Modal de Creación / Edición */}
      <TurnoEditModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        turno={selectedTurno}
        onSubmit={handleModalSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
