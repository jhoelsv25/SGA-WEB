"use client";

import * as React from "react";
import { toast } from "@/lib/toast";
import {
  exportDataToSpreadsheet,
  type ExportDataOptions,
  type ExportColumnDef,
} from "@/lib/export-data";

export interface UseExportExcelOptions<T extends object = object> {
  columns?: ExportColumnDef<T>[];
  filenamePrefix?: string;
  sheetName?: string;
}

export function useExportExcel<T extends object = object>(
  defaultOptions?: UseExportExcelOptions<T>,
) {
  const [isExporting, setIsExporting] = React.useState(false);

  const exportSpreadsheet = React.useCallback(
    async <U extends object = T>(options: ExportDataOptions<U>) => {
      if (!options.data || options.data.length === 0) {
        toast.info("No hay datos disponibles para exportar.");
        return;
      }

      setIsExporting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        exportDataToSpreadsheet(options);

        const formatLabel = options.format === "csv" ? "CSV" : "Excel";
        toast.success(`Archivo ${formatLabel} descargado exitosamente`);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Ocurrió un error al generar la exportación.";
        toast.error("Error al exportar", { description: message });
      } finally {
        setIsExporting(false);
      }
    },
    [],
  );

  const exportToExcel = React.useCallback(
    async (data: T[], customOptions?: Partial<ExportDataOptions<T>>) => {
      const filename =
        customOptions?.filename ||
        (defaultOptions?.filenamePrefix
          ? `${defaultOptions.filenamePrefix}-${new Date().toISOString().split("T")[0]}`
          : `exportacion-${Date.now()}`);

      const mergedOptions: ExportDataOptions<T> = {
        data,
        columns: (customOptions?.columns || defaultOptions?.columns) as ExportColumnDef<T>[],
        filename,
        sheetName: customOptions?.sheetName || defaultOptions?.sheetName || "Datos",
        format: customOptions?.format || "xlsx",
      };

      await exportSpreadsheet(mergedOptions);
    },
    [defaultOptions, exportSpreadsheet],
  );

  return {
    exportSpreadsheet,
    exportToExcel,
    isExporting,
  };
}
