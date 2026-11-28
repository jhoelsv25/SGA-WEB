/**
 * Aviso informativo que se muestra como modal al abrir la portada.
 * Para publicarlo o retirarlo, cambia `activo`. Si cambias el `id`,
 * el modal vuelve a mostrarse a quienes ya lo habían cerrado.
 */
export const AVISO_PORTAL = {
  activo: true,
  id: "cierre-clases",
  etiqueta: "Aviso importante",
  titulo: "Cierre del año escolar",
  mensaje:
    "Se acerca el cierre de las clases. Antes de que termine el año, te invitamos a revisar tu información en la intranet y a resolver cualquier pendiente con tiempo.",
  subtitulo: "Te recomendamos revisar:",
  puntos: [
    "Tus libretas oficiales del SIAGIE, disponibles en PDF para descargar.",
    "Tu asistencia y tardanzas, para presentar a tiempo las justificaciones.",
    "Los comunicados de Dirección y Tutoría sobre el cierre del año.",
    "Los materiales y tareas pendientes del aula virtual.",
  ],
  nota: "Si tienes dudas con tu usuario o contraseña, comunícate con el colegio en el horario de atención.",
  /** Ruta de una imagen en /public (ej. "/assets/portada/aviso.jpg"). Si es null se muestra el logo. */
  imagen: null as string | null,
  accion: { texto: "Ingresar a la intranet" },
} as const;
