import { DOCUMENTO_SESION as M, fechaDocumento } from "../consts";
import type { DocumentoSesion } from "../types";

// Mismas reglas que `sesion-documento.util.ts` de la API: la hoja debe verse como el Word.

export const lineasDe = (texto: string | null) =>
  (texto ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export const numeroSesion = (n: number | null) =>
  n === null ? M.vacio : String(n).padStart(2, "0");

export const rangoFechas = (inicio: string, fin: string) =>
  inicio === fin ? fechaDocumento(inicio) : `${fechaDocumento(inicio)} - ${fechaDocumento(fin)}`;

export const textoBimestre = (bimestre: string | null, unidad: string | null | undefined) =>
  [bimestre, unidad].filter(Boolean).join(" / ").toUpperCase() || M.vacio;

type FilaPares = [string, string, string, string];

export function filasListaCotejo(d: DocumentoSesion, seccion: string): FilaPares[] {
  const F = M.listaCotejo.filas;
  return [
    [F.institucion, d.institucion, F.area, d.area],
    [F.docente, d.docente, F.nivelGrado, d.nivelGrado],
    [F.fecha, rangoFechas(d.fechaInicio, d.fechaFin), F.numero, numeroSesion(d.numero)],
    [F.seccion, seccion, F.producto, d.producto ?? d.evidencia ?? M.vacio],
  ];
}

export function anchosListaCotejo(criterios: number): number[] {
  const { anchoNumero, anchoNombre } = M.listaCotejo;
  const resto = (100 - anchoNumero - anchoNombre) / criterios;
  return [anchoNumero, anchoNombre, ...Array<number>(criterios).fill(resto)];
}
