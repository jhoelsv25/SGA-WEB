"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/formatters/date";
import { useAgregarCompromiso, useCerrarRetroalimentacion, useRegistrarReunion } from "../hooks";
import type { Calificacion, Compromiso, Observacion } from "../types";
import { horaCorta } from "../utils";
import { Campo, MensajeError } from "./campo";

interface PanelRetroalimentacionProps {
  observacion: Observacion;
  calificaciones: Calificacion[];
  compromisos: Compromiso[];
}

function FormularioReunion({ observacion }: { observacion: Observacion }) {
  const registrar = useRegistrarReunion();
  const [fecha, setFecha] = React.useState(observacion.retroFecha ?? "");
  const [horaInicio, setHoraInicio] = React.useState(
    horaCorta(observacion.retroHoraInicio).replace("-", ""),
  );
  const [horaFin, setHoraFin] = React.useState(
    horaCorta(observacion.retroHoraFin).replace("-", ""),
  );
  const [resumen, setResumen] = React.useState(observacion.retroResumen ?? "");
  const [errores, setErrores] = React.useState<Record<string, string>>({});

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    const nuevos: Record<string, string> = {};
    if (!fecha) nuevos.fecha = "Indique la fecha.";
    if (!horaInicio) nuevos.horaInicio = "Indique la hora de inicio.";
    if (!horaFin) nuevos.horaFin = "Indique la hora de fin.";
    if (!resumen.trim()) nuevos.resumen = "Escriba el resumen de la reunión.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    registrar.mutate({ id: observacion.id, fecha, horaInicio, horaFin, resumen: resumen.trim() });
  };

  return (
    <form onSubmit={enviar} className="space-y-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-3">
        <Campo id="reu-fecha" etiqueta="Fecha *" error={errores.fecha}>
          <Input
            id="reu-fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            disabled={registrar.isPending}
          />
        </Campo>
        <Campo id="reu-inicio" etiqueta="Inicio *" error={errores.horaInicio}>
          <Input
            id="reu-inicio"
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            disabled={registrar.isPending}
          />
        </Campo>
        <Campo id="reu-fin" etiqueta="Fin *" error={errores.horaFin}>
          <Input
            id="reu-fin"
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            disabled={registrar.isPending}
          />
        </Campo>
      </div>
      <Campo id="reu-resumen" etiqueta="Resumen de la reunión *" error={errores.resumen}>
        <Textarea
          id="reu-resumen"
          value={resumen}
          onChange={(e) => setResumen(e.target.value)}
          maxLength={2000}
          rows={4}
          disabled={registrar.isPending}
        />
      </Campo>
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="outline"
          className="min-h-10 gap-2"
          disabled={registrar.isPending}
        >
          {registrar.isPending && <Spinner className="size-4" />}
          {observacion.retroFecha ? "Actualizar reunión" : "Registrar reunión"}
        </Button>
      </div>
    </form>
  );
}

function FormularioCompromiso({
  observacionId,
  calificaciones,
}: {
  observacionId: string;
  calificaciones: Calificacion[];
}) {
  const agregar = useAgregarCompromiso();
  const [desempeno, setDesempeno] = React.useState<string | undefined>();
  const [descripcion, setDescripcion] = React.useState("");
  const [fechaRevision, setFechaRevision] = React.useState("");
  const [error, setError] = React.useState<string>();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!desempeno || !descripcion.trim() || !fechaRevision) {
      setError("Indique el desempeño, el compromiso y la fecha de revisión.");
      return;
    }
    setError(undefined);
    agregar.mutate(
      {
        id: observacionId,
        desempeno: Number(desempeno),
        descripcion: descripcion.trim(),
        fechaRevision,
      },
      {
        onSuccess: () => {
          setDesempeno(undefined);
          setDescripcion("");
          setFechaRevision("");
        },
      },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo id="com-desempeno" etiqueta="Desempeño *">
          <SelectOption
            options={[...calificaciones]
              .sort((a, b) => a.desempeno - b.desempeno)
              .map((c) => ({
                value: String(c.desempeno),
                label: `D${c.desempeno} · nivel ${c.nivelRomano}`,
              }))}
            value={desempeno}
            onSelect={setDesempeno}
            placeholder="Elija el desempeño"
            disabled={agregar.isPending}
          />
        </Campo>
        <Campo id="com-fecha" etiqueta="Fecha de revisión *">
          <Input
            id="com-fecha"
            type="date"
            value={fechaRevision}
            onChange={(e) => setFechaRevision(e.target.value)}
            disabled={agregar.isPending}
          />
        </Campo>
      </div>
      <Campo id="com-descripcion" etiqueta="Compromiso de mejora *" error={error}>
        <Textarea
          id="com-descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={500}
          rows={3}
          disabled={agregar.isPending}
        />
      </Campo>
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="outline"
          className="min-h-10 gap-2"
          disabled={agregar.isPending}
        >
          {agregar.isPending && <Spinner className="size-4" />}
          Agregar compromiso
        </Button>
      </div>
    </form>
  );
}

/** Retroalimentación: reunión, compromisos y cierre; al cerrar, el docente ya ve su observación. */
export function PanelRetroalimentacion({
  observacion,
  calificaciones,
  compromisos,
}: PanelRetroalimentacionProps) {
  const cerrar = useCerrarRetroalimentacion();
  const [confirmarSin, setConfirmarSin] = React.useState(false);

  return (
    <section aria-labelledby="titulo-retro" className="space-y-5">
      <div>
        <h2 id="titulo-retro" className="text-base font-semibold">
          Retroalimentación
        </h2>
        <p className="text-muted-foreground text-sm">
          Registre la reunión con el docente y los compromisos de mejora. Al cerrarla, el docente ve
          su observación.
        </p>
      </div>

      <div className="border-border/70 space-y-3 rounded-2xl border p-4">
        <h3 className="text-sm font-semibold">1. Reunión</h3>
        <FormularioReunion key={observacion.retroFecha ?? "nueva"} observacion={observacion} />
      </div>

      <div className="border-border/70 space-y-3 rounded-2xl border p-4">
        <h3 className="text-sm font-semibold">2. Compromisos de mejora</h3>
        {!observacion.retroFecha && (
          <p className="text-muted-foreground text-sm">
            Registre la reunión antes de agregar compromisos.
          </p>
        )}
        {compromisos.length > 0 && (
          <ul className="space-y-2">
            {compromisos.map((c) => (
              <li key={c.id} className="bg-muted/40 rounded-xl p-3 text-sm">
                <p>
                  <span className="font-medium">D{c.desempeno}:</span> {c.descripcion}
                </p>
                <p className="text-muted-foreground text-xs">
                  Revisión: {formatDate(c.fechaRevision)}
                </p>
              </li>
            ))}
          </ul>
        )}
        {observacion.retroFecha && (
          <FormularioCompromiso observacionId={observacion.id} calificaciones={calificaciones} />
        )}
      </div>

      <div className="border-border/70 flex flex-col gap-3 rounded-2xl border p-4">
        <h3 className="text-sm font-semibold">3. Cerrar la retroalimentación</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="min-h-11 gap-2"
            disabled={cerrar.isPending}
            onClick={() => cerrar.mutate({ id: observacion.id })}
          >
            {cerrar.isPending && <Spinner className="size-4" />}
            Cerrar retroalimentación
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={cerrar.isPending}
            onClick={() => setConfirmarSin(true)}
          >
            Cerrar sin compromisos
          </Button>
        </div>
        {cerrar.isError && <MensajeError>{cerrar.error.message}</MensajeError>}
      </div>

      <ConfirmDialog
        open={confirmarSin}
        onOpenChange={setConfirmarSin}
        variant="info"
        title="Cerrar sin compromisos"
        description="Solo corresponde cuando no hace falta ningún compromiso. El sistema lo valida con los niveles calificados."
        confirmText="Cerrar sin compromisos"
        isLoading={cerrar.isPending}
        onConfirm={() =>
          cerrar.mutate(
            { id: observacion.id, sinCompromisos: true },
            { onSettled: () => setConfirmarSin(false) },
          )
        }
      />
    </section>
  );
}
