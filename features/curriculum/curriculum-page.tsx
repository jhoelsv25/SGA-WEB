"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, BookOpen01Icon, School01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
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

  const { data: grados = [], isLoading: isLoadingGrados } = useGradosQuery();

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

      {/* Navegación y Contenido con Tabs de shadcn */}
      {isLoadingGrados ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full gap-6">
          <TabsList
            variant="line"
            className="border-border/80 h-auto w-full justify-start gap-4 rounded-none border-b p-0"
          >
            <TabsTrigger
              value="plan"
              className="data-active:text-primary data-active:border-b-primary gap-2 rounded-none border-none px-3 py-2.5 text-xs font-semibold data-active:border-b-2"
            >
              <HugeiconsIcon icon={BookOpen01Icon} className="size-4" />
              <span>Plan de Estudios</span>
            </TabsTrigger>

            <TabsTrigger
              value="cursos"
              className="data-active:text-primary data-active:border-b-primary gap-2 rounded-none border-none px-3 py-2.5 text-xs font-semibold data-active:border-b-2"
            >
              <HugeiconsIcon icon={Book02Icon} className="size-4" />
              <span>Catálogo de Cursos</span>
            </TabsTrigger>

            <TabsTrigger
              value="grados"
              className="data-active:text-primary data-active:border-b-primary gap-2 rounded-none border-none px-3 py-2.5 text-xs font-semibold data-active:border-b-2"
            >
              <HugeiconsIcon icon={School01Icon} className="size-4" />
              <span>Grados de Secundaria</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="pt-2 outline-none">
            <PlanEstudiosTable
              grados={grados}
              selectedGradoId={gradoParam}
              onSelectGrado={handleSelectGrado}
            />
          </TabsContent>

          <TabsContent value="cursos" className="pt-2 outline-none">
            <CursosTable />
          </TabsContent>

          <TabsContent value="grados" className="pt-2 outline-none">
            <GradosView grados={grados} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
