"use client";

import * as React from "react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { Modal } from "@/components/common/modal";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DetalleAsistenciaEstudiante,
  JustificarFaltaModal,
  SelectorBimestre,
  useRangoBimestre,
  type FaltaAJustificar,
} from "./components";
import { useAsistenciaSeccion, useMisSecciones } from "./hooks";
import type { ResumenEstudianteSeccion } from "./types";

export function AsistenciaSeccionPage() {
  const { data: secciones = [] } = useMisSecciones();
  const { bimestres, bimestreId, setElegido, rango } = useRangoBimestre();
  const [seccionId, setSeccionId] = React.useState("");
  const [estudiante, setEstudiante] = React.useState<ResumenEstudianteSeccion | null>(null);
  const [falta, setFalta] = React.useState<FaltaAJustificar | null>(null);

  const seccionActual = seccionId || secciones[0]?.id || "";
  const { data, isLoading, isError, error, refetch } = useAsistenciaSeccion(seccionActual, rango);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Asistencia de mi sección"
        description="Faltas y tardanzas al colegio y por curso de cada estudiante en el periodo elegido."
        icon={UserGroupIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Asistencia de mi sección" },
        ]}
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full max-w-64">
          <SelectOption
            options={secciones.map((s) => ({ value: s.id, label: s.nombre }))}
            value={seccionActual}
            onSelect={setSeccionId}
            placeholder="Sección"
            searchPlaceholder="Buscar sección"
          />
        </div>
        <SelectorBimestre bimestres={bimestres} valor={bimestreId} onCambiar={setElegido} />
      </div>

      {!seccionActual ? (
        <EmptyState
          title="No hay secciones para consultar"
          description="Solo el tutor de una sección, o la dirección y secretaría, pueden ver su asistencia."
          icon={UserGroupIcon}
        />
      ) : (
        <PageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
          errorTitle="No se pudo cargar la asistencia"
        >
          {data && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                {data.seccionNombre} · {data.diasConClases} días con clases en el periodo.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead className="text-right">Faltas al colegio</TableHead>
                    <TableHead className="text-right">Tardanzas al colegio</TableHead>
                    <TableHead className="text-right">Faltas en clase</TableHead>
                    <TableHead className="text-right">Tardanzas en clase</TableHead>
                    <TableHead className="text-right">Detalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.estudiantes.map((e) => (
                    <TableRow key={e.estudianteId}>
                      <TableCell className="font-medium">{e.nombreCompleto}</TableCell>
                      <TableCell className="text-right tabular-nums">{e.faltasColegio}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {e.tardanzasColegio}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {e.clases.faltas + e.clases.faltasJustificadas}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {e.clases.tardanzas}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          className="min-h-10"
                          onClick={() => setEstudiante(e)}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </PageState>
      )}

      <Modal
        open={Boolean(estudiante)}
        onOpenChange={(abierto) => !abierto && setEstudiante(null)}
        title={estudiante?.nombreCompleto}
        description="Asistencia al colegio y por curso en el periodo elegido."
        icon={UserGroupIcon}
        size="3xl"
      >
        {estudiante && rango && (
          <DetalleAsistenciaEstudiante
            estudianteId={estudiante.estudianteId}
            rango={rango}
            onJustificar={(incidencia, cursoNombre) =>
              setFalta({ id: incidencia.id, cursoNombre, fecha: incidencia.fecha })
            }
          />
        )}
      </Modal>
      <JustificarFaltaModal falta={falta} onOpenChange={(abierto) => !abierto && setFalta(null)} />
    </div>
  );
}
