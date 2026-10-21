"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SlidersHorizontalIcon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useVariablesQuery } from "@/features/variables-sistema";

export function TabVariables() {
  const { data: variables = [], isLoading } = useVariablesQuery();

  const variablesReglas = React.useMemo(() => {
    return (variables || []).filter(
      (v) => v.modulo === "asistencia" || v.modulo === "organizacion" || v.modulo === "sesiones",
    );
  }, [variables]);

  const listaMostrar = variablesReglas.length > 0 ? variablesReglas : variables;

  return (
    <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-base font-bold">Reglas de Asistencia y Tolerancias</CardTitle>
          <CardDescription className="text-xs">
            Parámetros institucionales configurados en la base de datos
          </CardDescription>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-semibold">
          <Link href="/admin/variables">
            <HugeiconsIcon icon={SlidersHorizontalIcon} className="size-3.5" />
            Gestionar Variables
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : listaMostrar.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center text-xs">
            <p>No hay variables registradas en la base de datos.</p>
          </div>
        ) : (
          <div className="divide-border/40 divide-y rounded-xl border">
            {listaMostrar.map((v) => (
              <div key={v.codigo} className="flex items-center justify-between p-3.5 text-xs">
                <div>
                  <p className="text-foreground font-semibold">{v.descripcion}</p>
                  <p className="text-muted-foreground font-mono text-[11px]">{v.codigo}</p>
                </div>
                <Badge variant="secondary" className="font-mono text-xs font-bold">
                  {v.valor} {v.unidad || ""}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
