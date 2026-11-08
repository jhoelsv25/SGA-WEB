export const MENSAJE_CODIGO_BIOMETRICO =
  "El código biométrico solo admite letras y números (máximo 20).";

export const MAX_HORAS_PROGRAMACION = 24;

export const DIAS_SEMANA = [
  { valor: "1", corto: "L", largo: "Lunes" },
  { valor: "2", corto: "M", largo: "Martes" },
  { valor: "3", corto: "X", largo: "Miércoles" },
  { valor: "4", corto: "J", largo: "Jueves" },
  { valor: "5", corto: "V", largo: "Viernes" },
  { valor: "6", corto: "S", largo: "Sábado" },
  { valor: "7", corto: "D", largo: "Domingo" },
] as const;

export const DIAS_LABORABLES = "1,2,3,4,5";
