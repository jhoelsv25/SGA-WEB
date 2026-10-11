import type { EstadoSolicitudFecha, PlazoMaterial, TipoMaterial } from "../types";

export const MENU_AULA_VIRTUAL = "/admin/aula-virtual";
export const MENU_SOLICITUDES_CAMBIO_FECHA = "/admin/solicitudes-cambio-fecha";
export const MENU_MATERIALES_BIMESTRE = "/admin/materiales-bimestre";

export const TIPOS_MATERIAL: {
  value: TipoMaterial;
  label: string;
  accept: string;
  formatos: string;
}[] = [
  { value: "documento", label: "Documento", accept: ".pdf,.doc,.docx", formatos: "PDF, Word" },
  {
    value: "presentacion",
    label: "Presentación",
    accept: ".ppt,.pptx,.pdf",
    formatos: "PowerPoint, PDF",
  },
  { value: "hoja_calculo", label: "Hoja de cálculo", accept: ".xls,.xlsx", formatos: "Excel" },
  { value: "imagen", label: "Imagen", accept: ".png,.jpg,.jpeg", formatos: "PNG, JPG" },
  { value: "audio", label: "Audio", accept: ".mp3", formatos: "MP3" },
  { value: "video", label: "Video", accept: ".mp4", formatos: "MP4" },
  { value: "enlace", label: "Enlace", accept: "", formatos: "YouTube, Google Drive u otra página" },
];

export const PLAZO_CONFIG: Record<
  PlazoMaterial,
  { label: string; tone: "success" | "warning" | "danger" | "neutral" }
> = {
  pendiente: { label: "Pendiente", tone: "neutral" },
  a_tiempo: { label: "A tiempo", tone: "success" },
  fuera_de_plazo: { label: "Fuera de plazo", tone: "warning" },
  no_publicado: { label: "No publicado", tone: "danger" },
};

export const SOLICITUD_CONFIG: Record<
  EstadoSolicitudFecha,
  { label: string; tone: "warning" | "success" | "danger" }
> = {
  solicitada: { label: "Pendiente", tone: "warning" },
  aprobada: { label: "Aprobada", tone: "success" },
  rechazada: { label: "Rechazada", tone: "danger" },
};

export const DIAS_SEMANA: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

export function esTipoEnlace(tipo: TipoMaterial): boolean {
  return tipo === "enlace";
}
