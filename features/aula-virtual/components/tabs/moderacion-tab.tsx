"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Attachment01Icon,
  CheckmarkCircle02Icon,
  Download01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { Spinner } from "@/components/common/spinner";
import { DataTable, DataTableColumnHeader } from "@/components/common/data-table";
import { urlDeArchivo } from "../../api";
import { TIPO_MODERACION_CONFIG } from "../../consts";
import { formatearFechaHora } from "../../utils";
import { useHistorialModeracion, useRestaurarContenido } from "../../hooks";
import type { HistorialModeracion, TipoModeracion } from "../../types";

function badgeTipo(tipo: TipoModeracion) {
  const config = TIPO_MODERACION_CONFIG[tipo];
  return <StatusBadge tone={config?.tone ?? "neutral"}>{config?.label ?? tipo}</StatusBadge>;
}

export function ModeracionTab({ cursoSeccionId }: { cursoSeccionId: string }) {
  const {
    data: historial = [],
    isLoading,
    isError,
    refetch,
  } = useHistorialModeracion(cursoSeccionId);

  const restaurar = useRestaurarContenido(cursoSeccionId);
  const [restaurandoId, setRestaurandoId] = React.useState<string | null>(null);

  const handleRestaurar = (item: HistorialModeracion) => {
    setRestaurandoId(item.id);
    restaurar.mutate(
      { tipo: item.tipo, id: item.id },
      {
        onSettled: () => setRestaurandoId(null),
      },
    );
  };

  const columns = React.useMemo<ColumnDef<HistorialModeracion>[]>(
    () => [
      {
        accessorKey: "tipo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
        cell: ({ row }) => badgeTipo(row.original.tipo),
      },
      {
        accessorKey: "contenido",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Contenido ocultado" />
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="max-w-md space-y-1">
              {item.contenido ? (
                <p className="text-foreground line-clamp-2 text-xs">{item.contenido}</p>
              ) : (
                <span className="text-muted-foreground text-xs italic">
                  Sin texto (solo adjunto)
                </span>
              )}
              {item.adjuntoUrl && (
                <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                  <HugeiconsIcon icon={Attachment01Icon} size={12} />
                  <a
                    href={urlDeArchivo(item.adjuntoUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary flex items-center gap-1 hover:underline"
                  >
                    <span>Ver adjunto</span>
                    <HugeiconsIcon icon={Download01Icon} size={11} />
                  </a>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "autorNombre",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Autor original" />,
        cell: ({ row }) => <span className="text-xs font-medium">{row.original.autorNombre}</span>,
      },
      {
        accessorKey: "ocultadoPorNombre",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ocultado por" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">{row.original.ocultadoPorNombre}</span>
        ),
      },
      {
        accessorKey: "ocultadoEn",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {formatearFechaHora(row.original.ocultadoEn)}
          </span>
        ),
      },
      {
        accessorKey: "motivoOcultamiento",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Motivo" />,
        cell: ({ row }) => (
          <span className="bg-destructive/10 text-destructive line-clamp-2 rounded px-2 py-0.5 text-xs font-medium">
            {row.original.motivoOcultamiento}
          </span>
        ),
      },
      {
        id: "acciones",
        header: () => <div className="text-right">Acción</div>,
        cell: ({ row }) => {
          const item = row.original;
          const estaRestaurando = restaurandoId === item.id;
          return (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => handleRestaurar(item)}
                disabled={estaRestaurando || restaurar.isPending}
              >
                {estaRestaurando ? (
                  <Spinner className="size-3" />
                ) : (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                )}
                Restaurar
              </Button>
            </div>
          );
        },
      },
    ],
    [restaurandoId, restaurar.isPending], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Historial de Moderación del Curso</h3>
          <p className="text-muted-foreground text-xs">
            Registro de publicaciones, comentarios y mensajes de chat ocultados a los estudiantes
            por motivos disciplinarios o pedagógicos.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => void refetch()}
        >
          <HugeiconsIcon icon={RefreshIcon} size={14} />
          Actualizar
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={historial}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        pagination={false}
        caption="Historial de publicaciones, comentarios y mensajes moderados"
        emptyState={{
          title: "No hay contenido moderado",
          description: "El muro y el chat no tienen publicaciones ni mensajes ocultos.",
        }}
      />
    </div>
  );
}
