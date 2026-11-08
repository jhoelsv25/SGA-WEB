"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  UserGroupIcon,
  UserAdd01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { useEstudiantesQuery } from "@/features/estudiantes/hooks/use-estudiantes";
import { useSeccionesQuery } from "@/features/secciones";
import type { Seccion } from "@/features/secciones/types";
import { useMatricularLoteMutation } from "../../hooks";
import type { Estudiante } from "@/features/estudiantes/types/estudiantes.types";
import type { TipoMatricula } from "../../types";

interface ModalBuscarEstudianteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Estudiante elegido para matrícula individual */
  onSeleccionar: (estudiante: Estudiante) => void;
}

export function ModalBuscarEstudiante({
  open,
  onOpenChange,
  onSeleccionar,
}: ModalBuscarEstudianteProps) {
  const [termino, setTermino] = React.useState("");
  const [busqueda, setBusqueda] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [seccionDestinoId, setSeccionDestinoId] = React.useState("");
  const [tipoMatricula, setTipoMatricula] = React.useState<TipoMatricula>("nuevo");

  // Consulta de estudiantes del padrón
  const { data, isFetching } = useEstudiantesQuery({
    estado: "activo",
    search: busqueda || undefined,
    limit: 100,
  });
  const estudiantes = data?.data ?? [];

  // Consulta de secciones del año activo para asignar
  const { data: seccionesData, isLoading: loadingSecciones } = useSeccionesQuery();

  const seccionesOptions: SelectOptionItem<string>[] = React.useMemo(() => {
    return ((seccionesData as Seccion[] | undefined) ?? [])
      .filter((s) => s.estado === "activa")
      .map((s) => {
        const disponibles = Math.max(0, s.vacantes - s.matriculados);
        return {
          value: s.id,
          label: `${s.gradoNumero}.° ${s.nombre}`,
          description: `${disponibles} vacantes disponibles de ${s.vacantes}`,
          disabled: disponibles <= 0,
        };
      });
  }, [seccionesData]);

  const seccionSeleccionada = React.useMemo(
    () => (seccionesData as Seccion[] | undefined)?.find((s) => s.id === seccionDestinoId),
    [seccionesData, seccionDestinoId],
  );

  const vacantesDisponibles = seccionSeleccionada
    ? Math.max(0, seccionSeleccionada.vacantes - seccionSeleccionada.matriculados)
    : 0;

  const tipoOptions: SelectOptionItem<TipoMatricula>[] = [
    { value: "nuevo", label: "Nuevo ingreso" },
    { value: "continuador", label: "Continuador" },
    { value: "traslado", label: "Traslado" },
  ];

  // Mutación en lote
  const loteMutation = useMatricularLoteMutation(() => {
    setSelectedIds(new Set());
    setSeccionDestinoId("");
    onOpenChange(false);
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === estudiantes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(estudiantes.map((e) => e.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedIds(new Set());
      setSeccionDestinoId("");
      setTermino("");
      setBusqueda("");
    }
    onOpenChange(nextOpen);
  };

  const handleMatricularLote = () => {
    if (!seccionDestinoId || selectedIds.size === 0) return;
    loteMutation.mutate({
      seccionId: seccionDestinoId,
      estudianteIds: Array.from(selectedIds),
      tipo: tipoMatricula,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Matrícula de Estudiantes"
      description="Selecciona uno o varios estudiantes del padrón para matricularlos masivamente o individualmente."
      icon={UserGroupIcon}
      size="xl"
    >
      <div className="space-y-4">
        {/* Barra de Búsqueda */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setBusqueda(termino.trim());
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            />
            <Input
              autoFocus
              placeholder="Buscar por DNI, nombres o apellidos..."
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <Button type="submit" size="sm" className="h-10 rounded-full px-5 text-xs">
            Buscar
          </Button>
        </form>

        {/* Cabecera de Selección */}
        {estudiantes.length > 0 && (
          <div className="bg-muted/40 flex items-center justify-between rounded-xl px-3 py-2 text-xs">
            <label className="flex cursor-pointer items-center gap-2 font-medium">
              <Checkbox
                checked={
                  selectedIds.size === estudiantes.length && estudiantes.length > 0
                    ? true
                    : selectedIds.size > 0
                      ? "indeterminate"
                      : false
                }
                onCheckedChange={toggleSelectAll}
              />
              <span>
                {selectedIds.size === 0
                  ? "Seleccionar todos"
                  : `${selectedIds.size} de ${estudiantes.length} seleccionados`}
              </span>
            </label>
            {selectedIds.size > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
                className="text-muted-foreground hover:text-foreground h-7 text-xs"
              >
                Deseleccionar
              </Button>
            )}
          </div>
        )}

        {/* Lista de Estudiantes con Checkbox */}
        <ul className="max-h-72 divide-y overflow-y-auto rounded-xl border">
          {isFetching ? (
            <li className="text-muted-foreground p-6 text-center text-xs">
              Cargando padrón de estudiantes...
            </li>
          ) : estudiantes.length === 0 ? (
            <li className="text-muted-foreground p-6 text-center text-xs">
              No se encontraron estudiantes activos disponibles.
            </li>
          ) : (
            estudiantes.map((est) => {
              const isSelected = selectedIds.has(est.id);
              const nombre =
                est.persona.nombreCompleto ||
                `${est.persona.apellidoPaterno} ${est.persona.apellidoMaterno ?? ""}, ${est.persona.nombres}`.trim();

              return (
                <li
                  key={est.id}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors ${
                    isSelected ? "bg-primary/5" : "hover:bg-muted/40"
                  }`}
                >
                  <label className="flex flex-1 cursor-pointer items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelectOne(est.id)}
                    />
                    <div className="flex flex-col">
                      <span className="text-foreground text-sm font-medium">{nombre}</span>
                      <span className="text-muted-foreground text-xs">
                        Doc: {est.persona.numeroDocumento}
                        {est.codigo ? ` · Código: ${est.codigo}` : ""}
                      </span>
                    </div>
                  </label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full px-3 text-xs"
                    onClick={() => {
                      onSeleccionar(est);
                      onOpenChange(false);
                    }}
                  >
                    <HugeiconsIcon icon={UserAdd01Icon} className="mr-1 size-3.5" />
                    Individual
                  </Button>
                </li>
              );
            })
          )}
        </ul>

        {/* Panel de Asignación en Lote cuando hay selección */}
        {selectedIds.size > 0 && (
          <div className="border-primary/20 bg-primary/5 space-y-3 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <span className="text-primary text-xs font-semibold">
                Asignar {selectedIds.size} estudiante(s) seleccionados
              </span>
              {seccionSeleccionada && (
                <span
                  className={`text-xs font-semibold ${
                    vacantesDisponibles >= selectedIds.size
                      ? "text-emerald-600"
                      : "text-destructive"
                  }`}
                >
                  {vacantesDisponibles} vacantes disponibles
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Sección Destino *</Label>
                <SelectOption
                  options={seccionesOptions}
                  value={seccionDestinoId}
                  onSelect={(val) => setSeccionDestinoId(val)}
                  placeholder={
                    loadingSecciones ? "Cargando secciones..." : "Elegir sección (ej. 1.° A)..."
                  }
                  searchPlaceholder="Buscar sección..."
                  disabled={loadingSecciones || loteMutation.isPending}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Tipo de Matrícula</Label>
                <SelectOption
                  options={tipoOptions}
                  value={tipoMatricula}
                  onSelect={(val) => setTipoMatricula(val as TipoMatricula)}
                  placeholder="Tipo de matrícula..."
                  disabled={loteMutation.isPending}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
                disabled={loteMutation.isPending}
                className="h-9 rounded-full px-4 text-xs"
              >
                Cancelar Selección
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleMatricularLote}
                disabled={!seccionDestinoId || loteMutation.isPending}
                className="h-9 gap-1.5 rounded-full px-5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                {loteMutation.isPending
                  ? "Matriculando..."
                  : `Matricular ${selectedIds.size} estudiante(s)`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
