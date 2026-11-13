"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Clock01Icon,
  Download01Icon,
  RefreshIcon,
  Book02Icon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { EmptyState } from "@/components/common/empty-state";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { miHorarioApi } from "./api/mi-horario.api";
import { TEXTOS_MI_HORARIO } from "./consts";
import { useMiHorarioActivo } from "./hooks";
import { calcularFranjasHorarias } from "./utils";
import { MiHorarioDia, MiHorarioGrid } from "./views";

export function MiHorarioPage() {
  const {
    rol,
    anioLectivo,
    bloques,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    misEstudiantes,
    estudianteSeleccionadoId,
    seleccionarEstudiante,
  } = useMiHorarioActivo();

  // Modo de visualización: "semana" (grilla completa) o "dia" (selector por día)
  const [modoVista, setModoVista] = React.useState<"semana" | "dia">("semana");
  const [exportandoPdf, setExportandoPdf] = React.useState(false);

  const handleExportarPdf = async () => {
    setExportandoPdf(true);
    try {
      const blob =
        rol === "docente"
          ? await miHorarioApi.descargarMiHorarioDocentePdf()
          : await miHorarioApi.descargarHorarioEstudiantePdf(estudianteSeleccionadoId ?? "");
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = rol === "docente" ? "mi-horario-docente.pdf" : "mi-horario.pdf";
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("No se pudo generar el PDF del horario.");
    } finally {
      setExportandoPdf(false);
    }
  };

  const franjas = React.useMemo(() => {
    return calcularFranjasHorarias(bloques);
  }, [bloques]);

  const totalClases = React.useMemo(() => {
    return bloques.filter((b) => b.tipoBloque === "clase").length;
  }, [bloques]);

  const descripcionCabecera = React.useMemo(() => {
    if (rol === "docente") return TEXTOS_MI_HORARIO.DESCRIPCION_DOCENTE;
    if (rol === "estudiante") return TEXTOS_MI_HORARIO.DESCRIPCION_ESTUDIANTE;
    if (rol === "apoderado") return TEXTOS_MI_HORARIO.DESCRIPCION_APODERADO;
    return "Horario escolar semanal de clases y recesos.";
  }, [rol]);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title={TEXTOS_MI_HORARIO.TITULO_PAGINA}
        description={
          anioLectivo
            ? `${descripcionCabecera} Año académico ${anioLectivo.anio}.`
            : descripcionCabecera
        }
        icon={Calendar03Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mi horario" }]}
        actions={
          rol === "docente" || rol === "estudiante" || rol === "apoderado" ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportarPdf}
                disabled={
                  exportandoPdf ||
                  isLoading ||
                  bloques.length === 0 ||
                  (rol !== "docente" && !estudianteSeleccionadoId)
                }
                aria-label="Exportar horario en PDF"
                className="h-10 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
              >
                {exportandoPdf ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <HugeiconsIcon icon={Download01Icon} className="size-3.5" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">Exportar PDF</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching || isLoading}
                aria-label="Actualizar horario"
                className="h-10 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
              >
                <HugeiconsIcon
                  icon={RefreshIcon}
                  className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
            </div>
          ) : null
        }
      />

      {/* Manejo de roles incompatibles o pendientes */}
      {rol === "otro" && (
        <EmptyState
          title={TEXTOS_MI_HORARIO.ROL_SIN_HORARIO_TITULO}
          description={TEXTOS_MI_HORARIO.ROL_SIN_HORARIO_DESCRIPCION}
          icon={Calendar03Icon}
        />
      )}

      {rol === "apoderado" && !isLoading && misEstudiantes.length === 0 && (
        <EmptyState
          title={TEXTOS_MI_HORARIO.APODERADO_SIN_LISTADO_TITULO}
          description={TEXTOS_MI_HORARIO.APODERADO_SIN_LISTADO_DESCRIPCION}
          icon={Calendar03Icon}
        />
      )}

      {/* Vista principal para Docente, Estudiante o Apoderado */}
      {(rol === "docente" ||
        rol === "estudiante" ||
        (rol === "apoderado" && misEstudiantes.length > 0)) && (
        <PageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          errorTitle="No se pudo cargar el horario"
          isEmpty={bloques.length === 0}
          empty={{
            title: TEXTOS_MI_HORARIO.SIN_HORARIO_TITULO,
            description: TEXTOS_MI_HORARIO.SIN_HORARIO_DESCRIPCION,
            icon: Calendar03Icon,
          }}
        >
          {rol === "apoderado" && misEstudiantes.length > 1 && (
            <div className="border-border/60 bg-card/60 mb-4 flex items-center gap-3 rounded-2xl border p-3 shadow-xs">
              <span className="text-muted-foreground text-xs font-semibold">
                {TEXTOS_MI_HORARIO.SELECTOR_ESTUDIANTE_LABEL}
              </span>
              <Select value={estudianteSeleccionadoId} onValueChange={seleccionarEstudiante}>
                <SelectTrigger className="h-9 w-auto min-w-48 text-sm">
                  <SelectValue placeholder="Selecciona un estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {misEstudiantes.map((estudiante) => (
                    <SelectItem key={estudiante.estudianteId} value={estudiante.estudianteId}>
                      {estudiante.nombreCompleto}
                      {estudiante.seccionNombre ? ` · ${estudiante.seccionNombre}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {bloques.length > 0 && (
            <div className="space-y-4">
              {/* Barra superior de métricas y selector de modo de vista */}
              <div className="border-border/60 bg-card/60 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-semibold">
                    <HugeiconsIcon icon={Book02Icon} className="size-3.5" aria-hidden="true" />
                    <span>
                      {totalClases} {totalClases === 1 ? "clase" : "clases"} asignadas
                    </span>
                  </Badge>

                  <Badge
                    variant="outline"
                    className="text-muted-foreground gap-1.5 px-3 py-1 font-mono"
                  >
                    <HugeiconsIcon icon={Clock01Icon} className="size-3.5" aria-hidden="true" />
                    <span>Lunes a Viernes</span>
                  </Badge>
                </div>

                {/* Alternador de vista: Semana vs Día */}
                <div
                  role="tablist"
                  aria-label="Modo de visualización"
                  className="bg-muted/60 inline-flex items-center rounded-xl p-1 text-xs"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={modoVista === "semana"}
                    onClick={() => setModoVista("semana")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
                      modoVista === "semana"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={DashboardSquare01Icon}
                      className="size-3.5"
                      aria-hidden="true"
                    />
                    <span>Semana</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={modoVista === "dia"}
                    onClick={() => setModoVista("dia")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
                      modoVista === "dia"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" aria-hidden="true" />
                    <span>Por día</span>
                  </button>
                </div>
              </div>

              {/* Renderizado condicional según modo de visualización y responsive */}
              {modoVista === "semana" ? (
                <>
                  {/* Grilla completa en pantallas medianas y grandes */}
                  <div className="hidden md:block">
                    <MiHorarioGrid bloques={bloques} franjas={franjas} />
                  </div>
                  {/* En pantallas móviles (360px), se renderiza la vista por día */}
                  <div className="block md:hidden">
                    <MiHorarioDia bloques={bloques} />
                  </div>
                </>
              ) : (
                <MiHorarioDia bloques={bloques} />
              )}
            </div>
          )}
        </PageState>
      )}
    </div>
  );
}
