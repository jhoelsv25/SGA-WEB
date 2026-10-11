"use client";

import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RESULTADOS_MARCACION_CONFIG, TIPOS_MARCACION_LABEL } from "../consts";
import type { MarcacionApi } from "../types";

interface TablaMarcaronProps {
  marcaciones: MarcacionApi[];
  puedeJustificar: boolean;
  onJustificar: (marcacion: MarcacionApi) => void;
}

const horaDe = (fechaHora: string): string => fechaHora.slice(11, 16);

function esJustificable(m: MarcacionApi): boolean {
  return !m.justificada && (m.resultado === "tardanza" || m.resultado === "salida_anticipada");
}

export function TablaMarcaron({ marcaciones, puedeJustificar, onJustificar }: TablaMarcaronProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Hora</TableHead>
          <TableHead>Persona</TableHead>
          <TableHead>Marcación</TableHead>
          <TableHead>Resultado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {marcaciones.map((m) => {
          const resultado = RESULTADOS_MARCACION_CONFIG[m.resultado];
          return (
            <TableRow key={m.id}>
              <TableCell className="font-mono text-xs font-semibold">
                {horaDe(m.fechaHora)}
              </TableCell>
              <TableCell className="font-medium">{m.nombreCompleto}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {TIPOS_MARCACION_LABEL[m.tipo]}
                {m.origen === "manual" && " · manual"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusBadge tone={resultado.tone} dot size="sm">
                    {resultado.label}
                    {m.minutosTardanza > 0 && ` · ${m.minutosTardanza} min`}
                  </StatusBadge>
                  {m.justificada && (
                    <StatusBadge tone="info" size="sm">
                      Justificada
                    </StatusBadge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {puedeJustificar && esJustificable(m) && (
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-10"
                    onClick={() => onJustificar(m)}
                  >
                    Justificar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
