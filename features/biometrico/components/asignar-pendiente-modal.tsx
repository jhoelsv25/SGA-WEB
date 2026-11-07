"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { UserCheck01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { docentesApi } from "@/features/docentes/api/docentes.api";
import { useAsignarPendiente } from "../hooks";
import type { PendienteApi } from "../types";

interface AsignarPendienteModalProps {
  pendiente: PendienteApi | null;
  onOpenChange: (open: boolean) => void;
}

function Formulario({ pendiente, onCerrar }: { pendiente: PendienteApi; onCerrar: () => void }) {
  const [busqueda, setBusqueda] = React.useState("");
  const [personaId, setPersonaId] = React.useState<string | null>(null);
  const [vincular, setVincular] = React.useState(pendiente.motivo === "codigo_desconocido");
  const asignar = useAsignarPendiente();

  const { data, isFetching } = useQuery({
    queryKey: ["docentes", "buscar-pendiente", busqueda],
    queryFn: () => docentesApi.getDocentes({ search: busqueda, estado: "activo", limit: 6 }),
    enabled: busqueda.trim().length >= 2,
    staleTime: 30_000,
  });

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!personaId) return;
    asignar.mutate(
      { id: pendiente.id, personaId, vincularCodigo: vincular },
      { onSuccess: onCerrar },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="buscar-docente" className="text-sm font-medium">
          Docente *
        </Label>
        <Input
          id="buscar-docente"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPersonaId(null);
          }}
          placeholder="Buscar por nombre o documento"
          autoComplete="off"
        />
        {isFetching && <p className="text-muted-foreground text-xs">Buscando…</p>}
        {data && data.data.length === 0 && (
          <p className="text-muted-foreground text-xs">No se encontraron docentes activos.</p>
        )}
        {data && data.data.length > 0 && (
          <ul className="border-border/60 divide-border/60 divide-y rounded-xl border">
            {data.data.map((docente) => (
              <li key={docente.id}>
                <button
                  type="button"
                  onClick={() => setPersonaId(docente.personaId)}
                  aria-pressed={personaId === docente.personaId}
                  className={`min-h-10 w-full px-3 py-2 text-left text-sm transition-colors ${
                    personaId === docente.personaId
                      ? "bg-primary/10 font-semibold"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {docente.persona.nombreCompleto}
                  <span className="text-muted-foreground ml-2 text-xs">{docente.codigo}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pendiente.motivo === "codigo_desconocido" && (
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={vincular}
            onChange={(e) => setVincular(e.target.checked)}
            className="mt-1"
          />
          <span>
            Vincular también el código <strong>{pendiente.codigoBiometrico}</strong> a este docente
            para que sus próximas marcaciones se asignen solas.
          </span>
        </label>
      )}

      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!personaId || asignar.isPending} className="min-h-10 gap-2">
          {asignar.isPending && <Spinner className="size-4" />}
          Asignar marcación
        </Button>
      </div>
    </form>
  );
}

export function AsignarPendienteModal({ pendiente, onOpenChange }: AsignarPendienteModalProps) {
  return (
    <Modal
      open={Boolean(pendiente)}
      onOpenChange={onOpenChange}
      title="Asignar marcación"
      description={
        pendiente
          ? `Código ${pendiente.codigoBiometrico} · ${pendiente.fechaHora.slice(0, 16)}. Se registrará con la hora original.`
          : undefined
      }
      icon={UserCheck01Icon}
      size="md"
    >
      {pendiente && (
        <Formulario key={pendiente.id} pendiente={pendiente} onCerrar={() => onOpenChange(false)} />
      )}
    </Modal>
  );
}
