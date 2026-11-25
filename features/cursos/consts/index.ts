import { AreaCurricular } from "../types";

export const AREAS_CURRICULARES: AreaCurricular[] = [
  "matematica",
  "comunicacion",
  "quechua",
  "ingles",
  "arte_cultura",
  "ciencias_sociales",
  "dpcc",
  "educacion_fisica",
  "educacion_religiosa",
  "ciencia_tecnologia",
  "ept",
  "taller",
  "tutoria",
];

export const AREA_CURRICULAR_LABELS: Record<AreaCurricular, string> = {
  matematica: "Matemática",
  comunicacion: "Comunicación",
  quechua: "Quechua (Lengua Originaria)",
  ingles: "Inglés",
  arte_cultura: "Arte y Cultura",
  ciencias_sociales: "Ciencias Sociales",
  dpcc: "Desarrollo Personal, Ciudadanía y Cívica",
  educacion_fisica: "Educación Física",
  educacion_religiosa: "Educación Religiosa",
  ciencia_tecnologia: "Ciencia y Tecnología",
  ept: "Educación para el Trabajo (EPT)",
  taller: "Taller",
  tutoria: "Tutoría",
};

export const AREA_CURRICULAR_OPTIONS = AREAS_CURRICULARES.map((area) => ({
  value: area,
  label: AREA_CURRICULAR_LABELS[area],
}));

export const COLOR_PRESETS = [
  { hex: "#2563EB", label: "Azul Real" },
  { hex: "#DC2626", label: "Rojo Carmesí" },
  { hex: "#7C3AED", label: "Púrpura" },
  { hex: "#DB2777", label: "Rosa Vibrante" },
  { hex: "#D97706", label: "Ámbar Cálido" },
  { hex: "#059669", label: "Verde Esmeralda" },
  { hex: "#EA580C", label: "Naranja Fuego" },
  { hex: "#4F46E5", label: "Índigo Profundo" },
  { hex: "#0D9488", label: "Teal Océano" },
  { hex: "#CA8A04", label: "Dorado Oliva" },
  { hex: "#0284C7", label: "Cian Cielo" },
  { hex: "#64748B", label: "Gris Pizarra" },
];
