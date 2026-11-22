"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
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
import {
  useEgresarSeccionMutation,
  useMatriculaMasivaMutation,
  usePreviewEgresoQuery,
  usePreviewPromocionQuery,
} from "@/features/matriculas/hooks";
import type { ResumenSeccionPromocionItem } from "@/features/matriculas/types";
import type { Seccion } from "@/features/secciones/types";

interface PasoEgresoQuintoProps {
  anioOrigenNumero: number;
  anioDestinoNumero?: number;
  seccionesOrigen: Seccion[];
  seccionesDestino: Seccion[];
  resumenPorSeccion: Map<string, ResumenSeccionPromocionItem>;
  onRefreshSecciones: () => void;
  onContinuar: () => void;
}

export function PasoEgresoQuinto({
  anioOrigenNumero,
  anioDestinoNumero,
  seccionesOrigen,
  seccionesDestino,
  resumenPorSeccion,
  onRefreshSecciones,
  onContinuar,
}: PasoEgresoQuintoProps) {
  const seccionesQuinto = React.useMemo(
    () =>
      seccionesOrigen
        .filter((s) => s.gradoNumero === 5)
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    [seccionesOrigen],
  );

  const seccionesQuintoDestino = React.useMemo(
    () =>
      seccionesDestino
        .filter((s) => s.gradoNumero === 5 && s.estado === "activa")
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    [seccionesDestino],
  );

  const [seccionEgresoId, setSeccionEgresoId] = React.useState<string | null>(null);
  const [repitenteModal, setRepitenteModal] = React.useState<{
    origenId: string;
    destinoId: string;
  } | null>(null);
  const [desmarcados, setDesmarcados] = React.useState<Record<string, boolean>>({});

  const previewEgresoQuery = usePreviewEgresoQuery(seccionEgresoId ?? "");
  const previewRepitenteQuery = usePreviewPromocionQuery(
    repitenteModal?.origenId ?? "",
    repitenteModal?.destinoId ?? "",
  );

  const egresarMutation = useEgresarSeccionMutation(() => {
    setSeccionEgresoId(null);
    setDesmarcados({});
  });

  const matricularRepitenteMutation = useMatriculaMasivaMutation(() => {
    setRepitenteModal(null);
    setDesmarcados({});
    onRefreshSecciones();
  });

  const aEgresar = previewEgresoQuery.data?.aEgresar ?? [];
  const seleccionadosEgreso = aEgresar.filter((e) => !desmarcados[e.estudianteId]);

  const aRepetir = previewRepitenteQuery.data?.aPromover ?? [];
  const seleccionadosRepitentes = aRepetir.filter((e) => !desmarcados[e.estudianteId]);

  const opcionesQuintoDestino: SelectOptionItem<string>[] = React.useMemo(
    () =>
      seccionesQuintoDestino.map((s) => {
        const disponibles = Math.max(0, s.vacantes - s.matriculados);
        return {
          value: s.id,
          label: `5.° ${s.nombre} (${anioDestinoNumero ?? "Nuevo año"})`,
          description: `${disponibles} vacantes disponibles de ${s.vacantes}`,
        };
      }),
    [seccionesQuintoDestino, anioDestinoNumero],
  );

  const toggleTodos = (ids: string[], seleccionadosCount: number) => {
    const todosMarcados = seleccionadosCount === ids.length;
    const next: Record<string, boolean> = {};
    for (const id of ids) {
      next[id] = todosMarcados;
    }
    setDesmarcados(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Paso 4: Egreso de estudiantes de 5.° grado</CardTitle>
            <CardDescription>
              Al egresar a los estudiantes de 5.° ({anioOrigenNumero}), su ficha pasa a estado{" "}
              <strong>egresado</strong> y se <strong>anula su carné/QR físico</strong> conservando
              su historial y libretas. Si algún alumno repite 5.°, desmárquelo y use{" "}
              <strong>Repitentes en 5.°</strong>.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={onContinuar}>
            Ir a Finalizar (Paso 5)
          </Button>
        </CardHeader>

        <CardContent>
          {seccionesQuinto.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              No se encontraron secciones de 5.° grado en el año {anioOrigenNumero}.
            </p>
          ) : (
            <div className="divide-y rounded-xl border">
              {seccionesQuinto.map((sec) => {
                const resumen = resumenPorSeccion.get(sec.id);
                const totalCulminados = resumen?.totalCulminados ?? 0;
                const yaEgresados = resumen?.yaEgresados ?? 0;
                const yaRepitentes = resumen?.yaMatriculadosDestino ?? 0;
                const pendientes = resumen?.pendientes ?? 0;
                const completa = totalCulminados > 0 && pendientes === 0;

                const destinoSugerido =
                  seccionesQuintoDestino.find(
                    (d) => d.nombre.trim().toUpperCase() === sec.nombre.trim().toUpperCase(),
                  ) ?? seccionesQuintoDestino[0];

                return (
                  <div
                    key={sec.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                        5°{sec.nombre}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {sec.gradoNombre} — Sección {sec.nombre}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          {totalCulminados === 0 ? (
                            <span className="text-muted-foreground">Sin culminados</span>
                          ) : completa ? (
                            <StatusBadge tone="success">
                              Completa ({yaEgresados} egresados
                              {yaRepitentes > 0 ? ` · ${yaRepitentes} repitentes` : ""})
                            </StatusBadge>
                          ) : (
                            <>
                              <StatusBadge tone={yaEgresados > 0 ? "info" : "neutral"}>
                                {yaEgresados}/{totalCulminados} egresados
                              </StatusBadge>
                              {yaRepitentes > 0 ? (
                                <StatusBadge tone="info">{yaRepitentes} en 5.° nuevo</StatusBadge>
                              ) : null}
                              <StatusBadge tone="warning">{pendientes} pendientes</StatusBadge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {pendientes > 0 && destinoSugerido ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setDesmarcados({});
                            setRepitenteModal({
                              origenId: sec.id,
                              destinoId: destinoSugerido.id,
                            });
                          }}
                          className="gap-1.5"
                        >
                          <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
                          Repitentes en 5.° ({pendientes})
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant={completa || totalCulminados === 0 ? "outline" : "default"}
                        disabled={pendientes === 0}
                        onClick={() => {
                          setDesmarcados({});
                          setSeccionEgresoId(sec.id);
                        }}
                        className="gap-1.5"
                      >
                        <HugeiconsIcon icon={UserGroupIcon} className="size-3.5" />
                        {completa ? "Completada" : "Revisar y egresar"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de egreso */}
      <Modal
        open={seccionEgresoId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSeccionEgresoId(null);
            setDesmarcados({});
          }
        }}
        title="Confirmar egreso de 5.° grado"
        description={
          previewEgresoQuery.data
            ? `${previewEgresoQuery.data.seccion.grado} — Sección ${previewEgresoQuery.data.seccion.nombre} (${previewEgresoQuery.data.seccion.anio})`
            : "Revise los estudiantes que culminarán su etapa escolar."
        }
        icon={UserGroupIcon}
        size="xl"
      >
        {previewEgresoQuery.isLoading ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Cargando estudiantes de 5.° grado...
          </p>
        ) : previewEgresoQuery.isError ? (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-700 dark:text-red-400">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0" />
            <span>{previewEgresoQuery.error.message}</span>
          </div>
        ) : previewEgresoQuery.data ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">
                Estudiantes a marcar como egresados ({seleccionadosEgreso.length} de{" "}
                {aEgresar.length})
              </span>
              {aEgresar.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    toggleTodos(
                      aEgresar.map((e) => e.estudianteId),
                      seleccionadosEgreso.length,
                    )
                  }
                  className="h-7 px-2 text-xs"
                >
                  {seleccionadosEgreso.length === aEgresar.length
                    ? "Desmarcar todos"
                    : "Marcar todos"}
                </Button>
              ) : null}
            </div>

            <div className="max-h-56 divide-y overflow-y-auto rounded-xl border">
              {aEgresar.length === 0 ? (
                <p className="text-muted-foreground p-4 text-center text-xs">
                  No quedan estudiantes pendientes de egreso en esta sección.
                </p>
              ) : (
                aEgresar.map((est) => {
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

            {previewEgresoQuery.data.noEgresables.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs font-semibold">
                  Ya egresados u omitidos ({previewEgresoQuery.data.noEgresables.length})
                </span>
                <div className="max-h-32 divide-y overflow-y-auto rounded-xl border text-xs">
                  {previewEgresoQuery.data.noEgresables.map((est) => (
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
                onClick={() => setSeccionEgresoId(null)}
                disabled={egresarMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={egresarMutation.isPending || seleccionadosEgreso.length === 0}
                onClick={() => {
                  if (!seccionEgresoId) return;
                  egresarMutation.mutate({
                    seccionId: seccionEgresoId,
                    estudianteIds: seleccionadosEgreso.map((e) => e.estudianteId),
                  });
                }}
                className="gap-1.5"
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                {egresarMutation.isPending
                  ? "Procesando..."
                  : `Marcar como egresados (${seleccionadosEgreso.length})`}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Modal de repitentes de 5.° grado */}
      <Modal
        open={repitenteModal !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRepitenteModal(null);
            setDesmarcados({});
          }
        }}
        title="Matricular repitentes en 5.° grado"
        description={`Asigne a los estudiantes que repetirán 5.° de secundaria en el año ${anioDestinoNumero ?? ""}.`}
        icon={RefreshIcon}
        size="xl"
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Sección de 5.° grado en {anioDestinoNumero}
            </Label>
            <SelectOption
              options={opcionesQuintoDestino}
              value={repitenteModal?.destinoId ?? ""}
              onSelect={(val) =>
                setRepitenteModal((prev) => (prev ? { ...prev, destinoId: val } : null))
              }
              placeholder="Elegir sección de 5.°..."
              searchPlaceholder="Buscar sección..."
              className="h-9 text-xs"
            />
          </div>

          {previewRepitenteQuery.isLoading ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              Consultando pendientes...
            </p>
          ) : previewRepitenteQuery.data ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">
                  Pendientes de 5.° ({seleccionadosRepitentes.length} de {aRepetir.length})
                </span>
                {aRepetir.length > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toggleTodos(
                        aRepetir.map((e) => e.estudianteId),
                        seleccionadosRepitentes.length,
                      )
                    }
                    className="h-7 px-2 text-xs"
                  >
                    {seleccionadosRepitentes.length === aRepetir.length
                      ? "Desmarcar todos"
                      : "Marcar todos"}
                  </Button>
                ) : null}
              </div>

              <div className="max-h-56 divide-y overflow-y-auto rounded-xl border">
                {aRepetir.length === 0 ? (
                  <p className="text-muted-foreground p-4 text-center text-xs">
                    No quedan estudiantes pendientes en esta sección.
                  </p>
                ) : (
                  aRepetir.map((est) => {
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

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRepitenteModal(null)}
                  disabled={matricularRepitenteMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={
                    matricularRepitenteMutation.isPending || seleccionadosRepitentes.length === 0
                  }
                  onClick={() => {
                    if (!repitenteModal) return;
                    matricularRepitenteMutation.mutate({
                      seccionOrigenId: repitenteModal.origenId,
                      seccionDestinoId: repitenteModal.destinoId,
                      estudianteIds: seleccionadosRepitentes.map((e) => e.estudianteId),
                      esRepitente: true,
                    });
                  }}
                  className="gap-1.5"
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                  {matricularRepitenteMutation.isPending
                    ? "Matriculando..."
                    : `Matricular como repitentes (${seleccionadosRepitentes.length})`}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
