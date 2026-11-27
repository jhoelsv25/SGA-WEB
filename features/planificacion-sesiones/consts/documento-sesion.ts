/**
 * Estructura del documento de la sesión con el modelo estándar del colegio (RF-024, HU4):
 * títulos, tablas, columnas, anchos (en % del ancho útil de la hoja) y orden.
 *
 * Es copia fiel de `SGA-API/src/features/planificacion-sesiones/constants/sesion-documento.constants.ts`,
 * que usan el Word y el PDF exportados. La hoja del editor se dibuja con esta definición para que
 * lo que el docente ve sea lo que descarga: si cambia una, cambie la otra.
 */
export const DOCUMENTO_SESION = {
  borrador: "BORRADOR",
  vacio: "—",
  encabezado: "SESIÓN DE APRENDIZAJE N.º",
  datosInformativos: {
    titulo: "I. DATOS INFORMATIVOS",
    anchos: [30, 70],
    filas: {
      institucion: "INSTITUCIÓN EDUCATIVA",
      director: "DIRECTOR (A)",
      docente: "DOCENTE",
      gradoSeccion: "GRADO / SECCIÓN",
      area: "ÁREA CURRICULAR",
      fecha: "FECHA",
      unidad: "UNIDAD",
    },
  },
  acerca: "II. ACERCA DE LA SESIÓN DE APRENDIZAJE",
  propositos: {
    titulo: "2.1. PROPÓSITOS DE APRENDIZAJE",
    etiquetaProposito: "Propósito: ",
    anchos: [20, 22, 38, 20],
    columnas: ["Competencia", "Capacidades", "Desempeños precisados", "Campo temático"],
  },
  evaluacion: {
    titulo: "2.2. EVALUACIÓN DE LOS APRENDIZAJES",
    anchos: [26, 48, 26],
    columnas: ["Evidencia", "Criterios", "Instrumento"],
  },
  transversales: {
    titulo: "2.3. COMPETENCIAS TRANSVERSALES",
    anchos: [34, 33, 33],
    columnas: ["Competencia transversal", "Capacidades", "Desempeño precisado"],
  },
  enfoques: {
    titulo: "2.4. ENFOQUES TRANSVERSALES",
    anchos: [26, 24, 50],
    columnas: ["Enfoque transversal", "Valores", "Acciones observables"],
  },
  secuencia: "III. SECUENCIA DIDÁCTICA",
  materiales: {
    titulo: "3.1. MEDIACIÓN Y MATERIALES",
    anchos: [34, 33, 33],
    columnas: ["Materiales impresos", "Materiales manipulativos", "Materiales digitales"],
  },
  momentos: {
    titulo: "3.2. MOMENTOS DIDÁCTICOS",
    anchos: [16, 70, 14],
    columnas: ["MOMENTO", "ACTIVIDADES ESTRATÉGICAS", "TIEMPO"],
    orden: ["inicio", "desarrollo", "cierre"],
    nombres: { inicio: "INICIO", desarrollo: "DESARROLLO", cierre: "CIERRE" },
  },
  referencias: "IV. REFERENCIAS BIBLIOGRÁFICAS",
  firmas: { linea: "__________________________", roles: ["DOCENTE", "SUBDIRECCIÓN"] },
} as const;

/** Fecha ISO (yyyy-mm-dd…) como dd/mm/aaaa, igual en el Word, el PDF y la hoja de la web. */
export const fechaDocumento = (iso: string) => iso.slice(0, 10).split("-").reverse().join("/");

/** Medidas del Word exportado: A4 con márgenes de 1000 twips (≈17,6 mm), Arial 10 pt. */
export const HOJA_A4 = {
  ancho: "210mm",
  alto: "297mm",
  margen: "17.6mm",
  fuente: "Arial, Helvetica, sans-serif",
} as const;
