"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { getEstudianteColumns } from "./columns/estudiante-columns";
import { EditEstudianteModal } from "../components/modals/edit-estudiante-modal";
import { DeleteEstudianteModal } from "../components/modals/delete-estudiante-modal";
import { CredentialsModal } from "../components/modals/credentials-modal";
import { CarnetModal } from "../../credenciales/components/modals/carnet-modal";
import { ReemitirCredencialModal } from "../../credenciales/components/modals/reemitir-credencial-modal";
import { HistorialCriticoModal } from "@/features/personas";
import type { Estudiante } from "../types/estudiantes.types";
import type { CredencialResponse } from "../../credenciales/types/credenciales.types";

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
  const [carneModalOpen, setCarneModalOpen] = React.useState(false);
  const [reemitirModalOpen, setReemitirModalOpen] = React.useState(false);
  const [historialModalOpen, setHistorialModalOpen] = React.useState(false);
  const [reemitidaData, setReemitidaData] = React.useState<{
    nombreCompleto: string;
    codigoSiagie: string;
    codigoCredencial: string;
    pin: string;
  } | null>(null);
  const [credentialsModalOpen, setCredentialsModalOpen] = React.useState(false);

  const handleEdit = React.useCallback((estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setEditModalOpen(true);
  }, []);

  const handleDelete = React.useCallback((estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setDeleteModalOpen(true);
  }, []);

  const handlePrintCarne = React.useCallback((estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setCarneModalOpen(true);
  }, []);

  const handleReemitir = React.useCallback((estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setReemitirModalOpen(true);
  }, []);

  const handleVerHistorial = React.useCallback((estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setHistorialModalOpen(true);
  }, []);

  const handleReemitirSuccess = React.useCallback(
    (nuevaCred: CredencialResponse) => {
      if (selectedEstudiante) {
        setReemitidaData({
          nombreCompleto: selectedEstudiante.persona.nombreCompleto,
          codigoSiagie: selectedEstudiante.codigo,
          codigoCredencial: nuevaCred.codigo,
          pin: nuevaCred.pin || "----",
        });
        setCredentialsModalOpen(true);
      }
    },
    [selectedEstudiante],
  );

  const columns = React.useMemo(
    () =>
      getEstudianteColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onPrintCarne: handlePrintCarne,
        onReemitirCredencial: handleReemitir,
        onVerHistorial: handleVerHistorial,
      }),
    [handleEdit, handleDelete, handlePrintCarne, handleReemitir, handleVerHistorial],
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

      {/* Modal para Carnet Escolar Imprimible con QR (RF-007 HU5) */}
      {selectedEstudiante && (
        <CarnetModal
          personaId={selectedEstudiante.personaId}
          open={carneModalOpen}
          onOpenChange={setCarneModalOpen}
        />
      )}

      {/* Modal para Anular y Reemitir Credencial (Carné Perdido - RF-007 HU5) */}
      {selectedEstudiante && (
        <ReemitirCredencialModal
          personaId={selectedEstudiante.personaId}
          nombreCompleto={selectedEstudiante.persona.nombreCompleto}
          codigoActual={selectedEstudiante.credencial?.codigo}
          open={reemitirModalOpen}
          onOpenChange={setReemitirModalOpen}
          onSuccess={handleReemitirSuccess}
        />
      )}

      {/* Modal para Visualizar Nueva Credencial y PIN Reemitidos */}
      {reemitidaData && (
        <CredentialsModal
          open={credentialsModalOpen}
          onOpenChange={setCredentialsModalOpen}
          nombreCompleto={reemitidaData.nombreCompleto}
          codigoSiagie={reemitidaData.codigoSiagie}
          nombreUsuario={reemitidaData.codigoSiagie}
          codigoCredencial={reemitidaData.codigoCredencial}
          pin={reemitidaData.pin}
        />
      )}

      {/* Bitácora de Correcciones Críticas (RF-007 HU6) */}
      {selectedEstudiante && (
        <HistorialCriticoModal
          persona={selectedEstudiante.persona}
          open={historialModalOpen}
          onOpenChange={setHistorialModalOpen}
        />
      )}
    </>
  );
}
