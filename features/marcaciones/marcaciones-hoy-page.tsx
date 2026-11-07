"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  RefreshIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  FingerPrintIcon,
  Add01Icon,
  Calendar03Icon,
  StudentIcon,
  TeacherIcon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertasRelojes } from "@/features/biometrico";
import { cn } from "@/lib/utils";
import { ListaFaltan, JustificarMarcacionModal, TablaMarcaron } from "./components";
import { usePanelMarcacionesHoy, usePuedeJustificarMarcaciones } from "./hooks";
import type { GrupoPanel, MarcacionApi } from "./types";

type Pestana = "estudiantes" | "personal";

const PESTANAS: { id: Pestana; label: string; icon: typeof StudentIcon }[] = [
  { id: "estudiantes", label: "Estudiantes", icon: StudentIcon },
  { id: "personal", label: "Personal", icon: TeacherIcon },
];

interface KpiCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: typeof CheckmarkCircle02Icon;
  variant: "emerald" | "amber" | "blue";
}

function KpiCard({ title, value, subtitle, icon: Icon, variant }: KpiCardProps) {
  const styles = {
    emerald: {
      bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      accent: "text-amber-600 dark:text-amber-400",
    },
    blue: {
      bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      accent: "text-blue-600 dark:text-blue-400",
    },
  }[variant];

  return (
    <div className="border-border/80 bg-card hover:border-border relative overflow-hidden rounded-2xl border p-4.5 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {title}
          </p>
          <p className={cn("text-3xl font-black tracking-tight tabular-nums", styles.accent)}>
            {value}
          </p>
          {subtitle && <p className="text-muted-foreground/80 text-xs font-medium">{subtitle}</p>}
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl border shadow-2xs",
            styles.bg,
          )}
        >
          <HugeiconsIcon icon={Icon} className="size-6" />
        </div>
      </div>
    </div>
  );
}

function ContenidoGrupo({
  grupo,
  puedeJustificar,
  onJustificar,
}: {
  grupo: GrupoPanel;
  puedeJustificar: boolean;
  onJustificar: (m: MarcacionApi) => void;
}) {
  const totalEsperados = grupo.marcaron.length + grupo.faltan.length;
  const tasaAsistencia =
    totalEsperados > 0 ? Math.round((grupo.marcaron.length / totalEsperados) * 100) : 0;
  const tasaTardanza =
    grupo.marcaron.length > 0
      ? Math.round((grupo.totalTardanzas / grupo.marcaron.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* 3 Tarjetas KPI con diseño moderno */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <KpiCard
          title="Marcaciones de hoy"
          value={grupo.marcaron.length}
          subtitle={`${tasaAsistencia}% de asistencia (${grupo.marcaron.length} de ${totalEsperados})`}
          icon={CheckmarkCircle02Icon}
          variant="emerald"
        />
        <KpiCard
          title="Tardanzas"
          value={grupo.totalTardanzas}
          subtitle={
            grupo.marcaron.length > 0
              ? `${tasaTardanza}% de las marcas registradas`
              : "Sin incidencias registradas"
          }
          icon={AlertCircleIcon}
          variant="amber"
        />
        <KpiCard
          title="Aún no marcan"
          value={grupo.faltan.length}
          subtitle="Pendientes de registrar ingreso"
          icon={Clock01Icon}
          variant="blue"
        />
      </div>

      {/* Sección Quién marcó */}
      <section aria-labelledby="titulo-marcaron" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 id="titulo-marcaron" className="text-foreground text-sm font-bold">
              Quién marcó
            </h2>
            <Badge variant="outline" className="px-2 py-0 font-mono text-xs font-bold">
              {grupo.marcaron.length}
            </Badge>
          </div>
        </div>

        {grupo.marcaron.length === 0 ? (
          <div className="border-border/60 bg-card/60 flex flex-col items-center justify-center gap-3 rounded-2xl border p-8 text-center shadow-xs">
            <div className="bg-muted text-muted-foreground border-border flex size-12 items-center justify-center rounded-2xl border">
              <HugeiconsIcon icon={Clock01Icon} className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-bold">
                Aún no hay marcaciones registradas
              </p>
              <p className="text-muted-foreground max-w-sm text-xs">
                Las entradas y salidas aparecerán aquí en tiempo real a medida que se registren en
                el reloj biométrico, kiosko o de forma manual.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="mt-1 gap-1.5 rounded-xl text-xs font-semibold shadow-2xs"
            >
              <Link href="/admin/marcacion-manual">
                <HugeiconsIcon icon={Add01Icon} className="text-primary size-3.5" />
                <span>Registrar marcación manual</span>
              </Link>
            </Button>
          </div>
        ) : (
          <TablaMarcaron
            marcaciones={grupo.marcaron}
            puedeJustificar={puedeJustificar}
            onJustificar={onJustificar}
          />
        )}
      </section>

      {/* Sección Aún no han marcado */}
      <section aria-labelledby="titulo-faltan" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 id="titulo-faltan" className="text-foreground text-sm font-bold">
              Aún no han marcado
            </h2>
            <Badge variant="secondary" className="px-2 py-0 font-mono text-xs font-bold">
              {grupo.faltan.length}
            </Badge>
          </div>
        </div>

        <ListaFaltan pendientes={grupo.faltan} />
      </section>
    </div>
  );
}

export function MarcacionesHoyPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = usePanelMarcacionesHoy();
  const puedeJustificar = usePuedeJustificarMarcaciones();
  const [pestana, setPestana] = React.useState<Pestana>("estudiantes");
  const [aJustificar, setAJustificar] = React.useState<MarcacionApi | null>(null);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Marcaciones de hoy"
        description="Panel de asistencia en vivo: quién marcó, a qué hora y con qué resultado."
        icon={Clock01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Marcaciones de hoy" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
              aria-label="Actualizar marcaciones"
              className="h-9 gap-1.5 rounded-xl px-3 text-xs font-semibold shadow-2xs"
            >
              <HugeiconsIcon
                icon={RefreshIcon}
                className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl px-3 text-xs font-semibold shadow-2xs"
            >
              <Link href="/admin/marcaciones-pendientes">
                <HugeiconsIcon icon={FingerPrintIcon} className="text-primary size-3.5" />
                <span className="hidden sm:inline">Marcaciones pendientes</span>
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
            >
              <Link href="/admin/marcacion-manual">
                <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
                <span>Registrar marcación</span>
              </Link>
            </Button>
          </div>
        }
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar el panel"
      >
        {data && (
          <div className="space-y-5">
            <AlertasRelojes />

            {/* Aviso de día no lectivo */}
            {!data.diaConClases && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-900 shadow-xs dark:text-amber-200"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold tracking-wider uppercase">
                    Día sin turno lectivo regular
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Hoy no es un día de clases regulares para estudiantes. Cualquier marcación
                    registrada quedará registrada como fuera de turno.
                  </p>
                </div>
              </div>
            )}

            {/* Segmented Control de Pestañas con contador */}
            <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div
                role="tablist"
                aria-label="Tipo de persona"
                className="bg-muted/70 border-border/50 inline-flex rounded-xl border p-1 text-sm shadow-inner"
              >
                {PESTANAS.map((p) => {
                  const Icon = p.icon;
                  const grupo = data[p.id];
                  const pendientes = grupo.faltan.length;
                  const activo = pestana === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={activo}
                      onClick={() => setPestana(p.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all select-none",
                        activo
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:bg-card/50 hover:text-foreground",
                      )}
                    >
                      <HugeiconsIcon icon={Icon} className="size-3.5" />
                      <span>{p.label}</span>
                      <Badge
                        variant={activo ? "secondary" : "outline"}
                        className={cn(
                          "px-1.5 py-0 font-mono text-[10px]",
                          activo ? "bg-primary/10 text-primary" : "text-muted-foreground",
                        )}
                      >
                        {pendientes > 0 ? `${pendientes} pendientes` : "Al día"}
                      </Badge>
                    </button>
                  );
                })}
              </div>

              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                <span className="flex size-2 animate-pulse rounded-full bg-emerald-500" />
                <span>Actualización en vivo cada 30 s</span>
              </div>
            </div>

            {/* Contenido según pestaña activa */}
            <ContenidoGrupo
              grupo={data[pestana]}
              puedeJustificar={puedeJustificar}
              onJustificar={setAJustificar}
            />
          </div>
        )}
      </PageState>

      <JustificarMarcacionModal
        marcacion={aJustificar}
        onOpenChange={(abierto) => !abierto && setAJustificar(null)}
      />
    </div>
  );
}
