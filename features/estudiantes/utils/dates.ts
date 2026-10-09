export function parseIsoDate(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const [anio, mes, dia] = iso.slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return undefined;
  return new Date(anio, mes - 1, dia);
}

export function formatToIsoDate(fecha: Date | undefined): string {
  if (!fecha) return "";
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
