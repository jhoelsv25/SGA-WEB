import type { ExportColumnDef } from "@/lib/export-data";
import { formatDate } from "@/lib/formatters/date";
import type { Estudiante } from "../types/estudiantes.types";

export const estudianteExportColumns: ExportColumnDef<Estudiante>[] = [
  {
    key: "codigo",
    header: "Código SIAGIE",
  },
  {
    key: "persona",
    header: "Estudiante",
    format: (_, e) => e.persona.nombreCompleto,
  },
  {
    key: "documento",
    header: "Documento",
    format: (_, e) => `${e.persona.tipoDocumento.toUpperCase()}: ${e.persona.numeroDocumento}`,
  },
  {
    key: "fechaIngreso",
    header: "Fecha Ingreso",
    format: (val) => (val ? formatDate(String(val), "dd/MM/yyyy") : "-"),
  },
  {
    key: "tieneDiscapacidad",
    header: "Discapacidad",
    format: (_, e) =>
      e.tieneDiscapacidad ? `Sí (${e.detalleDiscapacidad || "Sin detalle"})` : "No",
  },
  {
    key: "grupoSanguineo",
    header: "Grupo Sanguíneo",
    format: (val) => String(val || "-"),
  },
  {
    key: "seguroSalud",
    header: "Seguro de Salud",
    format: (val) => String(val || "-"),
  },
  {
    key: "estado",
    header: "Estado Escolar",
    format: (val) => String(val).toUpperCase(),
  },
  {
    key: "usuario",
    header: "Usuario Sistema",
    format: (_, e) => e.usuario?.nombreUsuario || "-",
  },
  {
    key: "credencial",
    header: "Código Credencial",
    format: (_, e) => e.credencial?.codigo || "-",
  },
];
