import { extraerPrimerNombreYApellido } from "./formato";

/**
 * Gestor de audio y síntesis de voz para el terminal Kiosko.
 *
 * Utiliza Web Audio API para tonos sintéticos de tecla, éxito y error,
 * y Web Speech API (speechSynthesis) para locución en español (es-PE).
 * Si el navegador o dispositivo no soporta alguna de estas APIs, degrada
 * silenciosamente sin provocar errores en tiempo de ejecución.
 */
class KioskoAudioManager {
  private ctx: AudioContext | null = null;

  private getContext(sonidoHabilitado: boolean): AudioContext | null {
    if (!sonidoHabilitado || typeof window === "undefined") return null;

    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        void this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Reproduce un sonido breve y sutil de pulsación de tecla virtual o física.
   */
  public reproducirTecla(sonidoHabilitado = true): void {
    try {
      const ctx = this.getContext(sonidoHabilitado);
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Degrada silenciosamente
    }
  }

  /**
   * Reproduce un tono armónico de confirmación exitosa de marcación (chime de 3 notas).
   */
  public reproducirExito(sonidoHabilitado = true): void {
    try {
      const ctx = this.getContext(sonidoHabilitado);
      if (!ctx) return;

      const playTone = (freq: number, startOffset: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + startOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + startOffset);
        osc.stop(ctx.currentTime + startOffset + duration);
      };

      // Chime ascendente armónico (C6, E6, G6)
      playTone(1046.5, 0, 0.22);
      playTone(1318.5, 0.1, 0.35);
      playTone(1567.98, 0.2, 0.5);
    } catch {
      // Degrada silenciosamente
    }
  }

  /**
   * Reproduce un tono de alerta suave cuando ocurre un error o el servicio no está disponible.
   */
  public reproducirError(sonidoHabilitado = true): void {
    try {
      const ctx = this.getContext(sonidoHabilitado);
      if (!ctx) return;

      const playTone = (freq: number, startOffset: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + startOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + startOffset);
        osc.stop(ctx.currentTime + startOffset + 0.13);
      };

      playTone(280, 0);
      playTone(220, 0.1);
    } catch {
      // Degrada silenciosamente
    }
  }
}

export const kioskoAudio = new KioskoAudioManager();

/**
 * Busca la voz más natural en español disponible en el navegador,
 * dando prioridad a acentos de Perú, Latinoamérica y español neutro.
 */
function buscarVozEspanol(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !window.speechSynthesis) {
    return null;
  }
  try {
    const voces = window.speechSynthesis.getVoices();
    if (!voces || voces.length === 0) return null;

    const prefijos = ["es-pe", "es-419", "es-mx", "es-us", "es-es", "es"];
    for (const prefijo of prefijos) {
      const encontrada = voces.find((v) =>
        v.lang?.toLowerCase().replace("_", "-").startsWith(prefijo),
      );
      if (encontrada) return encontrada;
    }
    return voces.find((v) => v.lang?.toLowerCase().startsWith("es")) ?? null;
  } catch {
    return null;
  }
}

/**
 * Momento 1 de locución: Anuncia en voz alta el nombre corto de la persona
 * (primer nombre y primer apellido) al resolver su código.
 */
export function locutarNombrePersona(nombreCompleto: string, sonidoHabilitado = true): void {
  if (!sonidoHabilitado) return;

  try {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !window.speechSynthesis
    ) {
      return;
    }

    const nombreCorto = extraerPrimerNombreYApellido(nombreCompleto);
    if (!nombreCorto) return;

    const utterance = new SpeechSynthesisUtterance(nombreCorto);
    const voz = buscarVozEspanol();
    if (voz) {
      utterance.voice = voz;
      utterance.lang = voz.lang;
    } else {
      utterance.lang = "es-PE";
    }

    utterance.rate = 1.25;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // Degrada silenciosamente
  }
}

/**
 * Momento 2 de locución: Dice únicamente la palabra "Registrado" o "Registrada"
 * al confirmar la marcación según el género de la persona.
 */
export function locutarMarcacionRegistrada(genero?: string, sonidoHabilitado = true): void {
  if (!sonidoHabilitado) return;

  try {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !window.speechSynthesis
    ) {
      return;
    }

    const esFemenino =
      String(genero || "")
        .trim()
        .toUpperCase() === "FEMALE";
    const texto = esFemenino ? "Registrada." : "Registrado.";

    const utterance = new SpeechSynthesisUtterance(texto);
    const voz = buscarVozEspanol();
    if (voz) {
      utterance.voice = voz;
      utterance.lang = voz.lang;
    } else {
      utterance.lang = "es-PE";
    }

    utterance.rate = 1.25;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // Degrada silenciosamente
  }
}
