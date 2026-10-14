"use client";

import * as React from "react";
import { Alert02Icon, FloppyDiskIcon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { useCrearComunicadoMutation } from "../../hooks";
import { OPCIONES_DIRIGIDO_A, OPCIONES_PRIORIDAD } from "../../constants";
import type { DirigidoA, PrioridadComunicado } from "../../types";

export interface CrearComunicadoFormProps {
  grados?: Array<{ id: string; numero: number }>;
  secciones?: Array<{ id: string; nombre: string; gradoId: string }>;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function CrearComunicadoForm({
  grados = [],
  secciones = [],
  onCancel,
  onSuccess,
}: CrearComunicadoFormProps) {
  const [titulo, setTitulo] = React.useState("");
  const [contenido, setContenido] = React.useState("");
  const [dirigidoA, setDirigidoA] = React.useState<DirigidoA>("todos");
  const [prioridad, setPrioridad] = React.useState<PrioridadComunicado>("normal");
  const [gradoId, setGradoId] = React.useState<string>("all");
  const [seccionId, setSeccionId] = React.useState<string>("all");
  const [adjuntoUrl, setAdjuntoUrl] = React.useState("");
  const [venceEn, setVenceEn] = React.useState("");

  const crearMutation = useCrearComunicadoMutation();

  const resetForm = () => {
    setTitulo("");
    setContenido("");
    setDirigidoA("todos");
    setPrioridad("normal");
    setGradoId("all");
    setSeccionId("all");
    setAdjuntoUrl("");
    setVenceEn("");
  };

  const seccionesFiltradas = React.useMemo(() => {
    if (gradoId === "all") return secciones;
    return secciones.filter((s) => s.gradoId === gradoId);
  }, [gradoId, secciones]);

  const opcionesGrados = React.useMemo(() => {
    return [
      { value: "all", label: "Todo el colegio" },
      ...grados.map((g) => ({
        value: g.id,
        label: `${g.numero}° Grado`,
      })),
    ];
  }, [grados]);

  const opcionesSecciones = React.useMemo(() => {
    return [
      { value: "all", label: "Todas las secciones" },
      ...seccionesFiltradas.map((s) => ({
        value: s.id,
        label: `Sección ${s.nombre}`,
      })),
    ];
  }, [seccionesFiltradas]);

  const handleSubmit = (publicar: boolean) => {
    if (!titulo.trim() || !contenido.trim()) {
      return;
    }

    crearMutation.mutate(
      {
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        dirigidoA,
        prioridad,
        gradoId: gradoId !== "all" ? gradoId : undefined,
        seccionId: seccionId !== "all" ? seccionId : undefined,
        adjuntoUrl: adjuntoUrl.trim() ? adjuntoUrl.trim() : undefined,
        venceEn: venceEn.trim() ? new Date(venceEn).toISOString() : undefined,
        publicar,
      },
      {
        onSuccess: () => {
          resetForm();
          onSuccess?.();
        },
      },
    );
  };

  const isDisabled = crearMutation.isPending || !titulo.trim() || !contenido.trim();

  return (
    <div className="space-y-4 py-2">
      {/* Título */}
      <div className="space-y-1.5">
        <Label htmlFor="titulo" className="text-xs font-medium">
          Título del comunicado <span className="text-destructive">*</span>
        </Label>
        <Input
          id="titulo"
          placeholder="Ej. Convocatoria a reunión general de padres de familia"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={150}
          className="text-sm"
          disabled={crearMutation.isPending}
        />
      </div>

      {/* Público objetivo y Prioridad */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            Público destinatario <span className="text-destructive">*</span>
          </Label>
          <SelectOption
            value={dirigidoA}
            onSelect={(val: DirigidoA) => setDirigidoA(val)}
            options={OPCIONES_DIRIGIDO_A}
            placeholder="Seleccione el público"
            disabled={crearMutation.isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Prioridad</Label>
          <SelectOption
            value={prioridad}
            onSelect={(val: PrioridadComunicado) => setPrioridad(val)}
            options={OPCIONES_PRIORIDAD}
            placeholder="Prioridad"
            disabled={crearMutation.isPending}
          />
        </div>
      </div>

      {/* Alcance: Grado y Sección */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Grado escolar (opcional)</Label>
          <SelectOption
            value={gradoId}
            onSelect={(val: string) => {
              setGradoId(val);
              setSeccionId("all");
            }}
            options={opcionesGrados}
            placeholder="Todo el colegio"
            disabled={crearMutation.isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Sección escolar (opcional)</Label>
          <SelectOption
            value={seccionId}
            onSelect={(val: string) => setSeccionId(val)}
            options={opcionesSecciones}
            placeholder="Todas las secciones"
            disabled={crearMutation.isPending || seccionesFiltradas.length === 0}
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-1.5">
        <Label htmlFor="contenido" className="text-xs font-medium">
          Contenido del comunicado <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="contenido"
          placeholder="Escriba los detalles, indicaciones y acuerdos del comunicado..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={4}
          className="resize-none text-sm"
          disabled={crearMutation.isPending}
        />
      </div>

      {/* Adjunto y Vencimiento */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="adjunto" className="text-xs font-medium">
            URL de Archivo Adjunto (PDF o imagen)
          </Label>
          <Input
            id="adjunto"
            placeholder="https://..."
            value={adjuntoUrl}
            onChange={(e) => setAdjuntoUrl(e.target.value)}
            className="text-xs"
            disabled={crearMutation.isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="vence" className="text-xs font-medium">
            Fecha de vencimiento (opcional)
          </Label>
          <Input
            id="vence"
            type="datetime-local"
            value={venceEn}
            onChange={(e) => setVenceEn(e.target.value)}
            className="text-xs"
            disabled={crearMutation.isPending}
          />
        </div>
      </div>

      {prioridad === "urgente" && (
        <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
          <HugeiconsIcon icon={Alert02Icon} className="mt-0.5 size-4 shrink-0" />
          <span>
            Este comunicado se marcará como <strong>Urgente</strong> y generará una alerta de alta
            prioridad en la bandeja de los destinatarios.
          </span>
        </div>
      )}

      <div className="flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={crearMutation.isPending}
          className="text-xs"
        >
          Cancelar
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleSubmit(false)}
          disabled={isDisabled}
          className="gap-1.5 text-xs"
        >
          {crearMutation.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={FloppyDiskIcon} className="size-4" />
          )}
          Guardar borrador
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={() => handleSubmit(true)}
          disabled={isDisabled}
          className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
        >
          {crearMutation.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={SentIcon} className="size-4" />
          )}
          {crearMutation.isPending ? "Publicando..." : "Publicar ahora"}
        </Button>
      </div>
    </div>
  );
}
