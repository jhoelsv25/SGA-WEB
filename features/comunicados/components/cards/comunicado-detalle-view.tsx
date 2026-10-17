"use client";

import * as React from "react";
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FileAttachmentIcon,
  Megaphone01Icon,
  Search01Icon,
  UserCheck01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/formatters/date";
import { useAvanceLecturaQuery } from "../../hooks";
import {
  COMUNICADO_DIRIGIDO_LABELS,
  COMUNICADO_ESTADO_CONFIG,
  COMUNICADO_PRIORIDAD_CONFIG,
} from "../../constants";
import type { ComunicadoItem } from "../../types";

export interface ComunicadoDetalleViewProps {
  comunicado: ComunicadoItem;
  defaultTab?: "contenido" | "lecturas";
  currentUserId?: string;
}

export function ComunicadoDetalleView({
  comunicado,
  defaultTab = "contenido",
  currentUserId,
}: ComunicadoDetalleViewProps) {
  const [tab, setTab] = React.useState<string>(defaultTab);
  const [busquedaLectura, setBusquedaLectura] = React.useState("");

  const esAutor = Boolean(currentUserId && comunicado.autorId === currentUserId);

  const { data: avanceData, isLoading: isLoadingAvance } = useAvanceLecturaQuery(
    comunicado.id,
    Boolean(esAutor && comunicado.estado === "publicado"),
  );

  const estadoConfig = COMUNICADO_ESTADO_CONFIG[comunicado.estado];
  const prioridadConfig = COMUNICADO_PRIORIDAD_CONFIG[comunicado.prioridad];
  const publicoLabel = COMUNICADO_DIRIGIDO_LABELS[comunicado.dirigidoA];

  const destinatariosFiltrados = (avanceData?.destinatarios ?? []).filter((d) => {
    if (!busquedaLectura.trim()) return true;
    const q = busquedaLectura.toLowerCase();
    return (
      d.nombreCompleto.toLowerCase().includes(q) || d.tipoDestinatario.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 py-1">
      {/* Encabezado con etiquetas */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={estadoConfig.badgeClass}>
          {estadoConfig.label}
        </Badge>
        <Badge variant="outline" className={prioridadConfig.badgeClass}>
          {prioridadConfig.label}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {publicoLabel}
        </Badge>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {esAutor && comunicado.estado === "publicado" && (
          <TabsList className="mb-3 grid w-full grid-cols-2">
            <TabsTrigger value="contenido" className="gap-1.5 text-xs">
              <HugeiconsIcon icon={Megaphone01Icon} className="size-3.5" />
              Mensaje
            </TabsTrigger>
            <TabsTrigger value="lecturas" className="gap-1.5 text-xs">
              <HugeiconsIcon icon={UserCheck01Icon} className="size-3.5" />
              Control de Lectura ({avanceData?.porcentajeLectura ?? comunicado.porcentajeLectura}%)
            </TabsTrigger>
          </TabsList>
        )}

        {/* Pestaña 1: Contenido del Comunicado */}
        <TabsContent value="contenido" className="m-0 space-y-4">
          {/* Meta autor y fechas */}
          <div className="bg-muted/30 text-muted-foreground flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-xs">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={UserIcon} className="text-primary size-4" />
              <span>
                Autor:{" "}
                <strong className="text-foreground font-semibold">{comunicado.autorNombre}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
              <span>
                {comunicado.publicadoEn
                  ? `Publicado: ${new Date(comunicado.publicadoEn).toLocaleString("es-PE")}`
                  : `Creado: ${new Date(comunicado.creadoEn).toLocaleString("es-PE")}`}
              </span>
            </div>
          </div>

          {/* Texto del comunicado */}
          <div className="bg-card space-y-2 rounded-xl border p-4">
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {comunicado.contenido}
            </p>
          </div>

          {/* Archivo adjunto si existe */}
          {comunicado.adjuntoUrl && (
            <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-2 text-xs">
                <HugeiconsIcon icon={FileAttachmentIcon} className="text-primary size-4" />
                <span className="text-foreground font-medium">Documento o material adjunto</span>
              </div>
              <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                <a href={comunicado.adjuntoUrl} target="_blank" rel="noreferrer">
                  Abrir archivo
                </a>
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Pestaña 2: HU2 Control de Lectura */}
        {esAutor && comunicado.estado === "publicado" && (
          <TabsContent value="lecturas" className="m-0 space-y-4">
            {/* Tarjetas de Métricas de Lectura */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card space-y-1 rounded-xl border p-3 text-center">
                <span className="text-muted-foreground text-[11px]">Destinatarios</span>
                <div className="text-foreground text-lg font-bold">
                  {avanceData?.totalDestinatarios ?? comunicado.totalDestinatarios}
                </div>
              </div>

              <div className="space-y-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Han leído
                </span>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {avanceData?.totalLeidos ?? comunicado.totalLeidos}
                </div>
              </div>

              <div className="space-y-1 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center">
                <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  Pendientes
                </span>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {(avanceData?.totalDestinatarios ?? comunicado.totalDestinatarios) -
                    (avanceData?.totalLeidos ?? comunicado.totalLeidos)}
                </div>
              </div>
            </div>

            {/* Barra de progreso visual */}
            <div className="bg-muted/20 space-y-1.5 rounded-xl border p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  Tasa de apertura acumulada:
                </span>
                <span className="text-foreground font-bold">
                  {avanceData?.porcentajeLectura ?? comunicado.porcentajeLectura}%
                </span>
              </div>
              <Progress
                value={avanceData?.porcentajeLectura ?? comunicado.porcentajeLectura}
                className="h-2"
              />
            </div>

            {/* Buscador de destinatarios */}
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
              />
              <Input
                placeholder="Buscar destinatario..."
                value={busquedaLectura}
                onChange={(e) => setBusquedaLectura(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>

            {/* Lista detallada de destinatarios con estado de lectura */}
            <div className="max-h-56 overflow-hidden overflow-y-auto rounded-xl border">
              {isLoadingAvance ? (
                <div className="text-muted-foreground p-4 text-center text-xs">
                  Cargando lecturas...
                </div>
              ) : destinatariosFiltrados.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center text-xs">
                  No se encontraron destinatarios con el filtro ingresado.
                </div>
              ) : (
                <div className="divide-border/60 divide-y">
                  {destinatariosFiltrados.map((d) => (
                    <div
                      key={d.usuarioId}
                      className="hover:bg-muted/30 flex items-center justify-between gap-2 p-2.5 text-xs transition-colors"
                    >
                      <div className="space-y-0.5">
                        <p className="text-foreground font-medium">{d.nombreCompleto}</p>
                        <span className="text-muted-foreground text-[11px] capitalize">
                          {d.tipoDestinatario}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {d.leido ? (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                            <span>
                              {d.leidoEn ? formatDate(d.leidoEn, "dd/MM HH:mm") : "Leído"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                            <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                            <span>Sin abrir</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
