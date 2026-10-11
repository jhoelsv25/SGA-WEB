"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen01Icon, FileEditIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectorBimestre, useRangoBimestre } from "@/features/asistencia/components";
import { EstadoSesionBadge, HorasFirmadas, ModalTexto } from "./components";
import { useCorregirTema, useMisSesiones, useSolicitarJustificacion } from "./hooks";
import type { Sesion } from "./types";

type Accion = { tipo: "tema" | "justificar"; sesion: Sesion } | null;

const fechaCorta = (iso: string): string => iso.slice(0, 10).split("-").reverse().join("/");

function Total({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  return (
    <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
      <p className="text-muted-foreground text-xs font-medium">{etiqueta}</p>
      <p className="text-2xl font-extrabold tabular-nums">{valor}</p>
    </div>
  );
}

function Acciones({ sesion, onAccion }: { sesion: Sesion; onAccion: (a: Accion) => void }) {
  const puedeJustificar =
    sesion.estado === "no_cumplida" && sesion.justificacion?.estado !== "solicitada";
  const conAsistencia = ["en_curso", "cumplida", "parcial"].includes(sesion.estado);
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {conAsistencia && (
        <Button asChild variant="outline" className="min-h-10">
          <Link href={`/admin/asistencia?sesionId=${sesion.id}`}>Asistencia</Link>
        </Button>
      )}
      {(sesion.estado === "pendiente" || sesion.estado === "en_curso") && (
        <Button
          type="button"
          variant="outline"
          className="min-h-10"
          onClick={() => onAccion({ tipo: "tema", sesion })}
        >
          Tema
        </Button>
      )}
      {puedeJustificar && (
        <Button
          type="button"
          variant="outline"
          className="min-h-10"
          onClick={() => onAccion({ tipo: "justificar", sesion })}
        >
          Justificar
        </Button>
      )}
    </div>
  );
}

export function MisSesionesPage() {
  const { bimestres, bimestreId, setElegido, rango } = useRangoBimestre();
  const { data, isLoading, isError, error, refetch } = useMisSesiones(rango);
  const [accion, setAccion] = React.useState<Accion>(null);
  const tema = useCorregirTema();
  const justificar = useSolicitarJustificacion();
  const cerrar = () => setAccion(null);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Mis sesiones"
        description="Historial de sus sesiones con tema, horas firmadas, estado y minutos perdidos."
        icon={BookOpen01Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mis sesiones" }]}
      />
      <SelectorBimestre bimestres={bimestres} valor={bimestreId} onCambiar={setElegido} />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron cargar sus sesiones"
      >
        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Total etiqueta="Cumplidas" valor={data.totales.cumplidas} />
              <Total etiqueta="Parciales" valor={data.totales.parciales} />
              <Total etiqueta="No cumplidas" valor={data.totales.noCumplidas} />
              <Total etiqueta="Justificadas" valor={data.totales.justificadas} />
            </div>
            {data.sesiones.length === 0 ? (
              <EmptyState
                title="Sin sesiones en este periodo"
                description="Elija otro bimestre para ver su historial."
                icon={BookOpen01Icon}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Curso y sección</TableHead>
                    <TableHead>Tema</TableHead>
                    <TableHead>Firmas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.sesiones.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">
                        {fechaCorta(s.fecha)}
                        <br />
                        {s.horaInicio}–{s.horaFin}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{s.cursoNombre}</p>
                        <p className="text-muted-foreground text-xs">{s.seccionNombre}</p>
                      </TableCell>
                      <TableCell className="max-w-56 text-sm">{s.tema ?? "—"}</TableCell>
                      <TableCell>
                        <HorasFirmadas sesion={s} />
                      </TableCell>
                      <TableCell>
                        <EstadoSesionBadge sesion={s} />
                        {s.justificacion?.estado === "rechazada" && s.justificacion.comentario && (
                          <p className="text-muted-foreground mt-1 text-xs">
                            Rechazo: {s.justificacion.comentario}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Acciones sesion={s} onAccion={setAccion} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </PageState>

      <ModalTexto
        abierto={accion?.tipo === "tema"}
        clave={`tema-${accion?.sesion.id ?? ""}`}
        onOpenChange={(abierto) => !abierto && cerrar()}
        titulo="Corregir tema"
        descripcion={
          accion ? `${accion.sesion.cursoNombre} · ${accion.sesion.seccionNombre}` : undefined
        }
        icono={FileEditIcon}
        etiqueta="Tema"
        placeholder="Ej. Ecuaciones cuadráticas"
        mensajeRequerido="Ingrese el tema de la sesión para firmar el ingreso."
        textoInicial={accion?.sesion.tema ?? ""}
        textoBoton="Guardar tema"
        pendiente={tema.isPending}
        onEnviar={({ texto }) =>
          accion && tema.mutate({ id: accion.sesion.id, tema: texto }, { onSuccess: cerrar })
        }
      />
      <ModalTexto
        abierto={accion?.tipo === "justificar"}
        clave={`justificar-${accion?.sesion.id ?? ""}`}
        onOpenChange={(abierto) => !abierto && cerrar()}
        titulo="Solicitar justificación"
        descripcion="La revisa el subdirector."
        icono={FileEditIcon}
        etiqueta="Motivo"
        placeholder="Ej. Descanso médico"
        mensajeRequerido="Indique el motivo de la justificación."
        conEnlace
        textoBoton="Enviar justificación"
        pendiente={justificar.isPending}
        onEnviar={({ texto, enlace }) =>
          accion &&
          justificar.mutate(
            { id: accion.sesion.id, motivo: texto, documentoUrl: enlace },
            { onSuccess: cerrar },
          )
        }
      />
    </div>
  );
}
