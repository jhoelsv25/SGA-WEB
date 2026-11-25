"use client";

import * as React from "react";
import { Copy01Icon, CheckmarkCircle02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { SelectOption } from "@/components/common/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAniosQuery } from "@/features/anio-escolar/hooks/use-anios-query";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useClonarSeccionesMutation } from "../../hooks";
import type { ClonarSeccionesResultado } from "../../types";

interface ClonarSeccionesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClonarSeccionesModal({ open, onOpenChange }: ClonarSeccionesModalProps) {
  const { anio: anioVigente } = useAnioLectivo();
  const { data: anios = [], isLoading: isLoadingAnios } = useAniosQuery();
  const clonarMutation = useClonarSeccionesMutation();

  const [anioOrigenId, setAnioOrigenId] = React.useState<string>("");
  const [copiarTutores, setCopiarTutores] = React.useState<boolean>(false);
  const [copiarAulas, setCopiarAulas] = React.useState<boolean>(true);
  const [resultado, setResultado] = React.useState<ClonarSeccionesResultado | null>(null);

  // Filtrar años para excluir el año de trabajo actual
  const aniosDisponibles = React.useMemo(() => {
    return anios.filter((a) => a.id !== anioVigente?.id);
  }, [anios, anioVigente]);

  const idOrigenEfectivo = anioOrigenId || aniosDisponibles[0]?.id || "";

  const handleClose = () => {
    setResultado(null);
    onOpenChange(false);
  };

  const handleClonar = async () => {
    if (!idOrigenEfectivo) return;
    try {
      const res = await clonarMutation.mutateAsync({
        anioOrigenId: idOrigenEfectivo,
        copiarTutores,
        copiarAulas,
      });
      setResultado(res);
    } catch {
      // Manejado en onError de la mutación
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Clonar secciones de un año escolar anterior"
      description="Copia la estructura de secciones de un año previo al año lectivo actual, generando su carga académica automáticamente."
      icon={Copy01Icon}
      size="lg"
    >
      {resultado ? (
        <div className="space-y-4">
          <div className="space-y-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs">
            <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
              <span>Proceso de clonación finalizado</span>
            </div>
            <p className="text-muted-foreground">{resultado.mensaje}</p>
          </div>

          {resultado.omitidas.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
                <span>Secciones omitidas ({resultado.omitidas.length})</span>
              </div>
              <div className="border-border/70 max-h-40 space-y-1.5 overflow-y-auto rounded-xl border p-2 text-xs">
                {resultado.omitidas.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-border/40 flex justify-between border-b p-1.5 last:border-b-0"
                  >
                    <span className="text-foreground font-medium">
                      {item.gradoNombre} - Sección &quot;{item.nombre}&quot;
                    </span>
                    <span className="text-muted-foreground text-[11px] italic">{item.motivo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-border/40 flex justify-end border-t pt-3">
            <Button
              type="button"
              size="sm"
              onClick={handleClose}
              className="h-9 rounded-full px-4 text-xs shadow-xs"
            >
              Cerrar y Actualizar
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-foreground font-semibold">
              Año escolar de origen <span className="text-destructive">*</span>
            </label>
            <p className="text-muted-foreground text-[11px]">
              Selecciona el año lectivo del cual deseas copiar las secciones.
            </p>
            <SelectOption
              value={idOrigenEfectivo}
              onSelect={(val) => setAnioOrigenId(val)}
              options={aniosDisponibles.map((a) => ({
                value: a.id,
                label: `${a.nombre || a.anio} (${a.estado})`,
              }))}
              placeholder={
                isLoadingAnios
                  ? "Cargando años escolares..."
                  : aniosDisponibles.length === 0
                    ? "No hay otros años disponibles"
                    : "Selecciona un año escolar"
              }
              disabled={isLoadingAnios || aniosDisponibles.length === 0}
            />
          </div>

          <div className="border-border/70 space-y-3 rounded-xl border p-3">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="copiarAulas"
                checked={copiarAulas}
                onCheckedChange={(c) => setCopiarAulas(!!c)}
              />
              <div className="grid gap-0.5 leading-none">
                <label htmlFor="copiarAulas" className="text-foreground cursor-pointer font-medium">
                  Conservar aulas físicas
                </label>
                <p className="text-muted-foreground text-[11px]">
                  Mantiene asignada la misma aula que tenía cada sección en el año de origen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Checkbox
                id="copiarTutores"
                checked={copiarTutores}
                onCheckedChange={(c) => setCopiarTutores(!!c)}
              />
              <div className="grid gap-0.5 leading-none">
                <label
                  htmlFor="copiarTutores"
                  className="text-foreground cursor-pointer font-medium"
                >
                  Intentar conservar tutores asignados
                </label>
                <p className="text-muted-foreground text-[11px]">
                  Asigna al mismo docente tutor si continúa activo en el año actual.
                </p>
              </div>
            </div>
          </div>

          <div className="border-border/40 flex justify-end gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={clonarMutation.isPending}
              className="h-9 rounded-full px-4 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleClonar}
              disabled={!anioOrigenId || clonarMutation.isPending}
              className="h-9 rounded-full px-5 text-xs shadow-xs"
            >
              {clonarMutation.isPending ? "Clonando..." : "Clonar Secciones"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
