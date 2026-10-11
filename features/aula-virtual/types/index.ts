export type TipoMaterial =
  "documento" | "presentacion" | "hoja_calculo" | "imagen" | "audio" | "video" | "enlace";

export type PlazoMaterial = "pendiente" | "a_tiempo" | "fuera_de_plazo" | "no_publicado";
export type EstadoSolicitudFecha = "solicitada" | "aprobada" | "rechazada";

export interface CursoAula {
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  docenteNombre: string | null;
}

export interface CambioFecha {
  id: string;
  fechaAnterior: string;
  fechaSolicitada: string;
  motivo: string;
  estado: EstadoSolicitudFecha;
  solicitadoEn: string;
  resueltoEn: string | null;
  respuesta: string | null;
}

export interface Material {
  id: string;
  unidadId: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoMaterial;
  url: string | null;
  archivoNombre: string | null;
  esPlanificado: boolean;
  esExtra: boolean;
  visible: boolean;
  vigente: boolean;
  fechaProgramada: string | null;
  fechaCongelada: boolean;
  publicadoEn: string | null;
  plazo: PlazoMaterial | null;
  horarioId: string | null;
  sesionClase: { id: string; fecha: string; tema: string | null } | null;
  solicitudAbierta: boolean;
  cambiosDeFecha: CambioFecha[];
}

export interface Unidad {
  id: string;
  periodoId: string | null;
  titulo: string;
  descripcion: string | null;
  orden: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  publicada: boolean;
  materiales: Material[];
}

export interface BloqueCurso {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

export interface AulaVirtual {
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  puedeAdministrar: boolean;
  diasPlanificacion: number;
  tamanoMaximoMb: number;
  bloques: BloqueCurso[];
  unidades: Unidad[];
}

export interface MutacionMaterial {
  mensaje: string;
  material: Material;
}

export interface SolicitudCambio {
  id: string;
  materialId: string;
  materialTitulo: string;
  cursoNombre: string;
  seccionNombre: string;
  docenteNombre: string;
  fechaAnterior: string;
  fechaSolicitada: string;
  motivo: string;
  estado: EstadoSolicitudFecha;
  solicitadoEn: string;
  resueltoEn: string | null;
  respuesta: string | null;
}

export interface FilaSeguimiento {
  docenteId: string;
  docenteNombre: string;
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  planificados: number;
  aTiempo: number;
  fueraDePlazo: number;
  noPublicados: number;
  porcentajeATiempo: number;
  solicitudesPendientes: number;
}

export interface Seguimiento {
  periodoId: string;
  periodoNombre: string;
  filas: FilaSeguimiento[];
  totales: Omit<
    FilaSeguimiento,
    "docenteId" | "docenteNombre" | "cursoSeccionId" | "cursoNombre" | "seccionNombre"
  >;
}

export interface NuevaUnidad {
  titulo: string;
  descripcion?: string;
  periodoId: string;
  fechaInicio: string;
  fechaFin: string;
  publicada: boolean;
}

export interface PlanificarMaterial {
  titulo: string;
  descripcion?: string;
  tipo: TipoMaterial;
  horarioId?: string;
  fechaClase?: string;
  fechaProgramada?: string;
}

export interface ContenidoMaterial {
  enlace?: string;
  archivo?: File | null;
}

export interface MaterialExtra extends ContenidoMaterial {
  titulo: string;
  descripcion?: string;
  tipo: TipoMaterial;
}
