"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { PageState } from "@/components/common/page-state";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveBackendUrl } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useControlDiario } from "../hooks";
import type { MarcacionApi, PersonaControl } from "../types";
import { DetallePersona } from "./detalle-persona";
import {
  ESTADOS_DIA,
  claseSinFirma,
  fechaLarga,
  horaActualEnColegio,
  hoyEnColegio,
  llegoTarde,
  sumarDias,
} from "./utils";

type Filtro = "todos" | "sin_marca" | "tardanza" | "falta_marca" | "clases";

const sinTildes = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

interface ControlDiarioPersonalProps {
  puedeJustificar: boolean;
  onJustificar: (marcacion: MarcacionApi) => void;
}

export function ControlDiarioPersonal(props: ControlDiarioPersonalProps) {
  const hoy = hoyEnColegio();
  const [fecha, setFecha] = React.useState(hoy);
  const [filtro, setFiltro] = React.useState<Filtro>("todos");
  const [busqueda, setBusqueda] = React.useState("");
  const [elegidaId, setElegidaId] = React.useState<string | null>(null);
  const consulta = useControlDiario(fecha, fecha === hoy);
  const personas = React.useMemo(() => consulta.data?.personas ?? [], [consulta.data]);
  const ahora = horaActualEnColegio();

  const pasa: Record<Filtro, (p: PersonaControl) => boolean> = {
    todos: () => true,
    sin_marca: (p) => p.estado === "sin_marca",
    tardanza: llegoTarde,
    falta_marca: (p) => p.estado === "sin_salida" || p.estado === "sin_entrada",
    clases: (p) => p.sesiones.some((s) => claseSinFirma(s, hoy, ahora)),
  };
  const filtros: { id: Filtro; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "sin_marca", label: "Sin marca" },
    { id: "tardanza", label: "Tardanza" },
    { id: "falta_marca", label: "Falta una marca" },
    { id: "clases", label: "Clases sin firma" },
  ];
  const texto = sinTildes(busqueda.trim());
  const visibles = personas.filter(
    (p) => pasa[filtro](p) && (!texto || sinTildes(p.nombreCompleto).includes(texto)),
  );

  const esperados = personas.filter((p) => p.horario);
  const conEntrada = esperados.filter((p) => p.entrada).length;
  const sesiones = personas.flatMap((p) => p.sesiones);
  const resumen = [
    { etiqueta: "Personal esperado", valor: String(esperados.length) },
    {
      etiqueta: "Marcaron entrada",
      valor: String(conEntrada),
      nota: esperados.length
        ? `${Math.round((conEntrada / esperados.length) * 100)} % de lo esperado`
        : undefined,
    },
    { etiqueta: "Tardanzas", valor: String(personas.filter(pasa.tardanza).length) },
    { etiqueta: "Sin marca", valor: String(personas.filter(pasa.sin_marca).length) },
    {
      etiqueta: "Clases firmadas",
      valor: `${sesiones.filter((s) => s.horaIngreso).length} de ${sesiones.length}`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-foreground text-lg font-bold">{fechaLarga(fecha)}</p>
          <p className="text-muted-foreground text-xs">
            {fecha === hoy ? "Hoy · se actualiza cada 30 segundos" : "Día anterior"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 rounded-full"
            aria-label="Día anterior"
            onClick={() => setFecha((f) => sumarDias(f, -1))}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          </Button>
          <Input
            type="date"
            aria-label="Elegir fecha"
            value={fecha}
            max={hoy}
            onChange={(e) => e.target.value && e.target.value <= hoy && setFecha(e.target.value)}
            className="h-10 w-40 rounded-full"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 rounded-full"
            aria-label="Día siguiente"
            disabled={fecha >= hoy}
            onClick={() => setFecha((f) => sumarDias(f, 1))}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full"
            disabled={fecha === hoy}
            onClick={() => setFecha(hoy)}
          >
            Hoy
          </Button>
        </div>
      </div>

      <PageState
        isLoading={consulta.isLoading}
        isError={consulta.isError}
        error={consulta.error}
        onRetry={() => void consulta.refetch()}
        errorTitle="No se pudo cargar el control del día"
      >
        <div className="space-y-4">
          {consulta.data?.sinClases && (
            <p
              role="status"
              className="border-warning/40 bg-warning/10 text-foreground flex items-center gap-2 rounded-xl border p-3 text-xs"
            >
              <HugeiconsIcon icon={Calendar03Icon} className="size-4 shrink-0" />
              {consulta.data.personalLabora
                ? "Día sin clases en el que el personal trabaja: se espera su asistencia."
                : "El calendario marca este día sin clases: no se espera asistencia."}
            </p>
          )}

          <dl className="border-border/60 bg-border/60 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border shadow-xs sm:grid-cols-3 lg:grid-cols-5">
            {resumen.map((r) => (
              <div key={r.etiqueta} className="bg-card p-4 max-sm:last:col-span-2">
                <dt className="text-muted-foreground text-xs font-semibold">{r.etiqueta}</dt>
                <dd className="text-foreground text-2xl font-bold tabular-nums">{r.valor}</dd>
                {r.nota && <dd className="text-muted-foreground text-xs">{r.nota}</dd>}
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="group" aria-label="Filtrar personal" className="flex flex-wrap gap-1.5">
              {filtros.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filtro === f.id}
                  onClick={() => setFiltro(f.id)}
                  className={cn(
                    "border-border/70 focus-visible:ring-primary/30 rounded-full border px-3 py-1.5 text-xs font-semibold outline-none focus-visible:ring-2 pointer-coarse:min-h-9",
                    filtro === f.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}{" "}
                  <span className="tabular-nums">{personas.filter(pasa[f.id]).length}</span>
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                aria-label="Buscar por nombre"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="h-10 rounded-full pl-9"
              />
            </div>
          </div>

          <div className="border-border/60 bg-card overflow-hidden rounded-2xl border shadow-xs">
            <div
              aria-hidden="true"
              className={cn(
                FILA,
                "border-border/60 bg-muted/50 text-muted-foreground hidden border-b py-2.5 text-xs font-semibold lg:grid",
              )}
            >
              <span>Persona</span>
              <span>Horario esperado</span>
              <span>Entrada</span>
              <span>Salida</span>
              <span>Clases firmadas</span>
              <span>Estado</span>
              <span />
            </div>
            {visibles.length === 0 ? (
              <p className="text-muted-foreground p-8 text-center text-sm">
                {personas.length === 0
                  ? "No hay personal registrado."
                  : "Nadie coincide con el filtro o la búsqueda."}
              </p>
            ) : (
              <ul className="divide-border/60 divide-y">
                {visibles.map((p) => (
                  <li key={p.personaId}>
                    <Fila
                      persona={p}
                      hoy={hoy}
                      ahora={ahora}
                      onAbrir={() => setElegidaId(p.personaId)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PageState>

      <DetallePersona
        persona={personas.find((p) => p.personaId === elegidaId) ?? null}
        onCerrar={() => setElegidaId(null)}
        {...props}
      />
    </div>
  );
}

const FILA =
  "grid grid-cols-3 items-center gap-x-3 gap-y-2 px-4 lg:grid-cols-[minmax(0,2.4fr)_1.3fr_0.9fr_0.9fr_1.2fr_1.3fr_1.25rem]";

function Hora({ etiqueta, marca }: { etiqueta: string; marca: MarcacionApi | null }) {
  return (
    <span className="block">
      <span className="text-muted-foreground block text-xs lg:sr-only">{etiqueta}</span>
      <span
        className={cn(
          "font-mono text-sm font-bold tabular-nums",
          marca ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {marca ? marca.fechaHora.slice(11, 16) : "—"}
      </span>
      {marca?.resultado === "tardanza" && (
        <span className="text-muted-foreground block text-xs">
          +{marca.minutosTardanza} min{marca.justificada && " · justificada"}
        </span>
      )}
      {marca?.resultado === "salida_anticipada" && (
        <span className="text-muted-foreground block text-xs">anticipada</span>
      )}
    </span>
  );
}

function Fila({
  persona,
  hoy,
  ahora,
  onAbrir,
}: {
  persona: PersonaControl;
  hoy: string;
  ahora: string;
  onAbrir: () => void;
}) {
  const estado = ESTADOS_DIA[persona.estado];
  const firmadas = persona.sesiones.filter((s) => s.horaIngreso).length;
  const sinFirma = persona.sesiones.filter((s) => claseSinFirma(s, hoy, ahora)).length;
  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-label={`Ver el detalle de ${persona.nombreCompleto}`}
      className={cn(
        FILA,
        "hover:bg-muted/50 focus-visible:bg-muted/60 w-full py-3 text-left outline-none",
      )}
    >
      <span className="col-span-3 flex min-w-0 items-center gap-3 lg:col-span-1">
        <UserAvatar
          name={persona.nombreCompleto}
          avatar={persona.fotoUrl ? resolveBackendUrl(persona.fotoUrl) : null}
        />
        <span className="min-w-0">
          <span className="text-foreground block truncate text-sm font-semibold">
            {persona.nombreCompleto}
          </span>
          <span className="text-muted-foreground block text-xs">
            {persona.tipoPersona === "docentes" ? "Docente" : "Administrativo"}
          </span>
        </span>
      </span>
      <span className="block">
        <span className="text-muted-foreground block text-xs lg:sr-only">Horario</span>
        <span className="text-foreground block font-mono text-sm tabular-nums">
          {persona.horario ? `${persona.horario.entrada}–${persona.horario.salida}` : "—"}
        </span>
        {persona.horario && (
          <span className="text-muted-foreground block text-xs">
            {persona.horario.fuente === "clases" ? "según sus clases" : "turno general"}
          </span>
        )}
      </span>
      <Hora etiqueta="Entrada" marca={persona.entrada} />
      <Hora etiqueta="Salida" marca={persona.salida} />
      <span className="block">
        <span className="text-muted-foreground block text-xs lg:sr-only">Clases</span>
        {persona.sesiones.length === 0 ? (
          <span className="text-muted-foreground text-sm">—</span>
        ) : (
          <>
            <span className="text-foreground block text-sm font-bold tabular-nums">
              {firmadas} de {persona.sesiones.length}
            </span>
            <span className="bg-muted mt-1 block h-1.5 w-20 overflow-hidden rounded-full">
              <span
                className="bg-success block h-full"
                style={{ width: `${(firmadas / persona.sesiones.length) * 100}%` }}
              />
            </span>
            {sinFirma > 0 && (
              <span className="text-destructive block text-xs">{sinFirma} sin firma</span>
            )}
          </>
        )}
      </span>
      <span className="col-span-2 lg:col-span-1">
        <StatusBadge tone={estado.tone} dot>
          {estado.label}
        </StatusBadge>
      </span>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        className="text-muted-foreground hidden size-4 lg:block"
        aria-hidden="true"
      />
    </button>
  );
}
