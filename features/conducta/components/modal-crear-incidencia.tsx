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
import { AlertCircleIcon, Award01Icon, Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMatriculasQuery } from "@/features/matriculas/hooks";
import { useCrearIncidenciaMutation } from "../hooks";
import type { GravedadFalta, TipoIncidencia } from "../types";

interface ModalCrearIncidenciaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMatriculaId?: string;
}

const CATEGORIAS_SUGERIDAS_MERITO = [
  "Participación destacada",
  "Solidaridad y compañerismo",
  "Puntualidad impecable",
  "Liderazgo positivo",
  "Cuidado del medio ambiente",
];

const CATEGORIAS_SUGERIDAS_FALTA = [
  "Uniforme escolar",
  "Puntualidad",
  "Uso no autorizado de celular",
  "Interrupción reiterada de clase",
  "Falta de respeto a compañeros",
  "Daño a infraestructura",
];

export function ModalCrearIncidencia({
  open,
  onOpenChange,
  defaultMatriculaId,
}: ModalCrearIncidenciaProps) {
  const todayStr = React.useMemo(() => new Date().toISOString().split("T")[0], []);

  // Form states
  const [matriculaId, setMatriculaId] = React.useState(defaultMatriculaId ?? "");
  const [fecha, setFecha] = React.useState(todayStr);
  const [tipo, setTipo] = React.useState<TipoIncidencia>("falta");
  const [categoria, setCategoria] = React.useState("");
  const [gravedad, setGravedad] = React.useState<GravedadFalta>("leve");
  const [descripcion, setDescripcion] = React.useState("");
  const [lugar, setLugar] = React.useState("");
  const [medidasTomadas, setMedidasTomadas] = React.useState("");

  // Estudiantes matriculados para el selector
  const { data: matriculasData, isLoading: isLoadingMatriculas } = useMatriculasQuery({
    limit: 100,
    estado: "matriculado",
  });
  const matriculas = matriculasData?.data ?? [];

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setCategoria("");
      setDescripcion("");
      setLugar("");
      setMedidasTomadas("");
    }
    onOpenChange(newOpen);
  };

  const crearMutation = useCrearIncidenciaMutation({
    onSuccess: () => {
      handleClose(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matriculaId || !categoria.trim() || !descripcion.trim() || !fecha) {
      return;
    }

    crearMutation.mutate({
      matriculaId,
      fecha,
      tipo,
      categoria: categoria.trim(),
      gravedad: tipo === "falta" ? gravedad : undefined,
      descripcion: descripcion.trim(),
      lugar: lugar.trim() || undefined,
      medidasTomadas: medidasTomadas.trim() || undefined,
    });
  };

  const categoriasSugeridas =
    tipo === "merito" ? CATEGORIAS_SUGERIDAS_MERITO : CATEGORIAS_SUGERIDAS_FALTA;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon
                icon={tipo === "merito" ? Award01Icon : AlertCircleIcon}
                className={tipo === "merito" ? "text-emerald-500" : "text-amber-500"}
              />
              Registrar Incidencia de Conducta
            </DialogTitle>
            <DialogDescription>
              Documente acciones formativas, méritos o faltas con notificación inmediata al
              apoderado.
            </DialogDescription>
          </DialogHeader>

          {/* Selector de Tipo (Mérito vs Falta) */}
          <div className="space-y-2">
            <Label>Tipo de Incidencia</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                  tipo === "merito"
                    ? "border-emerald-500 bg-emerald-500/15 font-semibold text-emerald-700 dark:text-emerald-400"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
                onClick={() => {
                  setTipo("merito");
                  setCategoria("");
                }}
              >
                <HugeiconsIcon
                  icon={Award01Icon}
                  className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                />
                Mérito (+)
              </button>

              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                  tipo === "falta"
                    ? "border-amber-500 bg-amber-500/15 font-semibold text-amber-700 dark:text-amber-400"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
                onClick={() => {
                  setTipo("falta");
                  setCategoria("");
                }}
              >
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  className="h-4 w-4 text-amber-600 dark:text-amber-400"
                />
                Falta (−)
              </button>
            </div>
          </div>

          {/* Selección del Estudiante */}
          <div className="space-y-2">
            <Label htmlFor="estudiante-select">Estudiante</Label>
            <Select
              value={matriculaId}
              onValueChange={setMatriculaId}
              disabled={isLoadingMatriculas || Boolean(defaultMatriculaId)}
            >
              <SelectTrigger id="estudiante-select">
                <SelectValue placeholder="Seleccione un estudiante..." />
              </SelectTrigger>
              <SelectContent className="max-h-[220px]">
                {matriculas.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.estudiante.apellidos}, {m.estudiante.nombres} ({m.gradoNombre}{" "}
                    {m.seccionNombre})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="fecha-incidencia">Fecha</Label>
              <Input
                id="fecha-incidencia"
                type="date"
                max={todayStr}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            {/* Gravedad (Solo para faltas) */}
            {tipo === "falta" && (
              <div className="space-y-2">
                <Label htmlFor="gravedad-select">Gravedad</Label>
                <Select value={gravedad} onValueChange={(val) => setGravedad(val as GravedadFalta)}>
                  <SelectTrigger id="gravedad-select">
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

          {/* Categoría y sugerencias rápidas */}
          <div className="space-y-2">
            <Label htmlFor="categoria-input">Categoría</Label>
            <Input
              id="categoria-input"
              placeholder="Ej. Puntualidad, Respeto..."
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              maxLength={100}
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categoriasSugeridas.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategoria(cat)}
                  className="bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full px-2.5 py-0.5 text-[11px] transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion-input">Descripción detallada</Label>
            <Textarea
              id="descripcion-input"
              placeholder="Detalle los hechos observados de forma objetiva y formativa..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Lugar */}
            <div className="space-y-2">
              <Label htmlFor="lugar-input">Lugar (opcional)</Label>
              <Input
                id="lugar-input"
                placeholder="Ej. Patio, Aula de 3.° B..."
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Medidas tomadas */}
            <div className="space-y-2">
              <Label htmlFor="medidas-input">Medidas tomadas (opcional)</Label>
              <Input
                id="medidas-input"
                placeholder="Ej. Diálogo reflexivo..."
                value={medidasTomadas}
                onChange={(e) => setMedidasTomadas(e.target.value)}
                maxLength={1000}
              />
            </div>
          </div>

          {/* Aviso sobre notificación al apoderado */}
          <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-500/10 p-3 text-xs text-blue-700 dark:border-blue-800 dark:text-blue-400">
            <HugeiconsIcon icon={Notification01Icon} className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <strong>Aviso automático:</strong> Al guardar este registro se notificará
              automáticamente en el sistema al apoderado principal del estudiante.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={crearMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={crearMutation.isPending}>
              {crearMutation.isPending ? "Guardando..." : "Registrar Incidencia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
