"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, AlertCircleIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import {
  useTurnosQuery,
  useCreateTurnoMutation,
  useUpdateTurnoMutation,
  useToggleTurnoActivoMutation,
} from "./hooks";
import { TurnosGrid } from "./components/turnos-grid";
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
        title="Turnos de Marcación"
        description="Define las horas oficiales de entrada y salida, ventanas de marcado y tolerancia reglamentaria por cada estamento escolar."
        icon={Clock01Icon}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Configuración" },
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

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Spinner className="text-primary h-8 w-8" />
          <p className="text-muted-foreground text-xs">Cargando turnos escolares...</p>
        </div>
      ) : isError ? (
        <div className="border-destructive/20 bg-destructive/5 flex h-64 flex-col items-center justify-center gap-4 rounded-xl border p-8 text-center">
          <HugeiconsIcon icon={AlertCircleIcon} className="text-destructive h-10 w-10" />
          <div className="space-y-1">
            <h3 className="text-destructive text-sm font-semibold">Error al cargar turnos</h3>
            <p className="text-muted-foreground text-xs">
              {(error as Error)?.message || "No se pudieron obtener los turnos registrados."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : (
        <TurnosGrid
          turnos={turnos}
          onEditTurno={handleEditTurno}
          onCreateTurno={handleCreateTurno}
          onToggleActivo={handleToggleActivo}
          isToggling={toggleMutation.isPending}
        />
      )}

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
