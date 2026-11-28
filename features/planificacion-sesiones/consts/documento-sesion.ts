/**
 * Estructura del documento de la sesión (RF-024 V2, HU4): títulos, tablas, columnas, anchos
 * (en % del ancho útil de la hoja) y orden.
 *
 * Es copia fiel de `SGA-API/src/features/planificacion-sesiones/constants/sesion-documento.constants.ts`,
 * que usan el Word y el PDF exportados. La hoja del editor se dibuja con esta definición para que
 * lo que el docente ve sea lo que descarga: si cambia una, cambie la otra.
 */
export const DOCUMENTO_SESION = {
  borrador: "BORRADOR",
  vacio: "—",
  encabezado: "SESIÓN DE APRENDIZAJE N° -",
  datosInformativos: {
    titulo: "I. DATOS INFORMATIVOS:",
    anchos: [20, 31, 20, 29],
    filas: {
      docente: "Docente:",
      area: "Área:",
      coordinador: "Coordinador(a):",
      bimestre: "Bimestre/Unidad:",
      nivelGrado: "Nivel/Grado:",
      fecha: "Fecha:",
      secciones: "Sección (es):",
      duracion: "Duración:",
    },
  },
  tituloSesion: { titulo: "II. TÍTULO DE LA SESIÓN DE APRENDIZAJE:", anchos: [35, 65] },
  propositos: {
    titulo: "III. PROPÓSITO DE APRENDIZAJE:",
    anchos: [20, 23, 37, 20],
    columnas: ["COMPETENCIAS", "CAPACIDADES", "DESEMPEÑOS PRECISADOS", "CAMPOS TEMÁTICOS"],
  },
  enfoques: {
    titulo: "IV. ENFOQUE TRANSVERSAL:",
    anchos: [28, 24, 48],
    columnas: ["ENFOQUES TRANSVERSALES", "VALORES", "ACTIVIDAD QUE DESARROLLA"],
  },
  transversales: {
    titulo: "V. COMPETENCIA TRANSVERSAL:",
    anchos: [32, 24, 44],
    columnas: ["COMPETENCIA TRANSVERSAL", "CAPACIDAD", "ACTIVIDAD QUE DESARROLLA"],
  },
  momentos: {
    titulo: "VI. SECUENCIA DIDÁCTICA:",
    anchos: [16, 72, 12],
    columnas: ["MOMENTOS", "ACCIONES Y ESTRATEGIAS PEDAGÓGICAS", "TIEMPO"],
    orden: ["inicio", "desarrollo", "cierre"],
    nombres: { inicio: "INICIO", desarrollo: "DESARROLLO", cierre: "CIERRE" },
    etiquetaProposito: "Propósito: ",
    mapaVisual: "MAPA VISUAL: Conceptos clave",
  },
  evaluacion: {
    titulo: "VII. EVALUACIÓN DE LOS APRENDIZAJES:",
    anchos: [36, 22, 24, 18],
    columnas: ["CRITERIOS DE EVALUACIÓN", "EVIDENCIAS", "PRODUCTO", "INSTRUMENTO"],
  },
  acuerdos: { titulo: "VIII. ACUERDOS DE CONVIVENCIA:", anchos: [100] },
  materiales: {
    titulo: "IX. MATERIALES Y RECURSOS EDUCATIVOS:",
    anchos: [50, 50],
    columnas: [
      "MATERIALES EDUCATIVOS Y/O RECURSOS EDUCATIVOS DEL MINEDU",
      "ESPACIOS DE INTERACCIÓN CON SABIOS, FAMILIAS Y COMUNIDAD",
    ],
  },
  firmas: {
    linea: "__________________________",
    roles: ["Docente de Aula", "Coordinador(a)"],
  },
  listaCotejo: {
    titulo: "INSTRUMENTO DE EVALUACIÓN — Lista de cotejo",
    anexo: "ANEXO",
    anchos: [18, 37, 18, 27],
    filas: {
      institucion: "Institución Educativa:",
      area: "Área:",
      docente: "Docente:",
      nivelGrado: "Nivel y grado:",
      fecha: "Fecha:",
      numero: "Sesión N°:",
      seccion: "Sección:",
      producto: "Producto/Evidencia a evaluar:",
    },
    instrucciones:
      "Instrucciones: Marque con una X si el estudiante cumple el indicador (SÍ) o no lo cumple (NO). La lista de cotejo solo constata presencia o ausencia, sin puntos intermedios.",
    columnas: ["N°", "Apellidos y Nombres"],
    anchoNumero: 5,
    anchoNombre: 31,
  },
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
