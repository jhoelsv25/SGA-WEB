import * as XLSX from "xlsx";

export interface ExportColumnDef<T> {
  key: keyof T | string;
  header: string;
  format?: (value: unknown, item: T) => string | number | boolean | null | undefined;
}

export interface ExportDataOptions<T> {
  filename: string;
  columns: ExportColumnDef<T>[];
  data: T[];
  sheetName?: string;
  format?: "xlsx" | "csv";
}

export function exportDataToSpreadsheet<T extends object>({
  filename,
  columns,
  data,
  sheetName = "Datos",
  format = "xlsx",
}: ExportDataOptions<T>): void {
  const formattedRows = data.map((item) => {
    const row: Record<string, string | number | boolean> = {};

    columns.forEach((col) => {
      const rawValue = (item as Record<string, unknown>)[col.key as string];
      const finalValue = col.format ? col.format(rawValue, item) : rawValue;

      row[col.header] = finalValue != null ? (finalValue as string | number | boolean) : "";
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const fileExtension = format === "csv" ? "csv" : "xlsx";
  const fullFileName = filename.endsWith(`.${fileExtension}`)
    ? filename
    : `${filename}.${fileExtension}`;

  XLSX.writeFile(workbook, fullFileName, {
    bookType: format === "csv" ? "csv" : "xlsx",
  });
}
