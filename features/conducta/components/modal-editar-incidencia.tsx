"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useActualizarIncidenciaMutation } from "../hooks";
import type { GravedadFalta, IncidenciaItem } from "../types";

interface FormEditarIncidenciaProps {
  incidencia: IncidenciaItem;
  onClose: () => void;
}

function FormEditarIncidencia({ incidencia, onClose }: FormEditarIncidenciaProps) {
  const [categoria, setCategoria] = React.useState(incidencia.categoria);
  const [gravedad, setGravedad] = React.useState<GravedadFalta>(incidencia.gravedad ?? "leve");
  const [descripcion, setDescripcion] = React.useState(incidencia.descripcion);
  const [lugar, setLugar] = React.useState(incidencia.lugar ?? "");
  const [medidasTomadas, setMedidasTomadas] = React.useState(incidencia.medidasTomadas ?? "");

  const editarMutation = useActualizarIncidenciaMutation({
    onSuccess: onClose,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={Edit02Icon} className="text-primary" />
          Corregir Incidencia ({incidencia.estudianteNombre})
        </DialogTitle>
        <DialogDescription>
          Permitido dentro de las 24 horas posteriores al registro por el autor o director.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-categoria">Categoría</Label>
          <Input
            id="edit-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        {incidencia.tipo === "falta" && (
          <div className="space-y-2">
            <Label htmlFor="edit-gravedad">Gravedad</Label>
            <Select value={gravedad} onValueChange={(val) => setGravedad(val as GravedadFalta)}>
              <SelectTrigger id="edit-gravedad">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leve">Falta Leve</SelectItem>
                <SelectItem value="grave">Falta Grave</SelectItem>
                <SelectItem value="muy_grave">Falta Muy Grave</SelectItem>
              </SelectContent>
            </Select>
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-medidas">Medidas tomadas</Label>
          <Input
            id="edit-medidas"
            value={medidasTomadas}
            onChange={(e) => setMedidasTomadas(e.target.value)}
            maxLength={1000}
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={editarMutation.isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={editarMutation.isPending}>
          {editarMutation.isPending ? "Guardando..." : "Guardar Corrección"}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface ModalEditarIncidenciaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidencia: IncidenciaItem | null;
}

export function ModalEditarIncidencia({
  open,
  onOpenChange,
  incidencia,
}: ModalEditarIncidenciaProps) {
  if (!incidencia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <FormEditarIncidencia
          key={incidencia.id}
          incidencia={incidencia}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
