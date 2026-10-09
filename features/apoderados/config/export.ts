import type { ExportColumnDef } from "@/lib/export-data";
import type { Apoderado } from "../types/apoderados.types";

export const apoderadoExportColumns: ExportColumnDef<Apoderado>[] = [
  {
    key: "documento",
    header: "Documento",
    format: (_, a) => `${a.persona.tipoDocumento.toUpperCase()}: ${a.persona.numeroDocumento}`,
  },
  {
    key: "apellidosNombres",
    header: "Apellidos y Nombres",
    format: (_, a) => a.persona.nombreCompleto,
  },
  {
    key: "celular",
    header: "Celular",
    format: (_, a) => a.persona.celular || "-",
  },
  {
    key: "correo",
    header: "Correo",
    format: (_, a) => a.persona.correo || "-",
  },
  {
    key: "ocupacion",
    header: "Ocupación",
    format: (_, a) => a.ocupacion || "-",
  },
  {
    key: "centroLaboral",
    header: "Centro Laboral",
    format: (_, a) => a.centroLaboral || "-",
  },
  {
    key: "telefonoLaboral",
    header: "Teléfono Laboral",
    format: (_, a) => a.telefonoLaboral || "-",
  },
  {
    key: "gradoInstruccion",
    header: "Grado Instrucción",
    format: (_, a) => a.gradoInstruccion || "-",
  },
  {
    key: "estudiantes",
    header: "Estudiantes a Cargo",
    format: (_, a) =>
      a.estudiantes && a.estudiantes.length > 0
        ? a.estudiantes
            .map(
              (e) => `${e.nombreCompleto} (${e.parentesco}${e.esPrincipal ? ", Principal" : ""})`,
            )
            .join(" | ")
        : "Ninguno",
  },
];
