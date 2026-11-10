"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TarjetaApoyoProps {
  titulo: string;
  /** `null` cuando el indicador no tiene datos en el período. */
  valor: string | null;
  etiquetaSinDatos: string;
  detalles?: string[];
}

/**
 * Tarjeta de un indicador de apoyo (RF-020 V2): muestra solo el valor y sus datos de apoyo,
 * sin meta, semáforo ni calificación.
 */
export function TarjetaApoyo({
  titulo,
  valor,
  etiquetaSinDatos,
  detalles = [],
}: TarjetaApoyoProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p
          className={
            valor === null
              ? "text-muted-foreground text-xl font-semibold"
              : "text-foreground text-2xl font-semibold tabular-nums"
          }
        >
          {valor ?? etiquetaSinDatos}
        </p>
        {valor !== null &&
          detalles.map((detalle) => (
            <p key={detalle} className="text-muted-foreground text-xs">
              {detalle}
            </p>
          ))}
      </CardContent>
    </Card>
  );
}
