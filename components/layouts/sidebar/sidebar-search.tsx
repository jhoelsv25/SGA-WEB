"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
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

  // Aplanar todos los items y subitems para búsqueda instantánea
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
      {/* Botón trigger en el Sidebar redondeado estilo Login Input */}
      <button
        type="button"
        onClick={() => setOpenDialog(true)}
        className={cn(
          "bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground group/search border-border/80 hover:border-primary/40 focus-visible:ring-primary/25 flex w-full items-center gap-2.5 shadow-2xs transition-all duration-200 outline-none focus-visible:ring-2",
          isCollapsed
            ? "mx-auto size-9.5 justify-center rounded-xl p-0"
            : "h-10 rounded-full border px-3.5 text-left",
        )}
        title="Buscar módulo o función (Ctrl + K)"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          className="text-muted-foreground/80 group-hover/search:text-primary size-4 shrink-0 transition-colors"
        />

        {!isCollapsed && (
          <>
            <span className="text-muted-foreground/75 group-hover/search:text-foreground flex-1 truncate text-xs font-normal">
              Buscar en el portal...
            </span>
            <kbd className="bg-muted text-muted-foreground border-border/60 pointer-events-none hidden h-5 items-center gap-0.5 rounded-md border px-1.5 font-mono text-[9.5px] font-bold select-none sm:inline-flex">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </>
        )}
      </button>

      {/* Modal interactivo de búsqueda */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Buscador institucional</DialogTitle>
            <DialogDescription>
              Busca y navega rápidamente a cualquier módulo o sección de la plataforma
            </DialogDescription>
          </DialogHeader>

          {/* Campo de búsqueda con icono estilo Login */}
          <div className="border-border/70 flex items-center gap-3 border-b px-4 py-3">
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
              <HugeiconsIcon icon={Search01Icon} className="size-4" />
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar asignaturas, calificaciones, nóminas, reportes..."
              className="placeholder:text-muted-foreground/70 h-9 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground rounded-full px-2 py-0.5 text-xs font-semibold"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Resultados de la búsqueda */}
          <div className="max-h-[320px] overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                No se encontraron módulos con &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <button
                    key={`${item.id}-${item.link}`}
                    type="button"
                    onClick={() => handleSelect(item.link)}
                    className="hover:bg-accent/80 hover:text-accent-foreground group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-md transition-colors">
                        <HugeiconsIcon icon={Search01Icon} className="size-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-foreground group-hover:text-primary truncate font-semibold">
                          {item.label}
                        </div>
                        {item.sectionTitle && (
                          <div className="text-muted-foreground/75 truncate text-[11px]">
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
                ))}
              </div>
            )}
          </div>

          {/* Footer de navegación rápida */}
          <div className="border-border/60 bg-muted/30 text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-[11px]">
            <span>Navegación Institucional · I.E. Carmelitas</span>
            <span>Presiona ESC para salir</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
