"use client";

import * as React from "react";
import { Book02Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCompetencias, useCrearDesempeno, useDesempenos, useEditarDesempeno } from "../hooks";

/** Dirección corrige o agrega desempeños; las sesiones ya planificadas conservan su texto. */
export function CatalogoCurricularPage() {
  const competencias = useCompetencias();
  const [competenciaId, setCompetenciaId] = React.useState<string>();
  const [grado, setGrado] = React.useState(1);
  const desempenos = useDesempenos(competenciaId, grado);
  const editar = useEditarDesempeno();
  const crear = useCrearDesempeno();
  const [editando, setEditando] = React.useState<{ id: string; texto: string } | null>(null);
  const [nuevo, setNuevo] = React.useState("");

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-2 duration-300">
      <PageHeader
        title="Catálogo curricular"
        description="Competencias, capacidades y desempeños del CNEB por grado."
        icon={Book02Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Catálogo curricular" },
        ]}
      />
      <PageState
        isLoading={competencias.isLoading}
        isError={competencias.isError}
        error={competencias.error}
        onRetry={() => void competencias.refetch()}
      >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <SelectOption
              options={(competencias.data ?? []).map((c) => ({
                value: c.id,
                label: c.nombre,
                group: c.areaCodigo ?? "Transversales",
              }))}
              value={competenciaId}
              placeholder="Elija una competencia"
              searchPlaceholder="Buscar competencia"
              onSelect={setCompetenciaId}
            />
            <div className="flex gap-1" role="group" aria-label="Grado">
              {[1, 2, 3, 4, 5].map((g) => (
                <Button
                  key={g}
                  type="button"
                  variant={g === grado ? "default" : "outline"}
                  aria-pressed={g === grado}
                  onClick={() => setGrado(g)}
                >
                  {g}.°
                </Button>
              ))}
            </div>
          </div>
          {competenciaId && (
            <PageState
              isLoading={desempenos.isLoading}
              isError={desempenos.isError}
              error={desempenos.error}
              onRetry={() => void desempenos.refetch()}
              isEmpty={desempenos.data?.length === 0}
              empty={{ title: "Sin desempeños", description: "Puede agregar el primero abajo." }}
            >
              <ul className="space-y-2">
                {desempenos.data?.map((d) => (
                  <li key={d.id} className="border-border/80 rounded-2xl border p-3 text-sm">
                    {editando?.id === d.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editando.texto}
                          onChange={(e) => setEditando({ id: d.id, texto: e.target.value })}
                        />
                        <Button
                          disabled={!editando.texto.trim() || editar.isPending}
                          onClick={() =>
                            editar.mutate(
                              { id: d.id, texto: editando.texto.trim() },
                              { onSuccess: () => setEditando(null) },
                            )
                          }
                        >
                          Guardar
                        </Button>
                        <Button variant="ghost" onClick={() => setEditando(null)}>
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <span>{d.texto}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditando({ id: d.id, texto: d.texto })}
                        >
                          Corregir
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-2">
                <Input
                  value={nuevo}
                  placeholder="Agregar un desempeño a este grado"
                  onChange={(e) => setNuevo(e.target.value)}
                />
                <Button
                  disabled={!nuevo.trim() || crear.isPending}
                  onClick={() =>
                    crear.mutate(
                      { competenciaId, grado, texto: nuevo.trim() },
                      { onSuccess: () => setNuevo("") },
                    )
                  }
                >
                  Agregar
                </Button>
              </div>
            </PageState>
          )}
        </div>
      </PageState>
    </div>
  );
}
