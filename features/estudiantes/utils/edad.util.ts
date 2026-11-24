export function calcularEdad(fechaIso?: string | null): number | null {
  if (!fechaIso) return null;

  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(fechaIso);
  let anio: number;
  let mes: number;
  let dia: number;

  if (coincidencia) {
    anio = Number(coincidencia[1]);
    mes = Number(coincidencia[2]) - 1;
    dia = Number(coincidencia[3]);
  } else {
    const fecha = new Date(fechaIso);
    if (Number.isNaN(fecha.getTime())) return null;
    anio = fecha.getFullYear();
    mes = fecha.getMonth();
    dia = fecha.getDate();
  }

  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  const difMes = hoy.getMonth() - mes;
  if (difMes < 0 || (difMes === 0 && hoy.getDate() < dia)) {
    edad--;
  }
  return edad >= 0 ? edad : null;
}
