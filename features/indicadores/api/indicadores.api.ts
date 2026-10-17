import { apiClient } from "@/lib/api-client";
import type {
  CerrarMedicionDto,
  ComparacionBimestreResponseDto,
  ExportarIndicadoresQueryDto,
  FiltroIndicadoresQueryDto,
  HistorialMedicionResponseDto,
  Indicador,
  MedicionBimestreResponseDto,
  MensajeIndicadoresResponseDto,
  MisIndicadoresDocenteResponseDto,
  NuevaVersionMedicionDto,
  PanelGeneralResponseDto,
  PretestResponseDto,
  RegistrarPretestDto,
  TableroIndicadoresResponseDto,
} from "../types";

const RUTA_BASE = "/indicadores";

// ============================================================================
// 1. Tablero General (Director, Subdirector, Administrador)
// ============================================================================

export async function obtenerTablero(
  query?: FiltroIndicadoresQueryDto,
): Promise<TableroIndicadoresResponseDto> {
  const { data } = await apiClient.get<TableroIndicadoresResponseDto>(`${RUTA_BASE}/tablero`, {
    params: query,
  });
  return data;
}

// ============================================================================
// 2. Mis Indicadores (Docente con alcance propio)
// ============================================================================

export async function obtenerMisIndicadores(
  periodoId?: string,
): Promise<MisIndicadoresDocenteResponseDto> {
  const { data } = await apiClient.get<MisIndicadoresDocenteResponseDto>(
    `${RUTA_BASE}/mis-indicadores`,
    {
      params: periodoId ? { periodoId } : undefined,
    },
  );
  return data;
}

// ============================================================================
// 3. Pretest Manual (Director, Administrador)
// ============================================================================

export async function registrarPretest(
  dto: RegistrarPretestDto,
): Promise<MensajeIndicadoresResponseDto & { pretest: PretestResponseDto }> {
  const { data } = await apiClient.post<
    MensajeIndicadoresResponseDto & { pretest: PretestResponseDto }
  >(`${RUTA_BASE}/pretest`, dto);
  return data;
}

export async function listarPretests(): Promise<PretestResponseDto[]> {
  const { data } = await apiClient.get<PretestResponseDto[]>(`${RUTA_BASE}/pretest`);
  return data;
}

export async function obtenerPretestVigente(
  indicador: Indicador,
): Promise<PretestResponseDto | null> {
  const { data } = await apiClient.get<PretestResponseDto | null>(
    `${RUTA_BASE}/pretest/${indicador}/vigente`,
  );
  return data;
}

// ============================================================================
// 4. Mediciones Congeladas y Versionado (Director, Administrador)
// ============================================================================

export async function cerrarMedicion(
  dto: CerrarMedicionDto,
): Promise<MensajeIndicadoresResponseDto & { medicion: MedicionBimestreResponseDto }> {
  const { data } = await apiClient.post<
    MensajeIndicadoresResponseDto & { medicion: MedicionBimestreResponseDto }
  >(`${RUTA_BASE}/mediciones/cerrar`, dto);
  return data;
}

export async function crearNuevaVersionMedicion(
  id: string,
  dto: NuevaVersionMedicionDto,
): Promise<MensajeIndicadoresResponseDto & { medicion: MedicionBimestreResponseDto }> {
  const { data } = await apiClient.post<
    MensajeIndicadoresResponseDto & { medicion: MedicionBimestreResponseDto }
  >(`${RUTA_BASE}/mediciones/${id}/nueva-version`, dto);
  return data;
}

export async function obtenerMedicionPeriodo(
  periodoId: string,
): Promise<MedicionBimestreResponseDto | null> {
  const { data } = await apiClient.get<MedicionBimestreResponseDto | null>(
    `${RUTA_BASE}/mediciones/periodo/${periodoId}`,
  );
  return data;
}

export async function obtenerHistorialMediciones(
  periodoId: string,
): Promise<HistorialMedicionResponseDto> {
  const { data } = await apiClient.get<HistorialMedicionResponseDto>(
    `${RUTA_BASE}/mediciones/periodo/${periodoId}/historial`,
  );
  return data;
}

// ============================================================================
// 5. Comparación Pretest vs Postest (Director, Subdirector, Administrador)
// ============================================================================

export async function obtenerComparacion(
  periodoId: string,
): Promise<ComparacionBimestreResponseDto> {
  const { data } = await apiClient.get<ComparacionBimestreResponseDto>(
    `${RUTA_BASE}/comparacion/periodo/${periodoId}`,
  );
  return data;
}

// ============================================================================
// 6. Panel General de Apoyo Directivo (Director, Subdirector, Administrador)
// ============================================================================

export async function obtenerPanel(): Promise<PanelGeneralResponseDto> {
  const { data } = await apiClient.get<PanelGeneralResponseDto>(`${RUTA_BASE}/panel`);
  return data;
}

// ============================================================================
// 7. Exportación Oficial (Excel y PDF)
// ============================================================================

export async function exportarExcel(query?: ExportarIndicadoresQueryDto): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(`${RUTA_BASE}/exportar/excel`, {
    params: query,
    responseType: "blob",
  });
  return data;
}

export async function exportarPdf(query?: ExportarIndicadoresQueryDto): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(`${RUTA_BASE}/exportar/pdf`, {
    params: query,
    responseType: "blob",
  });
  return data;
}

/**
 * Descarga directamente en el navegador el archivo Excel de datos crudos.
 */
export async function descargarExcelIndicadores(
  query?: ExportarIndicadoresQueryDto,
  nombreArchivo = "reporte-indicadores.xlsx",
): Promise<void> {
  const blob = await exportarExcel(query);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Descarga directamente en el navegador el informe formal en PDF.
 */
export async function descargarPdfIndicadores(
  query?: ExportarIndicadoresQueryDto,
  nombreArchivo = "informe-indicadores-tesis.pdf",
): Promise<void> {
  const blob = await exportarPdf(query);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Genera una URL de blob para previsualizar el PDF oficial en un visor o modal.
 */
export async function obtenerPdfIndicadoresBlobUrl(
  query?: ExportarIndicadoresQueryDto,
): Promise<string> {
  const blob = await exportarPdf(query);
  return window.URL.createObjectURL(blob);
}
