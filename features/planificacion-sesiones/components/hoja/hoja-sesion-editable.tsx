"use client";

import * as React from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { DOCUMENTO_SESION as M, fechaDocumento, MOMENTOS } from "../../consts";
import { useCompetencias, useDesempenos, useEnfoques } from "../../hooks";
import type {
  Bloque,
  CompetenciaCatalogo,
  EnfoqueCatalogo,
  EnfoquePlanificado,
  GuardarPlanificacionPayload,
  Momento,
  OpcionCatalogo,
  TransversalPlanificada,
} from "../../types";
import { sumaMinutos } from "../../utils";
import {
  AccionHoja,
  AyudaHoja,
  ListaHoja,
  NumeroHoja,
  QuitarFilaHoja,
  SelectorHoja,
  TextoHoja,
} from "./campos-hoja";
import {
  CeldaHoja,
  FirmasHoja,
  Hoja,
  SeccionHoja,
  SubseccionHoja,
  TablaHoja,
  VinetasHoja,
} from "./hoja";

type Payload = GuardarPlanificacionPayload;
type CompetenciaForm = NonNullable<Payload["competencias"]>[number];
type DesempenoForm = CompetenciaForm["desempenos"][number];
type MomentoForm = NonNullable<Payload["momentos"]>[number];

/** Anclas de la hoja para saltar a lo que falta desde la barra de avance. */
export const ANCLAS_HOJA = {
  datos: "hoja-titulo",
  competencias: "hoja-propositos",
  evaluacion: "hoja-evaluacion",
  secuencia: "hoja-momentos",
  referencias: "hoja-referencias",
} as const;

interface Props {
  f: Payload;
  poner: (p: Partial<Payload>) => void;
  bloque: Bloque;
  /** Datos informativos que llena el sistema (salen del documento guardado). */
  institucion: string | null;
  director: string | null;
  docente: string | null;
  borrador: boolean;
  solo: boolean;
  minutosBloque: number;
  instrumentos: OpcionCatalogo[];
  onUsarDesempenos: () => void;
  onRepartirTiempo: () => void;
}

const SE_LLENA = "Se completa al guardar";

/**
 * La sesión se escribe sobre una hoja igual al Word exportado: mismas secciones, tablas,
 * columnas y orden (`DOCUMENTO_SESION`). Lo que se escribe en cada celda es lo que saldrá.
 */
export function HojaSesionEditable({
  f,
  poner,
  bloque,
  institucion,
  director,
  docente,
  borrador,
  solo,
  minutosBloque,
  instrumentos,
  onUsarDesempenos,
  onRepartirTiempo,
}: Props) {
  const { data: competencias = [] } = useCompetencias();
  const { data: enfoques = [] } = useEnfoques();
  const F = M.datosInformativos.filas;
  const filasCompetencia = f.competencias ?? [];
  const instrumento = instrumentos.find((o) => o.codigo === f.instrumentoCodigo);
  const total = sumaMinutos(f.momentos ?? []);

  const delArea = React.useMemo(() => {
    const area = bloque.areaCurricular.toLowerCase();
    const coinciden = competencias.filter(
      (c) => c.tipo === "area" && (c.areaCodigo ?? "").toLowerCase() === area,
    );
    return coinciden.length > 0 ? coinciden : competencias.filter((c) => c.tipo === "area");
  }, [competencias, bloque.areaCurricular]);

  const ponerCompetencia = (i: number, parche: Partial<CompetenciaForm>) =>
    poner({ competencias: filasCompetencia.map((c, k) => (k === i ? { ...c, ...parche } : c)) });

  const datos: [string, React.ReactNode][] = [
    [F.institucion, institucion ?? <AyudaHoja>{SE_LLENA}</AyudaHoja>],
    [F.director, director ?? <AyudaHoja>{SE_LLENA}</AyudaHoja>],
    [F.docente, docente ?? <AyudaHoja>{SE_LLENA}</AyudaHoja>],
    [F.gradoSeccion, `${bloque.gradoNombre} / ${bloque.seccionNombre}`],
    [F.area, bloque.cursoNombre],
    [F.fecha, fechaDocumento(f.fecha)],
  ];

  return (
    <Hoja etiqueta="Hoja de la sesión de aprendizaje">
      {borrador && <p className="font-bold">{M.borrador}</p>}
      <div id={ANCLAS_HOJA.datos} className="scroll-mt-24 text-center font-bold">
        <p className="flex items-baseline justify-center gap-[4pt] text-[14pt]">
          <span>{M.encabezado}</span>
          <NumeroHoja
            etiqueta="Número de sesión"
            placeholder={M.vacio}
            className="w-[3.2em] text-left"
            disabled={solo}
            valor={f.numero}
            onCambio={(numero) => poner({ numero })}
          />
        </p>
        <div className="mx-auto mt-[2pt] mb-[8pt] flex max-w-[90%] items-start justify-center text-[12pt]">
          <span aria-hidden="true">“</span>
          <TextoHoja
            etiqueta="Título de la sesión (obligatorio)"
            placeholder="Escriba aquí el título de la sesión"
            className="w-auto flex-1 text-center"
            unaLinea
            disabled={solo}
            valor={f.titulo}
            onCambio={(titulo) => poner({ titulo })}
          />
          <span aria-hidden="true">”</span>
        </div>
      </div>

      <SeccionHoja>{M.datosInformativos.titulo}</SeccionHoja>
      <TablaHoja anchos={M.datosInformativos.anchos} etiqueta={M.datosInformativos.titulo}>
        {datos.map(([k, v]) => (
          <tr key={k}>
            <CeldaHoja encabezadoFila negrita>
              {k}
            </CeldaHoja>
            <CeldaHoja>{v}</CeldaHoja>
          </tr>
        ))}
        {(!solo || f.unidad) && (
          <tr
            className={f.unidad ? undefined : "opacity-70"}
            title={
              f.unidad ? undefined : "Opcional: si la deja vacía, esta fila no sale en el Word."
            }
          >
            <CeldaHoja encabezadoFila negrita>
              {F.unidad}
            </CeldaHoja>
            <CeldaHoja>
              <TextoHoja
                etiqueta="Unidad (opcional)"
                placeholder="Opcional (si queda vacía, no sale en el Word). Ej.: Unidad 7"
                unaLinea
                disabled={solo}
                valor={f.unidad ?? ""}
                onCambio={(unidad) => poner({ unidad })}
              />
            </CeldaHoja>
          </tr>
        )}
      </TablaHoja>

      <SeccionHoja>{M.acerca}</SeccionHoja>
      <SubseccionHoja id={ANCLAS_HOJA.competencias}>{M.propositos.titulo}</SubseccionHoja>
      <div className="mb-[4pt] flex items-start">
        <span className="shrink-0 font-bold whitespace-pre">{M.propositos.etiquetaProposito}</span>
        <TextoHoja
          etiqueta="Propósito de la sesión"
          placeholder="¿Qué van a aprender hoy los estudiantes? En una o dos frases."
          disabled={solo}
          valor={f.proposito ?? ""}
          onCambio={(proposito) => poner({ proposito })}
        />
      </div>
      <TablaHoja
        anchos={M.propositos.anchos}
        columnas={M.propositos.columnas}
        etiqueta={M.propositos.titulo}
      >
        {filasCompetencia.map((c, i) => (
          <FilaCompetencia
            key={i}
            indice={i}
            valor={c}
            grado={bloque.gradoNumero}
            opciones={delArea}
            todas={competencias}
            solo={solo}
            onCambio={(p) => ponerCompetencia(i, p)}
            onQuitar={() => poner({ competencias: filasCompetencia.filter((_, k) => k !== i) })}
          />
        ))}
      </TablaHoja>
      {!solo && (
        <AccionHoja
          icono={PlusSignIcon}
          onClick={() =>
            poner({
              competencias: [
                ...filasCompetencia,
                { competenciaId: "", capacidades: [], desempenos: [] },
              ],
            })
          }
        >
          Agregar competencia
        </AccionHoja>
      )}

      <SubseccionHoja id={ANCLAS_HOJA.evaluacion}>{M.evaluacion.titulo}</SubseccionHoja>
      <TablaHoja
        anchos={M.evaluacion.anchos}
        columnas={M.evaluacion.columnas}
        etiqueta={M.evaluacion.titulo}
      >
        <tr>
          <CeldaHoja>
            <TextoHoja
              etiqueta="Evidencia de aprendizaje"
              placeholder="Ej.: Resuelven 5 ecuaciones y explican un procedimiento."
              disabled={solo}
              valor={f.evidencia ?? ""}
              onCambio={(evidencia) => poner({ evidencia })}
            />
          </CeldaHoja>
          <CeldaHoja>
            <ListaHoja
              items={f.criterios ?? []}
              texto={(t) => t}
              conTexto={(_, t) => t}
              nuevo={(t) => t}
              etiqueta="Criterio de evaluación"
              placeholder="Escriba un criterio"
              textoAgregar="Agregar criterio"
              disabled={solo}
              onCambio={(criterios) => poner({ criterios })}
            />
            {!solo && (
              <AccionHoja onClick={onUsarDesempenos}>Usar mis desempeños como criterios</AccionHoja>
            )}
          </CeldaHoja>
          <CeldaHoja>
            <SelectorHoja
              etiqueta="Instrumento de evaluación"
              opciones={instrumentos.map((o) => ({ valor: o.codigo, texto: o.nombre }))}
              seleccion={f.instrumentoCodigo ? [f.instrumentoCodigo] : []}
              disabled={solo}
              onCambio={([v]) => poner({ instrumentoCodigo: v })}
            >
              {instrumento?.nombre ?? f.instrumentoCodigo ?? (
                <AyudaHoja>Elegir instrumento</AyudaHoja>
              )}
            </SelectorHoja>
          </CeldaHoja>
        </tr>
      </TablaHoja>

      <SubseccionHoja>{M.transversales.titulo}</SubseccionHoja>
      <TablaTransversales
        valor={f.competenciasTransversales ?? []}
        catalogo={competencias.filter((c) => c.tipo === "transversal")}
        solo={solo}
        onCambio={(competenciasTransversales) => poner({ competenciasTransversales })}
      />

      <SubseccionHoja>{M.enfoques.titulo}</SubseccionHoja>
      <TablaEnfoques
        valor={f.enfoques ?? []}
        catalogo={enfoques}
        solo={solo}
        onCambio={(e) => poner({ enfoques: e })}
      />

      <SeccionHoja>{M.secuencia}</SeccionHoja>
      <SubseccionHoja>{M.materiales.titulo}</SubseccionHoja>
      <TablaHoja
        anchos={M.materiales.anchos}
        columnas={M.materiales.columnas}
        etiqueta={M.materiales.titulo}
      >
        <tr>
          {(["impresos", "manipulativos", "digitales"] as const).map((k, i) => (
            <CeldaHoja key={k}>
              <ListaHoja
                items={f.materiales?.[k] ?? []}
                texto={(t) => t}
                conTexto={(_, t) => t}
                nuevo={(t) => t}
                etiqueta={M.materiales.columnas[i] ?? k}
                placeholder={["Ej.: Fichas de trabajo", "Ej.: Conos, plumones", "Ej.: Video"][i]}
                disabled={solo}
                onCambio={(lista) => poner({ materiales: { ...f.materiales, [k]: lista } })}
              />
            </CeldaHoja>
          ))}
        </tr>
      </TablaHoja>

      <SubseccionHoja id={ANCLAS_HOJA.secuencia}>{M.momentos.titulo}</SubseccionHoja>
      <TablaMomentos
        valor={f.momentos ?? []}
        solo={solo}
        onCambio={(momentos) => poner({ momentos })}
      />
      {!solo && (
        <p
          role="status"
          className="mt-[2pt] flex flex-wrap items-center gap-x-3 font-sans text-[8pt] print:hidden"
        >
          <span
            className={
              total === minutosBloque ? "text-(--hoja-ok)" : "font-medium text-(--hoja-aviso)"
            }
          >
            {total} de {minutosBloque} minutos del bloque
            {total === minutosBloque ? "" : " · para marcarla lista deben sumar el bloque"}
          </span>
          <AccionHoja onClick={onRepartirTiempo} className="mt-0">
            Repartir el tiempo por mí
          </AccionHoja>
        </p>
      )}

      <SeccionHoja id={ANCLAS_HOJA.referencias}>{M.referencias}</SeccionHoja>
      <ListaHoja
        items={f.referencias ?? []}
        texto={(t) => t}
        conTexto={(_, t) => t}
        nuevo={(t) => t}
        etiqueta="Referencia bibliográfica"
        placeholder="Escriba una referencia"
        textoAgregar="Agregar referencia"
        disabled={solo}
        onCambio={(referencias) => poner({ referencias })}
      />

      <FirmasHoja linea={M.firmas.linea} roles={M.firmas.roles} />
    </Hoja>
  );
}

function FilaCompetencia({
  indice,
  valor,
  grado,
  opciones,
  todas,
  solo,
  onCambio,
  onQuitar,
}: {
  indice: number;
  valor: CompetenciaForm;
  grado: number;
  opciones: CompetenciaCatalogo[];
  todas: CompetenciaCatalogo[];
  solo: boolean;
  onCambio: (p: Partial<CompetenciaForm>) => void;
  onQuitar: () => void;
}) {
  const competencia = todas.find((x) => x.id === valor.competenciaId);
  const { data: desempenos = [] } = useDesempenos(valor.competenciaId || undefined, grado);
  const n = indice + 1;
  const marcados = desempenos
    .filter((d) => valor.desempenos.some((x) => x.desempenoId === d.id))
    .map((d) => d.id);

  return (
    <tr>
      <CeldaHoja>
        <SelectorHoja
          etiqueta={`Competencia ${n}`}
          opciones={opciones.map((o) => ({ valor: o.id, texto: o.nombre }))}
          seleccion={valor.competenciaId ? [valor.competenciaId] : []}
          disabled={solo}
          className="pr-5"
          onCambio={([id]) =>
            onCambio({ competenciaId: id ?? "", capacidades: [], desempenos: [] })
          }
        >
          {competencia?.nombre ?? <AyudaHoja>Elegir competencia</AyudaHoja>}
        </SelectorHoja>
        {!solo && <QuitarFilaHoja etiqueta={`Quitar competencia ${n}`} onClick={onQuitar} />}
      </CeldaHoja>
      <CeldaHoja>
        <SelectorHoja
          multiple
          etiqueta={`Capacidades de la competencia ${n}`}
          opciones={(competencia?.capacidades ?? []).map((c) => ({ valor: c, texto: c }))}
          seleccion={valor.capacidades}
          disabled={solo || !competencia}
          vacioLista="Primero elija la competencia."
          onCambio={(capacidades) => onCambio({ capacidades })}
        >
          {valor.capacidades.length > 0 ? (
            <VinetasHoja items={valor.capacidades} />
          ) : (
            <AyudaHoja>{competencia ? "Elegir capacidades" : M.vacio}</AyudaHoja>
          )}
        </SelectorHoja>
      </CeldaHoja>
      <CeldaHoja>
        <ListaHoja<DesempenoForm>
          items={valor.desempenos}
          texto={(d) => d.texto}
          conTexto={(d, texto) => ({ ...d, texto })}
          nuevo={(texto) => ({ texto })}
          etiqueta={`Desempeño precisado de la competencia ${n}`}
          placeholder={competencia ? "Elija del catálogo o escriba el suyo" : M.vacio}
          textoAgregar="Escribir uno propio"
          disabled={solo}
          onCambio={(d) => onCambio({ desempenos: d })}
        />
        {!solo && competencia && (
          <SelectorHoja
            multiple
            etiqueta={`Desempeños de ${grado}.° (catálogo)`}
            opciones={desempenos.map((d) => ({ valor: d.id, texto: d.texto }))}
            seleccion={marcados}
            vacioLista="No hay desempeños cargados para este grado; escriba el suyo."
            className="mt-[2pt] w-auto"
            onCambio={(ids) =>
              onCambio({
                desempenos: [
                  ...valor.desempenos.filter((x) => !x.desempenoId || ids.includes(x.desempenoId)),
                  ...desempenos
                    .filter((d) => ids.includes(d.id) && !marcados.includes(d.id))
                    .map((d) => ({ desempenoId: d.id, texto: d.texto })),
                ],
              })
            }
          >
            <span className="font-sans text-[8pt] font-medium text-(--hoja-accion)">
              Elegir del catálogo
            </span>
          </SelectorHoja>
        )}
      </CeldaHoja>
      <CeldaHoja>
        <TextoHoja
          etiqueta={`Campo temático de la competencia ${n}`}
          placeholder="Campo temático"
          disabled={solo}
          valor={valor.campoTematico ?? ""}
          onCambio={(campoTematico) => onCambio({ campoTematico })}
        />
      </CeldaHoja>
    </tr>
  );
}

function TablaTransversales({
  valor,
  catalogo,
  solo,
  onCambio,
}: {
  valor: TransversalPlanificada[];
  catalogo: CompetenciaCatalogo[];
  solo: boolean;
  onCambio: (v: TransversalPlanificada[]) => void;
}) {
  const poner = (id: string, p: Partial<TransversalPlanificada>) =>
    onCambio(valor.map((t) => (t.competenciaId === id ? { ...t, ...p } : t)));
  return (
    <>
      <TablaHoja
        anchos={M.transversales.anchos}
        columnas={M.transversales.columnas}
        etiqueta={M.transversales.titulo}
      >
        {valor.map((t) => {
          const c = catalogo.find((x) => x.id === t.competenciaId);
          const nombre = c?.nombre ?? M.vacio;
          return (
            <tr key={t.competenciaId}>
              <CeldaHoja className="pr-6">
                {nombre}
                {!solo && (
                  <QuitarFilaHoja
                    etiqueta={`Quitar ${nombre}`}
                    onClick={() =>
                      onCambio(valor.filter((x) => x.competenciaId !== t.competenciaId))
                    }
                  />
                )}
              </CeldaHoja>
              <CeldaHoja>
                <SelectorHoja
                  multiple
                  etiqueta={`Capacidades de ${nombre}`}
                  opciones={(c?.capacidades ?? []).map((x) => ({ valor: x, texto: x }))}
                  seleccion={t.capacidades}
                  disabled={solo}
                  onCambio={(capacidades) => poner(t.competenciaId, { capacidades })}
                >
                  {t.capacidades.length > 0 ? (
                    <VinetasHoja items={t.capacidades} />
                  ) : (
                    <AyudaHoja>{solo ? M.vacio : "Elegir capacidades"}</AyudaHoja>
                  )}
                </SelectorHoja>
              </CeldaHoja>
              <CeldaHoja>
                <TextoHoja
                  etiqueta={`Desempeño precisado de ${nombre}`}
                  placeholder="Desempeño precisado (opcional)"
                  disabled={solo}
                  valor={t.desempeno ?? ""}
                  onCambio={(desempeno) => poner(t.competenciaId, { desempeno })}
                />
              </CeldaHoja>
            </tr>
          );
        })}
      </TablaHoja>
      {!solo && (
        <SelectorHoja
          multiple
          etiqueta="Competencias transversales que trabaja (opcional)"
          opciones={catalogo.map((c) => ({ valor: c.id, texto: c.nombre }))}
          seleccion={valor.map((t) => t.competenciaId)}
          className="mt-[2pt] w-auto"
          onCambio={(ids) =>
            onCambio([
              ...valor.filter((t) => ids.includes(t.competenciaId)),
              ...ids
                .filter((id) => !valor.some((t) => t.competenciaId === id))
                .map((id) => ({ competenciaId: id, capacidades: [] })),
            ])
          }
        >
          <TextoAccion>Agregar competencia transversal (opcional)</TextoAccion>
        </SelectorHoja>
      )}
    </>
  );
}

function TablaEnfoques({
  valor,
  catalogo,
  solo,
  onCambio,
}: {
  valor: EnfoquePlanificado[];
  catalogo: EnfoqueCatalogo[];
  solo: boolean;
  onCambio: (v: EnfoquePlanificado[]) => void;
}) {
  const poner = (id: string, p: Partial<EnfoquePlanificado>) =>
    onCambio(valor.map((e) => (e.enfoqueId === id ? { ...e, ...p } : e)));
  return (
    <>
      <TablaHoja
        anchos={M.enfoques.anchos}
        columnas={M.enfoques.columnas}
        etiqueta={M.enfoques.titulo}
      >
        {valor.map((e) => {
          const c = catalogo.find((x) => x.id === e.enfoqueId);
          const nombre = c?.nombre ?? M.vacio;
          const acciones = (c?.valores ?? [])
            .filter((v) => e.valores.includes(v.nombre))
            .flatMap((v) => v.acciones);
          return (
            <tr key={e.enfoqueId}>
              <CeldaHoja className="pr-6">
                {nombre}
                {!solo && (
                  <QuitarFilaHoja
                    etiqueta={`Quitar ${nombre}`}
                    onClick={() => onCambio(valor.filter((x) => x.enfoqueId !== e.enfoqueId))}
                  />
                )}
              </CeldaHoja>
              <CeldaHoja>
                <SelectorHoja
                  multiple
                  etiqueta={`Valores de ${nombre}`}
                  opciones={(c?.valores ?? []).map((v) => ({ valor: v.nombre, texto: v.nombre }))}
                  seleccion={e.valores}
                  disabled={solo}
                  onCambio={(valores) => {
                    // Al quitar un valor se quitan también sus acciones observables.
                    const permitidas = new Set(
                      (c?.valores ?? [])
                        .filter((v) => valores.includes(v.nombre))
                        .flatMap((v) => v.acciones),
                    );
                    poner(e.enfoqueId, {
                      valores,
                      acciones: e.acciones.filter((a) => permitidas.has(a)),
                    });
                  }}
                >
                  {e.valores.length > 0 ? (
                    <VinetasHoja items={e.valores} />
                  ) : (
                    <AyudaHoja>{solo ? M.vacio : "Elegir valores"}</AyudaHoja>
                  )}
                </SelectorHoja>
              </CeldaHoja>
              <CeldaHoja>
                <SelectorHoja
                  multiple
                  etiqueta={`Acciones observables de ${nombre}`}
                  opciones={acciones.map((a) => ({ valor: a, texto: a }))}
                  seleccion={e.acciones}
                  disabled={solo}
                  vacioLista="Primero elija un valor."
                  onCambio={(a) => poner(e.enfoqueId, { acciones: a })}
                >
                  {e.acciones.length > 0 ? (
                    <VinetasHoja items={e.acciones} />
                  ) : (
                    <AyudaHoja>{solo ? M.vacio : "Elegir acciones observables"}</AyudaHoja>
                  )}
                </SelectorHoja>
              </CeldaHoja>
            </tr>
          );
        })}
      </TablaHoja>
      {!solo && (
        <SelectorHoja
          multiple
          etiqueta="Enfoques transversales que trabaja (opcional)"
          opciones={catalogo.map((e) => ({ valor: e.id, texto: e.nombre }))}
          seleccion={valor.map((e) => e.enfoqueId)}
          className="mt-[2pt] w-auto"
          onCambio={(ids) =>
            onCambio([
              ...valor.filter((e) => ids.includes(e.enfoqueId)),
              ...ids
                .filter((id) => !valor.some((e) => e.enfoqueId === id))
                .map((id) => ({ enfoqueId: id, valores: [], acciones: [] })),
            ])
          }
        >
          <TextoAccion>Agregar enfoque transversal (opcional)</TextoAccion>
        </SelectorHoja>
      )}
    </>
  );
}

function TablaMomentos({
  valor,
  solo,
  onCambio,
}: {
  valor: MomentoForm[];
  solo: boolean;
  onCambio: (v: MomentoForm[]) => void;
}) {
  const de = (m: Momento): MomentoForm => valor.find((x) => x.momento === m) ?? { momento: m };
  const poner = (m: Momento, p: Partial<MomentoForm>) =>
    onCambio([...valor.filter((x) => x.momento !== m), { ...de(m), ...p }]);
  return (
    <TablaHoja
      anchos={M.momentos.anchos}
      columnas={M.momentos.columnas}
      etiqueta={M.momentos.titulo}
    >
      {M.momentos.orden.map((m) => {
        const guia = MOMENTOS.find((x) => x.codigo === m);
        const x = de(m);
        return (
          <tr key={m}>
            <CeldaHoja negrita>{M.momentos.nombres[m]}</CeldaHoja>
            <CeldaHoja>
              <TextoHoja
                etiqueta={`Actividades estratégicas de ${guia?.nombre ?? m}`}
                placeholder={guia?.ejemplo}
                disabled={solo}
                className="min-h-[4.5em]"
                valor={x.actividades ?? ""}
                onCambio={(actividades) => poner(m, { actividades })}
              />
            </CeldaHoja>
            <CeldaHoja centrada>
              <span className="inline-flex items-baseline justify-center gap-[2pt]">
                <NumeroHoja
                  etiqueta={`Minutos de ${guia?.nombre ?? m}`}
                  placeholder="0"
                  className="w-[3em] text-right"
                  disabled={solo}
                  valor={x.minutos}
                  onCambio={(minutos) => poner(m, { minutos })}
                />
                <span>min</span>
              </span>
            </CeldaHoja>
          </tr>
        );
      })}
    </TablaHoja>
  );
}

function TextoAccion({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 font-sans text-[8pt] font-medium text-(--hoja-accion)">
      + {children}
    </span>
  );
}
