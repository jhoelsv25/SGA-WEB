"use client";

import * as React from "react";
import { Alert02Icon, FloppyDiskIcon, Megaphone01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { useCrearComunicadoMutation } from "../../hooks";
import type { DirigidoA, PrioridadComunicado } from "../../types";

interface ModalCrearComunicadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grados?: Array<{ id: string; numero: number }>;
  secciones?: Array<{ id: string; nombre: string; gradoId: string }>;
}

export function ModalCrearComunicado({
  open,
  onOpenChange,
  grados = [],
  secciones = [],
}: ModalCrearComunicadoProps) {
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
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="text-primary flex items-center gap-2">
            <HugeiconsIcon icon={Megaphone01Icon} className="size-5" />
            <DialogTitle>Redactar Comunicado Oficial</DialogTitle>
          </div>
          <DialogDescription>
            Cree un nuevo comunicado institucional. Puede guardarlo como borrador o publicarlo
            inmediatamente para notificar a los destinatarios.
          </DialogDescription>
        </DialogHeader>

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
            />
          </div>

          {/* Público objetivo y Prioridad */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Público destinatario <span className="text-destructive">*</span>
              </Label>
              <Select value={dirigidoA} onValueChange={(val) => setDirigidoA(val as DirigidoA)}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Seleccione el público" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos" className="text-xs">
                    Toda la comunidad
                  </SelectItem>
                  <SelectItem value="docentes" className="text-xs">
                    Solo Docentes
                  </SelectItem>
                  <SelectItem value="estudiantes" className="text-xs">
                    Solo Estudiantes
                  </SelectItem>
                  <SelectItem value="apoderados" className="text-xs">
                    Solo Apoderados
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Prioridad</Label>
              <Select
                value={prioridad}
                onValueChange={(val) => setPrioridad(val as PrioridadComunicado)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal" className="text-xs">
                    Normal
                  </SelectItem>
                  <SelectItem value="importante" className="text-xs">
                    Importante
                  </SelectItem>
                  <SelectItem value="urgente" className="text-destructive text-xs font-medium">
                    Urgente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alcance: Grado y Sección */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Grado escolar (opcional)</Label>
              <Select
                value={gradoId}
                onValueChange={(val) => {
                  setGradoId(val);
                  setSeccionId("all");
                }}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Todo el colegio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    Todo el colegio
                  </SelectItem>
                  {grados.map((g) => (
                    <SelectItem key={g.id} value={g.id} className="text-xs">
                      {g.numero}° Grado
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Sección escolar (opcional)</Label>
              <Select
                value={seccionId}
                onValueChange={setSeccionId}
                disabled={seccionesFiltradas.length === 0}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Todas las secciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    Todas las secciones
                  </SelectItem>
                  {seccionesFiltradas.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      Sección {s.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              />
            </div>
          </div>

          {prioridad === "urgente" && (
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
              <HugeiconsIcon icon={Alert02Icon} className="mt-0.5 size-4 shrink-0" />
              <span>
                Este comunicado se marcará como <strong>Urgente</strong> y generará una alerta de
                alta prioridad en la bandeja de los destinatarios.
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t pt-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(false)}
            disabled={crearMutation.isPending || !titulo.trim() || !contenido.trim()}
            className="gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={FloppyDiskIcon} className="size-4" />
            Guardar borrador
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSubmit(true)}
            disabled={crearMutation.isPending || !titulo.trim() || !contenido.trim()}
            className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
          >
            <HugeiconsIcon icon={SentIcon} className="size-4" />
            {crearMutation.isPending ? "Publicando..." : "Publicar ahora"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
