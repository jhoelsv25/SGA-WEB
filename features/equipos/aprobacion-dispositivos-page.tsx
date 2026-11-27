"use client";

import * as React from "react";
import { ShieldCheckIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { SelectOption } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/formatters";
import { ESTADO_SOLICITUD_KIOSKO, ESTADO_SOLICITUD_KIOSKO_META } from "./consts";
import {
  useEquiposQuery,
  useResolverSolicitudKioskoMutation,
  useSolicitudesKioskoQuery,
} from "./hooks";
import type { SolicitudKiosko } from "./types";

export function AprobacionDispositivosPage() {
  const solicitudes = useSolicitudesKioskoQuery();
  const { data: equipos = [] } = useEquiposQuery();
  const resolver = useResolverSolicitudKioskoMutation();

  const [porAprobar, setPorAprobar] = React.useState<SolicitudKiosko | null>(null);
  const [equipoId, setEquipoId] = React.useState("");

  const opciones = equipos
    .filter((e) => e.activo)
    .map((e) => ({ value: e.id, label: `${e.nombre} (${e.ubicacion})` }));
  const equipoElegido = equipos.find((e) => e.id === equipoId);
  const filas = solicitudes.data ?? [];

  const abrir = (solicitud: SolicitudKiosko) => {
    setEquipoId("");
    setPorAprobar(solicitud);
  };

  const aprobar = () => {
    if (!porAprobar || !equipoId) return;
    resolver.mutate({ id: porAprobar.id, equipoId }, { onSuccess: () => setPorAprobar(null) });
  };

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Aprobación de dispositivos"
        description="Compare el código con el que muestra la pantalla del kiosko antes de aprobar."
        icon={ShieldCheckIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Kiosko" },
          { label: "Aprobación de dispositivos" },
        ]}
      />

      {solicitudes.isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando solicitudes…</p>
      ) : solicitudes.isError ? (
        <div className="space-y-2" role="alert">
          <p className="text-destructive text-sm">No se pudieron cargar las solicitudes.</p>
          <Button variant="outline" size="sm" onClick={() => void solicitudes.refetch()}>
            Reintentar
          </Button>
        </div>
      ) : filas.length === 0 ? (
        <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
          No hay solicitudes. Abra la pantalla /kiosko en el equipo que quiere aprobar.
        </p>
      ) : (
        <ul className="bg-card divide-border/50 divide-y rounded-2xl border">
          {filas.map((s) => {
            const meta = ESTADO_SOLICITUD_KIOSKO_META[s.estado];
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-foreground font-mono text-base font-bold">{s.codigo}</p>
                  <p className="text-muted-foreground text-xs">
                    Solicitado: {formatDateTime(s.solicitadoEn)} • Última conexión:{" "}
                    {formatDateTime(s.ultimaConsultaEn)}
                  </p>
                  {s.equipoNombre && (
                    <p className="text-muted-foreground text-xs">Kiosko: {s.equipoNombre}</p>
                  )}
                </div>
                <StatusBadge tone={meta?.tone ?? "neutral"} dot size="sm">
                  {meta?.label ?? "Desconocido"}
                </StatusBadge>
                {s.estado !== ESTADO_SOLICITUD_KIOSKO.APROBADA && (
                  <Button size="sm" onClick={() => abrir(s)} disabled={resolver.isPending}>
                    Aprobar
                  </Button>
                )}
                {s.estado === ESTADO_SOLICITUD_KIOSKO.PENDIENTE && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolver.mutate({ id: s.id })}
                    disabled={resolver.isPending}
                  >
                    Rechazar
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Dialog
        open={porAprobar !== null}
        onOpenChange={(abierto) => !abierto && setPorAprobar(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aprobar {porAprobar?.codigo}</DialogTitle>
            <DialogDescription>
              Elija a qué kiosko corresponde. Si no está en la lista, regístrelo primero en Equipos
              autorizados.
            </DialogDescription>
          </DialogHeader>
          <SelectOption
            value={equipoId}
            onSelect={setEquipoId}
            options={opciones}
            placeholder="Seleccione el kiosko"
          />
          {equipoElegido?.autorizado && (
            <p className="text-warning-text text-xs">
              Este kiosko ya está autorizado. Si aprueba, el navegador anterior dejará de funcionar.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPorAprobar(null)}>
              Cancelar
            </Button>
            <Button onClick={aprobar} disabled={!equipoId || resolver.isPending}>
              {resolver.isPending ? "Aprobando…" : "Aprobar dispositivo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
