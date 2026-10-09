import { read, utils, writeFile } from "xlsx";
import type { CredencialEmitida, TipoImportacion } from "../types/importacion.types";

/**
 * Normaliza nombres de columnas de encabezados de Excel a claves de objeto.
 */
function normalizeHeaderKey(header: string): string {
  const clean = header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Quitar tildes

  if (clean.includes("siagie") && clean.includes("estudiante")) return "codigoSiagieEstudiante";
  if (clean.includes("siagie")) return "codigoSiagie";
  if (clean.includes("codigo") && clean.includes("docente")) return "codigoDocente";
  if (clean.includes("tipo") && clean.includes("documento")) return "tipoDocumento";
  if (clean.includes("numero") && clean.includes("documento")) return "numeroDocumento";
  if (clean.includes("paterno")) return "apellidoPaterno";
  if (clean.includes("materno")) return "apellidoMaterno";
  if (clean.includes("nombres") || clean === "nombre") return "nombres";
  if (clean.includes("sexo")) return "sexo";
  if (clean.includes("nacimiento")) return "fechaNacimiento";
  if (clean.includes("celular") || clean.includes("telefono")) return "celular";
  if (clean.includes("correo") || clean.includes("email")) return "correo";
  if (clean.includes("ingreso")) return "fechaIngreso";
  if (clean.includes("especialidad")) return "especialidad";
  if (clean.includes("contrato")) return "tipoContrato";
  if (clean.includes("jornada")) return "jornada";
  if (clean.includes("parentesco")) return "parentesco";
  if (clean.includes("principal")) return "esPrincipal";

  return header.trim();
}

/**
 * Parsea un archivo Excel subido por el usuario en el navegador y retorna un arreglo de filas.
 */
export async function parseExcelFile(file: File): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = read(buffer, { type: "array" });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error("El archivo Excel no contiene hojas de datos.");
  }

  const worksheet = workbook.Sheets[firstSheetName];
  if (!worksheet) {
    throw new Error("No se pudo leer la hoja de datos.");
  }

  const rawRows = utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
  });

  if (rawRows.length === 0) {
    throw new Error("El archivo no contiene filas de datos para procesar.");
  }

  // Normalizar los encabezados de cada fila
  return rawRows.map((row) => {
    const normalizedRow: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = normalizeHeaderKey(key);
      normalizedRow[normalizedKey] = value;
    }
    return normalizedRow;
  });
}

/**
 * Descarga un archivo Blob generado o recibido del backend.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Genera y descarga un reporte en formato Excel (.xlsx) con las credenciales y accesos emitidos.
 */
export function exportCredencialesReport(
  credenciales: CredencialEmitida[],
  tipo: TipoImportacion,
): void {
  if (credenciales.length === 0) return;

  const dataToExport = credenciales.map((c) => ({
    "Apellidos y Nombres": c.nombreCompleto,
    "N° Documento": c.numeroDocumento,
    Rol: c.tipoRol,
    "Usuario de Acceso": c.nombreUsuario ?? "—",
    "Contraseña Temporal": c.tempPassword ?? "—",
    "Código de Marcación": c.codigoCredencial ?? "—",
    "PIN de Marcación": c.pin ?? "—",
  }));

  const worksheet = utils.json_to_sheet(dataToExport);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Credenciales Emitidas");

  // Configurar anchos de columnas
  worksheet["!cols"] = [
    { wch: 30 }, // Nombre completo
    { wch: 15 }, // Documento
    { wch: 15 }, // Rol
    { wch: 20 }, // Usuario
    { wch: 22 }, // Contraseña temporal
    { wch: 22 }, // Código credencial
    { wch: 18 }, // PIN
  ];

  const fechaStr = new Date().toISOString().split("T")[0];
  writeFile(workbook, `Reporte_Credenciales_${tipo}_${fechaStr}.xlsx`);
}
