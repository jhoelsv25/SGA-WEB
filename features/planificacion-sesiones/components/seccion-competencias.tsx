"use client";

import * as React from "react";
import { SelectOption } from "@/components/common/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompetencias, useDesempenos } from "../hooks";
import type { Bloque, CompetenciaCatalogo, GuardarPlanificacionPayload } from "../types";

type CompetenciaForm = NonNullable<GuardarPlanificacionPayload["competencias"]>[number];

interface Props {
  bloque: Bloque;
  valor: CompetenciaForm[];
  onChange: (v: CompetenciaForm[]) => void;
  disabled?: boolean;
}

/** Elige competencia → capacidades → desempeños del grado del bloque (CNEB). */
export function SeccionCompetencias({ bloque, valor, onChange, disabled }: Props) {
  const { data: todas = [] } = useCompetencias();
  const delArea = React.useMemo(() => {
    const area = bloque.areaCurricular.toLowerCase();
    const coinciden = todas.filter(
      (c) => c.tipo === "area" && (c.areaCodigo ?? "").toLowerCase() === area,
    );
    return coinciden.length > 0 ? coinciden : todas.filter((c) => c.tipo === "area");
  }, [todas, bloque.areaCurricular]);

  const actualizar = (i: number, parche: Partial<CompetenciaForm>) =>
    onChange(valor.map((c, k) => (k === i ? { ...c, ...parche } : c)));

  return (
    <div className="space-y-4">
      {valor.map((c, i) => (
        <BloqueCompetencia
          key={i}
          indice={i}
          grado={bloque.gradoNumero}
          valor={c}
          opciones={delArea}
          todas={todas}
          disabled={disabled}
          onChange={(p) => actualizar(i, p)}
          onQuitar={() => onChange(valor.filter((_, k) => k !== i))}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => onChange([...valor, { competenciaId: "", capacidades: [], desempenos: [] }])}
      >
        Agregar competencia
      </Button>
    </div>
  );
}

interface BloqueProps {
  indice: number;
  grado: number;
  valor: CompetenciaForm;
  opciones: CompetenciaCatalogo[];
  todas: CompetenciaCatalogo[];
  disabled?: boolean;
  onChange: (p: Partial<CompetenciaForm>) => void;
  onQuitar: () => void;
}

function BloqueCompetencia({
  indice,
  grado,
  valor,
  opciones,
  todas,
  disabled,
  onChange,
  onQuitar,
}: BloqueProps) {
  const competencia = todas.find((x) => x.id === valor.competenciaId);
  const { data: desempenos = [] } = useDesempenos(valor.competenciaId || undefined, grado);
  const [propio, setPropio] = React.useState("");

  const alternar = (lista: string[], item: string) =>
    lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item];

  const textosMarcados = new Set(valor.desempenos.map((d) => d.texto));

  return (
    <fieldset className="border-border/80 space-y-3 rounded-2xl border p-4">
      <legend className="px-2 text-sm font-semibold">Competencia {indice + 1}</legend>
      <SelectOption
        options={opciones.map((o) => ({ value: o.id, label: o.nombre }))}
        value={valor.competenciaId || undefined}
        placeholder="Elija la competencia"
        searchPlaceholder="Buscar competencia"
        disabled={disabled}
        onSelect={(id) => onChange({ competenciaId: id, capacidades: [], desempenos: [] })}
      />
      {competencia && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Capacidades</p>
          {competencia.capacidades.map((cap) => (
            <Label key={cap} className="flex items-start gap-2 text-sm font-normal">
              <Checkbox
                checked={valor.capacidades.includes(cap)}
                disabled={disabled}
                onCheckedChange={() => onChange({ capacidades: alternar(valor.capacidades, cap) })}
              />
              <span>{cap}</span>
            </Label>
          ))}
        </div>
      )}
      {competencia && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Desempeños de {grado}.° de secundaria</p>
          {desempenos.length === 0 && (
            <p className="text-muted-foreground text-xs">
              No hay desempeños cargados para este grado; escriba el suyo abajo.
            </p>
          )}
          {desempenos.map((d) => (
            <Label key={d.id} className="flex items-start gap-2 text-sm font-normal">
              <Checkbox
                checked={textosMarcados.has(d.texto)}
                disabled={disabled}
                onCheckedChange={(marcado) =>
                  onChange({
                    desempenos: marcado
                      ? [...valor.desempenos, { desempenoId: d.id, texto: d.texto }]
                      : valor.desempenos.filter((x) => x.texto !== d.texto),
                  })
                }
              />
              <span>{d.texto}</span>
            </Label>
          ))}
          {valor.desempenos
            .filter((d) => !d.desempenoId)
            .map((d) => (
              <div
                key={d.texto}
                className="bg-muted/50 flex items-start gap-2 rounded-lg p-2 text-sm"
              >
                <span className="flex-1">{d.texto}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() =>
                    onChange({ desempenos: valor.desempenos.filter((x) => x.texto !== d.texto) })
                  }
                >
                  Quitar
                </Button>
              </div>
            ))}
          <div className="flex gap-2">
            <Input
              value={propio}
              disabled={disabled}
              placeholder="Precisar o escribir un desempeño propio"
              onChange={(e) => setPropio(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={disabled || !propio.trim()}
              onClick={() => {
                onChange({ desempenos: [...valor.desempenos, { texto: propio.trim() }] });
                setPropio("");
              }}
            >
              Añadir
            </Button>
          </div>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor={`campo-${indice}`}>Campo temático</Label>
        <Input
          id={`campo-${indice}`}
          value={valor.campoTematico ?? ""}
          disabled={disabled}
          onChange={(e) => onChange({ campoTematico: e.target.value })}
        />
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={onQuitar}>
          Quitar competencia
        </Button>
      </div>
    </fieldset>
  );
}
