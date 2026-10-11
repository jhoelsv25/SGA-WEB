"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, BookOpen01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import { useDocentesQuery } from "@/features/docentes";
import {
  useAsignarDocenteMutation,
  useCargaSeccionQuery,
  usePuedeGestionarCarga,
  useSeccionDetalleQuery,
} from "../hooks";
import type { ApiClientErrorConConfirmacion } from "../api";
import {
  ConfirmacionExcesoDialog,
  type ConfirmacionExcesoEstado,
  SeccionInfoCard,
} from "../components";
import { SeccionCargaTable } from "./seccion-carga-table";

interface SeccionCargaViewProps {
  seccionId: string;
}

export function SeccionCargaView({ seccionId }: SeccionCargaViewProps) {
  const permisoGestionar = usePuedeGestionarCarga();

  const {
    data: cargaData,
    isLoading: isLoadingCarga,
    isError: isErrorCarga,
    error: errorCarga,
    refetch: refetchCarga,
  } = useCargaSeccionQuery(seccionId);

  const {
    data: seccion,
    isLoading: isLoadingSeccion,
    isError: isErrorSeccion,
    error: errorSeccion,
    refetch: refetchSeccion,
  } = useSeccionDetalleQuery(seccionId);

  // Consulta de docentes activos para el selector (límite fijo de 100)
  const { data: docentesResponse } = useDocentesQuery({
    estado: "activo",
    limit: 100,
  });

  const seccionCerrada = seccion?.estado === "cerrada";
  const puedeGestionar = permisoGestionar && !seccionCerrada;

  const asignarMutation = useAsignarDocenteMutation(seccionId);

  const [docentesSeleccionados, setDocentesSeleccionados] = React.useState<Record<string, string>>(
    {},
  );
  const [guardandoFilaId, setGuardandoFilaId] = React.useState<string | null>(null);
  const [confirmacionExceso, setConfirmacionExceso] =
    React.useState<ConfirmacionExcesoEstado | null>(null);

  const docentesOptions = React.useMemo(() => {
    const list = docentesResponse?.data ?? [];
    const activos = list.filter((d) => d.estado === "activo");

    const opciones = activos.map((d) => ({
      value: d.id,
      label: d.persona?.nombreCompleto || d.codigo,
      description: `${d.codigo} • Jornada: ${d.jornadaHoras}h`,
    }));

    return [
      {
        value: "",
        label: "Sin docente (vacante)",
        description: "Dejar este curso sin docente asignado",
      },
      ...opciones,
    ];
  }, [docentesResponse]);

  const handleGuardar = async (
    cursoSeccionId: string,
    docenteId: string | null,
    confirmarExceso = false,
  ) => {
    try {
      setGuardandoFilaId(cursoSeccionId);
      const resultado = await asignarMutation.mutateAsync({
        cursoSeccionId,
        payload: { docenteId, confirmarExceso },
      });

      setDocentesSeleccionados((prev) => {
        const next = { ...prev };
        delete next[cursoSeccionId];
        return next;
      });

      if (docenteId) {
        toast.success(
          `Docente asignado. Carga horaria: ${resultado.cargaDocente.horasAsignadas} de ${resultado.cargaDocente.jornadaHoras} horas.`,
        );
      } else {
        toast.success("Docente desasignado correctamente.");
      }
    } catch (error: unknown) {
      if (
        error instanceof ApiClientError &&
        (error.statusCode === 409 || (error as ApiClientErrorConConfirmacion).requiereConfirmacion)
      ) {
        setConfirmacionExceso({
          open: true,
          cursoSeccionId,
          docenteId,
          mensaje: error.message,
        });
        return;
      }

      if (error instanceof ApiClientError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrió un error al procesar la asignación del docente.");
      }
    } finally {
      setGuardandoFilaId(null);
    }
  };

  const handleSelectDocente = React.useCallback((cursoSeccionId: string, docenteId: string) => {
    setDocentesSeleccionados((prev) => ({
      ...prev,
      [cursoSeccionId]: docenteId,
    }));
  }, []);

  const isLoading = isLoadingCarga || isLoadingSeccion;
  const isError = isErrorCarga || isErrorSeccion;
  const error = errorCarga || errorSeccion;
  const items = cargaData?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={seccion ? `${seccion.gradoNombre} — Sección "${seccion.nombre}"` : "Carga académica"}
        description="Asignación de docentes y carga horaria por curso de la sección"
        icon={BookOpen01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Secciones", href: "/admin/secciones" },
          { label: "Carga académica" },
        ]}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="min-h-11 rounded-full px-4 text-xs font-semibold sm:min-h-9"
          >
            <Link href="/admin/secciones">
              <HugeiconsIcon icon={ArrowLeft02Icon} className="mr-1.5 size-4" />
              <span>Volver a secciones</span>
            </Link>
          </Button>
        }
      />

      {seccion && <SeccionInfoCard seccion={seccion} />}

      {!puedeGestionar && (
        <div className="border-border bg-muted/50 text-muted-foreground flex items-center gap-3 rounded-xl border p-3.5 text-xs sm:text-sm">
          <HugeiconsIcon icon={InformationCircleIcon} className="text-primary size-5 shrink-0" />
          <p>
            <strong className="text-foreground font-semibold">Modo de solo consulta:</strong>{" "}
            {seccionCerrada
              ? "La sección está cerrada y no admite cambios en la asignación de docentes."
              : "Tu rol de usuario no cuenta con permisos para modificar la asignación de docentes de la sección."}
          </p>
        </div>
      )}

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => {
          refetchCarga();
          refetchSeccion();
        }}
        isEmpty={items.length === 0}
        empty={{
          title: "Sin cursos en la sección",
          description:
            "No se encontraron cursos asignados al plan de estudios de esta sección para este año académico.",
          icon: BookOpen01Icon,
        }}
      >
        <SeccionCargaTable
          items={items}
          puedeGestionar={puedeGestionar}
          docentesOptions={docentesOptions}
          docentesSeleccionados={docentesSeleccionados}
          onSelectDocente={handleSelectDocente}
          guardandoFilaId={guardandoFilaId}
          onGuardar={handleGuardar}
        />
      </PageState>

      <ConfirmacionExcesoDialog
        confirmacion={confirmacionExceso}
        onClose={() => setConfirmacionExceso(null)}
        onConfirm={(cId, dId) => handleGuardar(cId, dId, true)}
        isLoading={asignarMutation.isPending}
      />
    </div>
  );
}
