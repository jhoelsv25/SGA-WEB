"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowLeft02Icon,
  BookOpen01Icon,
  TeacherIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { useDocenteQuery } from "@/features/docentes";
import { useCargaDocenteQuery } from "../hooks";
import { DocenteInfoCard } from "../components/docente-info-card";
import { DocenteCargaTable } from "./docente-carga-table";

interface DocenteCargaViewProps {
  docenteId: string;
}

export function DocenteCargaView({ docenteId }: DocenteCargaViewProps) {
  const {
    data: carga,
    isLoading: isLoadingCarga,
    isError: isErrorCarga,
    error: errorCarga,
    refetch: refetchCarga,
  } = useCargaDocenteQuery(docenteId);

  const {
    data: docente,
    isLoading: isLoadingDocente,
    isError: isErrorDocente,
    error: errorDocente,
    refetch: refetchDocente,
  } = useDocenteQuery(docenteId);

  const isLoading = isLoadingCarga || isLoadingDocente;
  const isError = isErrorCarga || isErrorDocente;
  const error = errorCarga || errorDocente;
  const cursos = carga?.cursos ?? [];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <PageHeader
        title={
          docente
            ? `Carga académica: ${docente.persona.nombreCompleto}`
            : "Carga académica del docente"
        }
        description="Horas pedagógicas asignadas y cursos a cargo frente a la jornada laboral"
        icon={TeacherIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Docentes", href: "/admin/docentes" },
          { label: "Carga académica" },
        ]}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="min-h-11 rounded-full px-4 text-xs font-semibold sm:min-h-9"
          >
            <Link href="/admin/docentes">
              <HugeiconsIcon icon={ArrowLeft02Icon} className="mr-1.5 size-4" />
              <span>Volver a docentes</span>
            </Link>
          </Button>
        }
      />

      {/* Ficha resumen del docente */}
      {docente && <DocenteInfoCard docente={docente} carga={carga} />}

      {/* Aviso visible cuando excede la jornada */}
      {carga?.excede && (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3.5 rounded-2xl border p-4 shadow-2xs sm:p-5"
        >
          <HugeiconsIcon icon={Alert02Icon} className="mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold sm:text-base">
              Aviso: El docente excede su jornada laboral
            </h4>
            <p className="text-xs leading-relaxed opacity-90 sm:text-sm">
              El docente tiene asignadas{" "}
              <strong>{carga.horasAsignadas} horas pedagógicas semanales</strong>, superando su
              jornada máxima contractual de <strong>{carga.jornadaHoras} horas</strong>. Revisa las
              asignaciones de cursos o coordina una ampliación horaria.
            </p>
          </div>
        </div>
      )}

      {/* Listado de cursos y secciones en tabla desacoplada */}
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => {
          refetchCarga();
          refetchDocente();
        }}
        isEmpty={cursos.length === 0}
        empty={{
          title: "Sin cursos asignados",
          description:
            "Este docente no tiene asignaturas ni secciones a cargo en el presente año académico.",
          icon: BookOpen01Icon,
        }}
      >
        <DocenteCargaTable cursos={cursos} carga={carga} />
      </PageState>
    </div>
  );
}
