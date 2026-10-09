"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, BookOpen01Icon, School01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GradosView, useGradosQuery } from "@/features/grados";
import { CursosTable } from "@/features/cursos";
import { PlanEstudiosTable } from "@/features/plan-estudios";
import { useUrlFilters } from "@/hooks/use-url-filters";

type ActiveTab = "plan" | "cursos" | "grados";

const VALID_TABS: ActiveTab[] = ["plan", "cursos", "grados"];

export function CurriculumPage() {
  const { getParam, setParam } = useUrlFilters({ resetPageOnFilter: false });

  const tabParam = getParam("tab");
  const activeTab: ActiveTab = VALID_TABS.includes(tabParam as ActiveTab)
    ? (tabParam as ActiveTab)
    : "plan";

  const gradoParam = getParam("grado");

  const {
    data: grados = [],
    isLoading: isLoadingGrados,
    isError: isErrorGrados,
    error: errorGrados,
    refetch: refetchGrados,
  } = useGradosQuery();

  const handleTabChange = React.useCallback(
    (val: string) => {
      setParam("tab", val === "plan" ? null : val);
    },
    [setParam],
  );

  const handleSelectGrado = React.useCallback(
    (gradoId: string) => {
      setParam("grado", gradoId);
    },
    [setParam],
  );

  return (
    <div className="space-y-6">
      {/* Cabecera Principal con Icono */}
      <PageHeader
        title="Grados, Cursos y Plan de Estudios"
        description="Gestión del catálogo de asignaturas curriculares, talleres y distribución de horas semanales por grado."
        icon={BookOpen01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Estructura Académica" },
          { label: "Grados, Cursos y Plan" },
        ]}
      />

      {/* Navegación y Contenido gestionado por PageState */}
      <PageState
        isLoading={isLoadingGrados}
        isError={isErrorGrados}
        error={errorGrados}
        onRetry={() => void refetchGrados()}
        errorTitle="Error al cargar la estructura académica"
      >
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full gap-6">
          <div className="border-border/80 -mx-4 overflow-x-auto border-b px-4 sm:mx-0 sm:px-0">
            <TabsList
              variant="line"
              className="h-auto min-w-full justify-start gap-2 rounded-none border-b-0 p-0 sm:min-w-0 sm:gap-4"
            >
              <TabsTrigger
                value="plan"
                className="data-active:text-primary data-active:border-b-primary min-h-11 gap-2 rounded-none border-none px-3 py-2.5 text-xs font-semibold whitespace-nowrap data-active:border-b-2"
              >
                <HugeiconsIcon icon={BookOpen01Icon} className="size-4 shrink-0" />
                <span>Plan de Estudios</span>
              </TabsTrigger>

              <TabsTrigger
                value="cursos"
                className="data-active:text-primary data-active:border-b-primary min-h-11 gap-2 rounded-none border-none px-3 py-2.5 text-xs font-semibold whitespace-nowrap data-active:border-b-2"
              >
                <HugeiconsIcon icon={Book02Icon} className="size-4 shrink-0" />
                <span>Catálogo de Cursos</span>
              </TabsTrigger>

              <TabsTrigger
                value="grados"
                className="data-active:text-primary data-active:border-b-primary min-h-11 gap-2 rounded-none border-none px-3 py-2.5 text-xs font-semibold whitespace-nowrap data-active:border-b-2"
              >
                <HugeiconsIcon icon={School01Icon} className="size-4 shrink-0" />
                <span>Grados de Secundaria</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="plan" className="pt-2">
            <PlanEstudiosTable
              grados={grados}
              selectedGradoId={gradoParam}
              onSelectGrado={handleSelectGrado}
            />
          </TabsContent>

          <TabsContent value="cursos" className="pt-2">
            <CursosTable />
          </TabsContent>

          <TabsContent value="grados" className="pt-2">
            <GradosView grados={grados} />
          </TabsContent>
        </Tabs>
      </PageState>
    </div>
  );
}
