"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { ArrowRight01Icon, Calendar03Icon, UserIcon } from "@hugeicons/core-free-icons";
import { menuDelUsuario, RUTA_INICIO, type NavItem } from "@/config";
import { useDashboardRole } from "@/components/layouts";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";

function esIconoHugeicons(icono: NavItem["icon"]): icono is IconSvgElement {
  return Array.isArray(icono);
}

export default function DashboardPage() {
  const { user, rolActivo, currentUser } = useDashboardRole();
  const { anio } = useAnioLectivo();
  const bimestreEnCurso = anio?.bimestres.find((bimestre) => bimestre.estado === "en_curso");

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

  return (
    <div className="space-y-6">
      <section className="border-border/60 bg-card rounded-2xl border p-5 sm:p-6">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Hola{user.name ? `, ${user.name}` : ""}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {rolActivo ? (
            <Badge variant="outline" className="gap-1.5">
              <HugeiconsIcon icon={UserIcon} className="size-3.5" />
              Rol: {rolActivo}
            </Badge>
          ) : null}
          {anio ? (
            <Badge variant="outline" className="gap-1.5">
              <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
              Año académico {anio.anio}
              {bimestreEnCurso ? ` · Bimestre ${bimestreEnCurso.nombre}` : ""}
            </Badge>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="titulo-accesos" className="space-y-3">
        <h2 id="titulo-accesos" className="text-foreground text-base font-semibold">
          Tus accesos
        </h2>

        {accesos.length === 0 ? (
          <EmptyState
            title="Tu rol todavía no tiene opciones asignadas"
            description="Cuando el administrador te asigne opciones en Roles-Menú, aparecerán aquí y en el menú lateral."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {accesos.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.link}
                  className="border-border/60 bg-card hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-ring/40 group flex h-full min-h-16 items-start gap-3 rounded-xl border p-4 transition-colors outline-none focus-visible:ring-2"
                >
                  {esIconoHugeicons(item.icon) ? (
                    <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                      <HugeiconsIcon icon={item.icon} className="size-5" />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="text-foreground block text-sm font-semibold">
                      {item.label}
                    </span>
                    {item.description ? (
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="text-muted-foreground group-hover:text-primary mt-0.5 size-4 shrink-0"
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
