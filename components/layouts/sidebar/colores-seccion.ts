/**
 * Color de los iconos del menú, uno por sección para reconocerlas de un vistazo.
 * En oscuro se usa un tono más claro del mismo color para que se lea sobre el fondo.
 */
const COLOR_POR_SECCION: Record<string, string> = {
  "Mi espacio": "text-primary dark:text-rose-400",
  "Estructura académica": "text-blue-600 dark:text-blue-400",
  "Comunidad y matrícula": "text-emerald-700 dark:text-emerald-400",
  Asistencia: "text-amber-700 dark:text-amber-400",
  "Seguimiento docente": "text-violet-600 dark:text-violet-400",
  "Evaluación y convivencia": "text-rose-600 dark:text-rose-400",
  "Reportes e indicadores": "text-cyan-700 dark:text-cyan-400",
  "Aula virtual": "text-indigo-600 dark:text-indigo-400",
  Comunicación: "text-orange-700 dark:text-orange-400",
  "Seguridad y accesos": "text-teal-700 dark:text-teal-400",
  "Configuración del sistema": "text-slate-600 dark:text-slate-400",
};

/** Para las secciones de los demás roles, que no están en la lista anterior. */
const COLORES_DE_RESERVA = [
  "text-blue-600 dark:text-blue-400",
  "text-emerald-700 dark:text-emerald-400",
  "text-amber-700 dark:text-amber-400",
  "text-violet-600 dark:text-violet-400",
  "text-cyan-700 dark:text-cyan-400",
];

/** La opción sin sección (Inicio) usa el color primario de la institución. */
export function colorDeSeccion(titulo: string | undefined, indice: number): string {
  if (!titulo) return "text-primary dark:text-rose-400";
  return COLOR_POR_SECCION[titulo] ?? COLORES_DE_RESERVA[indice % COLORES_DE_RESERVA.length];
}
