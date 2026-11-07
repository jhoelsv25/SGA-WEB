"use client";

import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "@/lib/toast";

export type ModuloReporte = "personas" | "estudiantes" | "docentes" | "apoderados" | "usuarios";

type ParamsReporte = Record<string, string | number | boolean | null | undefined>;

function nombreDesdeCabecera(cabecera: unknown, respaldo: string): string {
  const texto = typeof cabecera === "string" ? cabecera : "";
  return /filename="?([^";]+)"?/i.exec(texto)?.[1] ?? respaldo;
}

/**
 * Descarga el reporte Excel estándar del backend (`GET /exportacion/<módulo>`) con los filtros
 * actuales de la pantalla. El servidor devuelve todas las filas que cumplen los filtros,
 * no solo la página visible. Skill del backend: `estandar-reportes-excel`.
 */
export function useExportarReporte(modulo: ModuloReporte) {
  const [isExporting, setIsExporting] = React.useState(false);

  const exportar = React.useCallback(
    async (filtros: ParamsReporte = {}) => {
      if (isExporting) return;
      setIsExporting(true);
      try {
        const params = Object.fromEntries(
          Object.entries(filtros).filter(([, v]) => v !== undefined && v !== null && v !== ""),
        );
        const res = await apiClient.get<Blob>(`/exportacion/${modulo}`, {
          params,
          responseType: "blob",
        });
        const hoy = new Date().toISOString().slice(0, 10);
        const nombre = nombreDesdeCabecera(
          (res.headers as Record<string, unknown>)["content-disposition"],
          `sga_${modulo}_${hoy}.xlsx`,
        );
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = nombre;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Archivo Excel descargado exitosamente");
      } catch {
        toast.error("No se pudo generar el reporte Excel. Intente nuevamente.");
      } finally {
        setIsExporting(false);
      }
    },
    [modulo, isExporting],
  );

  return { exportar, isExporting };
}
