import type { ExportColumnDef } from "@/lib/export-data";
import { formatDate } from "@/lib/formatters/date";
import type { Docente } from "../types/docentes.types";

export const docenteExportColumns: ExportColumnDef<Docente>[] = [
  {
    key: "codigo",
    header: "Código Docente",
  },
  {
    key: "persona",
    header: "Docente",
    format: (_, d) => d.persona.nombreCompleto,
  },
  {
    key: "documento",
    header: "Documento",
    format: (_, d) => `${d.persona.tipoDocumento.toUpperCase()}: ${d.persona.numeroDocumento}`,
  },
  {
    key: "especialidad",
    header: "Especialidad",
    format: (val) => String(val || "-"),
  },
  {
    key: "tipoContrato",
    header: "Contrato",
    format: (val) => String(val).toUpperCase(),
  },
  {
    key: "jornadaHoras",
    header: "Jornada (hrs)",
    format: (val) => `${val} hrs`,
  },
  {
    key: "fechaIngreso",
    header: "Fecha Ingreso",
    format: (val) => (val ? formatDate(String(val), "dd/MM/yyyy") : "-"),
  },
  {
    key: "estado",
    header: "Estado",
    format: (val) => String(val).toUpperCase(),
  },
  {
    key: "cargoVigente",
    header: "Cargo Vigente",
    format: (val) => String(val || "-"),
  },
  {
    key: "usuario",
    header: "Usuario Sistema",
    format: (_, d) => d.usuario?.nombreUsuario || "-",
  },
  {
    key: "credencial",
    header: "Código Credencial",
    format: (_, d) => d.credencial?.codigo || "-",
  },
  {
    key: "celular",
    header: "Celular",
    format: (_, d) => d.persona.celular || "-",
  },
  {
    key: "correo",
    header: "Correo",
    format: (_, d) => d.persona.correo || "-",
  },
];
