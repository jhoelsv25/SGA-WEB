"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MatriculaEstudianteInfo } from "../../types";

interface DetalleEstudianteCardProps {
  estudiante: MatriculaEstudianteInfo;
}

export function DetalleEstudianteCard({ estudiante }: DetalleEstudianteCardProps) {
  return (
    <Card className="border-border/60 overflow-hidden rounded-2xl shadow-2xs">
      <CardHeader className="bg-muted/30 border-border/50 border-b px-5 py-3.5">
        <CardTitle className="flex items-center justify-between text-sm font-semibold">
          <span>Información del Alumno</span>
          <Link
            href="/admin/estudiantes"
            className="text-primary text-xs font-medium hover:underline"
          >
            Ver en Padrón de Estudiantes →
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 p-5 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">Apellidos y Nombres</span>
          <span className="text-foreground text-sm font-bold">
            {estudiante.apellidos}, {estudiante.nombres}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">Documento de Identidad</span>
          <span className="text-foreground font-mono font-medium">
            {estudiante.tipoDocumento || "DNI"}: {estudiante.numeroDocumento}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">Código SIAGIE / Matrícula</span>
          <span className="text-primary font-mono font-bold">
            {estudiante.codigo || "No asignado"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">Estado en Padrón</span>
          <span className="text-foreground font-medium capitalize">
            {estudiante.estado || "Activo"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
