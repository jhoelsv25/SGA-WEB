"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { StatusBadge } from "@/components/common/status-badge";
import { TIPO_EQUIPO_META, PROPOSITO_EQUIPO_META } from "../../consts";
import { EquiposActions } from "./columns/equipos-actions";
import { getEquiposColumns } from "./columns";
import { EquipoFormModal } from "../../components/modals/equipo-form-modal";
import { AutorizarModal } from "../../components/modals/autorizar-modal";
import {
  useEquiposQuery,
  useCreateEquipoMutation,
  useUpdateEquipoMutation,
  useToggleEquipoActivoMutation,
  useAutorizarEquipoMutation,
} from "../../hooks";
import type { Equipo } from "../../types";
import type { EquipoFormValues } from "../../schemas";

export function EquiposTable() {
  const { data: equipos = [], isLoading, isError, refetch } = useEquiposQuery();

  const createMutation = useCreateEquipoMutation();
  const updateMutation = useUpdateEquipoMutation();
  const toggleMutation = useToggleEquipoActivoMutation();
  const autorizarMutation = useAutorizarEquipoMutation();

  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [equipoToEdit, setEquipoToEdit] = React.useState<Equipo | null>(null);

  const [autorizarModalOpen, setAutorizarModalOpen] = React.useState(false);
  const [equipoToAutorizar, setEquipoToAutorizar] = React.useState<Equipo | null>(null);

  const handleCreate = () => {
    setEquipoToEdit(null);
    setFormModalOpen(true);
  };

  const handleEdit = React.useCallback((equipo: Equipo) => {
    setEquipoToEdit(equipo);
    setFormModalOpen(true);
  }, []);

  const handleAutorizar = React.useCallback((equipo: Equipo) => {
    setEquipoToAutorizar(equipo);
    setAutorizarModalOpen(true);
  }, []);

  const handleToggleActivo = React.useCallback(
    async (equipo: Equipo, activo: boolean) => {
      await toggleMutation.mutateAsync({ id: equipo.id, activo });
    },
    [toggleMutation],
  );

  const handleFormSubmit = async (values: EquipoFormValues) => {
    if (equipoToEdit?.id) {
      await updateMutation.mutateAsync({
        id: equipoToEdit.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleConfirmAutorizar = async (equipoId: string) => {
    await autorizarMutation.mutateAsync(equipoId);
  };

  const columns = React.useMemo(
    () =>
      getEquiposColumns({
        onEdit: handleEdit,
        onAutorizar: handleAutorizar,
        onToggleActivo: handleToggleActivo,
        isToggling: toggleMutation.isPending,
      }),
    [handleEdit, handleAutorizar, handleToggleActivo, toggleMutation.isPending],
  );

  const renderEquipoMobileCard = React.useCallback(
    (equipo: Equipo) => {
      const tipoMeta = TIPO_EQUIPO_META[equipo.tipo];
      const propositoMeta = PROPOSITO_EQUIPO_META[equipo.proposito];
      const isAutorizado = Boolean(
        equipo.tokenAutorizado || equipo.autorizado || equipo.autorizadoEn,
      );

      return (
        <div className="border-border/70 bg-card space-y-3 rounded-xl border p-4 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-semibold">{equipo.nombre}</p>
              <p className="text-muted-foreground text-xs">{equipo.ubicacion}</p>
              {equipo.numeroSerie && (
                <p className="text-muted-foreground/80 font-mono text-[11px]">
                  S/N: {equipo.numeroSerie}
                </p>
              )}
            </div>
            <EquiposActions
              equipo={equipo}
              onEdit={handleEdit}
              onAutorizar={handleAutorizar}
              onToggleActivo={handleToggleActivo}
              isToggling={toggleMutation.isPending}
            />
          </div>

          <div className="border-border/50 flex flex-wrap items-center gap-1.5 border-t pt-2 text-xs">
            <StatusBadge tone={tipoMeta?.tone ?? "neutral"} size="sm">
              {tipoMeta?.label || equipo.tipo}
            </StatusBadge>
            <StatusBadge tone={propositoMeta?.tone ?? "brand"} size="sm">
              {propositoMeta?.label || equipo.proposito}
            </StatusBadge>
            <StatusBadge tone={isAutorizado ? "success" : "warning"} dot size="sm">
              {isAutorizado ? "Autorizado" : "Pendiente"}
            </StatusBadge>
            <StatusBadge tone={equipo.activo ? "success" : "neutral"} dot size="sm">
              {equipo.activo ? "Activo" : "Inactivo"}
            </StatusBadge>
          </div>
        </div>
      );
    },
    [handleEdit, handleAutorizar, handleToggleActivo, toggleMutation.isPending],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={equipos}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        caption="Listado de equipos autorizados para marcación y sesiones"
        mobileCard={renderEquipoMobileCard}
        searchKey="nombre"
        searchPlaceholder="Buscar terminal por nombre o ubicación..."
        toolbarActions={
          <Button onClick={handleCreate} className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
            Registrar equipo
          </Button>
        }
      />

      {/* Modal Crear / Editar */}
      <EquipoFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        equipo={equipoToEdit}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Modal Autorizar en PC local */}
      <AutorizarModal
        open={autorizarModalOpen}
        onOpenChange={setAutorizarModalOpen}
        equipo={equipoToAutorizar}
        onConfirmAutorizar={handleConfirmAutorizar}
        isAuthorizing={autorizarMutation.isPending}
      />
    </>
  );
}
