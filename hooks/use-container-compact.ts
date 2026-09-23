"use client";

import * as React from "react";

/**
 * Observa el ancho real del contenedor (útil con sidebar).
 * Más fiable que window.matchMedia para toolbars responsivos.
 */
export function useContainerCompact<T extends HTMLElement>(breakpoint = 960) {
  const ref = React.useRef<T | null>(null);
  const [isCompact, setIsCompact] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const update = (width: number) => {
      setIsCompact(width < breakpoint);
    };

    update(node.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      update(entry.contentRect.width);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [breakpoint]);

  return { ref, isCompact };
}
