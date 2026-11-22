"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  RefreshIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMatriculaMasivaMutation, usePreviewPromocionQuery } from "@/features/matriculas/hooks";
import type { ResumenSeccionPromocionItem } from "@/features/matriculas/types";
import type { Seccion } from "@/features/secciones/types";

interface PasoPromocionSeccionesProps {
  anioOrigenNumero: number;
  anioDestinoNumero: number;
  seccionesOrigen: Seccion[];
  seccionesDestino: Seccion[];
  resumenPorSeccion: Map<string, ResumenSeccionPromocionItem>;
  onRefreshSecciones: () => void;
  onContinuar: () => void;
}

interface ModalPromocionActivo {
  origenId: string;
  destinoId: string;
  gradoOrigen: number;
  esRepitente: boolean;
}

export function PasoPromocionSecciones({
  anioOrigenNumero,
  anioDestinoNumero,
  seccionesOrigen,
  seccionesDestino,
  resumenPorSeccion,
  onRefreshSecciones,
  onContinuar,
}: PasoPromocionSeccionesProps) {
  const seccionesPromovibles = React.useMemo(
    () =>
      seccionesOrigen
        .filter((s) => s.gradoNumero >= 1 && s.gradoNumero <= 4)
        .sort((a, b) => a.gradoNumero - b.gradoNumero || a.nombre.localeCompare(b.nombre, "es")),
    [seccionesOrigen],
  );

  const [mapeoManual, setMapeoManual] = React.useState<Record<string, string>>({});
  const [modalActivo, setModalActivo] = React.useState<ModalPromocionActivo | null>(null);
  const [desmarcados, setDesmarcados] = React.useState<Record<string, boolean>>({});

  const mapeoDestino = React.useMemo(() => {
    const resultado: Record<string, string> = {};
    for (const origen of seccionesPromovibles) {
      if (mapeoManual[origen.id]) {
        resultado[origen.id] = mapeoManual[origen.id];
        continue;
      }
      const candidatas = seccionesDestino.filter(
        (d) => d.gradoNumero === origen.gradoNumero + 1 && d.estado === "activa",
      );
      const exacta = candidatas.find(
        (d) => d.nombre.trim().toUpperCase() === origen.nombre.trim().toUpperCase(),
      );
      if (exacta) {
        resultado[origen.id] = exacta.id;
      } else if (candidatas[0]) {
        resultado[origen.id] = candidatas[0].id;
      }
    }
    return resultado;
  }, [seccionesPromovibles, seccionesDestino, mapeoManual]);

  const previewQuery = usePreviewPromocionQuery(
    modalActivo?.origenId ?? "",
    modalActivo?.destinoId ?? "",
  );

  const promoverMutation = useMatriculaMasivaMutation(() => {
    setModalActivo(null);
    setDesmarcados({});
    onRefreshSecciones();
  });

  const aPromover = previewQuery.data?.aPromover ?? [];
  const seleccionados = aPromover.filter((e) => !desmarcados[e.estudianteId]);
  const vacantesDestino = previewQuery.data?.seccionDestino.vacantesDisponibles ?? 0;
  const excedeVacantes = seleccionados.length > vacantesDestino;

  const abrirPromocion = (origen: Seccion, destinoId: string) => {
    setDesmarcados({});
    setModalActivo({
      origenId: origen.id,
      destinoId,
      gradoOrigen: origen.gradoNumero,
      esRepitente: false,
    });
  };

  const abrirRepitentes = (origen: Seccion) => {
    const candidatasMismoGrado = seccionesDestino.filter(
      (d) => d.gradoNumero === origen.gradoNumero && d.estado === "activa",
    );
    const sugerida =
      candidatasMismoGrado.find(
        (d) => d.nombre.trim().toUpperCase() === origen.nombre.trim().toUpperCase(),
      ) ?? candidatasMismoGrado[0];
    if (!sugerida) return;
    setDesmarcados({});
    setModalActivo({
      origenId: origen.id,
      destinoId: sugerida.id,
      gradoOrigen: origen.gradoNumero,
      esRepitente: true,
    });
  };

  const opcionesRepitenteModal: SelectOptionItem<string>[] = React.useMemo(() => {
    if (!modalActivo?.esRepitente) return [];
    return seccionesDestino
      .filter((d) => d.gradoNumero === modalActivo.gradoOrigen && d.estado === "activa")
      .map((d) => {
        const disponibles = Math.max(0, d.vacantes - d.matriculados);
        return {
          value: d.id,
          label: `${d.gradoNumero}.° ${d.nombre} (${anioDestinoNumero})`,
          description: `${disponibles} vacantes disponibles de ${d.vacantes}`,
        };
      });
  }, [modalActivo, seccionesDestino, anioDestinoNumero]);

  const toggleTodos = () => {
    const todosMarcados = seleccionados.length === aPromover.length;
    const next: Record<string, boolean> = {};
    for (const item of aPromover) {
      next[item.estudianteId] = todosMarcados;
    }
    setDesmarcados(next);
  };

  const confirmar = () => {
    if (!modalActivo || seleccionados.length === 0) return;
    promoverMutation.mutate({
      seccionOrigenId: modalActivo.origenId,
      seccionDestinoId: modalActivo.destinoId,
      estudianteIds: seleccionados.map((e) => e.estudianteId),
      esRepitente: modalActivo.esRepitente,
    });
  };

  const porGrado = React.useMemo(() => {
    const map = new Map<number, Seccion[]>();
    for (const sec of seccionesPromovibles) {
      const lista = map.get(sec.gradoNumero) ?? [];
      lista.push(sec);
      map.set(sec.gradoNumero, lista);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [seccionesPromovibles]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Paso 3: Promoción masiva de 1.° a 4.° grado</CardTitle>
            <CardDescription>
              Promueva sección por sección desde {anioOrigenNumero} hacia el grado superior en{" "}
              {anioDestinoNumero}. Si desmarca estudiantes repitentes, podrá matricularlos en el
              mismo grado directamente con el botón <strong>Repitentes</strong>.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onContinuar}>
            Ir a Egreso de 5.° (Paso 4)
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {porGrado.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              No se encontraron secciones de 1.° a 4.° grado en el año {anioOrigenNumero}.
            </p>
          ) : (
            porGrado.map(([gradoNumero, lista]) => {
              const candidatasGrado = seccionesDestino.filter(
                (d) => d.gradoNumero === gradoNumero + 1 && d.estado === "activa",
              );
              const tieneMismoGradoDestino = seccionesDestino.some(
                (d) => d.gradoNumero === gradoNumero && d.estado === "activa",
              );

              const opcionesDestino: SelectOptionItem<string>[] = candidatasGrado.map((d) => {
                const disponibles = Math.max(0, d.vacantes - d.matriculados);
                return {
                  value: d.id,
                  label: `${d.gradoNumero}.° ${d.nombre} (${anioDestinoNumero})`,
                  description: `${disponibles} vacantes disponibles de ${d.vacantes}`,
                };
              });

              return (
                <div key={gradoNumero} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">
                      {gradoNumero}.° grado ({anioOrigenNumero}) → {gradoNumero + 1}.° grado (
                      {anioDestinoNumero})
                    </h3>
                    <span className="text-muted-foreground text-xs">
                      ({lista.length} secciones)
                    </span>
                  </div>

                  <div className="divide-y rounded-xl border">
                    {lista.map((origen) => {
                      const destinoId = mapeoDestino[origen.id] ?? "";
                      const destino = seccionesDestino.find((d) => d.id === destinoId);
                      const resumen = resumenPorSeccion.get(origen.id);
                      const totalCulminados = resumen?.totalCulminados ?? 0;
                      const yaMatriculados = resumen?.yaMatriculadosDestino ?? 0;
                      const pendientes = resumen?.pendientes ?? 0;
                      const completa = totalCulminados > 0 && pendientes === 0;

                      return (
                        <div
                          key={origen.id}
                          className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                              {origen.gradoNumero}°{origen.nombre}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {origen.gradoNombre} — Sección {origen.nombre}
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                {totalCulminados === 0 ? (
                                  <span className="text-muted-foreground">Sin culminados</span>
                                ) : completa ? (
                                  <StatusBadge tone="success">
                                    Completa ({yaMatriculados}/{totalCulminados})
                                  </StatusBadge>
                                ) : (
                                  <>
                                    <StatusBadge tone={yaMatriculados > 0 ? "info" : "neutral"}>
                                      {yaMatriculados}/{totalCulminados} matriculados
                                    </StatusBadge>
                                    <StatusBadge tone="warning">
                                      {pendientes} pendientes
                                    </StatusBadge>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              className="text-muted-foreground hidden size-4 sm:block"
                            />
                            <div className="w-full sm:w-52">
                              <SelectOption
                                options={opcionesDestino}
                                value={destinoId}
                                onSelect={(val) =>
                                  setMapeoManual((prev) => ({ ...prev, [origen.id]: val }))
                                }
                                placeholder="Sección destino..."
                                searchPlaceholder="Buscar sección..."
                                className="h-9 text-xs"
                              />
                            </div>

                            {pendientes > 0 && tieneMismoGradoDestino ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => abrirRepitentes(origen)}
                                className="gap-1.5"
                              >
                                <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
                                Repitentes ({pendientes})
                              </Button>
                            ) : null}

                            <Button
                              size="sm"
                              variant={completa || totalCulminados === 0 ? "outline" : "default"}
                              disabled={!destino || pendientes === 0}
                              onClick={() => destino && abrirPromocion(origen, destino.id)}
                              className="gap-1.5"
                            >
                              <HugeiconsIcon icon={UserGroupIcon} className="size-3.5" />
                              {completa ? "Revisada" : "Revisar y promover"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalActivo !== null}
        onOpenChange={(open) => {
          if (!open) {
            setModalActivo(null);
            setDesmarcados({});
          }
        }}
        title={
          modalActivo?.esRepitente
            ? "Matricular estudiantes repitentes (mismo grado)"
            : "Vista previa de promoción"
        }
        description={
          previewQuery.data
            ? `${previewQuery.data.seccionOrigen.grado} ${previewQuery.data.seccionOrigen.nombre} (${previewQuery.data.seccionOrigen.anio}) → ${previewQuery.data.seccionDestino.grado} ${previewQuery.data.seccionDestino.nombre} (${previewQuery.data.seccionDestino.anio})`
            : "Verifique la lista de estudiantes antes de matricularlos."
        }
        icon={modalActivo?.esRepitente ? RefreshIcon : UserGroupIcon}
        size="xl"
      >
        {modalActivo?.esRepitente ? (
          <div className="mb-3 space-y-1.5">
            <Label className="text-xs font-semibold">
              Sección de {modalActivo.gradoOrigen}.° grado en {anioDestinoNumero} (repitentes)
            </Label>
            <SelectOption
              options={opcionesRepitenteModal}
              value={modalActivo.destinoId}
              onSelect={(val) =>
                setModalActivo((prev) => (prev ? { ...prev, destinoId: val } : null))
              }
              placeholder="Elegir sección..."
              searchPlaceholder="Buscar sección..."
              className="h-9 text-xs"
            />
          </div>
        ) : null}

        {previewQuery.isLoading ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Consultando estudiantes culminados...
          </p>
        ) : previewQuery.isError ? (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-700 dark:text-red-400">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0" />
            <span>{previewQuery.error.message}</span>
          </div>
        ) : previewQuery.data ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-muted/40 rounded-lg border p-2.5">
                <p className="text-muted-foreground">Pendientes</p>
                <p className="text-base font-bold">{previewQuery.data.totalAPromover}</p>
              </div>
              <div className="bg-muted/40 rounded-lg border p-2.5">
                <p className="text-muted-foreground">Seleccionados</p>
                <p className="text-primary text-base font-bold">{seleccionados.length}</p>
              </div>
              <div className="bg-muted/40 rounded-lg border p-2.5">
                <p className="text-muted-foreground">Vacantes libres</p>
                <p
                  className={
                    excedeVacantes
                      ? "text-base font-bold text-amber-600"
                      : "text-base font-bold text-emerald-600"
                  }
                >
                  {vacantesDestino}
                </p>
              </div>
            </div>

            {excedeVacantes ? (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0" />
                <span>
                  Hay {seleccionados.length - vacantesDestino} estudiantes por encima de las
                  vacantes disponibles. Se matricularán en orden alfabético hasta completar el
                  aforo.
                </span>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">
                  {modalActivo?.esRepitente
                    ? "Seleccione a los estudiantes que repiten el grado"
                    : "Estudiantes a promover (desmarque repitentes)"}
                </span>
                {aPromover.length > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleTodos}
                    className="h-7 px-2 text-xs"
                  >
                    {seleccionados.length === aPromover.length ? "Desmarcar todos" : "Marcar todos"}
                  </Button>
                ) : null}
              </div>

              <div className="max-h-56 divide-y overflow-y-auto rounded-xl border">
                {aPromover.length === 0 ? (
                  <p className="text-muted-foreground p-4 text-center text-xs">
                    No quedan estudiantes pendientes en esta sección.
                  </p>
                ) : (
                  aPromover.map((est) => {
                    const marcado = !desmarcados[est.estudianteId];
                    return (
                      <label
                        key={est.estudianteId}
                        className="hover:bg-muted/40 flex cursor-pointer items-center justify-between px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Checkbox
                            checked={marcado}
                            onCheckedChange={() =>
                              setDesmarcados((prev) => ({
                                ...prev,
                                [est.estudianteId]: !prev[est.estudianteId],
                              }))
                            }
                          />
                          <span className="font-medium">{est.nombreCompleto}</span>
                        </div>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {est.numeroDocumento}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {previewQuery.data.noPromovidos.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs font-semibold">
                  Ya matriculados u omitidos ({previewQuery.data.noPromovidos.length})
                </span>
                <div className="max-h-32 divide-y overflow-y-auto rounded-xl border text-xs">
                  {previewQuery.data.noPromovidos.map((est) => (
                    <div
                      key={est.estudianteId}
                      className="flex items-center justify-between px-3 py-1.5"
                    >
                      <span>{est.nombreCompleto}</span>
                      <span className="text-muted-foreground text-[11px] italic">{est.motivo}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end gap-2 border-t pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalActivo(null)}
                disabled={promoverMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={promoverMutation.isPending || seleccionados.length === 0}
                onClick={confirmar}
                className="gap-1.5"
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                {promoverMutation.isPending
                  ? "Procesando..."
                  : modalActivo?.esRepitente
                    ? `Matricular como repitentes (${seleccionados.length})`
                    : `Confirmar promoción (${seleccionados.length})`}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
