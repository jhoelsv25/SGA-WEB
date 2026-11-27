"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { menuDelUsuario, RUTA_INICIO, type NavItem } from "@/config";
import { useDashboardRole } from "@/components/layouts";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AdminDashboardView,
  DashboardHeaderFilters,
  DirectivoDashboardView,
  DocenteDashboardView,
  EstudianteDashboardView,
  SecretariaDashboardView,
  useDashboard,
} from "@/features/dashboard";

/** Se compara con el nombre exacto del rol (como en la API del dashboard). */
const PRIORIDADES_POR_ROL: Record<string, readonly string[]> = {
  Administrador: [
    "/admin/users",
    "/admin/roles",
    "/admin/academic-years",
    "/admin/secciones",
    "/admin/enrollment",
    "/admin/audit",
  ],
  Director: [
    "/admin/sesiones-hoy",
    "/admin/consolidados-docentes",
    "/admin/pendientes-seguimiento",
    "/admin/indicadores",
    "/admin/observaciones-aula",
    "/admin/reportes",
  ],
  Subdirector: [
    "/admin/sesiones-hoy",
    "/admin/consolidados-docentes",
    "/admin/pendientes-seguimiento",
    "/admin/horarios",
    "/admin/observaciones-aula",
    "/admin/indicadores",
  ],
  Secretaria: [
    "/admin/marcaciones-hoy",
    "/admin/marcacion-manual",
    "/admin/asistencia-seccion",
    "/admin/libretas",
    "/admin/reportes",
  ],
  Docente: [
    "/admin/mis-sesiones",
    "/admin/planificacion-sesiones",
    "/admin/asistencia",
    "/admin/aula-virtual",
    "/admin/mi-horario",
    "/admin/mi-seguimiento",
  ],
  Estudiante: [
    "/admin/aula-virtual",
    "/admin/mi-horario",
    "/admin/mi-asistencia",
    "/admin/mis-libretas",
  ],
  Apoderado: [
    "/admin/mi-asistencia",
    "/admin/mis-libretas",
    "/admin/mi-horario",
    "/admin/aula-virtual",
  ],
};

const DESCRIPCION_POR_ROL: Record<string, string> = {
  Administrador:
    "Administra la estructura académica, las cuentas, los permisos y la configuración.",
  "Soporte TI": "Monitorea las cuentas, los accesos y los equipos del sistema.",
  Director: "Supervisa el seguimiento docente, la asistencia y los indicadores de gestión.",
  Subdirector: "Supervisa sesiones, horarios, asistencia y el seguimiento de los docentes.",
  Secretaria: "Controla matrículas, fichas pendientes y la asistencia del día.",
  Docente: "Gestiona tus clases de hoy, tu planificación y el aula virtual.",
  Estudiante: "Revisa tu horario, tus tareas, tu asistencia y tus libretas.",
  Apoderado: "Revisa la asistencia, el horario, las tareas y las libretas de su hijo(a).",
};

function esIconoHugeicons(icono: NavItem["icon"]): icono is IconSvgElement {
  return Array.isArray(icono);
}

export default function DashboardPage() {
  const { user, rolActivo, currentUser } = useDashboardRole();
  const { anio } = useAnioLectivo();

  // Estados de filtros
  const [periodoSeleccionado, setPeriodoSeleccionado] = React.useState<string | null | undefined>(
    undefined,
  );
  const [rangoFecha, setRangoFecha] = React.useState<string>("periodo");
  const [estudianteId, setEstudianteId] = React.useState<string | undefined>(undefined);

  // El período en curso se toma por defecto si el usuario no ha forzado un filtro
  const periodoPorDefecto = anio?.bimestres.find((b) => b.estado === "en_curso")?.id;
  const periodoId =
    periodoSeleccionado !== undefined ? (periodoSeleccionado ?? undefined) : periodoPorDefecto;

  // Calcular fechas desde/hasta según rangoFecha
  const { fechaDesde, fechaHasta } = React.useMemo(() => {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];

    if (rangoFecha === "hoy") {
      return { fechaDesde: hoyStr, fechaHasta: hoyStr };
    }

    if (rangoFecha === "semana") {
      const hace7Dias = new Date();
      hace7Dias.setDate(hoy.getDate() - 7);
      return { fechaDesde: hace7Dias.toISOString().split("T")[0], fechaHasta: hoyStr };
    }

    if (rangoFecha === "mes") {
      const hace30Dias = new Date();
      hace30Dias.setDate(hoy.getDate() - 30);
      return { fechaDesde: hace30Dias.toISOString().split("T")[0], fechaHasta: hoyStr };
    }

    return { fechaDesde: undefined, fechaHasta: undefined };
  }, [rangoFecha]);

  // Consulta React Query del Dashboard
  const {
    data: dashboardData,
    isLoading,
    isRefetching,
    refetch,
  } = useDashboard({
    anioAcademicoId: anio?.id,
    periodoId,
    fechaDesde,
    fechaHasta,
    estudianteId,
  });

  const [mostrarTodosAccesos, setMostrarTodosAccesos] = React.useState(false);

  // Lista de accesos autorizados para el rol
  const accesos = React.useMemo(
    () =>
      menuDelUsuario({
        esAdministrador: rolActivo === "Administrador",
        menuRoutes: currentUser?.menuRoutes,
      })
        // Los accesos son las pantallas: de cada grupo se toman sus opciones.
        .flatMap((seccion) => seccion.items.flatMap((item) => item.items ?? [item]))
        .filter((item) => item.link !== RUTA_INICIO),
    [rolActivo, currentUser?.menuRoutes],
  );

  // Accesos más usados por cada rol: aparecen primero.
  const accesosPriorizados = React.useMemo(() => {
    const prioridades = PRIORIDADES_POR_ROL[rolActivo] ?? [];
    const orden = (link: string) => {
      const i = prioridades.indexOf(link);
      return i === -1 ? prioridades.length : i;
    };
    return [...accesos].sort((a, b) => orden(a.link) - orden(b.link));
  }, [accesos, rolActivo]);

  const rutasDelRol = React.useMemo(() => new Set(accesos.map((item) => item.link)), [accesos]);
  const puedeIr = React.useCallback((ruta: string) => rutasDelRol.has(ruta), [rutasDelRol]);

  const accesosVisibles = mostrarTodosAccesos ? accesosPriorizados : accesosPriorizados.slice(0, 6);

  const descripcionRol =
    DESCRIPCION_POR_ROL[rolActivo] ??
    "Use los accesos rápidos para entrar a sus opciones asignadas.";

  return (
    <div className="space-y-6 pb-8">
      {/* Barra de Filtros Superior */}
      <DashboardHeaderFilters
        userName={user.name}
        userAvatar={user.avatar}
        rolActivo={rolActivo}
        periodoIdSeleccionado={periodoId}
        onPeriodoChange={(nuevo) => setPeriodoSeleccionado(nuevo ?? null)}
        rangoFechaSeleccionado={rangoFecha}
        onRangoFechaChange={setRangoFecha}
        estudiantesAsociados={dashboardData?.estudiante?.estudiantesAsociados}
        estudianteSeleccionadoId={estudianteId}
        onEstudianteChange={setEstudianteId}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
        descripcion={descripcionRol}
      />

      {/* Contenido del Dashboard */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-border/60 p-5">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="mb-2 h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Card className="border-border/60 p-6 lg:col-span-7">
              <Skeleton className="mb-4 h-6 w-48" />
              <Skeleton className="h-56 w-full" />
            </Card>
            <Card className="border-border/60 p-6 lg:col-span-5">
              <Skeleton className="mb-4 h-6 w-48" />
              <Skeleton className="h-56 w-full" />
            </Card>
          </div>
        </div>
      ) : (
        <>
          {/* Vista según rol */}
          {dashboardData?.admin && (
            <AdminDashboardView data={dashboardData.admin} puedeIr={puedeIr} />
          )}

          {dashboardData?.secretaria && <SecretariaDashboardView data={dashboardData.secretaria} />}

          {dashboardData?.directivo && <DirectivoDashboardView data={dashboardData.directivo} />}

          {dashboardData?.docente && <DocenteDashboardView data={dashboardData.docente} />}

          {dashboardData?.estudiante && (
            <EstudianteDashboardView
              data={dashboardData.estudiante}
              esApoderado={dashboardData.rolCategoria === "apoderado"}
            />
          )}

          {dashboardData?.rolCategoria === "adicional" && (
            <EmptyState
              title="Sin información para su rol."
              description="Use los accesos rápidos para entrar a las opciones que tiene asignadas."
            />
          )}
        </>
      )}

      {/* Accesos rápidos prioritarios */}
      <section aria-labelledby="titulo-accesos" className="space-y-3.5 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 id="titulo-accesos" className="text-foreground text-base font-semibold">
              Accesos rápidos
            </h2>
            <p className="text-muted-foreground text-xs">
              Módulos y herramientas más relevantes para tu rol
            </p>
          </div>

          {accesosPriorizados.length > 6 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarTodosAccesos((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground h-8 gap-1.5 rounded-lg text-xs"
            >
              {mostrarTodosAccesos
                ? "Mostrar solo principales"
                : `Ver todos (${accesosPriorizados.length})`}
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
            </Button>
          )}
        </div>

        {accesosVisibles.length === 0 ? (
          <EmptyState
            title="Tu rol todavía no tiene opciones asignadas"
            description="Cuando el administrador te asigne opciones en Roles-Menú, aparecerán aquí y en el menú lateral."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {accesosVisibles.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.link}
                  className="border-border/40 bg-card hover:border-primary/40 hover:bg-muted/30 focus-visible:ring-ring/40 group flex h-full items-center gap-3.5 rounded-2xl border p-3.5 shadow-2xs transition-all outline-none focus-visible:ring-2"
                >
                  {esIconoHugeicons(item.icon) ? (
                    <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105">
                      <HugeiconsIcon icon={item.icon} className="size-5" />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="text-foreground block truncate text-sm font-semibold">
                      {item.label}
                    </span>
                    {item.description ? (
                      <span className="text-muted-foreground mt-0.5 line-clamp-1 block text-xs">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
