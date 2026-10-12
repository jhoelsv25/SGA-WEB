"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { getPersonaColumns } from "./columns/persona-columns";
import { EditPersonaModal } from "../components/modals/edit-persona-modal";
import { DeletePersonaModal } from "../components/modals/delete-persona-modal";
import { HistorialCriticoModal } from "../components/modals/historial-critico-modal";
import { ChangeCargoModal } from "../components/modals/change-cargo-modal";
import type { Persona } from "../types/personas.types";

interface PersonasTableProps {
  personas: Persona[];
  isLoading: boolean;
  cursorPagination?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    onNextPage: () => void;
    onPreviousPage: () => void;
    isLoading?: boolean;
    loadedCount?: number;
  };
}

export function PersonasTable({ personas, isLoading, cursorPagination }: PersonasTableProps) {
  const [selectedPersona, setSelectedPersona] = React.useState<Persona | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [historialModalOpen, setHistorialModalOpen] = React.useState(false);
  const [changeCargoModalOpen, setChangeCargoModalOpen] = React.useState(false);

  const handleEdit = React.useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setEditModalOpen(true);
  }, []);

  const handleDelete = React.useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setDeleteModalOpen(true);
  }, []);

  const handleVerHistorial = React.useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setHistorialModalOpen(true);
  }, []);

  const handleChangeCargo = React.useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setChangeCargoModalOpen(true);
  }, []);

  const columns = React.useMemo(
    () =>
      getPersonaColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onVerHistorial: handleVerHistorial,
        onChangeCargo: handleChangeCargo,
      }),
    [handleEdit, handleDelete, handleVerHistorial, handleChangeCargo],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={personas}
        isLoading={isLoading}
        cursorPagination={cursorPagination}
        emptyMessage="No se encontraron personas en el padrón con los criterios seleccionados."
      />

      {/* Modal para Editar Persona */}
      <EditPersonaModal
        persona={selectedPersona}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      {/* Modal para Eliminar Persona Provisional */}
      <DeletePersonaModal
        persona={selectedPersona}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />

      {/* Modal de Bitácora de Correcciones Críticas (RF-007 HU6) */}
      <HistorialCriticoModal
        persona={selectedPersona}
        open={historialModalOpen}
        onOpenChange={setHistorialModalOpen}
      />

      {/* Modal para Cambiar el Cargo de una Persona (RF-002 V3) */}
      <ChangeCargoModal
        persona={selectedPersona}
        open={changeCargoModalOpen}
        onOpenChange={setChangeCargoModalOpen}
      />
    </>
  );
}
