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

export interface SidebarSearchProps {
  sections: NavSection[];
}

export function SidebarSearch({ sections }: SidebarSearchProps) {
  const router = useRouter();
  const { state, setOpenMobile, isMobile } = useSidebar();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [query, setQuery] = React.useState("");

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

  // Atajo de teclado (Ctrl + K o Cmd + K)
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
    if (isMobile) {
      setOpenMobile(false);
    }
    router.push(link);
  };

  const isCollapsed = state === "collapsed";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenDialog(true)}
        className={cn(
          "group/search flex w-full items-center gap-2.5 transition-all duration-200 outline-none",
          "border-sidebar-border hover:border-primary/30 border",
          "bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-foreground",
          "focus-visible:ring-primary/25 shadow-2xs focus-visible:ring-2",
          isCollapsed
            ? "mx-auto size-9 justify-center rounded-full p-0"
            : "h-9.5 rounded-full px-3 text-left",
        )}
        title="Buscar módulo o función (Ctrl + K)"
        aria-label="Buscar módulo o función (Ctrl + K)"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          className="text-muted-foreground/80 group-hover/search:text-primary size-4 shrink-0 transition-colors"
        />

        {!isCollapsed && (
          <>
            <span className="text-muted-foreground/80 group-hover/search:text-foreground flex-1 truncate text-xs font-normal">
              Buscar en el portal...
            </span>
            <kbd className="border-border/80 bg-background/80 text-muted-foreground pointer-events-none hidden h-5 items-center gap-0.5 rounded-md border px-1.5 font-mono text-xs font-semibold select-none sm:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </>
        )}
      </button>

      {/* Modal interactivo de búsqueda estilo Command Palette */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="border-border/70 max-w-md overflow-hidden rounded-2xl border p-0 shadow-2xl backdrop-blur-xl sm:max-w-lg">
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar asignaturas, asistencias, roles, usuarios..."
              className="placeholder:text-muted-foreground/60 h-9 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
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
              filteredItems.map((item) => (
                <button
                  key={`${item.id}-${item.link}`}
                  type="button"
                  onClick={() => handleSelect(item.link)}
                  className="group hover:bg-accent/80 hover:text-accent-foreground flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all duration-150"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="bg-primary/10 text-primary border-primary/15 group-hover:bg-primary group-hover:text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-lg border transition-colors">
                      <HugeiconsIcon icon={Search01Icon} className="size-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="text-foreground group-hover:text-primary truncate font-semibold transition-colors">
                        {item.label}
                      </div>
                      {item.sectionTitle && (
                        <div className="text-muted-foreground/80 truncate text-xs">
                          {item.sectionTitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="text-muted-foreground/60 size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </button>
              ))
            )}
          </div>

          {/* Footer de navegación rápida */}
          <div className="border-border/60 bg-muted/40 text-muted-foreground flex items-center justify-between border-t px-4 py-2.5 text-xs">
            <span className="font-medium">
              Navegación Institucional · I.E. Nuestra Señora del Carmen
            </span>
            <span className="font-mono text-xs">ESC para salir</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
