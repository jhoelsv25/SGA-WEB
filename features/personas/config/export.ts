import type { ExportColumnDef } from "@/lib/export-data";
import { formatDate } from "@/lib/formatters/date";
import type { Persona } from "../types/personas.types";

export const personaExportColumns: ExportColumnDef<Persona>[] = [
  {
    key: "documento",
    header: "Documento",
    format: (_, p) => `${p.tipoDocumento.toUpperCase()}: ${p.numeroDocumento}`,
  },
  {
    key: "nombreCompleto",
    header: "Apellidos y Nombres",
  },
  {
    key: "sexo",
    header: "Sexo",
  },
  {
    key: "esProvisional",
    header: "Condición Padrón",
    format: (val) => (val ? "Provisional (Sin fichas)" : "Activo en comunidad"),
  },
  {
    key: "fichas",
    header: "Fichas / Roles",
    format: (_, p) => {
      const active: string[] = [];
      if (p.fichas.esDocente) active.push("Docente");
      if (p.fichas.esEstudiante) active.push("Estudiante");
      if (p.fichas.esApoderado) active.push("Apoderado");
      if (p.fichas.tieneUsuario) active.push("Usuario");
      return active.length > 0 ? active.join(", ") : "Ninguna";
    },
  },
  {
    key: "cargoVigente",
    header: "Cargo Vigente",
    format: (val) => String(val || "-"),
  },
  {
    key: "celular",
    header: "Celular",
    format: (val) => String(val || "-"),
  },
  {
    key: "correo",
    header: "Correo",
    format: (val) => String(val || "-"),
  },
  {
    key: "creadoEn",
    header: "Registrado",
    format: (val) => (val ? formatDate(String(val), "dd/MM/yyyy") : "-"),
  },
];
