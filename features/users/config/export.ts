import type { ExportColumnDef } from "@/lib/export-data";
import type { UserItem } from "../types/users.types";
import { formatDate } from "@/lib/formatters/date";
import { USER_STATUS_CONFIG } from "../consts/users.consts";

export const userExportColumns: ExportColumnDef<UserItem>[] = [
  {
    key: "nombreUsuario",
    header: "Nombre de usuario",
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
    format: (_, user) => USER_STATUS_CONFIG[user.estado]?.label ?? String(user.estado),
  },
  {
    key: "correo",
    header: "Correo",
    format: (_, user) => user.persona.correo || "No registrado",
  },
  {
    key: "ultimoAcceso",
    header: "Último acceso",
    format: (val) => (val ? formatDate(String(val), "dd/MM/yyyy HH:mm") : "Nunca"),
  },
  {
    key: "creadoEn",
    header: "Fecha de creación",
    format: (val) => (val ? formatDate(String(val), "dd/MM/yyyy") : ""),
  },
];
