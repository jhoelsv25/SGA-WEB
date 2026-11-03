"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { getDocenteColumns } from "./columns/docente-columns";
import { EditDocenteModal } from "../components/modals/edit-docente-modal";
import { CesarDocenteModal } from "../components/modals/cesar-docente-modal";
import { CredentialsModal } from "../components/modals/credentials-modal";
import { CarnetModal } from "../../credenciales/components/modals/carnet-modal";
import { ReemitirCredencialModal } from "../../credenciales/components/modals/reemitir-credencial-modal";
import { CodigoBiometricoModal } from "@/features/biometrico";
import { HistorialCriticoModal } from "@/features/personas";
import type { Docente } from "../types/docentes.types";
import type { CredencialResponse } from "../../credenciales/types/credenciales.types";

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
  const [carneModalOpen, setCarneModalOpen] = React.useState(false);
  const [reemitirModalOpen, setReemitirModalOpen] = React.useState(false);
  const [historialModalOpen, setHistorialModalOpen] = React.useState(false);
  const [codigoBiometricoDe, setCodigoBiometricoDe] = React.useState<Docente | null>(null);
  const [reemitidaData, setReemitidaData] = React.useState<{
    nombreCompleto: string;
    codigoDocente: string;
    codigoCredencial: string;
    pin: string;
  } | null>(null);
  const [credentialsModalOpen, setCredentialsModalOpen] = React.useState(false);

  const handleEdit = React.useCallback((docente: Docente) => {
    setSelectedDocente(docente);
    setEditModalOpen(true);
  }, []);

  const handleCesar = React.useCallback((docente: Docente) => {
    setSelectedDocente(docente);
    setCesarModalOpen(true);
  }, []);

  const handlePrintCarne = React.useCallback((docente: Docente) => {
    setSelectedDocente(docente);
    setCarneModalOpen(true);
  }, []);

  const handleReemitir = React.useCallback((docente: Docente) => {
    setSelectedDocente(docente);
    setReemitirModalOpen(true);
  }, []);

  const handleVerHistorial = React.useCallback((docente: Docente) => {
    setSelectedDocente(docente);
    setHistorialModalOpen(true);
  }, []);

  const handleReemitirSuccess = React.useCallback(
    (nuevaCred: CredencialResponse) => {
      if (selectedDocente) {
        setReemitidaData({
          nombreCompleto: selectedDocente.persona.nombreCompleto,
          codigoDocente: selectedDocente.codigo,
          codigoCredencial: nuevaCred.codigo,
          pin: nuevaCred.pin || "----",
        });
        setCredentialsModalOpen(true);
      }
    },
    [selectedDocente],
  );

  const columns = React.useMemo(
    () =>
      getDocenteColumns({
        onEdit: handleEdit,
        onCesar: handleCesar,
        onPrintCarne: handlePrintCarne,
        onReemitirCredencial: handleReemitir,
        onVerHistorial: handleVerHistorial,
        onCodigoBiometrico: setCodigoBiometricoDe,
      }),
    [handleEdit, handleCesar, handlePrintCarne, handleReemitir, handleVerHistorial],
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

      {/* Código biométrico del reloj (RF-022) */}
      <CodigoBiometricoModal
        personaId={codigoBiometricoDe?.personaId ?? null}
        nombreCompleto={codigoBiometricoDe?.persona.nombreCompleto ?? ""}
        onOpenChange={(abierto) => !abierto && setCodigoBiometricoDe(null)}
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

      {/* Modal para Carnet Docente Imprimible con QR (RF-007 HU5) */}
      {selectedDocente && (
        <CarnetModal
          personaId={selectedDocente.personaId}
          open={carneModalOpen}
          onOpenChange={setCarneModalOpen}
        />
      )}

      {/* Modal para Anular y Reemitir Credencial (Carné Perdido - RF-007 HU5) */}
      {selectedDocente && (
        <ReemitirCredencialModal
          personaId={selectedDocente.personaId}
          nombreCompleto={selectedDocente.persona.nombreCompleto}
          codigoActual={selectedDocente.credencial?.codigo}
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
          codigoDocente={reemitidaData.codigoDocente}
          nombreUsuario={reemitidaData.codigoDocente}
          codigoCredencial={reemitidaData.codigoCredencial}
          pin={reemitidaData.pin}
        />
      )}

      {/* Bitácora de Correcciones Críticas (RF-007 HU6) */}
      {selectedDocente && (
        <HistorialCriticoModal
          persona={selectedDocente.persona}
          open={historialModalOpen}
          onOpenChange={setHistorialModalOpen}
        />
      )}
    </>
  );
}
