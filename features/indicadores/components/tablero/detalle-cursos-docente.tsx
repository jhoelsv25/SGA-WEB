"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, Calendar03Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DetalleCursoDocenteIndicadorDto } from "@/features/indicadores";

interface DetalleCursosDocenteProps {
  cursos: DetalleCursoDocenteIndicadorDto[];
  docenteNombre?: string;
}

/**
 * Tabla detallada con el desglose del CSP y del IGM por cada curso y sección asignada.
 * Se presenta cuando se filtra por un docente en el tablero (RF-020 HU1).
 */
export function DetalleCursosDocente({ cursos, docenteNombre }: DetalleCursosDocenteProps) {
  if (!cursos || cursos.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-foreground text-base font-semibold">
              Desglose por Curso y Sección
            </CardTitle>
            <CardDescription className="text-xs">
              {docenteNombre
                ? `Cursos y secciones asignados al docente ${docenteNombre}`
                : "Detalle de efectividad desagregado por asignación académica"}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {cursos.length} {cursos.length === 1 ? "curso asignado" : "cursos asignados"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-xs font-semibold">Curso</TableHead>
                <TableHead className="text-xs font-semibold">Grado y Sección</TableHead>
                <TableHead className="text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-sky-600" />
                    <span>CSP (Sesiones)</span>
                  </div>
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Folder01Icon} size={14} className="text-amber-600" />
                    <span>IGM (Materiales)</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursos.map((item) => {
                const cspSinDatos = item.csp.sinDatos || item.csp.porcentaje === null;
                const igmSinDatos = item.igm.sinDatos || item.igm.porcentaje === null;

                return (
                  <TableRow key={`${item.cursoId}-${item.seccionId}`}>
                    <TableCell className="text-foreground text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={Book02Icon}
                          size={15}
                          className="text-muted-foreground shrink-0"
                        />
                        <span>{item.cursoNombre}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground text-xs">
                      {item.gradoNombre} &quot;{item.seccionNombre}&quot;
                    </TableCell>

                    <TableCell className="text-xs">
                      {cspSinDatos ? (
                        <span className="text-muted-foreground italic">Sin datos</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-semibold">
                            {item.csp.porcentajeTexto}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            ({item.csp.numerador}/{item.csp.denominador})
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-xs">
                      {igmSinDatos ? (
                        <span className="text-muted-foreground italic">Sin datos</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-semibold">
                            {item.igm.porcentajeTexto}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            ({item.igm.numerador}/{item.igm.denominador})
                          </span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
