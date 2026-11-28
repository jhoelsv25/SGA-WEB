"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SelectOption } from "@/components/common/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/common/spinner";
import { MAX_ARCHIVOS, MAX_BYTES_PDF, ETIQUETA_ESTADO, tituloBimestre } from "../constants";
import { ModalAsignarArchivo } from "./modals";
import { usePublicarLibretasMutation, useVistaPreviaLibretasMutation } from "../hooks";
import type { AsignacionManual, ContextoLibretas, EstadoLibreta } from "../types";

const MENSAJE_INVALIDO = "Solo se aceptan archivos PDF de hasta 5 MB.";
const MENSAJE_DEMASIADOS = "Puede subir hasta 50 archivos por carga.";

function esReemplazo(estado: EstadoLibreta | null): boolean {
  return Boolean(estado && estado !== "pendiente");
}

export function PanelSubirLibretas({ contexto }: { contexto: ContextoLibretas }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [seccionId, setSeccionId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);
  const [arrastrando, setArrastrando] = useState(false);
  const [manuales, setManuales] = useState<Record<string, { matriculaId: string; motivo: string }>>(
    {},
  );
  const [motivos, setMotivos] = useState<Record<string, string>>({});
  const [excluidos, setExcluidos] = useState<string[]>([]);
  const [archivoManual, setArchivoManual] = useState<string | null>(null);
  const vista = useVistaPreviaLibretasMutation();
  const publicar = usePublicarLibretasMutation(() => {
    setArchivos([]);
    setManuales({});
    setMotivos({});
    setExcluidos([]);
    vista.reset();
  });

  const periodos = contexto.periodos.filter((periodo) => periodo.programada);
  const preview = vista.data;

  const asignadasVisibles = useMemo(() => {
    if (!preview) return [];
    const excluidosSet = new Set(excluidos);
    return preview.asignadas.filter((item) => !excluidosSet.has(item.nombreArchivo));
  }, [preview, excluidos]);

  const asignaciones = useMemo(() => {
    if (!preview) return [];
    const lista: AsignacionManual[] = [];
    const yaIncluidos = new Set<string>();
    for (const item of asignadasVisibles) {
      const correccion = manuales[item.nombreArchivo];
      if (correccion) {
        lista.push({
          nombreArchivo: item.nombreArchivo,
          matriculaId: correccion.matriculaId,
          motivo: correccion.motivo || undefined,
        });
        yaIncluidos.add(item.nombreArchivo);
        continue;
      }
      const reemplazo = esReemplazo(item.estado);
      const porOcr = item.metodoReconocimiento === "ocr";
      if (!reemplazo && !porOcr) continue;
      const motivo = reemplazo ? (motivos[item.nombreArchivo] ?? "").trim() : undefined;
      lista.push({
        nombreArchivo: item.nombreArchivo,
        matriculaId: item.matriculaId,
        motivo,
        origen: porOcr ? "ocr" : undefined,
      });
      yaIncluidos.add(item.nombreArchivo);
    }
    for (const [nombreArchivo, manual] of Object.entries(manuales)) {
      if (yaIncluidos.has(nombreArchivo)) continue;
      lista.push({
        nombreArchivo,
        matriculaId: manual.matriculaId,
        motivo: manual.motivo || undefined,
      });
    }
    return lista;
  }, [preview, asignadasVisibles, motivos, manuales]);

  function incorporar(entrantes: File[]) {
    if (archivos.length + entrantes.length > MAX_ARCHIVOS) {
      toast.error(MENSAJE_DEMASIADOS);
      return;
    }
    const siguientes = [...archivos];
    for (const archivo of entrantes) {
      const esPdf =
        archivo.type === "application/pdf" || archivo.name.toLowerCase().endsWith(".pdf");
      if (!esPdf || archivo.size > MAX_BYTES_PDF) {
        toast.error(MENSAJE_INVALIDO);
        continue;
      }
      if (
        siguientes.some((actual) => actual.name === archivo.name && actual.size === archivo.size)
      ) {
        continue;
      }
      siguientes.push(archivo);
    }
    setArchivos(siguientes);
    setManuales({});
    setMotivos({});
    setExcluidos([]);
    vista.reset();
  }

  function publicarCarga() {
    if (!preview) return;
    const faltaMotivo = asignadasVisibles.some((item) => {
      if (manuales[item.nombreArchivo]) return false;
      return esReemplazo(item.estado) && !(motivos[item.nombreArchivo] ?? "").trim();
    });
    if (faltaMotivo) {
      toast.error("Indique el motivo del reemplazo.");
      return;
    }
    const manualesSinReconocer = Object.keys(manuales).filter(
      (nombre) => !asignadasVisibles.some((item) => item.nombreArchivo === nombre),
    );
    const publicables = asignadasVisibles.length + manualesSinReconocer.length;
    if (publicables === 0) {
      toast.error("No hay libretas asignadas para publicar.");
      return;
    }
    const excluidosSet = new Set(excluidos);
    const archivosAPublicar = archivos.filter((archivo) => !excluidosSet.has(archivo.name));
    publicar.mutate({ seccionId, periodoId, archivos: archivosAPublicar, asignaciones });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Sección</Label>
          <SelectOption
            options={contexto.secciones.map((seccion) => ({
              value: seccion.id,
              label: `${seccion.gradoNombre} ${seccion.nombre}`,
            }))}
            value={seccionId || undefined}
            onSelect={(valor) => {
              setSeccionId(valor);
              vista.reset();
            }}
            placeholder="Elige la sección"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Bimestre</Label>
          <SelectOption
            options={periodos.map((periodo) => ({
              value: periodo.id,
              label: tituloBimestre(periodo.nombre),
            }))}
            value={periodoId || undefined}
            onSelect={(valor) => {
              setPeriodoId(valor);
              vista.reset();
            }}
            placeholder="Elige el bimestre"
            emptyMessage="No hay bimestres programados"
          />
        </div>
      </div>

      <button
        type="button"
        className={`flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center ${arrastrando ? "border-primary bg-primary/5" : "border-border"}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(evento) => {
          evento.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(evento) => {
          evento.preventDefault();
          setArrastrando(false);
          incorporar(Array.from(evento.dataTransfer.files));
        }}
      >
        <HugeiconsIcon icon={Upload01Icon} className="size-6" />
        <span className="text-sm font-medium">Arrastra los PDF o haz clic para elegirlos</span>
        <span className="text-muted-foreground text-xs">
          Hasta {MAX_ARCHIVOS} archivos, 5 MB cada uno. Si el nombre no incluye el código del
          estudiante, se intentará leer automáticamente del PDF.
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(evento) => {
          incorporar(Array.from(evento.target.files ?? []));
          evento.target.value = "";
        }}
      />

      {archivos.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm">{archivos.length} archivo(s) listos</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!seccionId || !periodoId || vista.isPending}
              onClick={() => vista.mutate({ seccionId, periodoId, archivos })}
            >
              {vista.isPending ? <Spinner className="size-3.5" /> : null}
              Revisar carga
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setArchivos([])}>
              Quitar archivos
            </Button>
          </div>
        </div>
      ) : null}

      {preview ? (
        <div className="space-y-4">
          <p className="text-sm font-medium">{preview.mensaje}</p>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Asignadas</h3>
            {asignadasVisibles.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                Ningún archivo coincidió con un estudiante de la sección.
              </p>
            ) : (
              <ul className="space-y-2">
                {asignadasVisibles.map((item) => {
                  const correccion = manuales[item.nombreArchivo];
                  const estudianteCorregido = correccion
                    ? preview.estudiantes.find(
                        (fila) => fila.matriculaId === correccion.matriculaId,
                      )
                    : undefined;
                  const nombreMostrado = estudianteCorregido?.nombreCompleto ?? item.nombreCompleto;
                  const estadoMostrado = correccion
                    ? (estudianteCorregido?.estado ?? null)
                    : item.estado;
                  const porOcr = item.metodoReconocimiento === "ocr";
                  return (
                    <li key={item.nombreArchivo} className="rounded-lg border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm">
                          {item.nombreArchivo} · {nombreMostrado}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {correccion ? (
                            <Badge variant="outline">Corregido manualmente</Badge>
                          ) : porOcr ? (
                            <Badge variant="outline">Detectado por OCR</Badge>
                          ) : null}
                          <Badge
                            variant={
                              estadoMostrado === "pendiente" || !estadoMostrado
                                ? "secondary"
                                : "warning"
                            }
                          >
                            {estadoMostrado ? ETIQUETA_ESTADO[estadoMostrado] : "Pendiente"}
                          </Badge>
                        </div>
                      </div>
                      {porOcr ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setArchivoManual(item.nombreArchivo)}
                          >
                            Cambiar estudiante
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setExcluidos((actual) => [...actual, item.nombreArchivo]);
                              setManuales((actual) => {
                                const copia = { ...actual };
                                delete copia[item.nombreArchivo];
                                return copia;
                              });
                            }}
                          >
                            Quitar
                          </Button>
                        </div>
                      ) : null}
                      {!correccion && esReemplazo(item.estado) ? (
                        <div className="mt-2 space-y-1.5">
                          <Label className="text-sm font-medium">Motivo del reemplazo *</Label>
                          <Input
                            value={motivos[item.nombreArchivo] ?? ""}
                            onChange={(evento) =>
                              setMotivos((actual) => ({
                                ...actual,
                                [item.nombreArchivo]: evento.target.value,
                              }))
                            }
                            placeholder="Por qué se reemplaza"
                          />
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Sin reconocer</h3>
            {preview.sinReconocer.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                Todos los archivos de esta sección fueron reconocidos.
              </p>
            ) : (
              <ul className="space-y-2">
                {preview.sinReconocer.map((item) => {
                  const manual = manuales[item.nombreArchivo];
                  const estudiante = preview.estudiantes.find(
                    (fila) => fila.matriculaId === manual?.matriculaId,
                  );
                  return (
                    <li key={item.nombreArchivo} className="rounded-lg border p-3">
                      <p className="text-sm font-medium">{item.nombreArchivo}</p>
                      <p className="text-muted-foreground text-xs">{item.mensaje}</p>
                      {estudiante ? (
                        <p className="mt-1 text-xs">Asignado a {estudiante.nombreCompleto}</p>
                      ) : null}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setArchivoManual(item.nombreArchivo)}
                      >
                        Asignar estudiante
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Otra sección</h3>
            {preview.otraSeccion.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                Ningún archivo pertenece a otra sección.
              </p>
            ) : (
              <ul className="space-y-2">
                {preview.otraSeccion.map((item) => (
                  <li key={item.nombreArchivo} className="rounded-lg border p-3">
                    <p className="text-sm font-medium">{item.nombreArchivo}</p>
                    <p className="text-muted-foreground text-xs">{item.mensaje}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex justify-end">
            <Button type="button" disabled={publicar.isPending} onClick={publicarCarga}>
              {publicar.isPending ? <Spinner className="size-3.5" /> : null}
              Publicar asignadas
            </Button>
          </div>
        </div>
      ) : null}

      <ModalAsignarArchivo
        open={Boolean(archivoManual)}
        onOpenChange={(abierto) => {
          if (!abierto) setArchivoManual(null);
        }}
        nombreArchivo={archivoManual ?? ""}
        estudiantes={preview?.estudiantes ?? []}
        onAsignar={(matriculaId, motivo) => {
          if (!archivoManual) return;
          setManuales((actual) => ({
            ...actual,
            [archivoManual]: { matriculaId, motivo },
          }));
        }}
      />
    </div>
  );
}
