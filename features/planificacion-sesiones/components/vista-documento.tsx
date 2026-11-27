"use client";

import { DOCUMENTO_SESION as M, fechaDocumento } from "../consts";
import type { DocumentoSesion } from "../types";
import {
  CeldaHoja,
  FirmasHoja,
  Hoja,
  LineasHoja,
  SeccionHoja,
  SubseccionHoja,
  TablaHoja,
  VinetasHoja,
} from "./hoja";

/**
 * Vista de solo lectura con la misma hoja del Word exportado (secciones I a IV, en su orden),
 * a partir de lo que devuelve `GET /planificacion-sesiones/:id/documento`.
 */
export function VistaDocumento({ doc }: { doc: DocumentoSesion }) {
  const F = M.datosInformativos.filas;
  const datos: [string, string][] = [
    [F.institucion, doc.institucion],
    [F.director, doc.director],
    [F.docente, doc.docente],
    [F.gradoSeccion, doc.gradoSeccion],
    [F.area, doc.area],
    [F.fecha, fechaDocumento(doc.fecha)],
    ...(doc.unidad ? ([[F.unidad, doc.unidad]] as [string, string][]) : []),
  ];
  return (
    <Hoja etiqueta="Documento de la sesión de aprendizaje">
      {doc.borrador && <p className="font-bold">{M.borrador}</p>}
      <p className="text-center text-[14pt] font-bold">
        {M.encabezado} {doc.numero ?? M.vacio}
      </p>
      <p className="mb-[8pt] text-center text-[12pt] font-bold">“{doc.titulo}”</p>

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
      </TablaHoja>

      <SeccionHoja>{M.acerca}</SeccionHoja>
      <SubseccionHoja>{M.propositos.titulo}</SubseccionHoja>
      <p className="mb-[4pt] whitespace-pre-wrap">
        <span className="font-bold">{M.propositos.etiquetaProposito}</span>
        {doc.proposito ?? M.vacio}
      </p>
      <TablaHoja
        anchos={M.propositos.anchos}
        columnas={M.propositos.columnas}
        etiqueta={M.propositos.titulo}
      >
        {doc.competencias.map((c) => (
          <tr key={c.competenciaId}>
            <CeldaHoja>{c.competenciaTexto}</CeldaHoja>
            <CeldaHoja>
              <VinetasHoja items={c.capacidades} />
            </CeldaHoja>
            <CeldaHoja>
              <VinetasHoja items={c.desempenos.map((d) => d.texto)} />
            </CeldaHoja>
            <CeldaHoja>{c.campoTematico ?? M.vacio}</CeldaHoja>
          </tr>
        ))}
      </TablaHoja>

      <SubseccionHoja>{M.evaluacion.titulo}</SubseccionHoja>
      <TablaHoja
        anchos={M.evaluacion.anchos}
        columnas={M.evaluacion.columnas}
        etiqueta={M.evaluacion.titulo}
      >
        <tr>
          <CeldaHoja>
            <LineasHoja texto={doc.evidencia} />
          </CeldaHoja>
          <CeldaHoja>
            <VinetasHoja items={doc.criterios} />
          </CeldaHoja>
          <CeldaHoja>
            <LineasHoja texto={doc.instrumento} />
          </CeldaHoja>
        </tr>
      </TablaHoja>

      <SubseccionHoja>{M.transversales.titulo}</SubseccionHoja>
      <TablaHoja
        anchos={M.transversales.anchos}
        columnas={M.transversales.columnas}
        etiqueta={M.transversales.titulo}
      >
        {doc.transversales.map((t) => (
          <tr key={t.competencia}>
            <CeldaHoja>{t.competencia}</CeldaHoja>
            <CeldaHoja>
              <VinetasHoja items={t.capacidades} />
            </CeldaHoja>
            <CeldaHoja>{t.desempeno ?? M.vacio}</CeldaHoja>
          </tr>
        ))}
      </TablaHoja>

      <SubseccionHoja>{M.enfoques.titulo}</SubseccionHoja>
      <TablaHoja
        anchos={M.enfoques.anchos}
        columnas={M.enfoques.columnas}
        etiqueta={M.enfoques.titulo}
      >
        {doc.enfoques.map((e) => (
          <tr key={e.enfoque}>
            <CeldaHoja>{e.enfoque}</CeldaHoja>
            <CeldaHoja>
              <VinetasHoja items={e.valores} />
            </CeldaHoja>
            <CeldaHoja>
              <VinetasHoja items={e.acciones} />
            </CeldaHoja>
          </tr>
        ))}
      </TablaHoja>

      <SeccionHoja>{M.secuencia}</SeccionHoja>
      <SubseccionHoja>{M.materiales.titulo}</SubseccionHoja>
      <TablaHoja
        anchos={M.materiales.anchos}
        columnas={M.materiales.columnas}
        etiqueta={M.materiales.titulo}
      >
        <tr>
          <CeldaHoja>
            <VinetasHoja items={doc.materiales.impresos} />
          </CeldaHoja>
          <CeldaHoja>
            <VinetasHoja items={doc.materiales.manipulativos} />
          </CeldaHoja>
          <CeldaHoja>
            <VinetasHoja items={doc.materiales.digitales} />
          </CeldaHoja>
        </tr>
      </TablaHoja>

      <SubseccionHoja>{M.momentos.titulo}</SubseccionHoja>
      <TablaHoja
        anchos={M.momentos.anchos}
        columnas={M.momentos.columnas}
        etiqueta={M.momentos.titulo}
      >
        {M.momentos.orden.map((m) => {
          const x = doc.momentos.find((y) => y.momento === m);
          return (
            <tr key={m}>
              <CeldaHoja negrita>{M.momentos.nombres[m]}</CeldaHoja>
              <CeldaHoja>
                <LineasHoja texto={x?.actividades ?? null} />
              </CeldaHoja>
              <CeldaHoja centrada>{`${x?.minutos ?? 0} min`}</CeldaHoja>
            </tr>
          );
        })}
      </TablaHoja>

      <SeccionHoja>{M.referencias}</SeccionHoja>
      <VinetasHoja items={doc.referencias} vacio="" />

      <FirmasHoja linea={M.firmas.linea} roles={M.firmas.roles} />
    </Hoja>
  );
}
