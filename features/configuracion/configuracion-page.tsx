"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Clock01Icon,
  ComputerIcon,
  Settings02Icon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";

const DESTINOS = [
  {
    href: "/admin/variables",
    titulo: "Variables del sistema",
    detalle: "Parámetros, tolerancias de asistencia, plazos de descargo y ponderaciones.",
    icono: SlidersHorizontalIcon,
  },
  {
    href: "/admin/turnos",
    titulo: "Turnos y jornadas",
    detalle: "Horas oficiales de entrada y salida, ventanas de marcado y tolerancia.",
    icono: Clock01Icon,
  },
  {
    href: "/admin/equipos",
    titulo: "Equipos autorizados",
    detalle: "Kioskos y biométricos desde los que se marca asistencia y se firman sesiones.",
    icono: ComputerIcon,
  },
] as const;

export function ConfiguracionPage() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Configuración"
        description="Elige qué parte del sistema quieres ajustar."
        icon={Settings02Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Configuración" }]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DESTINOS.map((destino) => (
          <Link
            key={destino.href}
            href={destino.href}
            className="bg-card hover:border-primary/40 hover:bg-muted/30 group flex items-start gap-4 rounded-xl border p-4 shadow-2xs transition-colors"
          >
            <span className="border-primary/20 bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl border">
              <HugeiconsIcon icon={destino.icono} className="size-5" />
            </span>
            <span className="min-w-0 flex-1 space-y-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{destino.titulo}</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </span>
              <span className="text-muted-foreground block text-xs leading-relaxed">
                {destino.detalle}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
