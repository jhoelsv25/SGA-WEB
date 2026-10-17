"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  Pdf01Icon,
  UserRemove01Icon,
  Exchange01Icon,
  FileCheckIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { LoadingScreen } from "@/components/common/loading-screen";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/formatters/date";
import { useMatriculaDetailQuery } from "../hooks";
import {
  ModalOperacionMatricula,
  ModalConstanciaPdf,
  type OperacionMatriculaTipo,
  DetalleAsignacionEscolar,
  DetalleEstudianteCard,
  DetalleOperacionesPanel,
} from "../components";
import { MATRICULA_ESTADO_CONFIG } from "../constants";

interface MatriculaDetalleViewProps {
  matriculaId: string;
}

export function MatriculaDetalleView({ matriculaId }: MatriculaDetalleViewProps) {
  const router = useRouter();
  const { data: matricula, isLoading, isError } = useMatriculaDetailQuery(matriculaId);

  const [operacionActiva, setOperacionActiva] = React.useState<OperacionMatriculaTipo>(null);
  const [modalPdfOpen, setModalPdfOpen] = React.useState(false);

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

  const estadoInfo = MATRICULA_ESTADO_CONFIG[matricula.estado] || {
    label: matricula.estado,
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
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
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${estadoInfo.bg} ${estadoInfo.color} ${estadoInfo.border}`}
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 gap-2 rounded-full px-4 text-xs font-semibold shadow-xs"
            onClick={() => setModalPdfOpen(true)}
          >
            <HugeiconsIcon icon={Pdf01Icon} className="size-4 text-amber-400" />
            Ver Constancia Oficial (PDF)
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

      {/* Grilla Principal de Información Limpia y Desacoplada */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DetalleAsignacionEscolar matricula={matricula} />
          <DetalleEstudianteCard estudiante={matricula.estudiante} />
        </div>

        <div className="space-y-6">
          <DetalleOperacionesPanel
            matricula={matricula}
            onSelectOperacion={(tipo: OperacionMatriculaTipo) => setOperacionActiva(tipo)}
          />

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
                <span className="text-foreground">{formatDate(matricula.creadoEn)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Documento Oficial:</span>
                <span className="font-semibold text-emerald-600">Constancia Habilitada</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Reutilizable para Operaciones */}
      <ModalOperacionMatricula
        matricula={matricula}
        tipo={operacionActiva}
        open={Boolean(operacionActiva)}
        onOpenChange={(op: boolean) => !op && setOperacionActiva(null)}
      />

      {/* Modal Visor Oficial de Constancia con Colores del Colegio */}
      <ModalConstanciaPdf
        open={modalPdfOpen}
        onOpenChange={setModalPdfOpen}
        matriculaId={matricula.id}
        matriculaCodigo={matricula.codigo}
        estudianteNombre={`${matricula.estudiante.apellidos}, ${matricula.estudiante.nombres}`}
      />
    </div>
  );
}
