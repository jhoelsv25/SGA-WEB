const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function formatoFecha(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [anio, mes, dia] = iso.slice(0, 10).split("-");
  if (!anio || !mes || !dia) return iso;
  return `${dia}/${mes}/${anio}`;
}

export function tituloMes(anio: number, mes: number): string {
  const nombre = MESES[mes - 1] ?? "";
  return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${anio}`;
}

export function desplazarMes(
  anio: number,
  mes: number,
  delta: number,
): { anio: number; mes: number } {
  const fecha = new Date(anio, mes - 1 + delta, 1);
  return { anio: fecha.getFullYear(), mes: fecha.getMonth() + 1 };
}

export function isoDePartes(anio: number, mes: number, dia: number): string {
  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function fechaDeIso(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const [anio, mes, dia] = iso.slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return undefined;
  return new Date(anio, mes - 1, dia);
}

export function isoDeFecha(fecha: Date | undefined): string {
  if (!fecha) return "";
  return isoDePartes(fecha.getFullYear(), fecha.getMonth() + 1, fecha.getDate());
}

export function fechasSugeridas(anio: number) {
  return {
    fechaInicio: `${anio}-03-01`,
    fechaFin: `${anio}-12-19`,
    bimestres: [
      { numero: 1, fechaInicio: `${anio}-03-01`, fechaFin: `${anio}-05-09` },
      { numero: 2, fechaInicio: `${anio}-05-10`, fechaFin: `${anio}-07-16` },
      { numero: 3, fechaInicio: `${anio}-08-02`, fechaFin: `${anio}-10-01` },
      { numero: 4, fechaInicio: `${anio}-10-04`, fechaFin: `${anio}-12-17` },
    ],
  };
}
