"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  Calendar03Icon,
  ChartBarLineIcon,
  Upload01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectOption } from "@/components/common/select";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { ETIQUETA_ALCANCE, OPCIONES_ALCANCE } from "./constants";
import { PanelProgramarLibretas } from "./components/panel-programar-libretas";
import { PanelSeguimientoLibretas } from "./components/panel-seguimiento-libretas";
import { PanelSubirLibretas } from "./components/panel-subir-libretas";
import { ModalProgramarLibretas } from "./components/modals";
import {
  useAlcancesLibretasQuery,
  useCambiarAlcanceLibretasMutation,
  useContextoLibretasQuery,
} from "./hooks";
import type { AlcanceLibreta, ContextoLibretas, PeriodoLibreta } from "./types";

const PESTANAS = ["programar", "subir", "seguimiento", "alcance"] as const;
type PestanaLibreta = (typeof PESTANAS)[number];

function pestanaPermitida(valor: string, datos: ContextoLibretas): PestanaLibreta | null {
  if (!PESTANAS.includes(valor as PestanaLibreta)) return null;
  if (valor === "programar" && !datos.puedeProgramar) return null;
  if (valor === "alcance" && !datos.esAdministrador) return null;
  return valor as PestanaLibreta;
}

export function LibretasPage() {
  const contexto = useContextoLibretasQuery();
  const datos = contexto.data;
  const { getParam, setParam } = useUrlFilters({ resetPageOnFilter: false });
  const alcances = useAlcancesLibretasQuery(Boolean(datos?.esAdministrador));
  const cambiarAlcance = useCambiarAlcanceLibretasMutation();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [periodoModal, setPeriodoModal] = useState<PeriodoLibreta | undefined>();

  function abrirProgramar(periodo?: PeriodoLibreta) {
    setPeriodoModal(periodo);
    setModalAbierto(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Libretas del SIAGIE"
        description="Fija la fecha límite de cada bimestre, sube los PDF y revisa cuántas se publicaron a tiempo."
        icon={Award01Icon}
      />

      {contexto.isLoading ? <Skeleton className="h-40 w-full" /> : null}
      {contexto.isError ? (
        <EmptyState
          title="No se pudo cargar las libretas"
          description="Revisa el año lectivo de trabajo e inténtalo de nuevo."
          icon={Award01Icon}
        />
      ) : null}

      {datos ? (
        <Tabs
          value={
            pestanaPermitida(getParam("tab"), datos) ??
            (datos.puedeProgramar ? "programar" : "subir")
          }
          onValueChange={(valor) => setParam("tab", valor)}
        >
          <TabsList className="bg-muted/50 h-auto min-h-11 w-fit rounded-xl p-1">
            {datos.puedeProgramar ? (
              <TabsTrigger value="programar" className="h-9 gap-1.5 rounded-lg px-3.5">
                <HugeiconsIcon icon={Calendar03Icon} size={16} />
                Fecha límite
              </TabsTrigger>
            ) : null}
            <TabsTrigger value="subir" className="h-9 gap-1.5 rounded-lg px-3.5">
              <HugeiconsIcon icon={Upload01Icon} size={16} />
              Subir PDF
            </TabsTrigger>
            <TabsTrigger value="seguimiento" className="h-9 gap-1.5 rounded-lg px-3.5">
              <HugeiconsIcon icon={ChartBarLineIcon} size={16} />
              Avance
            </TabsTrigger>
            {datos.esAdministrador ? (
              <TabsTrigger value="alcance" className="h-9 gap-1.5 rounded-lg px-3.5">
                <HugeiconsIcon icon={UserGroupIcon} size={16} />
                Quién sube
              </TabsTrigger>
            ) : null}
          </TabsList>

          {datos.puedeProgramar ? (
            <TabsContent value="programar" className="pt-4">
              <PanelProgramarLibretas periodos={datos.periodos} onProgramar={abrirProgramar} />
            </TabsContent>
          ) : null}

          <TabsContent value="subir" className="pt-4">
            <PanelSubirLibretas contexto={datos} />
          </TabsContent>

          <TabsContent value="seguimiento" className="pt-4">
            <PanelSeguimientoLibretas contexto={datos} puedeHistorial={datos.puedeProgramar} />
          </TabsContent>

          {datos.esAdministrador ? (
            <TabsContent value="alcance" className="space-y-3 pt-4">
              <p className="text-muted-foreground text-sm">
                Define si el docente sube las libretas de su tutoría, de las secciones donde dicta o
                de todo el colegio.
              </p>
              {alcances.isLoading ? <Skeleton className="h-24 w-full" /> : null}
              <ul className="space-y-3">
                {alcances.data?.map((fila) => (
                  <li
                    key={fila.rolId}
                    className="grid items-end gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_16rem]"
                  >
                    <div>
                      <p className="text-sm font-semibold">{fila.rolNombre}</p>
                      <p className="text-muted-foreground text-xs">
                        Alcance actual: {ETIQUETA_ALCANCE[fila.alcance]}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Alcance</Label>
                      <SelectOption
                        options={OPCIONES_ALCANCE}
                        value={fila.alcance}
                        disabled={cambiarAlcance.isPending}
                        onSelect={(valor) =>
                          cambiarAlcance.mutate({
                            rolId: fila.rolId,
                            alcance: valor as AlcanceLibreta,
                          })
                        }
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ) : null}
        </Tabs>
      ) : null}

      {datos ? (
        <ModalProgramarLibretas
          open={modalAbierto}
          onOpenChange={setModalAbierto}
          periodos={datos.periodos.filter((periodo) => !periodo.programada)}
          periodo={periodoModal}
        />
      ) : null}
    </div>
  );
}
