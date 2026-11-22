import type { Seccion } from "@/features/secciones/types";

export function parsearFechaIso(iso: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function formatearFechaIso(fecha: Date | undefined): string {
  if (!fecha) return "";
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface SolicitudDescargaDirecta {
  url: string;
  params?: Record<string, string | undefined>;
  anioAcademicoId?: string;
  nombrePorDefecto: string;
}

export interface ContextoDescargaDirecta {
  reporteId: string;
  formato: "excel" | "pdf";
  anioId: string;
  periodoId: string;
  seccionId?: string;
  seccionObj: Seccion | null;
  cursoSeccionId?: string;
  desde: string;
  hasta: string;
  mesValor: string;
}

export function construirSolicitudDescargaDirecta(
  ctx: ContextoDescargaDirecta,
): SolicitudDescargaDirecta | null {
  const {
    reporteId,
    formato,
    anioId,
    periodoId,
    seccionId,
    seccionObj,
    cursoSeccionId,
    desde,
    hasta,
    mesValor,
  } = ctx;

  const sufijoSeccion = `${seccionObj?.gradoNumero ?? ""}g_${seccionObj?.nombre ?? "sec"}`;

  switch (reporteId) {
    case "libro-notas":
      if (!cursoSeccionId) return null;
      return {
        url: `/aula-virtual/cursos/${cursoSeccionId}/libro-notas/excel`,
        params: { periodoId: periodoId || undefined },
        anioAcademicoId: anioId,
        nombrePorDefecto: "sga_libro-notas.xlsx",
      };

    case "horario-seccion":
      if (!seccionId) return null;
      return {
        url: `/horarios/seccion/${seccionId}/pdf`,
        anioAcademicoId: anioId,
        nombrePorDefecto: `horario_${sufijoSeccion}.pdf`,
      };

    case "indicadores":
      return {
        url: formato === "pdf" ? "/indicadores/exportar/pdf" : "/indicadores/exportar/excel",
        params: {
          periodoId: periodoId || undefined,
          fechaInicio: desde || undefined,
          fechaFin: hasta || undefined,
          seccionId,
        },
        anioAcademicoId: anioId,
        nombrePorDefecto: formato === "pdf" ? "sga_indicadores.pdf" : "sga_indicadores.xlsx",
      };

    case "indicadores-apoyo":
      return {
        url: "/indicadores/apoyo/exportar/excel",
        params: { periodoId: periodoId || undefined },
        anioAcademicoId: anioId,
        nombrePorDefecto: "sga_indicadores-apoyo.xlsx",
      };

    case "observaciones-aula":
      return {
        url: "/observaciones-aula/reporte/matriz/excel",
        params: { periodoId: periodoId || undefined },
        anioAcademicoId: anioId,
        nombrePorDefecto: "sga_observaciones-aula.xlsx",
      };

    case "consolidado-docente":
      return {
        url: "/consolidado-docente/exportar/excel",
        params: { periodoId },
        anioAcademicoId: anioId,
        nombrePorDefecto: "sga_consolidado-docente.xlsx",
      };

    case "horas-efectivas":
      return {
        url: "/seguimiento-docente/informe-mensual/excel",
        params: { mes: mesValor },
        anioAcademicoId: anioId,
        nombrePorDefecto: `sga_informe-horas-efectivas_${mesValor}.xlsx`,
      };

    case "pendientes-seguimiento":
      return {
        url: "/seguimiento-docente/pendientes/exportar/excel",
        params: { periodoId: periodoId || undefined },
        anioAcademicoId: anioId,
        nombrePorDefecto: "sga_pendientes-seguimiento.xlsx",
      };

    case "carnes-seccion":
      if (!seccionId) return null;
      return {
        url: `/credenciales/secciones/${seccionId}/carnes/pdf`,
        anioAcademicoId: anioId,
        nombrePorDefecto: `carnes_${sufijoSeccion}.pdf`,
      };

    case "carnes-docentes":
      return {
        url: "/credenciales/docentes/carnes/pdf",
        anioAcademicoId: anioId,
        nombrePorDefecto: "carnes_docentes.pdf",
      };

    default:
      return null;
  }
}
