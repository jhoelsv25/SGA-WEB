"use client";

import type { DocumentoSesion } from "../types";
import { MOMENTOS } from "../consts";

/** Vista previa con el formato estándar de la sesión de aprendizaje. */
export function VistaDocumento({ doc }: { doc: DocumentoSesion }) {
  return (
    <article className="border-border/80 bg-card space-y-4 rounded-2xl border p-6 text-sm">
      <header className="space-y-1 text-center">
        <p className="text-muted-foreground text-xs uppercase">{doc.institucion}</p>
        <h2 className="text-lg font-semibold">
          Sesión de aprendizaje{doc.numero ? ` N.° ${doc.numero}` : ""}
          {doc.unidad ? ` · ${doc.unidad}` : ""}
        </h2>
        <p className="font-medium">{doc.titulo}</p>
        {doc.borrador && <p className="text-warning-text text-xs font-medium">BORRADOR</p>}
      </header>
      <dl className="grid gap-2 sm:grid-cols-2">
        <Dato t="Docente" v={doc.docente} />
        <Dato t="Grado y sección" v={doc.gradoSeccion} />
        <Dato t="Área" v={doc.area} />
        <Dato t="Fecha" v={doc.fecha} />
      </dl>
      <Bloque t="Propósito" v={doc.proposito} />
      <section>
        <h3 className="font-semibold">Competencias, capacidades y desempeños</h3>
        {doc.competencias.map((c) => (
          <div key={c.competenciaId} className="mt-2 space-y-1">
            <p className="font-medium">{c.competenciaTexto}</p>
            <ul className="list-disc pl-5">
              {c.capacidades.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <ul className="text-muted-foreground list-disc pl-5">
              {c.desempenos.map((d) => (
                <li key={d.texto}>{d.texto}</li>
              ))}
            </ul>
            {c.campoTematico && <p>Campo temático: {c.campoTematico}</p>}
          </div>
        ))}
      </section>
      <Bloque t="Evidencia" v={doc.evidencia} />
      {doc.criterios.length > 0 && (
        <section>
          <h3 className="font-semibold">Criterios de evaluación</h3>
          <ul className="list-disc pl-5">
            {doc.criterios.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          {doc.instrumento && <p>Instrumento: {doc.instrumento}</p>}
        </section>
      )}
      {doc.enfoques.length > 0 && (
        <section>
          <h3 className="font-semibold">Enfoques transversales</h3>
          {doc.enfoques.map((e) => (
            <p key={e.enfoque}>
              {e.enfoque}
              {e.valores.length ? ` — ${e.valores.join(", ")}` : ""}
            </p>
          ))}
        </section>
      )}
      <section className="space-y-2">
        <h3 className="font-semibold">Secuencia didáctica</h3>
        {MOMENTOS.map((m) => {
          const x = doc.momentos.find((y) => y.momento === m.codigo);
          return (
            <div key={m.codigo}>
              <p className="font-medium">
                {m.nombre}
                {x?.minutos ? ` (${x.minutos} min)` : ""}
              </p>
              <p className="whitespace-pre-wrap">{x?.actividades ?? "—"}</p>
            </div>
          );
        })}
      </section>
      {doc.referencias.length > 0 && (
        <section>
          <h3 className="font-semibold">Referencias</h3>
          <ul className="list-disc pl-5">
            {doc.referencias.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function Dato({ t, v }: { t: string; v: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{t}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function Bloque({ t, v }: { t: string; v: string | null }) {
  if (!v) return null;
  return (
    <section>
      <h3 className="font-semibold">{t}</h3>
      <p className="whitespace-pre-wrap">{v}</p>
    </section>
  );
}
