"use client";

import { useState } from "react";
import type { BloqueHorario } from "../types";

export interface BloqueInicialesParams {
  diaSemana: number;
  horaInicio?: string;
  horaFin?: string;
  tipoBloque?: "clase" | "receso";
  cursoSeccionId?: string | null;
}

export function useHorariosDialogs() {
  const [bloqueModalOpen, setBloqueModalOpen] = useState(false);
  const [bloqueAEditar, setBloqueAEditar] = useState<BloqueHorario | null>(null);
  const [bloqueIniciales, setBloqueIniciales] = useState<BloqueInicialesParams>({
    diaSemana: 1,
  });

  const [copiarModalOpen, setCopiarModalOpen] = useState(false);
  const [proponerModalOpen, setProponerModalOpen] = useState(false);
  const [proponerIaModalOpen, setProponerIaModalOpen] = useState(false);
  const [eliminarDialogOpen, setEliminarDialogOpen] = useState(false);
  const [bloqueAEliminar, setBloqueAEliminar] = useState<BloqueHorario | null>(null);

  const abrirNuevoBloque = (
    diaSemana: number,
    horaInicio?: string,
    horaFin?: string,
    tipoBloque?: "clase" | "receso",
    cursoSeccionId?: string | null,
  ) => {
    setBloqueAEditar(null);
    setBloqueIniciales({
      diaSemana,
      horaInicio: horaInicio ?? "",
      horaFin: horaFin ?? "",
      tipoBloque: tipoBloque ?? "clase",
      cursoSeccionId: cursoSeccionId ?? null,
    });
    setBloqueModalOpen(true);
  };

  const abrirEditarBloque = (bloque: BloqueHorario) => {
    setBloqueAEditar(bloque);
    setBloqueModalOpen(true);
  };

  const abrirEliminarBloque = (bloque: BloqueHorario) => {
    setBloqueAEliminar(bloque);
    setEliminarDialogOpen(true);
  };

  return {
    bloqueModalOpen,
    setBloqueModalOpen,
    bloqueAEditar,
    bloqueIniciales,
    abrirNuevoBloque,
    abrirEditarBloque,
    copiarModalOpen,
    setCopiarModalOpen,
    proponerModalOpen,
    setProponerModalOpen,
    proponerIaModalOpen,
    setProponerIaModalOpen,
    eliminarDialogOpen,
    setEliminarDialogOpen,
    bloqueAEliminar,
    setBloqueAEliminar,
    abrirEliminarBloque,
  };
}
