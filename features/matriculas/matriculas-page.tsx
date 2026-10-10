"use client";

import * as React from "react";
import { MatriculasTable } from "./views";
import { useSession } from "@/features/auth";

export function MatriculasPage() {
  const { data: session } = useSession();

  // Roles autorizados para gestionar según RF-009
  const rol = session?.user?.activeRoleName || session?.user?.roles?.[0] || "";
  const puedeGestionar =
    rol === "Administrador" ||
    rol === "Secretaria" ||
    rol.toLowerCase().includes("admin") ||
    rol.toLowerCase().includes("secretaria");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Gestión de Matrícula, Retiro y Traslado
        </h1>
        <p className="text-muted-foreground text-sm">
          Control oficial de matrículas individuales, masivas por continuadores, cambios de sección
          y constancias PDF (RF-009).
        </p>
      </div>

      <MatriculasTable puedeGestionar={puedeGestionar} />
    </div>
  );
}
