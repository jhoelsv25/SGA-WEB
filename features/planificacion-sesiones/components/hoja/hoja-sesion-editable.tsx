"use client";

import * as React from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { DOCUMENTO_SESION as M, fechaDocumento, MOMENTOS } from "../../consts";
import { useCompetencias, useDesempenos, useEnfoques } from "../../hooks";
import type {
  Bloque,
  CompetenciaCatalogo,
  ConceptoMapa,
  DocumentoSesion,
  EnfoqueCatalogo,
  EnfoquePlanificado,
  GuardarPlanificacionPayload,
  Momento,
  OpcionCatalogo,
  TransversalPlanificada,
} from "../../types";
import { rangoFechas, sumaMinutos } from "../../utils";
import {
  AccionHoja,
  AyudaHoja,
  ListaHoja,
  NumeroHoja,
  QuitarFilaHoja,
  SelectorHoja,
  TextoHoja,
} from "./campos-hoja";
import { CeldaHoja, FirmasHoja, Hoja, TablaHoja, VinetasHoja } from "./hoja";

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
} as const;

interface Props {
  f: Payload;
  poner: (p: Partial<Payload>) => void;
  bloque: Bloque;
  /** Datos que llena el sistema (salen del documento guardado). */
  documento: DocumentoSesion | undefined;
  docente: string | null;
  /** Otras secciones del docente en el mismo curso y grado. */
  otrasSecciones: { cursoSeccionId: string; nombre: string }[];
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
  documento,
  docente,
  otrasSecciones,
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

  const adicionales = f.seccionesAdicionales ?? [];
  const nombresSecciones = [
    bloque.seccionNombre,
    ...otrasSecciones.filter((x) => adicionales.includes(x.cursoSeccionId)).map((x) => x.nombre),
  ].sort((a, b) => a.localeCompare(b));
  const porGuardar = <AyudaHoja>{SE_LLENA}</AyudaHoja>;
  // Lo escrito con el formato anterior se muestra junto en la lista de recursos
  const recursos = [
    ...(f.materiales?.impresos ?? []),
    ...(f.materiales?.manipulativos ?? []),
    ...(f.materiales?.digitales ?? []),
    ...(f.materiales?.recursos ?? []),
  ];
  const comunidad = f.materiales?.comunidad ?? [];
  const listaTextos = (
    items: string[],
    etiqueta: string,
    placeholder: string,
    onCambio: (items: string[]) => void,
  ) => (
    <ListaHoja
      items={items}
      texto={(t) => t}
      conTexto={(_, t) => t}
      nuevo={(t) => t}
      etiqueta={etiqueta}
      placeholder={placeholder}
      disabled={solo}
      onCambio={onCambio}
    />
  );

  return (
    <Hoja etiqueta="Hoja de la sesión de aprendizaje">
      {borrador && <p className="font-bold">{M.borrador}</p>}
      <div id={ANCLAS_HOJA.datos} className="scroll-mt-24 text-center font-bold">
        {documento?.lema && <p>&quot;{documento.lema}&quot;</p>}
        <p className="text-[12pt]">{documento?.institucion ?? porGuardar}</p>
        <p className="flex items-baseline justify-center gap-[4pt] text-[14pt]">
          <span>&quot;{M.encabezado}</span>
          <NumeroHoja
            etiqueta="Número de sesión"
            placeholder={M.vacio}
            className="w-[2.4em]"
            disabled={solo}
            valor={f.numero}
            onCambio={(numero) => poner({ numero })}
          />
          <span>&quot;</span>
        </p>
      </div>

      <TablaHoja anchos={M.datosInformativos.anchos} titulo={M.datosInformativos.titulo}>
        <tr>
          <CeldaHoja encabezadoFila negrita>
            {F.docente}
          </CeldaHoja>
          <CeldaHoja>{docente ?? porGuardar}</CeldaHoja>
          <CeldaHoja negrita>{F.area}</CeldaHoja>
          <CeldaHoja>{bloque.cursoNombre}</CeldaHoja>
        </tr>
        <tr>
          <CeldaHoja encabezadoFila negrita>
            {F.coordinador}
          </CeldaHoja>
          <CeldaHoja>
            <TextoHoja
              etiqueta="Coordinador o coordinadora"
              placeholder="Nombre y apellidos"
              unaLinea
              disabled={solo}
              valor={f.coordinador ?? ""}
              onCambio={(coordinador) => poner({ coordinador })}
            />
          </CeldaHoja>
          <CeldaHoja negrita>{F.bimestre}</CeldaHoja>
          <CeldaHoja>
            <p>{documento?.bimestre?.toUpperCase() ?? porGuardar}</p>
            <TextoHoja
              etiqueta="Unidad"
              placeholder="Ej.: Unidad 04"
              unaLinea
              disabled={solo}
              valor={f.unidad ?? ""}
              onCambio={(unidad) => poner({ unidad })}
            />
          </CeldaHoja>
        </tr>
        <tr>
          <CeldaHoja encabezadoFila negrita>
            {F.nivelGrado}
          </CeldaHoja>
          <CeldaHoja>
            {`Secundaria - ${bloque.gradoNombre.replace(/\s*de secundaria$/i, "")}`}
          </CeldaHoja>
          <CeldaHoja negrita>{F.fecha}</CeldaHoja>
          <CeldaHoja>
            {documento
              ? rangoFechas(documento.fechaInicio, documento.fechaFin)
              : fechaDocumento(f.fecha)}
          </CeldaHoja>
        </tr>
        <tr>
          <CeldaHoja encabezadoFila negrita>
            {F.secciones}
          </CeldaHoja>
          <CeldaHoja>
            <SelectorHoja
              multiple
              etiqueta="Otras secciones que usan esta sesión"
              opciones={otrasSecciones.map((x) => ({
                valor: x.cursoSeccionId,
                texto: x.nombre,
              }))}
              seleccion={adicionales}
              disabled={solo || otrasSecciones.length === 0}
              onCambio={(seccionesAdicionales) => poner({ seccionesAdicionales })}
            >
              {nombresSecciones.join(", ")}
            </SelectorHoja>
          </CeldaHoja>
          <CeldaHoja negrita>{F.duracion}</CeldaHoja>
          <CeldaHoja>{minutosBloque} minutos</CeldaHoja>
        </tr>
      </TablaHoja>

      <TablaHoja anchos={M.tituloSesion.anchos} etiqueta={M.tituloSesion.titulo}>
        <tr>
          <CeldaHoja encabezadoFila negrita>
            {M.tituloSesion.titulo}
          </CeldaHoja>
          <CeldaHoja>
            <TextoHoja
              etiqueta="Título de la sesión (obligatorio)"
              placeholder="Escriba aquí el título de la sesión"
              unaLinea
              disabled={solo}
              valor={f.titulo}
              onCambio={(titulo) => poner({ titulo })}
            />
          </CeldaHoja>
        </tr>
      </TablaHoja>

      <TablaHoja
        id={ANCLAS_HOJA.competencias}
        anchos={M.propositos.anchos}
        titulo={M.propositos.titulo}
        columnas={M.propositos.columnas}
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

      <TablaEnfoques
        valor={f.enfoques ?? []}
        catalogo={enfoques}
        solo={solo}
        onCambio={(e) => poner({ enfoques: e })}
      />

      <TablaTransversales
        valor={f.competenciasTransversales ?? []}
        catalogo={competencias.filter((c) => c.tipo === "transversal")}
        solo={solo}
        onCambio={(competenciasTransversales) => poner({ competenciasTransversales })}
      />

      <TablaMomentos
        valor={f.momentos ?? []}
        solo={solo}
        onCambio={(momentos) => poner({ momentos })}
        proposito={f.proposito ?? ""}
        onProposito={(proposito) => poner({ proposito })}
        mapa={f.mapaVisual ?? []}
        onMapa={(mapaVisual) => poner({ mapaVisual })}
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

      <TablaHoja
        id={ANCLAS_HOJA.evaluacion}
        anchos={M.evaluacion.anchos}
        titulo={M.evaluacion.titulo}
        columnas={M.evaluacion.columnas}
      >
        <tr>
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
            <TextoHoja
              etiqueta="Evidencias de aprendizaje (una por línea)"
              placeholder="Una evidencia por línea"
              disabled={solo}
              valor={f.evidencia ?? ""}
              onCambio={(evidencia) => poner({ evidencia })}
            />
          </CeldaHoja>
          <CeldaHoja>
            <TextoHoja
              etiqueta="Producto"
              placeholder="Ej.: Informe escrito grupal"
              disabled={solo}
              valor={f.producto ?? ""}
              onCambio={(producto) => poner({ producto })}
            />
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

      <TablaHoja anchos={M.acuerdos.anchos} titulo={M.acuerdos.titulo}>
        <tr>
          <CeldaHoja>
            {listaTextos(
              f.acuerdos ?? [],
              "Acuerdo de convivencia",
              "Ej.: Levantar la mano para participar",
              (acuerdos) => poner({ acuerdos }),
            )}
          </CeldaHoja>
        </tr>
      </TablaHoja>

      <TablaHoja
        anchos={M.materiales.anchos}
        titulo={M.materiales.titulo}
        columnas={M.materiales.columnas}
      >
        <tr>
          <CeldaHoja>
            {listaTextos(
              recursos,
              "Material o recurso",
              "Ej.: Cuaderno de trabajo, páginas 10-12",
              (lista) => poner({ materiales: { recursos: lista, comunidad } }),
            )}
          </CeldaHoja>
          <CeldaHoja>
            {listaTextos(
              comunidad,
              "Espacio de interacción",
              "Ej.: Entrevista a una persona mayor",
              (lista) => poner({ materiales: { ...f.materiales, comunidad: lista } }),
            )}
          </CeldaHoja>
        </tr>
      </TablaHoja>

      <FirmasHoja
        linea={M.firmas.linea}
        roles={M.firmas.roles}
        nombres={[docente, f.coordinador]}
      />
      {/lista de cotejo/i.test(instrumento?.nombre ?? "") && (
        <p className="mt-[8pt] font-sans text-[8pt] text-(--hoja-tenue) print:hidden">
          El Word y el PDF agregan como anexo la lista de cotejo, con sus criterios y los
          estudiantes matriculados de cada sección.
        </p>
      )}
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
        titulo={M.transversales.titulo}
        columnas={M.transversales.columnas}
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
                  etiqueta={`Actividad que desarrolla de ${nombre}`}
                  placeholder="Actividad que desarrolla (opcional)"
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
        titulo={M.enfoques.titulo}
        columnas={M.enfoques.columnas}
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
                    // Al quitar un valor se quitan sus acciones del catálogo, no las escritas.
                    const retiradas = new Set(
                      (c?.valores ?? [])
                        .filter((v) => !valores.includes(v.nombre))
                        .flatMap((v) => v.acciones),
                    );
                    poner(e.enfoqueId, {
                      valores,
                      acciones: e.acciones.filter((a) => !retiradas.has(a)),
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
                <ListaHoja
                  items={e.acciones}
                  texto={(t) => t}
                  conTexto={(_, t) => t}
                  nuevo={(t) => t}
                  etiqueta={`Actividad de ${nombre}`}
                  placeholder="¿Qué actividad desarrolla?"
                  textoAgregar="Escribir una actividad"
                  disabled={solo}
                  onCambio={(a) => poner(e.enfoqueId, { acciones: a })}
                />
                {!solo && acciones.length > 0 && (
                  <SelectorHoja
                    multiple
                    etiqueta={`Actividades sugeridas de ${nombre}`}
                    opciones={acciones.map((a) => ({ valor: a, texto: a }))}
                    seleccion={e.acciones}
                    className="mt-[2pt] w-auto"
                    onCambio={(a) => poner(e.enfoqueId, { acciones: a })}
                  >
                    <span className="font-sans text-[8pt] font-medium text-(--hoja-accion)">
                      Elegir del catálogo
                    </span>
                  </SelectorHoja>
                )}
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
  proposito,
  onProposito,
  mapa,
  onMapa,
}: {
  valor: MomentoForm[];
  solo: boolean;
  onCambio: (v: MomentoForm[]) => void;
  proposito: string;
  onProposito: (v: string) => void;
  mapa: ConceptoMapa[];
  onMapa: (v: ConceptoMapa[]) => void;
}) {
  const de = (m: Momento): MomentoForm => valor.find((x) => x.momento === m) ?? { momento: m };
  const poner = (m: Momento, p: Partial<MomentoForm>) =>
    onCambio([...valor.filter((x) => x.momento !== m), { ...de(m), ...p }]);
  return (
    <TablaHoja
      id={ANCLAS_HOJA.secuencia}
      anchos={M.momentos.anchos}
      titulo={M.momentos.titulo}
      columnas={M.momentos.columnas}
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
              {m === "inicio" && (
                <div className="flex items-start">
                  <span className="shrink-0 font-bold whitespace-pre">
                    {M.momentos.etiquetaProposito}
                  </span>
                  <TextoHoja
                    etiqueta="Propósito de la sesión"
                    placeholder="¿Qué van a aprender hoy los estudiantes?"
                    disabled={solo}
                    valor={proposito}
                    onCambio={onProposito}
                  />
                </div>
              )}
              {m === "desarrollo" && <MapaVisual valor={mapa} solo={solo} onCambio={onMapa} />}
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

const MAXIMO_CONCEPTOS = 6;

function MapaVisual({
  valor,
  solo,
  onCambio,
}: {
  valor: ConceptoMapa[];
  solo: boolean;
  onCambio: (v: ConceptoMapa[]) => void;
}) {
  const poner = (i: number, p: Partial<ConceptoMapa>) =>
    onCambio(valor.map((c, k) => (k === i ? { ...c, ...p } : c)));
  return (
    <>
      {valor.length > 0 && (
        <TablaHoja anchos={valor.map(() => 100 / valor.length)} titulo={M.momentos.mapaVisual}>
          <tr>
            {valor.map((c, i) => (
              <CeldaHoja key={i} centrada>
                <TextoHoja
                  etiqueta={`Concepto ${i + 1}`}
                  placeholder="Concepto"
                  unaLinea
                  className="text-center font-bold"
                  disabled={solo}
                  valor={c.concepto}
                  onCambio={(concepto) => poner(i, { concepto })}
                />
                <TextoHoja
                  etiqueta={`Definición ${i + 1}`}
                  placeholder="Definición"
                  className="text-center"
                  disabled={solo}
                  valor={c.definicion}
                  onCambio={(definicion) => poner(i, { definicion })}
                />
                {!solo && (
                  <QuitarFilaHoja
                    etiqueta={`Quitar concepto ${i + 1}`}
                    onClick={() => onCambio(valor.filter((_, k) => k !== i))}
                  />
                )}
              </CeldaHoja>
            ))}
          </tr>
        </TablaHoja>
      )}
      {!solo && valor.length < MAXIMO_CONCEPTOS && (
        <AccionHoja
          icono={PlusSignIcon}
          onClick={() => onCambio([...valor, { concepto: "", definicion: "" }])}
        >
          Agregar concepto al mapa visual (opcional)
        </AccionHoja>
      )}
    </>
  );
}

function TextoAccion({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 font-sans text-[8pt] font-medium text-(--hoja-accion)">
      + {children}
    </span>
  );
}
