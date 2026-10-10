"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  Pdf01Icon,
  UserRemove01Icon,
  Exchange01Icon,
  Delete02Icon,
  AlertCircleIcon,
  SchoolIcon,
  FileCheckIcon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { LoadingScreen } from "@/components/common/loading-screen";
import { EmptyState } from "@/components/common/empty-state";
import { useDescargarConstancia, useMatriculaDetailQuery } from "@/features/matriculas/hooks";
import {
  ModalOperacionMatricula,
  type OperacionMatriculaTipo,
} from "@/features/matriculas/components";
import type { MatriculaItem } from "@/features/matriculas/types";

interface MatriculaDetalleViewProps {
  matriculaId: string;
}

const ESTADO_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  matriculado: {
    label: "Matriculado Regular",
    variant: "default",
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  retirado: {
    label: "Retirado del Colegio",
    variant: "destructive",
    color: "text-destructive bg-destructive/10 border-destructive/20",
  },
  trasladado: {
    label: "Trasladado a Otra I.E.",
    variant: "secondary",
    color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  },
  culminado: {
    label: "Culminado / Promovido",
    variant: "outline",
    color: "text-muted-foreground bg-muted border-border",
  },
};

const TIPO_CONFIG: Record<string, string> = {
  nuevo: "Nuevo Ingreso",
  continuador: "Estudiante Continuador",
  traslado: "Traslado Externo",
};

export function MatriculaDetalleView({ matriculaId }: MatriculaDetalleViewProps) {
  const router = useRouter();
  const { data: matricula, isLoading, isError } = useMatriculaDetailQuery(matriculaId);
  const descargarConstanciaMutation = useDescargarConstancia();

  const [operacionActiva, setOperacionActiva] = React.useState<{
    matricula: MatriculaItem | null;
    tipo: OperacionMatriculaTipo;
  }>({ matricula: null, tipo: null });

  if (isLoading) {
    return <LoadingScreen message="Cargando ficha oficial de matrícula..." />;
  }

  if (isError || !matricula) {
    return (
      <EmptyState
        title="Matrícula no encontrada"
        description="No se pudo localizar el registro de matrícula especificado o ha sido anulado."
        action={
          <Button variant="outline" onClick={() => router.push("/admin/enrollment")}>
            <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 size-4" />
            Volver a Matrículas
          </Button>
        }
      />
    );
  }

  const est = matricula.estudiante;
  const esMatriculado = matricula.estado === "matriculado";
  const estadoInfo = ESTADO_CONFIG[matricula.estado] || {
    label: matricula.estado,
    variant: "outline",
    color: "",
  };

  return (
    <div className="space-y-6">
      {/* Cabecera y Navegación */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title={`Expediente: ${matricula.codigo}`}
          description={`Ficha oficial de matrícula escolar — Año lectivo ${matricula.anioNumero}`}
          icon={FileCheckIcon}
          badge={
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${estadoInfo.color}`}
            >
              {estadoInfo.label}
            </span>
          }
          breadcrumbs={[
            { label: "Panel", href: "/admin" },
            { label: "Matrícula y Traslados", href: "/admin/enrollment" },
            { label: matricula.codigo },
          ]}
        />

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-10 gap-2 rounded-full px-4 text-xs"
            onClick={() => router.push("/admin/enrollment")}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Volver
          </Button>

          <Button
            size="sm"
            className="h-10 gap-2 rounded-full px-4 text-xs shadow-xs"
            onClick={() =>
              descargarConstanciaMutation.mutate({
                id: matricula.id,
                codigo: matricula.codigo,
              })
            }
            disabled={descargarConstanciaMutation.isPending}
          >
            <HugeiconsIcon icon={Pdf01Icon} className="size-4 text-rose-300" />
            Descargar Constancia PDF
          </Button>
        </div>
      </div>

      {/* Alerta de Retiro o Traslado si aplica */}
      {matricula.estado === "retirado" && (
        <div className="border-destructive/20 bg-destructive/5 text-destructive flex items-start gap-3 rounded-2xl border p-4 text-xs">
          <HugeiconsIcon icon={UserRemove01Icon} className="mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Estudiante Retirado Definitivamente</p>
            <p>
              Fecha efectiva: <strong>{matricula.fechaRetiro || "No registrada"}</strong>
              {matricula.motivoRetiro && ` — Motivo: "${matricula.motivoRetiro}"`}
            </p>
            <p className="text-muted-foreground text-[11px]">
              La cuenta de usuario institucional y la credencial de marcación escolar han sido
              revocadas según normativa.
            </p>
          </div>
        </div>
      )}

      {matricula.estado === "trasladado" && (
        <div className="flex items-start gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-xs text-purple-700 dark:text-purple-300">
          <HugeiconsIcon icon={Exchange01Icon} className="mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Estudiante Trasladado a Otra Institución</p>
            <p>
              Colegio de destino: <strong>{matricula.motivoRetiro || "Colegio externo"}</strong>
              {matricula.fechaRetiro && ` — Fecha de retiro: ${matricula.fechaRetiro}`}
            </p>
            <p className="text-muted-foreground text-[11px]">
              La vacante escolar fue liberada para reasignación en la sección correspondiente.
            </p>
          </div>
        </div>
      )}

      {/* Grilla Principal de Información */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna Izquierda: Datos del Estudiante (2 cols en lg) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tarjeta de Datos Escolares y Académicos */}
          <Card className="border-border/60 overflow-hidden rounded-2xl shadow-2xs">
            <CardHeader className="bg-muted/30 border-border/50 border-b px-5 py-3.5">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <HugeiconsIcon icon={SchoolIcon} className="text-primary size-4" />
                Asignación Escolar y Salón
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 p-5 text-xs sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Grado Escolar</span>
                <span className="text-foreground text-sm font-semibold">
                  {matricula.gradoNombre}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Sección Asignada</span>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-bold">
                    Sección {matricula.seccionNombre}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Año Académico</span>
                <span className="text-foreground font-medium">{matricula.anioNumero}</span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Modalidad / Tipo</span>
                <span className="text-foreground font-medium">
                  {TIPO_CONFIG[matricula.tipo] || matricula.tipo}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Condición Académica</span>
                {matricula.esRepitente ? (
                  <Badge variant="outline" className="border-amber-400 text-[11px] text-amber-600">
                    Repitente del grado
                  </Badge>
                ) : (
                  <span className="text-foreground font-medium">Regular (Promovido)</span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">
                  Fecha Oficial de Matrícula
                </span>
                <span className="text-foreground font-medium">{matricula.fechaMatricula}</span>
              </div>

              {matricula.colegioProcedencia && (
                <div className="border-border/40 space-y-1 border-t pt-2 sm:col-span-2">
                  <span className="text-muted-foreground block text-[11px]">
                    Colegio de Procedencia
                  </span>
                  <span className="text-foreground font-medium">
                    {matricula.colegioProcedencia}
                  </span>
                </div>
              )}

              {matricula.observaciones && (
                <div className="border-border/40 space-y-1 border-t pt-2 sm:col-span-2">
                  <span className="text-muted-foreground block text-[11px]">
                    Observaciones del Expediente
                  </span>
                  <p className="text-muted-foreground italic">{matricula.observaciones}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tarjeta de Ficha del Estudiante */}
          <Card className="border-border/60 overflow-hidden rounded-2xl shadow-2xs">
            <CardHeader className="bg-muted/30 border-border/50 border-b px-5 py-3.5">
              <CardTitle className="flex items-center justify-between text-sm font-semibold">
                <span>Información del Alumno</span>
                <Link
                  href={`/admin/estudiantes`}
                  className="text-primary text-xs font-medium hover:underline"
                >
                  Ver en Padrón de Estudiantes →
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 p-5 text-xs sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Apellidos y Nombres</span>
                <span className="text-foreground text-sm font-bold">
                  {est.apellidos}, {est.nombres}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">
                  Documento de Identidad
                </span>
                <span className="text-foreground font-mono font-medium">
                  {est.tipoDocumento || "DNI"}: {est.numeroDocumento}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">
                  Código SIAGIE / Matrícula
                </span>
                <span className="text-primary font-mono font-bold">
                  {est.codigo || "No asignado"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Estado en Padrón</span>
                <span className="text-foreground font-medium capitalize">
                  {est.estado || "Activo"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Acciones Administrativas y Control */}
        <div className="space-y-6">
          <Card className="border-border/60 rounded-2xl shadow-2xs">
            <CardHeader className="border-border/50 bg-muted/30 border-b px-5 py-3.5">
              <CardTitle className="text-sm font-semibold">Operaciones de Secretaría</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
              {esMatriculado ? (
                <>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Acciones reglamentarias disponibles para este estudiante matriculado:
                  </p>

                  <Button
                    variant="outline"
                    className="h-10 w-full justify-start gap-2.5 rounded-xl text-xs"
                    onClick={() => setOperacionActiva({ matricula, tipo: "cambiar-seccion" })}
                  >
                    <HugeiconsIcon icon={Exchange01Icon} className="size-4 text-blue-500" />
                    <span>Cambiar de Sección (Mismo Grado)</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-10 w-full justify-start gap-2.5 rounded-xl text-xs"
                    onClick={() => setOperacionActiva({ matricula, tipo: "retirar" })}
                  >
                    <HugeiconsIcon icon={UserRemove01Icon} className="size-4 text-amber-500" />
                    <span>Registrar Retiro Escolar</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-10 w-full justify-start gap-2.5 rounded-xl text-xs"
                    onClick={() => setOperacionActiva({ matricula, tipo: "trasladar" })}
                  >
                    <HugeiconsIcon icon={SchoolIcon} className="size-4 text-purple-500" />
                    <span>Registrar Traslado Externo</span>
                  </Button>

                  <div className="border-border/50 border-t pt-2">
                    <Button
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-full justify-start gap-2.5 rounded-xl text-xs"
                      onClick={() => setOperacionActiva({ matricula, tipo: "anular" })}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                      <span>Anular Matrícula (por error)</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground space-y-2 py-2 text-xs">
                  <div className="text-foreground flex items-center gap-2 font-semibold">
                    <HugeiconsIcon icon={AlertCircleIcon} className="size-4 text-amber-500" />
                    <span>Expediente Cerrado</span>
                  </div>
                  <p>
                    Esta matrícula se encuentra en estado <strong>{matricula.estado}</strong>. No
                    admite cambios de sección ni anulaciones adicionales.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen de Certificación */}
          <Card className="border-border/60 bg-card/60 rounded-2xl shadow-2xs">
            <CardHeader className="border-border/50 border-b px-5 py-3">
              <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Auditoría del Registro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-5 text-xs">
              <div className="border-border/40 flex justify-between border-b py-1">
                <span className="text-muted-foreground">ID Interno:</span>
                <span className="text-foreground font-mono text-[11px]">
                  {matricula.id.slice(0, 8)}...
                </span>
              </div>
              <div className="border-border/40 flex justify-between border-b py-1">
                <span className="text-muted-foreground">Fecha de Creación:</span>
                <span className="text-foreground">
                  {new Date(matricula.creadoEn).toLocaleDateString("es-PE")}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Documento Oficial:</span>
                <span className="font-semibold text-emerald-600">Constancia Habilitada</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modales de Operación */}
      <ModalOperacionMatricula
        matricula={operacionActiva.matricula}
        tipo={operacionActiva.tipo}
        open={Boolean(operacionActiva.tipo)}
        onOpenChange={(op) => !op && setOperacionActiva({ matricula: null, tipo: null })}
      />
    </div>
  );
}
