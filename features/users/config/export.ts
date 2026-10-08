import type { ExportColumnDef } from "@/lib/export-data";
import type { UserItem } from "../types/users.types";
import { formatDate } from "@/lib/formatters/date";

export const userExportColumns: ExportColumnDef<UserItem>[] = [
  {
    key: "nombreUsuario",
    header: "Nombre de Usuario",
  },
  {
    key: "persona",
    header: "Persona",
    format: (_, user) =>
      `${user.persona.apellidoPaterno} ${user.persona.apellidoMaterno ?? ""}, ${user.persona.nombres}`.trim(),
  },
  {
    key: "documento",
    header: "Documento",
    format: (_, user) =>
      `${user.persona.tipoDocumento.toUpperCase()}: ${user.persona.numeroDocumento}`,
  },
  {
    key: "rol",
    header: "Rol",
    format: (_, user) => user.rol.nombre,
  },
  {
    key: "estado",
    header: "Estado",
    format: (val) => String(val).toUpperCase(),
  },
  {
    key: "correo",
    header: "Correo",
    format: (_, user) => user.persona.correo || "No registrado",
  },
  {
    key: "ultimoAcceso",
    header: "Último Acceso",
    format: (val) => (val ? formatDate(String(val), "dd/MM/yyyy HH:mm") : "Nunca"),
  },
  {
    key: "creadoEn",
    header: "Fecha de Creación",
    format: (val) => (val ? formatDate(String(val), "dd/MM/yyyy") : ""),
  },
];
