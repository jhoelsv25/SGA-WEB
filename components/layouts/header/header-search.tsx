"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import type { NavSection, NavItem } from "@/config/navigation/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function RenderSearchIcon({
  icon,
  className = "size-4 shrink-0",
}: {
  icon: NavItem["icon"];
  className?: string;
}) {
  if (typeof icon === "function") {
    const Component = icon;
    return <Component className={className} />;
  }

  if (Array.isArray(icon)) {
    return <HugeiconsIcon icon={icon} className={className} />;
  }

  return <HugeiconsIcon icon={Search01Icon} className={className} />;
}

export interface HeaderSearchProps {
  sections: NavSection[];
}

export function HeaderSearch({ sections }: HeaderSearchProps) {
  const router = useRouter();
  const { setOpenMobile, isMobile } = useSidebar();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const allItems = React.useMemo(() => {
    const list: Array<NavItem & { sectionTitle?: string }> = [];

    sections.forEach((section) => {
      section.items.forEach((item) => {
        list.push({ ...item, sectionTitle: section.title });
        if (item.items) {
          item.items.forEach((sub) => {
            list.push({
              ...sub,
              sectionTitle: `${section.title ?? ""} · ${item.label}`,
            });
          });
        }
      });
    });

    return list;
  }, [sections]);

  // Filtrar según query
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.sectionTitle && item.sectionTitle.toLowerCase().includes(q)),
    );
  }, [allItems, query]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  // Atajo de teclado global (Ctrl + K o Cmd + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenDialog((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (link: string) => {
    setOpenDialog(false);
    setQuery("");
    if (isMobile) {
      setOpenMobile(false);
    }
    router.push(link);
  };

  // Navegación por teclado dentro del cuadro de diálogo
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const targetItem = filteredItems[selectedIndex];
      if (targetItem) {
        handleSelect(targetItem.link);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        data-buscador-portal
        onClick={() => setOpenDialog(true)}
        className={cn(
          "group/search flex shrink-0 items-center justify-center gap-2.5 transition-colors outline-none",
          "text-muted-foreground hover:text-foreground focus-visible:ring-primary/25 focus-visible:ring-2",
          // En pantallas angostas queda solo el icono.
          "size-11 rounded-full",
          "lg:border-border lg:bg-muted/40 lg:hover:border-primary/30 lg:h-9 lg:w-72 lg:justify-start lg:rounded-2xl lg:border lg:px-3",
        )}
        title="Buscar módulo o función (Ctrl + K)"
        aria-label="Buscar módulo o función (Ctrl + K)"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          className="group-hover/search:text-primary size-4 shrink-0 transition-colors"
        />
        <span className="hidden flex-1 truncate text-left text-xs font-normal lg:block">
          Buscar en el portal...
        </span>
        <kbd className="border-border/80 bg-background text-muted-foreground pointer-events-none hidden h-5 items-center gap-0.5 rounded-md border px-1.5 font-mono text-xs font-semibold select-none lg:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Modal interactivo de búsqueda estilo Command Palette */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="border-border/70 max-w-md overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Buscador institucional</DialogTitle>
            <DialogDescription>
              Busca y navega rápidamente a cualquier módulo o sección de la plataforma
            </DialogDescription>
          </DialogHeader>

          {/* Campo de búsqueda con icono estilo Command */}
          <div className="border-border/70 bg-muted/20 flex items-center gap-3 border-b px-4 py-3">
            <div className="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-full border">
              <HugeiconsIcon icon={Search01Icon} className="size-4" />
            </div>
            <Input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Buscar asignaturas, asistencias, roles, usuarios..."
              className="placeholder:text-muted-foreground/60 h-9 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
                title="Limpiar"
                aria-label="Limpiar búsqueda"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              </button>
            )}
          </div>

          {/* Resultados de la búsqueda */}
          <div className="max-h-80 space-y-1 overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="text-muted-foreground py-10 text-center text-sm">
                No se encontraron módulos con &ldquo;{query}&rdquo;
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={`${item.id}-${item.link}`}
                    type="button"
                    onClick={() => handleSelect(item.link)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all duration-150 select-none",
                      isSelected
                        ? "bg-primary/10 text-primary-foreground border-primary/20 border shadow-2xs"
                        : "hover:bg-accent/80 hover:text-accent-foreground border border-transparent",
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={cn(
                          "flex size-7.5 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/70 text-foreground/80 border-border/60 group-hover:bg-primary group-hover:text-primary-foreground",
                        )}
                      >
                        <RenderSearchIcon icon={item.icon} className="size-4" />
                      </div>
                      <div className="truncate">
                        <div
                          className={cn(
                            "truncate font-semibold transition-colors",
                            isSelected
                              ? "text-primary dark:text-primary-foreground"
                              : "text-foreground group-hover:text-primary",
                          )}
                        >
                          {item.label}
                        </div>
                        {item.sectionTitle && (
                          <div className="text-muted-foreground/80 truncate text-[11px]">
                            {item.sectionTitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className={cn(
                        "size-3.5 transition-all",
                        isSelected
                          ? "text-primary dark:text-primary-foreground translate-x-0.5 opacity-100"
                          : "text-muted-foreground/60 opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100",
                      )}
                    />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer de navegación rápida */}
          <div className="border-border/60 bg-muted/40 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5 text-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="hidden sm:inline">Navegación Institucional</span>
              <span className="text-muted-foreground/50 hidden sm:inline">·</span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <kbd className="border-border bg-background rounded border px-1">↑</kbd>
                <kbd className="border-border bg-background rounded border px-1">↓</kbd> navegar
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <kbd className="border-border bg-background rounded border px-1">↵</kbd> entrar
              </span>
            </div>
            <span className="font-mono text-xs">ESC para salir</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
