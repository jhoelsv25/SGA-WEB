"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { getApoderadoColumns } from "./columns/apoderado-columns";
import { EditApoderadoModal } from "../components/modals/edit-apoderado-modal";
import { DeleteApoderadoModal } from "../components/modals/delete-apoderado-modal";
import type { Apoderado } from "../types/apoderados.types";

interface ApoderadosTableProps {
  apoderados: Apoderado[];
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

export function ApoderadosTable({ apoderados, isLoading, cursorPagination }: ApoderadosTableProps) {
  const [selectedApoderado, setSelectedApoderado] = React.useState<Apoderado | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const handleEdit = React.useCallback((apoderado: Apoderado) => {
    setSelectedApoderado(apoderado);
    setEditModalOpen(true);
  }, []);

  const handleDelete = React.useCallback((apoderado: Apoderado) => {
    setSelectedApoderado(apoderado);
    setDeleteModalOpen(true);
  }, []);

  const columns = React.useMemo(
    () =>
      getApoderadoColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={apoderados}
        isLoading={isLoading}
        cursorPagination={cursorPagination}
        emptyMessage="No se encontraron apoderados en el padrón con los criterios seleccionados."
      />

      <EditApoderadoModal
        apoderado={selectedApoderado}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <DeleteApoderadoModal
        apoderado={selectedApoderado}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
    </>
  );
}
