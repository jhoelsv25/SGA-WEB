"use client";

import * as React from "react";
import {
  Award01Icon,
  AlertCircleIcon,
  GraduationCapIcon,
  ChartLineData02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResumenConductaEstudiante } from "../../types";

export interface FichaResumenConductaProps {
  resumen: ResumenConductaEstudiante;
}

export function FichaResumenConducta({ resumen }: FichaResumenConductaProps) {
  const totales = React.useMemo(() => {
    let leves = 0;
    let graves = 0;
    let muyGraves = 0;
    for (const b of resumen.desglosePorBimestre) {
      leves += b.faltasLeves;
      graves += b.faltasGraves;
      muyGraves += b.faltasMuyGraves;
    }
    return { leves, graves, muyGraves };
  }, [resumen.desglosePorBimestre]);

  return (
    <div className="space-y-6">
      {/* Cabecera del Estudiante */}
      <div className="bg-muted/40 border-border flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={GraduationCapIcon} className="text-primary h-5 w-5" />
            <h3 className="text-foreground text-lg font-semibold">{resumen.estudianteNombre}</h3>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono">Código: {resumen.codigoEstudiante}</span>
            <span>•</span>
            <span>Grado: {resumen.gradoNombre}</span>
            <span>•</span>
            <span>Sección: {resumen.seccionNombre}</span>
          </div>
        </div>

        <Badge variant="outline" className="self-start text-xs font-medium sm:self-auto">
          Ficha de Convivencia Escolar
        </Badge>
      </div>

      {/* Tarjetas de Métricas Globales */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-emerald-200/80 bg-emerald-500/5 dark:border-emerald-900/50">
          <CardContent className="space-y-1.5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Méritos
              </span>
              <HugeiconsIcon
                icon={Award01Icon}
                className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              +{resumen.totalMeritos}
            </div>
            <p className="text-muted-foreground text-[11px]">Acciones positivas registradas</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200/80 bg-amber-500/5 dark:border-amber-900/50">
          <CardContent className="space-y-1.5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Faltas Leves
              </span>
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="h-4 w-4 text-amber-600 dark:text-amber-400"
              />
            </div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {totales.leves}
            </div>
            <p className="text-muted-foreground text-[11px]">Incumplimientos menores</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200/80 bg-orange-500/5 dark:border-orange-900/50">
          <CardContent className="space-y-1.5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-orange-700 dark:text-orange-400">
                Faltas Graves
              </span>
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="h-4 w-4 text-orange-600 dark:text-orange-400"
              />
            </div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {totales.graves}
            </div>
            <p className="text-muted-foreground text-[11px]">Reiteraciones o faltas serias</p>
          </CardContent>
        </Card>

        <Card className="border-red-200/80 bg-red-500/5 dark:border-red-900/50">
          <CardContent className="space-y-1.5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-red-700 dark:text-red-400">Muy Graves</span>
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="h-4 w-4 text-red-600 dark:text-red-400"
              />
            </div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {totales.muyGraves}
            </div>
            <p className="text-muted-foreground text-[11px]">Infracciones graves al reglamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Desglose por Bimestre */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <HugeiconsIcon icon={ChartLineData02Icon} className="text-primary h-4 w-4" />
            Evolución y Desglose por Periodo Académico
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 border-border text-muted-foreground border-y font-medium">
                <tr>
                  <th className="px-4 py-2.5 text-left">Periodo / Bimestre</th>
                  <th className="px-3 py-2.5 text-center text-emerald-600 dark:text-emerald-400">
                    Méritos
                  </th>
                  <th className="px-3 py-2.5 text-center text-amber-600 dark:text-amber-400">
                    F. Leves
                  </th>
                  <th className="px-3 py-2.5 text-center text-orange-600 dark:text-orange-400">
                    F. Graves
                  </th>
                  <th className="px-3 py-2.5 text-center text-red-600 dark:text-red-400">
                    F. Muy Graves
                  </th>
                  <th className="px-4 py-2.5 text-right font-semibold">Total Faltas</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {resumen.desglosePorBimestre.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-muted-foreground py-6 text-center">
                      No hay registros bimestrales de conducta disponibles para este estudiante.
                    </td>
                  </tr>
                ) : (
                  resumen.desglosePorBimestre.map((b) => (
                    <tr key={b.periodoId} className="hover:bg-muted/30 transition-colors">
                      <td className="text-foreground px-4 py-3 font-medium">{b.periodoNombre}</td>
                      <td className="px-3 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {b.meritos > 0 ? `+${b.meritos}` : "0"}
                      </td>
                      <td className="text-muted-foreground px-3 py-3 text-center">
                        {b.faltasLeves}
                      </td>
                      <td className="text-muted-foreground px-3 py-3 text-center">
                        {b.faltasGraves}
                      </td>
                      <td className="text-muted-foreground px-3 py-3 text-center">
                        {b.faltasMuyGraves}
                      </td>
                      <td className="text-foreground px-4 py-3 text-right font-bold">
                        {b.totalFaltas}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
