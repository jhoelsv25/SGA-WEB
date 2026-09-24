"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Panel Principal",
  teacher: "Docente",
  student: "Estudiante",
  principal: "Dirección",
  director: "Dirección",
  admin: "Administración",
  parent: "Apoderado",
  courses: "Asignaturas",
  grades: "Calificaciones",
  attendance: "Asistencia",
  tasks: "Tareas",
  schedule: "Horario",
  materials: "Materiales",
  analytics: "Métricas",
  teachers: "Personal Docente",
  enrollments: "Matrícula",
  reports: "Reportes",
  calendar: "Calendario",
  users: "Usuarios",
  roles: "Roles y Permisos",
  audit: "Auditoría",
  settings: "Ajustes",
  profile: "Mi Perfil",
  notifications: "Notificaciones",
  help: "Ayuda",
};

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList className="text-xs">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              SGA
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");
          const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-foreground font-semibold">{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="text-muted-foreground hover:text-foreground">
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
