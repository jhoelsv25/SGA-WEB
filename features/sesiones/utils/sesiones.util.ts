/**
 * Genera la configuración de cabeceras requerida para solicitudes desde un kiosko físico.
 */
export function cabeceraKiosko(token: string) {
  return { headers: { "x-kiosk-token": token } };
}

/**
 * Extrae el mensaje de respuesta de una mutación de sesión o devuelve el valor por defecto.
 */
export function extraerMensajeSesion(resultado: unknown, porDefecto: string): string {
  if (resultado && typeof resultado === "object" && "mensaje" in resultado) {
    return String((resultado as { mensaje: unknown }).mensaje);
  }
  return porDefecto;
}
