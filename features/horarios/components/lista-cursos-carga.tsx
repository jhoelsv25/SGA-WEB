"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Book02Icon,
  ArrowRight01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CargaItemHorario } from "../types";

interface ListaCursosCargaProps {
  cargaItems: CargaItemHorario[];
  cursoSeleccionado: CargaItemHorario | null;
  onSelectCurso: (curso: CargaItemHorario | null) => void;
  puedeGestionar: boolean;
}

export function ListaCursosCarga({
  cargaItems,
  cursoSeleccionado,
  onSelectCurso,
  puedeGestionar,
}: ListaCursosCargaProps) {
  const [busqueda, setBusqueda] = useState("");

  const itemsFiltrados = useMemo(() => {
    if (!busqueda.trim()) return cargaItems;
    const q = busqueda.toLowerCase().trim();
    return cargaItems.filter((item) => {
      const curso = item.cursoNombre.toLowerCase();
      const docente = item.docente?.nombreCompleto?.toLowerCase() ?? "";
      return curso.includes(q) || docente.includes(q);
    });
  }, [cargaItems, busqueda]);

  if (cargaItems.length === 0) {
    return (
      <div className="border-border/60 bg-card space-y-3 rounded-2xl border p-5 text-center shadow-xs">
        <div className="bg-muted/40 text-muted-foreground mx-auto flex size-10 items-center justify-center rounded-xl">
          <HugeiconsIcon icon={Book02Icon} className="size-5" />
        </div>
        <div className="space-y-1">
          <p className="text-foreground text-xs font-semibold">Sin carga académica</p>
          <p className="text-muted-foreground mx-auto max-w-52 text-[11px] leading-relaxed">
            Esta sección no tiene cursos registrados para este ciclo escolar.
          </p>
        </div>
        {puedeGestionar && (
          <Button asChild variant="outline" size="sm" className="h-8 w-full gap-1.5 text-xs">
            <Link href="/admin/secciones">
              <span>Gestionar secciones</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="border-border/80 bg-card rounded-xl border p-4 shadow-sm">
      <div className="border-border/60 flex flex-col gap-1 border-b pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-sm font-semibold">Cursos de la sección</h3>
          <span className="text-muted-foreground text-[11px]">
            {itemsFiltrados.length} {itemsFiltrados.length === 1 ? "curso" : "cursos"}
          </span>
        </div>
        <p className="text-muted-foreground text-xs">
          {puedeGestionar
            ? "Arrastra un curso a una franja o selecciónalo para asignarlo."
            : "Lista de cursos y docentes asignados a la sección."}
        </p>

        {/* Buscador y filtro por curso o docente */}
        <div className="relative mt-2">
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
          />
          <Input
            placeholder="Filtrar por curso o docente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="h-8 rounded-lg pr-7 pl-8 text-xs"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-0.5"
              aria-label="Limpiar filtro"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Indicador de curso seleccionado para asignación rápida */}
      {cursoSeleccionado && (
        <div className="border-primary/30 bg-primary/10 mt-3 flex items-center justify-between rounded-lg border p-2.5 text-xs">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary size-4" />
            <span>
              Seleccionado: <strong>{cursoSeleccionado.cursoNombre}</strong>. Clic en una franja
              libre.
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelectCurso(null)}
            className="h-8 min-h-8 min-w-8 gap-1 px-2.5 text-xs"
            aria-label="Desmarcar curso seleccionado"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Desmarcar</span>
          </Button>
        </div>
      )}

      {/* Tarjetas de cursos */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
        {itemsFiltrados.length === 0 ? (
          <p className="text-muted-foreground p-4 text-center text-xs italic">
            No se encontraron cursos o docentes con &quot;{busqueda}&quot;.
          </p>
        ) : (
          itemsFiltrados.map((item) => {
            const isSelected = cursoSeleccionado?.id === item.id;
            const horasCompletas = item.horasHorario === item.horasPlan;
            const faltaHoras = item.horasHorario < item.horasPlan;

            return (
              <div
                key={item.id}
                draggable={puedeGestionar}
                onDragStart={(e) => {
                  if (!puedeGestionar) return;
                  e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({
                      cursoSeccionId: item.id,
                      cursoNombre: item.cursoNombre,
                    }),
                  );
                  e.dataTransfer.effectAllowed = "copy";
                }}
                onClick={() => {
                  if (!puedeGestionar) return;
                  onSelectCurso(isSelected ? null : item);
                }}
                className={`group flex min-h-12 cursor-pointer items-center justify-between rounded-lg border p-2.5 text-xs transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-primary ring-2"
                    : "border-border/70 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                }`}
                role="button"
                tabIndex={puedeGestionar ? 0 : -1}
                onKeyDown={(e) => {
                  if (!puedeGestionar) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectCurso(isSelected ? null : item);
                  }
                }}
                aria-label={`Seleccionar curso ${item.cursoNombre}`}
                aria-pressed={isSelected}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="border-border/80 size-3.5 shrink-0 rounded-full border shadow-xs"
                    style={{ backgroundColor: item.colorHex ?? "var(--primary)" }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-foreground truncate font-semibold">{item.cursoNombre}</p>
                    <p className="text-muted-foreground truncate">
                      {item.docente ? item.docente.nombreCompleto : "Sin docente asignado"}
                    </p>
                  </div>
                </div>

                <div className="ml-2 shrink-0 text-right">
                  <span
                    className={`font-semibold ${
                      horasCompletas
                        ? "text-emerald-600 dark:text-emerald-400"
                        : faltaHoras
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-destructive"
                    }`}
                  >
                    {item.horasHorario}/{item.horasPlan} h
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
