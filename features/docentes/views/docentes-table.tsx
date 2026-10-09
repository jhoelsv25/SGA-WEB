"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { getDocenteColumns } from "./columns/docente-columns";
import { EditDocenteModal } from "../components/modals/edit-docente-modal";
import { CesarDocenteModal } from "../components/modals/cesar-docente-modal";
import type { Docente } from "../types/docentes.types";

interface DocentesTableProps {
  docentes: Docente[];
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

export function DocentesTable({ docentes, isLoading, cursorPagination }: DocentesTableProps) {
  const [selectedDocente, setSelectedDocente] = React.useState<Docente | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [cesarModalOpen, setCesarModalOpen] = React.useState(false);

  const handleEdit = React.useCallback((docente: Docente) => {
    setSelectedDocente(docente);
    setEditModalOpen(true);
  }, []);

  const handleCesar = React.useCallback((docente: Docente) => {
    setSelectedDocente(docente);
    setCesarModalOpen(true);
  }, []);

  const columns = React.useMemo(
    () =>
      getDocenteColumns({
        onEdit: handleEdit,
        onCesar: handleCesar,
      }),
    [handleEdit, handleCesar],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={docentes}
        isLoading={isLoading}
        cursorPagination={cursorPagination}
        emptyMessage="No se encontraron docentes con los criterios seleccionados."
      />

      {/* Modal para Editar Docente */}
      <EditDocenteModal
        docente={selectedDocente}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      {/* Modal para Cesar Docente */}
      <CesarDocenteModal
        docente={selectedDocente}
        open={cesarModalOpen}
        onOpenChange={setCesarModalOpen}
      />
    </>
  );
}
