"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Archive02Icon,
  Clock01Icon,
  DocumentValidationIcon,
  FileExportIcon,
  InformationCircleIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { MENSAJES_INDICADORES } from "../../consts";
import { usePuedeMedir } from "../../hooks/use-indicadores-permisos";
import type { Indicador } from "../../types";
import { ListaPretestsPanel } from "./lista-pretests-panel";
import { PanelMedicionPeriodo } from "./panel-medicion-periodo";
import { HistorialMedicionesPanel } from "./historial-mediciones-panel";
import { ModalRegistrarPretest } from "./modal-registrar-pretest";
import { ModalCerrarMedicion } from "./modal-cerrar-medicion";
import { ModalNuevaVersion } from "./modal-nueva-version";
import { ModalExportarMedicion } from "./modal-exportar-medicion";
import { cn } from "@/lib/utils";

export interface GestionMedicionPanelProps {
  className?: string;
}

export function GestionMedicionPanel({ className }: GestionMedicionPanelProps) {
  const { anio } = useAnioLectivo();
  const puedeMedir = usePuedeMedir();

  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio?.bimestres]);

  // Bimestre activo seleccionado (prioriza cerrado o en curso)
  const [periodoSeleccionadoId, setPeriodoSeleccionadoId] = React.useState<string>("");

  const periodoPredeterminadoId = React.useMemo(() => {
    if (bimestres.length === 0) return "";
    const cerrado = bimestres.find((b) => b.estado === "cerrado");
    const enCurso = bimestres.find((b) => b.estado === "en_curso");
    return cerrado?.id ?? enCurso?.id ?? bimestres[0].id;
  }, [bimestres]);

  const periodoActualId = periodoSeleccionadoId || periodoPredeterminadoId;
  const periodoActual = bimestres.find((b) => b.id === periodoActualId) ?? bimestres[0];

  // Estados de Modales
  const [modalPretestAbierto, setModalPretestAbierto] = React.useState(false);
  const [indicadorPretestInicial, setIndicadorPretestInicial] = React.useState<Indicador>("CSP");

  const [modalCerrarAbierto, setModalCerrarAbierto] = React.useState(false);

  const [modalNuevaVersionAbierto, setModalNuevaVersionAbierto] = React.useState(false);
  const [medicionParaNuevaVersion, setMedicionParaNuevaVersion] = React.useState<{
    id: string;
    periodoNombre: string;
    versionActual: number;
  } | null>(null);

  const [modalExportarAbierto, setModalExportarAbierto] = React.useState(false);
  const [tabActivo, setTabActivo] = React.useState<string>("medicion");

  const abrirRegistroPretest = (indicador?: Indicador) => {
    setIndicadorPretestInicial(indicador ?? "CSP");
    setModalPretestAbierto(true);
  };

  const abrirNuevaVersion = (datos: {
    id: string;
    periodoNombre: string;
    versionActual: number;
  }) => {
    setMedicionParaNuevaVersion(datos);
    setModalNuevaVersionAbierto(true);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Cabecera Principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Gestión de la Medición — Tesis
            </h2>
            <Badge variant="outline" className="text-xs font-semibold">
              Año {anio?.anio ?? "académico"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Control de línea base (pretest), congelamiento inmutable por bimestre (postest),
            versionado e informe oficial.
          </p>
        </div>

        {/* Acciones principales en la cabecera */}
        <div className="flex flex-wrap items-center gap-2">
          {puedeMedir && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => abrirRegistroPretest()}
                className="h-9 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
                <span>Pretest</span>
              </Button>

              {periodoActual && periodoActual.estado === "cerrado" && (
                <Button
                  size="sm"
                  onClick={() => setModalCerrarAbierto(true)}
                  className="shadow-primary/20 h-9 gap-1.5 rounded-full px-4 text-xs font-semibold shadow-xs"
                >
                  <HugeiconsIcon icon={Archive02Icon} className="size-3.5" />
                  <span>Cerrar medición</span>
                </Button>
              )}
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalExportarAbierto(true)}
            className="h-9 gap-1.5 rounded-full px-4 text-xs font-semibold"
          >
            <HugeiconsIcon icon={FileExportIcon} className="size-3.5" />
            <span>Exportar evidencia</span>
          </Button>
        </div>
      </div>

      {/* Aviso informativo de permisos si el usuario es Subdirector */}
      {!puedeMedir && (
        <div className="border-border/70 bg-muted/40 text-muted-foreground flex items-center gap-2.5 rounded-xl border p-3 text-xs leading-relaxed">
          <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-primary shrink-0" />
          <span>
            {MENSAJES_INDICADORES.ROL_NO_AUTORIZADO} Dispone de acceso de consulta y exportación
            oficial.
          </span>
        </div>
      )}

      {/* Selector de Bimestres del Año Lectivo */}
      {bimestres.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-muted-foreground text-xs font-medium">Bimestre de trabajo:</span>
          <div className="flex flex-wrap gap-2">
            {bimestres.map((b) => {
              const seleccionado = b.id === periodoActual?.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setPeriodoSeleccionadoId(b.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                    seleccionado
                      ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "border-border/80 bg-card hover:bg-muted/60 text-foreground",
                  )}
                >
                  <span>{b.nombre}</span>
                  <span
                    className={cn(
                      "py-0.2 rounded-full px-1.5 text-[9px] font-semibold uppercase",
                      b.estado === "cerrado"
                        ? "bg-slate-500/20 text-slate-700 dark:text-slate-300"
                        : b.estado === "en_curso"
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-500/20 text-amber-700 dark:text-amber-300",
                    )}
                  >
                    {b.estado}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navegación por Pestañas */}
      <Tabs value={tabActivo} onValueChange={setTabActivo} className="space-y-5">
        <TabsList className="bg-muted/60 border-border/60 h-10 rounded-full border p-1">
          <TabsTrigger
            value="medicion"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-full px-4 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Archive02Icon} className="mr-1.5 size-3.5" />
            Medición del bimestre
          </TabsTrigger>

          <TabsTrigger
            value="pretest"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-full px-4 text-xs font-semibold"
          >
            <HugeiconsIcon icon={DocumentValidationIcon} className="mr-1.5 size-3.5" />
            Línea base (Pretest)
          </TabsTrigger>

          <TabsTrigger
            value="historial"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-full px-4 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Clock01Icon} className="mr-1.5 size-3.5" />
            Historial de versiones
          </TabsTrigger>
        </TabsList>

        {/* Contenido 1: Medición del bimestre seleccionado */}
        <TabsContent value="medicion" className="outline-none focus:outline-none">
          {periodoActual ? (
            <PanelMedicionPeriodo
              periodo={{
                id: periodoActual.id,
                nombre: periodoActual.nombre,
                estado: periodoActual.estado,
                numero: periodoActual.numero,
              }}
              onCerrarMedicion={() => setModalCerrarAbierto(true)}
              onNuevaVersion={abrirNuevaVersion}
              onVerHistorial={() => setTabActivo("historial")}
            />
          ) : (
            <p className="text-muted-foreground text-xs italic">
              No hay bimestres registrados en el año lectivo activo.
            </p>
          )}
        </TabsContent>

        {/* Contenido 2: Pretests vigentes e históricos */}
        <TabsContent value="pretest" className="outline-none focus:outline-none">
          <ListaPretestsPanel onRegistrarPretest={abrirRegistroPretest} />
        </TabsContent>

        {/* Contenido 3: Historial de versiones del bimestre */}
        <TabsContent value="historial" className="outline-none focus:outline-none">
          {periodoActual ? (
            <HistorialMedicionesPanel
              periodoId={periodoActual.id}
              periodoNombre={periodoActual.nombre}
              onNuevaVersion={abrirNuevaVersion}
            />
          ) : (
            <p className="text-muted-foreground text-xs italic">
              Selecciona un período académico para consultar su historial de versiones.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Modales Desacoplados */}
      <ModalRegistrarPretest
        open={modalPretestAbierto}
        onOpenChange={setModalPretestAbierto}
        indicadorInicial={indicadorPretestInicial}
      />

      <ModalCerrarMedicion
        open={modalCerrarAbierto}
        onOpenChange={setModalCerrarAbierto}
        periodo={
          periodoActual
            ? {
                id: periodoActual.id,
                nombre: periodoActual.nombre,
                estado: periodoActual.estado,
              }
            : null
        }
        onSolicitarNuevaVersion={() => {
          setTabActivo("historial");
        }}
      />

      <ModalNuevaVersion
        open={modalNuevaVersionAbierto}
        onOpenChange={setModalNuevaVersionAbierto}
        medicion={medicionParaNuevaVersion}
      />

      <ModalExportarMedicion
        open={modalExportarAbierto}
        onOpenChange={setModalExportarAbierto}
        periodoIdSeleccionado={periodoActual?.id}
        periodosDisponibles={bimestres.map((b) => ({ id: b.id, nombre: b.nombre }))}
      />
    </div>
  );
}
