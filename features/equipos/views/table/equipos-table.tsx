"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
  const { data: equipos = [], isLoading } = useEquiposQuery();

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

  return (
    <>
      <DataTable
        columns={columns}
        data={equipos}
        isLoading={isLoading}
        searchKey="nombre"
        searchPlaceholder="Buscar terminal por nombre o ubicación..."
        toolbarActions={
          <Button onClick={handleCreate} className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
            Registrar Equipo
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
