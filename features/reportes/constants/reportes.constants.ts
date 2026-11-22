import type { SelectOptionItem } from "@/components/common/select";
import type { DefinicionCategoriaReporte } from "../types";

export const CATEGORIAS_REPORTES: readonly DefinicionCategoriaReporte[] = [
  {
    id: "academico",
    label: "Académico y Matrícula",
    descripcion: "Matrículas, libretas, notas y horarios",
    grupo: "gestion",
  },
  {
    id: "asistencia",
    label: "Asistencia y Marcaciones",
    descripcion: "Consolidado por grado/sección y puerta",
    grupo: "gestion",
  },
  {
    id: "indicadores",
    label: "Indicadores y Seguimiento",
    descripcion: "CSP, ISA, IGM, observaciones y horas",
    grupo: "gestion",
  },
  {
    id: "padrones",
    label: "Padrones y Carnés",
    descripcion: "Padrones Excel y carnés PDF oficiales",
    grupo: "institucional",
  },
];

export const OPCIONES_ESTADO_MATRICULA: SelectOptionItem<string>[] = [
  { value: "all", label: "Todos los estados" },
  { value: "matriculado", label: "Solo matriculados activos" },
  { value: "culminado", label: "Culminados" },
  { value: "retirado", label: "Retirados" },
  { value: "trasladado", label: "Trasladados" },
];

export const OPCIONES_TIPO_PERSONA: SelectOptionItem<string>[] = [
  { value: "all", label: "Todos", description: "Estudiantes, docentes y administrativos" },
  { value: "estudiantes", label: "Solo estudiantes", description: "Control escolar" },
  { value: "docentes", label: "Solo docentes", description: "Plana docente" },
  {
    value: "administrativos",
    label: "Solo administrativos",
    description: "Personal administrativo",
  },
];

export const OPCIONES_TIPO_PERSONAL: SelectOptionItem<string>[] = [
  { value: "all", label: "Todo el personal", description: "Docentes y administrativos" },
  { value: "docentes", label: "Solo docentes", description: "Plana docente" },
  {
    value: "administrativos",
    label: "Solo administrativos",
    description: "Personal administrativo",
  },
];

export const MESES_ANIO: SelectOptionItem<string>[] = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];
