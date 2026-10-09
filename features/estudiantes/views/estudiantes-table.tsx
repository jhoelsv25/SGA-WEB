"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { getEstudianteColumns } from "./columns/estudiante-columns";
import { EditEstudianteModal } from "../components/modals/edit-estudiante-modal";
import { DeleteEstudianteModal } from "../components/modals/delete-estudiante-modal";
import type { Estudiante } from "../types/estudiantes.types";

interface EstudiantesTableProps {
  estudiantes: Estudiante[];
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

export function EstudiantesTable({
  estudiantes,
  isLoading,
  cursorPagination,
}: EstudiantesTableProps) {
  const [selectedEstudiante, setSelectedEstudiante] = React.useState<Estudiante | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const handleEdit = React.useCallback((estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setEditModalOpen(true);
  }, []);

  const handleDelete = React.useCallback((estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setDeleteModalOpen(true);
  }, []);

  const columns = React.useMemo(
    () =>
      getEstudianteColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={estudiantes}
        isLoading={isLoading}
        cursorPagination={cursorPagination}
        emptyMessage="No se encontraron estudiantes en el padrón con los criterios seleccionados."
      />

      {/* Modal para Editar Estudiante */}
      <EditEstudianteModal
        estudiante={selectedEstudiante}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      {/* Diálogo de Confirmación para Eliminar Estudiante */}
      <DeleteEstudianteModal
        estudiante={selectedEstudiante}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
    </>
  );
}
