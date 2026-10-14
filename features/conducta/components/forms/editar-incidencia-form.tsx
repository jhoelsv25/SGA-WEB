"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { useActualizarIncidenciaMutation } from "../../hooks";
import { OPCIONES_GRAVEDAD } from "../../constants";
import type { GravedadFalta, IncidenciaItem } from "../../types";

export interface EditarIncidenciaFormProps {
  incidencia: IncidenciaItem;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function EditarIncidenciaForm({
  incidencia,
  onCancel,
  onSuccess,
}: EditarIncidenciaFormProps) {
  const [categoria, setCategoria] = React.useState(incidencia.categoria);
  const [gravedad, setGravedad] = React.useState<GravedadFalta>(incidencia.gravedad ?? "leve");
  const [descripcion, setDescripcion] = React.useState(incidencia.descripcion);
  const [lugar, setLugar] = React.useState(incidencia.lugar ?? "");
  const [medidasTomadas, setMedidasTomadas] = React.useState(incidencia.medidasTomadas ?? "");

  const editarMutation = useActualizarIncidenciaMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria.trim() || !descripcion.trim()) return;

    editarMutation.mutate({
      id: incidencia.id,
      payload: {
        categoria: categoria.trim(),
        gravedad: incidencia.tipo === "falta" ? gravedad : undefined,
        descripcion: descripcion.trim(),
        lugar: lugar.trim() || undefined,
        medidasTomadas: medidasTomadas.trim() || undefined,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-categoria">Categoría</Label>
          <Input
            id="edit-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            maxLength={100}
            disabled={editarMutation.isPending}
          />
        </div>

        {incidencia.tipo === "falta" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gravedad</Label>
            <SelectOption
              value={gravedad}
              onSelect={(val: GravedadFalta) => setGravedad(val)}
              options={OPCIONES_GRAVEDAD}
              placeholder="Seleccionar gravedad..."
              disabled={editarMutation.isPending}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-descripcion">Descripción</Label>
        <Textarea
          id="edit-descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          rows={3}
          maxLength={1000}
          disabled={editarMutation.isPending}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-lugar">Lugar</Label>
          <Input
            id="edit-lugar"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            maxLength={100}
            disabled={editarMutation.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-medidas">Medidas tomadas</Label>
          <Input
            id="edit-medidas"
            value={medidasTomadas}
            onChange={(e) => setMedidasTomadas(e.target.value)}
            maxLength={1000}
            disabled={editarMutation.isPending}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={editarMutation.isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={editarMutation.isPending} className="gap-2">
          {editarMutation.isPending && <Spinner className="size-4" />}
          {editarMutation.isPending ? "Guardando..." : "Guardar Corrección"}
        </Button>
      </div>
    </form>
  );
}
