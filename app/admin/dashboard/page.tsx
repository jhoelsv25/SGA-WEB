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
        .flatMap((seccion) => seccion.items)
        .filter((item) => item.link !== RUTA_INICIO),
    [rolActivo, currentUser?.menuRoutes],
  );

  // Priorizar los accesos más importantes según el rol
  const accesosPriorizados = React.useMemo(() => {
    const rol = (rolActivo || "").toLowerCase();
    let prioridades: readonly string[] = [
      "/admin/sesiones-hoy",
      "/admin/aula-virtual",
      "/admin/marcaciones-hoy",
      "/admin/enrollment",
      "/admin/docentes",
      "/admin/estudiantes",
    ];

    if (rol.includes("docente") || rol.includes("profesor")) {
      prioridades = [
        "/admin/mis-sesiones",
        "/admin/aula-virtual",
        "/admin/asistencia-seccion",
        "/admin/mi-horario",
        "/admin/mi-seguimiento",
        "/admin/mis-ausencias",
      ];
    } else if (rol.includes("estudiante") || rol.includes("alumno") || rol.includes("apoderado")) {
      prioridades = [
        "/admin/aula-virtual",
        "/admin/mi-horario",
        "/admin/mi-asistencia",
        "/admin/mis-libretas",
        "/admin/comunicados",
      ];
    } else if (rol.includes("secretaria") || rol.includes("secretario")) {
      prioridades = [
        "/admin/matriculas",
        "/admin/estudiantes",
        "/admin/apoderados",
        "/admin/libretas",
        "/admin/comunicados",
        "/admin/asistencia",
      ];
    } else if (rol.includes("admin") || rol.includes("soporte") || rol.includes("ti")) {
      prioridades = [
        "/admin/users",
        "/admin/roles",
        "/admin/bitacora-auditoria",
        "/admin/institucion",
        "/admin/equipos",
        "/admin/anio-escolar",
      ];
    }

    return [...accesos].sort((a, b) => {
      const idxA = prioridades.indexOf(a.link);
      const idxB = prioridades.indexOf(b.link);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }, [accesos, rolActivo]);

  const accesosVisibles = mostrarTodosAccesos ? accesosPriorizados : accesosPriorizados.slice(0, 6);

  const descripcionRol = React.useMemo(() => {
    const rol = (rolActivo || "").toLowerCase();
    if (rol.includes("docente") || rol.includes("profesor")) {
      return "Gestiona tus clases de hoy, el avance de calificaciones y el aula virtual.";
    }
    if (rol.includes("estudiante") || rol.includes("alumno")) {
      return "Revisa tus horarios, tareas pendientes y calificaciones del ciclo.";
    }
    if (rol.includes("apoderado") || rol.includes("padre")) {
      return "Monitorea la asistencia, horarios y tareas escolares de tus hijos.";
    }
    if (rol.includes("secretaria") || rol.includes("secretario")) {
      return "Supervisa matrículas, gestión documentaria, asistencia escolar y comunicados.";
    }
    if (rol.includes("admin") || rol.includes("soporte") || rol.includes("ti")) {
      return "Monitorea la seguridad del sistema, cuentas de usuario y auditoría.";
    }
    return "Supervisa en tiempo real el progreso institucional, asistencia y actividades.";
  }, [rolActivo]);

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
          {dashboardData?.admin && <AdminDashboardView data={dashboardData.admin} />}

          {dashboardData?.secretaria && <SecretariaDashboardView data={dashboardData.secretaria} />}

          {dashboardData?.directivo && <DirectivoDashboardView data={dashboardData.directivo} />}

          {dashboardData?.docente && <DocenteDashboardView data={dashboardData.docente} />}

          {dashboardData?.estudiante && <EstudianteDashboardView data={dashboardData.estudiante} />}
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
