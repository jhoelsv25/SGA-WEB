"use client";

import * as React from "react";
import { Award01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { SelectOption } from "@/components/common/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ETIQUETA_ESTADO, formatearFecha } from "./constants";
import { useAbrirLibretaMutation, useMisLibretasQuery } from "./hooks";

export function MisLibretasPage() {
  const consulta = useMisLibretasQuery();
  const abrir = useAbrirLibretaMutation();
  const libretas = React.useMemo(() => consulta.data?.libretas ?? [], [consulta.data?.libretas]);
  const [estudianteFiltro, setEstudianteFiltro] = React.useState<string>("");

  const estudiantesUnicos = React.useMemo(() => {
    const nombres = Array.from(
      new Set(libretas.map((l) => l.estudianteNombre).filter(Boolean) as string[]),
    );
    return nombres;
  }, [libretas]);

  const estudianteActivo =
    estudianteFiltro && estudiantesUnicos.includes(estudianteFiltro) ? estudianteFiltro : "";

  const libretasFiltradas = React.useMemo(() => {
    if (!estudianteActivo) return libretas;
    return libretas.filter((l) => l.estudianteNombre === estudianteActivo);
  }, [libretas, estudianteActivo]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis libretas"
        description="Libretas oficiales del SIAGIE publicadas por el colegio."
        icon={Award01Icon}
      />

      {estudiantesUnicos.length > 1 && (
        <div className="w-full max-w-72">
          <SelectOption
            options={[
              { value: "", label: "Todos los estudiantes" },
              ...estudiantesUnicos.map((nombre) => ({
                value: nombre,
                label: nombre,
              })),
            ]}
            value={estudianteActivo}
            onSelect={setEstudianteFiltro}
            placeholder="Filtrar por estudiante..."
          />
        </div>
      )}

      {consulta.isLoading ? <Skeleton className="h-28 w-full" /> : null}
      {consulta.isError ? (
        <EmptyState
          title="No se pudieron cargar tus libretas"
          description="Inténtalo de nuevo en unos minutos."
          icon={Award01Icon}
        />
      ) : null}
      {!consulta.isLoading && !consulta.isError && libretasFiltradas.length === 0 ? (
        <EmptyState
          title="Aún no hay libretas"
          description="Cuando el colegio publique un bimestre, aparecerá aquí."
          icon={Award01Icon}
        />
      ) : null}

      <ul className="grid gap-3 md:grid-cols-2">
        {libretasFiltradas.map((libreta) => (
          <li key={libreta.id} className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{libreta.bimestre}</p>
                <p className="text-muted-foreground text-xs">{libreta.estudianteNombre}</p>
              </div>
              <Badge
                variant={
                  libreta.estado === "a_tiempo"
                    ? "success"
                    : libreta.estado === "fuera_de_plazo"
                      ? "warning"
                      : "secondary"
                }
              >
                {ETIQUETA_ESTADO[libreta.estado]}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Fecha límite {formatearFecha(libreta.fechaLimite)}
            </p>
            {libreta.mensaje ? <p className="mt-2 text-sm">{libreta.mensaje}</p> : null}
            {libreta.disponible ? (
              <Button
                type="button"
                size="sm"
                className="mt-3"
                disabled={abrir.isPending}
                onClick={() => abrir.mutate(libreta.id)}
              >
                Ver libreta
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
