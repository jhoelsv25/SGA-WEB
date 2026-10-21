"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstitucionQuery } from "@/features/institucion";

export function TabInstitucion() {
  const { data: institucion, isLoading } = useInstitucionQuery();

  return (
    <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-base font-bold">Datos de la Institución Educativa</CardTitle>
          <CardDescription className="text-xs">
            Identificación oficial y parámetros legales sincronizados con la base de datos
          </CardDescription>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
          <Link href="/admin/institucion">
            <HugeiconsIcon icon={Edit02Icon} className="size-3.5" />
            Editar Datos
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl sm:col-span-2" />
          </div>
        ) : !institucion ? (
          <div className="text-muted-foreground py-6 text-center text-xs">
            <p>No se encontraron datos de la institución en la base de datos.</p>
            <Button asChild variant="link" size="sm" className="mt-2 text-xs">
              <Link href="/admin/institucion">Registrar institución</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-muted/30 border-border/40 rounded-xl border p-3">
              <span className="text-muted-foreground block text-[11px]">Nombre de la I.E.</span>
              <span className="text-foreground text-sm font-semibold">{institucion.nombre}</span>
            </div>

            <div className="bg-muted/30 border-border/40 rounded-xl border p-3">
              <span className="text-muted-foreground block text-[11px]">Código Modular</span>
              <span className="text-foreground font-mono text-sm font-semibold">
                {institucion.codigoModular || "No especificado"}
              </span>
            </div>

            <div className="bg-muted/30 border-border/40 rounded-xl border p-3">
              <span className="text-muted-foreground block text-[11px]">DRE / UGEL</span>
              <span className="text-foreground text-sm font-semibold">
                {institucion.ugelDre || "No registrado"}
              </span>
            </div>

            <div className="bg-muted/30 border-border/40 rounded-xl border p-3">
              <span className="text-muted-foreground block text-[11px]">Tipo de Gestión</span>
              <span className="text-foreground text-sm font-semibold capitalize">
                {institucion.tipoGestion}
              </span>
            </div>

            <div className="bg-muted/30 border-border/40 rounded-xl border p-3 sm:col-span-2">
              <span className="text-muted-foreground block text-[11px]">Dirección y Sede</span>
              <span className="text-foreground text-sm font-semibold">
                {[
                  institucion.direccion,
                  institucion.distrito,
                  institucion.provincia,
                  institucion.departamento,
                ]
                  .filter(Boolean)
                  .join(", ") || "Dirección no registrada"}
              </span>
            </div>

            {institucion.director && (
              <div className="bg-muted/30 border-border/40 rounded-xl border p-3 sm:col-span-2">
                <span className="text-muted-foreground block text-[11px]">Director(a) General</span>
                <span className="text-foreground text-sm font-semibold">
                  {institucion.director}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-xl border p-3 text-xs">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary size-4 shrink-0" />
            <span className="text-foreground">
              Los datos institucionales se reflejan automáticamente en libretas, reportes y
              comunicados oficiales.
            </span>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary shrink-0 text-[10px]">
            Sincronizado con BD
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
