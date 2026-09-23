"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon, Moon02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={className} aria-label="Alternar tema" disabled>
        <span className="size-4.5 rounded-full border border-current opacity-20" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo Claro" : "Modo Oscuro"}
    >
      {isDark ? (
        <HugeiconsIcon
          icon={Sun03Icon}
          className="size-4.5 text-amber-400 transition-transform hover:rotate-45"
        />
      ) : (
        <HugeiconsIcon
          icon={Moon02Icon}
          className="text-muted-foreground size-4.5 transition-transform hover:-rotate-12"
        />
      )}
    </Button>
  );
}
