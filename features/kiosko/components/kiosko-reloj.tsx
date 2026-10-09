"use client";

import * as React from "react";

interface KioskoRelojProps {
  hora: string;
  fecha: string;
}

export function KioskoReloj({ hora, fecha }: KioskoRelojProps) {
  return (
    <div className="space-y-2 text-center select-none lg:text-left">
      {fecha && (
        <span className="text-primary text-xs font-bold tracking-wider uppercase sm:text-sm">
          {fecha}
        </span>
      )}
      <div
        className="text-foreground font-mono text-6xl font-black tracking-tight tabular-nums drop-shadow-xs sm:text-7xl lg:text-8xl"
        aria-label={`Hora actual: ${hora}`}
      >
        {hora}
      </div>
    </div>
  );
}
