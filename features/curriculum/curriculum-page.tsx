"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, BookOpen01Icon, School01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import { PlanEstudiosTab } from "./components/plan-estudios-tab";
import { CursosTab } from "./components/cursos-tab";
import { GradosTab } from "./components/grados-tab";
import { useGradosQuery } from "./hooks";

type ActiveTab = "plan" | "cursos" | "grados";

export function CurriculumPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("plan");
  const [selectedGradoId, setSelectedGradoId] = React.useState<string>("");

  const { data: grados = [], isLoading: isLoadingGrados } = useGradosQuery();

  // Derivar el grado activo sin efectos para evitar re-renders en cascada
  const activeGradoId = selectedGradoId || (grados.length > 0 ? grados[0].id : "");

  return (
    <div className="space-y-6">
      {/* Cabecera Principal */}
      <PageHeader
        title="Grados, Cursos y Plan de Estudios"
        description="Gestión del catálogo de asignaturas curriculares, talleres y distribución de horas semanales por grado."
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Estructura Académica" },
          { label: "Grados, Cursos y Plan" },
        ]}
      />

      {/* Navegación por Pestañas Principales */}
      <div className="border-border/80 flex border-b">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("plan")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === "plan"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent"
            }`}
          >
            <HugeiconsIcon icon={BookOpen01Icon} className="size-4" />
            <span>Plan de Estudios</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cursos")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === "cursos"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent"
            }`}
          >
            <HugeiconsIcon icon={Book02Icon} className="size-4" />
            <span>Catálogo de Cursos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("grados")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all ${
              activeTab === "grados"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent"
            }`}
          >
            <HugeiconsIcon icon={School01Icon} className="size-4" />
            <span>Grados de Secundaria</span>
          </button>
        </div>
      </div>

      {/* Contenido según pestaña activa */}
      {isLoadingGrados ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : (
        <div>
          {activeTab === "plan" && (
            <PlanEstudiosTab
              grados={grados}
              selectedGradoId={activeGradoId}
              onSelectGrado={setSelectedGradoId}
            />
          )}

          {activeTab === "cursos" && <CursosTab />}

          {activeTab === "grados" && <GradosTab grados={grados} />}
        </div>
      )}
    </div>
  );
}
