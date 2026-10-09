/**
 * Tipos del dominio del módulo Kiosko de Marcación.
 *
 * Cubre el contrato de datos para resolución de códigos, registro de eventos de asistencia,
 * estados de respuesta del terminal y metadatos de turnos.
 */

export type TipoMarcacion = "entrada" | "salida";

export type EstadoMarcacion = "a_tiempo" | "tardanza" | "fuera_de_horario" | "ya_marco";

export type RolPersona = "estudiante" | "docente" | "administrativo" | "personal";

export interface PersonaMarcacion {
  id?: string;
  nombre: string;
  rol: RolPersona | string;
  documento?: string;
  codigo?: string;
  genero?: "MALE" | "FEMALE" | string;
  requierePin?: boolean;
  fotoUrl?: string;
}

export interface ResultadoResolucion {
  persona: PersonaMarcacion;
  tipoSugerido: TipoMarcacion;
  yaMarcoHoy?: boolean;
  requierePin: boolean;
}

export interface DatosRegistroMarcacion {
  codigo: string;
  pin?: string;
  tipo: TipoMarcacion;
  equipoId?: string;
  notas?: string;
  idLocal?: string;
}

export interface MarcacionPendiente {
  idLocal: string;
  codigo: string;
  tipo: TipoMarcacion;
  marcadoEnDispositivo: string;
  intentos: number;
  ultimoError?: string;
  equipoId?: string;
}

export interface EstadoColaMarcaciones {
  totalPendientes: number;
  enviando: boolean;
  disponible: boolean;
  ultimoError?: string;
}

export interface ResultadoMarcacion {
  persona: PersonaMarcacion;
  tipo: TipoMarcacion;
  estado: EstadoMarcacion;
  hora: string;
  mensaje?: string;
}

export interface TurnoInfo {
  nombre: string;
  horario: string;
  tipoSugerido: TipoMarcacion;
}

export type PantallaKioskoEstado = "verificando" | "sin_conexion" | "no_autorizado" | "operativo";

export interface AvisoKiosko {
  tipo: "exito" | "error" | "info";
  titulo: string;
  mensaje: string;
  persona?: PersonaMarcacion;
  tipoMarcacion?: TipoMarcacion;
  estado?: EstadoMarcacion;
  hora?: string;
}
