"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCrearOrdenReloj, useGuardarConfigReloj, useOrdenesReloj } from "../hooks";
import type { EstadoRelojApiDto, OrdenApi, TipoOrdenApi } from "../types";

const ACCIONES: { tipo: TipoOrdenApi; etiqueta: string }[] = [
  { tipo: "probar_reloj", etiqueta: "Probar conexión con el reloj" },
  { tipo: "leer_reloj", etiqueta: "Ver marcaciones del reloj" },
  { tipo: "sincronizar", etiqueta: "Sincronizar ahora" },
];

const ETIQUETA_TIPO: Record<TipoOrdenApi, string> = {
  probar_reloj: "Probar conexión",
  leer_reloj: "Ver marcaciones",
  sincronizar: "Sincronizar",
};

const ETIQUETA_ESTADO: Record<OrdenApi["estado"], string> = {
  pendiente: "Esperando a la app puente…",
  completada: "Listo",
  error: "Falló",
};

function hora(iso: string | null): string {
  return iso ? new Date(iso).toLocaleTimeString("es-PE") : "";
}

interface ConexionRelojCardProps {
  reloj: EstadoRelojApiDto;
}

/** Conexión al reloj (IP, puerto, clave) y pruebas que ejecuta la app puente (RF-022 HU5). */
export function ConexionRelojCard({ reloj }: ConexionRelojCardProps) {
  const { config } = reloj;
  const [ip, setIp] = React.useState(config.relojIp ?? "");
  const [puerto, setPuerto] = React.useState(String(config.relojPuerto));
  const [clave, setClave] = React.useState(String(config.relojClaveComunicacion));
  const [intervalo, setIntervalo] = React.useState(String(config.intervaloSegundos));

  const guardar = useGuardarConfigReloj();
  const crearOrden = useCrearOrdenReloj();
  const { data: ordenes = [] } = useOrdenesReloj(reloj.equipoId);

  const sinGuardar =
    ip.trim() !== (config.relojIp ?? "") ||
    Number(puerto) !== config.relojPuerto ||
    Number(clave) !== config.relojClaveComunicacion ||
    Number(intervalo) !== config.intervaloSegundos;
  const puedeProbar = Boolean(config.relojIp) && !sinGuardar;
  const hayPendiente = ordenes.some((o) => o.estado === "pendiente");

  function onGuardar(e: React.FormEvent) {
    e.preventDefault();
    guardar.mutate({
      equipoId: reloj.equipoId,
      relojIp: ip.trim(),
      relojPuerto: Number(puerto),
      relojClaveComunicacion: Number(clave),
      intervaloSegundos: Number(intervalo),
    });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onGuardar} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`ip-${reloj.equipoId}`}>IP del reloj</Label>
          <Input
            id={`ip-${reloj.equipoId}`}
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.201"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`pu-${reloj.equipoId}`}>Puerto</Label>
          <Input
            id={`pu-${reloj.equipoId}`}
            type="number"
            min={1}
            max={65535}
            value={puerto}
            onChange={(e) => setPuerto(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`cl-${reloj.equipoId}`}>Clave de comunicación</Label>
          <Input
            id={`cl-${reloj.equipoId}`}
            type="number"
            min={0}
            max={999999}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`in-${reloj.equipoId}`}>Leer cada (segundos)</Label>
          <Input
            id={`in-${reloj.equipoId}`}
            type="number"
            min={10}
            max={3600}
            value={intervalo}
            onChange={(e) => setIntervalo(e.target.value)}
            required
          />
        </div>
        <div className="flex items-end sm:col-span-3">
          <Button type="submit" size="sm" disabled={guardar.isPending || !sinGuardar}>
            {guardar.isPending ? "Guardando…" : "Guardar conexión"}
          </Button>
          <p className="text-muted-foreground ml-3 text-xs">
            La app puente toma estos datos en su próxima comunicación. Use clave 0 si el reloj no
            tiene clave.
          </p>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {ACCIONES.map((a) => (
          <Button
            key={a.tipo}
            type="button"
            size="sm"
            variant="outline"
            disabled={!puedeProbar || hayPendiente || crearOrden.isPending}
            onClick={() => crearOrden.mutate({ equipoId: reloj.equipoId, tipo: a.tipo })}
          >
            {a.etiqueta}
          </Button>
        ))}
        {!puedeProbar && (
          <p className="text-muted-foreground self-center text-xs">
            Guarde la conexión para poder probar.
          </p>
        )}
      </div>

      {ordenes.length > 0 && (
        <ul className="space-y-2" aria-label="Resultado de las pruebas">
          {ordenes.slice(0, 4).map((o) => (
            <li key={o.id} className="border-border/40 rounded-lg border p-3 text-xs">
              <p className="font-semibold">
                {ETIQUETA_TIPO[o.tipo]} · {ETIQUETA_ESTADO[o.estado]}{" "}
                <span className="text-muted-foreground font-normal">
                  {hora(o.resueltaEn ?? o.creadoEn)}
                </span>
              </p>
              {o.mensaje && <p className="text-muted-foreground mt-0.5">{o.mensaje}</p>}
              {o.tipo === "leer_reloj" && o.datos?.recientes && o.datos.recientes.length > 0 && (
                <ul className="mt-2 space-y-0.5 font-mono">
                  {o.datos.recientes.slice(-5).map((m) => (
                    <li key={`${m.codigo}-${m.fechaHora}`}>
                      ID {m.codigo} · {m.fechaHora}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
