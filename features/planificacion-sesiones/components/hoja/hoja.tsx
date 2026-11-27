import * as React from "react";
import { cn } from "@/lib/utils";
import { HOJA_A4 } from "../../consts";

/**
 * Primitivas de la «hoja» que imita el Word exportado (`sesion-docx.util.ts` de la API): página A4
 * blanca, Arial 10 pt, tablas con borde gris de 0,5 pt y encabezados sombreados #D9E2F3.
 * La hoja es papel: se ve blanca también en el tema oscuro, por eso sus colores son fijos y
 * salen del documento, no de los tokens del tema.
 */
const PAPEL: React.CSSProperties & Record<`--${string}`, string> = {
  "--hoja-papel": "#ffffff",
  "--hoja-tinta": "#000000",
  "--hoja-borde": "#808080",
  "--hoja-encabezado": "#d9e2f3",
  "--hoja-tenue": "#6b6b6b",
  "--hoja-campo": "#eef4fb",
  "--hoja-accion": "#1d4ed8",
  "--hoja-ok": "#166534",
  "--hoja-aviso": "#92400e",
  "--hoja-peligro": "#b91c1c",
  width: HOJA_A4.ancho,
  minHeight: HOJA_A4.alto,
  padding: HOJA_A4.margen,
  fontFamily: HOJA_A4.fuente,
  fontSize: "10pt",
  lineHeight: 1.25,
  colorScheme: "light",
};

/** Mesa gris con la hoja centrada; en pantallas angostas la hoja se desplaza dentro, no la página. */
export function Hoja({ children, etiqueta }: { children: React.ReactNode; etiqueta: string }) {
  return (
    <div className="bg-muted/60 border-border/70 w-full min-w-0 overflow-x-auto rounded-2xl border p-3 sm:p-6">
      <article
        aria-label={etiqueta}
        style={PAPEL}
        className="mx-auto shrink-0 bg-(--hoja-papel) text-(--hoja-tinta) shadow-[0_1px_3px_rgba(0,0,0,0.18),0_8px_24px_rgba(0,0,0,0.12)]"
      >
        {children}
      </article>
    </div>
  );
}

/** Título de sección (I, II, III, IV): 11 pt negrita, 12 pt antes y 5 pt después. */
export function SeccionHoja({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-[12pt] mb-[5pt] scroll-mt-24 text-[11pt] font-bold">
      {children}
    </h2>
  );
}

/** Subtítulo (2.1, 3.2…): 10 pt negrita, 8 pt antes y 4 pt después. */
export function SubseccionHoja({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="mt-[8pt] mb-[4pt] scroll-mt-24 text-[10pt] font-bold">
      {children}
    </h3>
  );
}

/** Tabla de ancho completo con las columnas y anchos del documento. */
export function TablaHoja({
  anchos,
  columnas,
  children,
  etiqueta,
}: {
  anchos: readonly number[];
  columnas?: readonly string[] | null;
  children: React.ReactNode;
  etiqueta?: string;
}) {
  return (
    <table
      aria-label={etiqueta}
      className="w-full table-fixed border-collapse border border-(--hoja-borde)"
    >
      <colgroup>
        {anchos.map((a, i) => (
          <col key={i} style={{ width: `${a}%` }} />
        ))}
      </colgroup>
      {columnas && (
        <thead>
          <tr>
            {columnas.map((c) => (
              <th
                key={c}
                scope="col"
                className="border border-(--hoja-borde) bg-(--hoja-encabezado) px-[5pt] py-[3pt] text-center align-top font-bold"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>{children}</tbody>
    </table>
  );
}

/** Celda con el borde y los márgenes internos del Word (60/100 twips). */
export function CeldaHoja({
  children,
  className,
  negrita,
  centrada,
  encabezadoFila,
}: {
  children?: React.ReactNode;
  className?: string;
  negrita?: boolean;
  centrada?: boolean;
  /** Primera columna de los datos informativos: es la etiqueta de la fila. */
  encabezadoFila?: boolean;
}) {
  const clases = cn(
    "group/celda relative border border-(--hoja-borde) px-[5pt] py-[3pt] text-left align-top break-words",
    negrita && "font-bold",
    centrada && "text-center",
    className,
  );
  return encabezadoFila ? (
    <th scope="row" className={clases}>
      {children}
    </th>
  ) : (
    <td className={clases}>{children}</td>
  );
}

/** Lista con viñetas como las del Word; si no hay elementos, el documento pone «—». */
export function VinetasHoja({ items, vacio = "—" }: { items: readonly string[]; vacio?: string }) {
  const llenos = items.filter((i) => i.trim());
  if (llenos.length === 0) return <p>{vacio}</p>;
  return (
    <ul className="list-disc space-y-[2pt] pl-[14pt]">
      {llenos.map((i, k) => (
        <li key={`${k}-${i}`}>{i}</li>
      ))}
    </ul>
  );
}

/** Texto con saltos de línea; vacío se ve «—» como en el Word. */
export function LineasHoja({ texto, vacio = "—" }: { texto: string | null; vacio?: string }) {
  return <p className="whitespace-pre-wrap">{texto?.trim() ? texto : vacio}</p>;
}

/** Espacio de firmas al pie, sin bordes. */
export function FirmasHoja({ linea, roles }: { linea: string; roles: readonly string[] }) {
  return (
    <div className="mt-[40pt] grid grid-cols-2 text-center">
      {roles.map((r) => (
        <div key={r}>
          <p>{linea}</p>
          <p className="font-bold">{r}</p>
        </div>
      ))}
    </div>
  );
}
