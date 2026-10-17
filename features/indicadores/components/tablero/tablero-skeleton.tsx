"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Estado de carga esqueletizado para el tablero de indicadores de la tesis.
 */
export function TableroSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-live="polite"
      aria-label="Cargando indicadores de la tesis"
    >
      {/* Esqueleto de filtros */}
      <Card className="border-border/60">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-10 w-36 rounded-lg" />
              <Skeleton className="h-10 w-44 rounded-lg" />
              <Skeleton className="h-10 w-40 rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Esqueleto de tarjetas CSP, ISA, IGM */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((indice) => (
          <Card key={indice} className="border-border/60">
            <CardHeader className="space-y-3 pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex items-baseline justify-between">
                <Skeleton className="h-10 w-28 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Esqueleto de gráfico comparativo */}
      <Card className="border-border/60">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </CardHeader>
        <CardContent className="pt-4">
          <Skeleton className="h-72 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}
