"use client";

import * as React from "react";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAnularJustificacion, useCrearJustificacion, usePersonasDelReporte } from "./hooks";
import {
  DE_UN_DIA,
  TIPOS_JUSTIFICACION,
  type Justificacion,
  type TipoJustificacion,
} from "./types";

const CAMPO_SELECT =
  "border-input bg-background h-10 w-full rounded-md border px-3 text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none";

function Campo({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Formulario({ mes, onCerrar }: { mes: string; onCerrar: () => void }) {
  const personas = usePersonasDelReporte(mes, true);
  const crear = useCrearJustificacion();
  const [personaId, setPersonaId] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoJustificacion>("licencia_con_goce");
  const [desde, setDesde] = React.useState("");
  const [hasta, setHasta] = React.useState("");
  const [minutos, setMinutos] = React.useState("");
  const [documento, setDocumento] = React.useState("");
  const [observacion, setObservacion] = React.useState("");
  const [presentadoEn, setPresentadoEn] = React.useState("");
  const [marcaOmitida, setMarcaOmitida] = React.useState<"" | "ingreso" | "salida">("");
  const [error, setError] = React.useState<string | null>(null);

  const unDia = DE_UN_DIA.includes(tipo);
  const esPermiso = tipo === "permiso_con_goce" || tipo === "permiso_sin_goce";
  const esOmision = tipo === "omision_justificada";

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const fin = unDia ? desde : hasta;
    if (
      !personaId ||
      !desde ||
      !fin ||
      !documento.trim() ||
      (esOmision && (!presentadoEn || !marcaOmitida))
    ) {
      setError("Complete los campos obligatorios (*).");
      return;
    }
    if (tipo === "permiso_sin_goce" && !(Number(minutos) > 0)) {
      setError("Indique los minutos del permiso sin goce.");
      return;
    }
    setError(null);
    crear.mutate(
      {
        personaId,
        tipo,
        fechaDesde: desde,
        fechaHasta: fin,
        documento: documento.trim(),
        observacion: observacion.trim() || undefined,
        minutos: esPermiso && minutos ? Number(minutos) : undefined,
        presentadoEn: esOmision ? presentadoEn : undefined,
        marcaOmitida: esOmision && marcaOmitida ? marcaOmitida : undefined,
      },
      { onSuccess: onCerrar },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <Campo id="j-persona" label="Docente o auxiliar *">
        <select
          id="j-persona"
          className={CAMPO_SELECT}
          value={personaId}
          onChange={(e) => setPersonaId(e.target.value)}
        >
          <option value="">{personas.isLoading ? "Cargando…" : "Elija una persona"}</option>
          {personas.data?.map((p) => (
            <option key={p.personaId} value={p.personaId}>
              {p.nombreCompleto}
            </option>
          ))}
        </select>
      </Campo>
      <Campo id="j-tipo" label="Tipo *">
        <select
          id="j-tipo"
          className={CAMPO_SELECT}
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoJustificacion)}
        >
          {Object.entries(TIPOS_JUSTIFICACION).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
      </Campo>
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo id="j-desde" label={unDia ? "Fecha *" : "Desde *"}>
          <Input
            id="j-desde"
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </Campo>
        {!unDia && (
          <Campo id="j-hasta" label="Hasta *">
            <Input
              id="j-hasta"
              type="date"
              min={desde}
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </Campo>
        )}
        {esPermiso && (
          <Campo
            id="j-minutos"
            label={tipo === "permiso_sin_goce" ? "Minutos del permiso *" : "Minutos del permiso"}
          >
            <Input
              id="j-minutos"
              type="number"
              min={1}
              max={720}
              value={minutos}
              onChange={(e) => setMinutos(e.target.value)}
            />
          </Campo>
        )}
        {esOmision && (
          <Campo id="j-marca" label="Marca que faltó *">
            <select
              id="j-marca"
              className={CAMPO_SELECT}
              value={marcaOmitida}
              onChange={(e) => setMarcaOmitida(e.target.value as "" | "ingreso" | "salida")}
            >
              <option value="">Elija una</option>
              <option value="ingreso">Ingreso</option>
              <option value="salida">Salida</option>
            </select>
          </Campo>
        )}
        {esOmision && (
          <Campo id="j-presentado" label="Sustento presentado el *">
            <Input
              id="j-presentado"
              type="datetime-local"
              value={presentadoEn}
              onChange={(e) => setPresentadoEn(e.target.value)}
            />
          </Campo>
        )}
      </div>
      <Campo id="j-documento" label="Documento que lo acredita *">
        <Input
          id="j-documento"
          value={documento}
          maxLength={150}
          placeholder="Ej. Papeleta de permiso N.° 12"
          onChange={(e) => setDocumento(e.target.value)}
        />
      </Campo>
      <Campo id="j-obs" label="Observación">
        <Textarea
          id="j-obs"
          value={observacion}
          maxLength={500}
          onChange={(e) => setObservacion(e.target.value)}
        />
      </Campo>
      {error && (
        <p role="alert" className="text-destructive text-xs font-medium">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2.5 pt-1">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={crear.isPending} className="min-h-10 gap-2">
          {crear.isPending && <Spinner className="size-4" />}
          Registrar
        </Button>
      </div>
    </form>
  );
}

export function NuevaJustificacionModal(props: {
  mes: string;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}) {
  return (
    <Modal
      open={props.abierto}
      onOpenChange={props.onOpenChange}
      title="Registrar justificación"
      description="Licencias, permisos, vacaciones, huelga u omisión de marca. Cambian el código del día en el reporte."
      icon={FileEditIcon}
      size="md"
    >
      {props.abierto && <Formulario mes={props.mes} onCerrar={() => props.onOpenChange(false)} />}
    </Modal>
  );
}

function FormularioAnulacion({
  justificacion,
  onCerrar,
}: {
  justificacion: Justificacion;
  onCerrar: () => void;
}) {
  const anular = useAnularJustificacion();
  const [motivo, setMotivo] = React.useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (motivo.trim()) {
          anular.mutate({ id: justificacion.id, motivo: motivo.trim() }, { onSuccess: onCerrar });
        }
      }}
      className="space-y-4"
    >
      <Campo id="j-motivo" label="Motivo de la anulación *">
        <Textarea
          id="j-motivo"
          value={motivo}
          maxLength={500}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </Campo>
      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!motivo.trim() || anular.isPending} className="min-h-10">
          Anular
        </Button>
      </div>
    </form>
  );
}

export function AnularJustificacionModal(props: {
  justificacion: Justificacion | null;
  onCerrar: () => void;
}) {
  const j = props.justificacion;
  return (
    <Modal
      open={j !== null}
      onOpenChange={(abierto) => !abierto && props.onCerrar()}
      title="Anular justificación"
      description={j ? `${j.nombreCompleto}: ${TIPOS_JUSTIFICACION[j.tipo]}` : undefined}
      icon={FileEditIcon}
      size="md"
    >
      {j && <FormularioAnulacion key={j.id} justificacion={j} onCerrar={props.onCerrar} />}
    </Modal>
  );
}
