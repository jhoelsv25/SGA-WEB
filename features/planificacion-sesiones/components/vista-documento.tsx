"use client";

import { DOCUMENTO_SESION as M } from "../consts";
import type { DocumentoSesion } from "../types";
import {
  anchosListaCotejo,
  filasListaCotejo,
  lineasDe,
  numeroSesion,
  rangoFechas,
  textoBimestre,
} from "../utils";
import { CeldaHoja, FirmasHoja, Hoja, LineasHoja, TablaHoja, VinetasHoja } from "./hoja";

function FilasPares({ filas }: { filas: [string, string, string, string][] }) {
  return filas.map(([a, b, c, d]) => (
    <tr key={a}>
      <CeldaHoja encabezadoFila negrita>
        {a}
      </CeldaHoja>
      <CeldaHoja>{b}</CeldaHoja>
      <CeldaHoja negrita>{c}</CeldaHoja>
      <CeldaHoja>{d}</CeldaHoja>
    </tr>
  ));
}

/**
 * Vista de solo lectura con la misma hoja del Word exportado, a partir de lo que devuelve
 * `GET /planificacion-sesiones/:id/documento`.
 */
export function VistaDocumento({ doc }: { doc: DocumentoSesion }) {
  const F = M.datosInformativos.filas;
  return (
    <Hoja etiqueta="Documento de la sesión de aprendizaje">
      {doc.borrador && <p className="font-bold">{M.borrador}</p>}
      <div className="text-center font-bold">
        {doc.lema && <p>&quot;{doc.lema}&quot;</p>}
        <p className="text-[12pt]">{doc.institucion}</p>
        <p className="text-[14pt]">
          &quot;{M.encabezado} {numeroSesion(doc.numero)}&quot;
        </p>
      </div>

      <TablaHoja anchos={M.datosInformativos.anchos} titulo={M.datosInformativos.titulo}>
        <FilasPares
          filas={[
            [F.docente, doc.docente, F.area, doc.area],
            [
              F.coordinador,
              doc.coordinador ?? M.vacio,
              F.bimestre,
              textoBimestre(doc.bimestre, doc.unidad),
            ],
            [F.nivelGrado, doc.nivelGrado, F.fecha, rangoFechas(doc.fechaInicio, doc.fechaFin)],
            [F.secciones, doc.secciones.join(", "), F.duracion, `${doc.duracionMin} minutos`],
          ]}
        />
      </TablaHoja>

      <TablaHoja anchos={M.tituloSesion.anchos} etiqueta={M.tituloSesion.titulo}>
        <tr>
          <CeldaHoja encabezadoFila negrita>
            {M.tituloSesion.titulo}
          </CeldaHoja>
          <CeldaHoja>{doc.titulo}</CeldaHoja>
        </tr>
      </TablaHoja>

      <TablaHoja
        anchos={M.propositos.anchos}
        titulo={M.propositos.titulo}
        columnas={M.propositos.columnas}
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

      <TablaHoja
        anchos={M.enfoques.anchos}
        titulo={M.enfoques.titulo}
        columnas={M.enfoques.columnas}
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

      <TablaHoja
        anchos={M.transversales.anchos}
        titulo={M.transversales.titulo}
        columnas={M.transversales.columnas}
      >
        {doc.transversales.map((t) => (
          <tr key={t.competencia}>
            <CeldaHoja>{t.competencia}</CeldaHoja>
            <CeldaHoja>
              <VinetasHoja items={t.capacidades} />
            </CeldaHoja>
            <CeldaHoja>{t.actividad ?? M.vacio}</CeldaHoja>
          </tr>
        ))}
      </TablaHoja>

      <TablaHoja
        anchos={M.momentos.anchos}
        titulo={M.momentos.titulo}
        columnas={M.momentos.columnas}
      >
        {M.momentos.orden.map((m) => {
          const x = doc.momentos.find((y) => y.momento === m);
          return (
            <tr key={m}>
              <CeldaHoja negrita>{M.momentos.nombres[m]}</CeldaHoja>
              <CeldaHoja>
                <LineasHoja texto={x?.actividades ?? null} />
                {m === "inicio" && doc.proposito && (
                  <p>
                    <span className="font-bold">{M.momentos.etiquetaProposito}</span>
                    {doc.proposito}
                  </p>
                )}
                {m === "desarrollo" && doc.mapaVisual.length > 0 && (
                  <TablaHoja
                    anchos={doc.mapaVisual.map(() => 100 / doc.mapaVisual.length)}
                    titulo={M.momentos.mapaVisual}
                  >
                    <tr>
                      {doc.mapaVisual.map((c, i) => (
                        <CeldaHoja key={i} centrada>
                          <p className="font-bold">{c.concepto}</p>
                          <p>{c.definicion}</p>
                        </CeldaHoja>
                      ))}
                    </tr>
                  </TablaHoja>
                )}
              </CeldaHoja>
              <CeldaHoja centrada>{`${x?.minutos ?? 0} min`}</CeldaHoja>
            </tr>
          );
        })}
      </TablaHoja>

      <TablaHoja
        anchos={M.evaluacion.anchos}
        titulo={M.evaluacion.titulo}
        columnas={M.evaluacion.columnas}
      >
        <tr>
          <CeldaHoja>
            <VinetasHoja items={doc.criterios} />
          </CeldaHoja>
          <CeldaHoja>
            <VinetasHoja items={lineasDe(doc.evidencia)} />
          </CeldaHoja>
          <CeldaHoja>
            <LineasHoja texto={doc.producto} />
          </CeldaHoja>
          <CeldaHoja>
            <LineasHoja texto={doc.instrumento} />
          </CeldaHoja>
        </tr>
      </TablaHoja>

      <TablaHoja anchos={M.acuerdos.anchos} titulo={M.acuerdos.titulo}>
        <tr>
          <CeldaHoja>
            <VinetasHoja items={doc.acuerdos} />
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
            <VinetasHoja items={doc.materiales.recursos} />
          </CeldaHoja>
          <CeldaHoja>
            <VinetasHoja items={doc.materiales.comunidad} />
          </CeldaHoja>
        </tr>
      </TablaHoja>

      <FirmasHoja
        linea={M.firmas.linea}
        roles={M.firmas.roles}
        nombres={[doc.docente, doc.coordinador]}
      />

      {doc.listasCotejo.map((lista, n) => (
        <section key={lista.seccion} className="mt-[32pt]">
          <TablaHoja
            anchos={M.listaCotejo.anchos}
            titulo={`${M.listaCotejo.anexo} ${n + 1}: ${M.listaCotejo.titulo}`}
          >
            <FilasPares filas={filasListaCotejo(doc, lista.seccion)} />
          </TablaHoja>
          <p className="mt-[5pt]">{M.listaCotejo.instrucciones}</p>
          <TablaHoja
            anchos={anchosListaCotejo(doc.criterios.length)}
            columnas={[...M.listaCotejo.columnas, ...doc.criterios]}
            etiqueta={`Lista de cotejo de la sección ${lista.seccion}`}
          >
            {lista.estudiantes.map((nombre, i) => (
              <tr key={`${i}-${nombre}`}>
                <CeldaHoja centrada>{i + 1}</CeldaHoja>
                <CeldaHoja>{nombre}</CeldaHoja>
                {doc.criterios.map((_, k) => (
                  <CeldaHoja key={k} />
                ))}
              </tr>
            ))}
          </TablaHoja>
        </section>
      ))}
    </Hoja>
  );
}
