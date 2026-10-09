"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";

export function HeaderLiveClock() {
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="text-muted-foreground/80 hidden items-center gap-1.5 px-2 text-xs select-none md:flex"
      title="Hora local del sistema"
    >
      <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground/70 size-3.5 shrink-0" />
      <span className="text-foreground/80 font-mono text-xs font-medium tracking-tight">
        {time || "--:--"}
      </span>
    </div>
  );
}
