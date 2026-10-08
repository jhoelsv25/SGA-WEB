"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { EditGradoModal } from "../../components/modals/edit-grado-modal";
import { useUpdateGradoMutation } from "../../hooks";
import type { Grado } from "../../types";
import type { UpdateGradoFormValues } from "../../schemas";

interface GradosViewProps {
  grados: Grado[];
}

export function GradosView({ grados }: GradosViewProps) {
  const [selectedGrado, setSelectedGrado] = React.useState<Grado | null>(null);
  const updateMutation = useUpdateGradoMutation();

  const handleFormSubmit = async (values: UpdateGradoFormValues) => {
    if (!selectedGrado) return;
    await updateMutation.mutateAsync({
      id: selectedGrado.id,
      payload: values,
    });
    setSelectedGrado(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner Informativo de Regla de Negocio (HU1) */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-blue-900 dark:text-blue-200">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400"
        />
        <div>
          <p className="text-foreground font-semibold">Estructura Fija de Secundaria (1.° a 5.°)</p>
          <p className="text-muted-foreground mt-0.5 leading-relaxed">
            El colegio atiende exclusivamente el nivel secundaria: los grados 1.° a 5.° vienen
            predeterminados en el sistema. No se crean ni se eliminan; puedes personalizar el nombre
            visible con el que se mostrarán en todas las pantallas.
          </p>
        </div>
      </div>

      {/* Grid de Grados */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grados.map((g) => (
          <div
            key={g.id}
            className="border-border/80 bg-card hover:border-border flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all hover:shadow-sm"
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl text-sm font-bold">
                  {g.numero}.°
                </span>
                <span className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                  Nivel Secundaria
                </span>
              </div>

              <h3 className="text-foreground mb-1 text-base font-bold">{g.nombre}</h3>
              <p className="text-muted-foreground text-xs">
                Configurado para asignación de planes curriculares y secciones.
              </p>
            </div>

            <div className="border-border/60 mt-5 flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground text-[11px]">Orden: Grado {g.numero}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedGrado(g)}
                className="h-8 gap-1.5 rounded-xl px-3 text-xs font-semibold"
              >
                <HugeiconsIcon icon={Edit01Icon} className="size-3.5" />
                <span>Editar nombre</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Editar Nombre de Grado */}
      <EditGradoModal
        open={Boolean(selectedGrado)}
        onOpenChange={(open) => !open && setSelectedGrado(null)}
        grado={selectedGrado}
        onSubmit={handleFormSubmit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
