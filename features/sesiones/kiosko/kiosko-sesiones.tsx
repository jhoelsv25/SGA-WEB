"use client";

import * as React from "react";
import {
  KioskoAvisoResultado,
  KioskoEntradaCodigo,
  KioskoFooter,
  KioskoHeader,
  KioskoReloj,
  KioskoTeclado,
  LONGITUD_CODIGO_DEFECTO,
  LONGITUD_CODIGO_MAXIMA,
  LONGITUD_PIN_DEFECTO,
  TIEMPO_AUTO_CIERRE_AVISO_MS,
  TIEMPO_AUTO_LIMPIEZA_ERROR_MS,
  kioskoAudio,
  locutarConNombre,
  useConexionRed,
  useInactividad,
  useRelojDigital,
  type AvisoKiosko,
} from "@/features/kiosko";
import type { ValidarEquipoResponse } from "@/features/equipos/types";
import { firmarIngreso, firmarSalida, sesionesEnKiosko } from "../api";
import type { CredencialesKiosko, SesionesKiosko } from "../types";
import { ListaSesionesKiosko } from "./lista-sesiones-kiosko";

const SIN_CONEXION = "Sin conexión. No se registró la firma; intente nuevamente.";

interface KioskoSesionesProps {
  token: string;
  equipo: NonNullable<ValidarEquipoResponse["equipo"]>;
}

function mensajeDeError(error: unknown, enLinea: boolean): string {
  if (!enLinea) return SIN_CONEXION;
  return error instanceof Error && error.message ? error.message : SIN_CONEXION;
}

export function KioskoSesiones({ token, equipo }: KioskoSesionesProps) {
  const { estaEnLinea } = useConexionRed();
  const { horaFormateada, fechaFormateada } = useRelojDigital();
  const [sonido, setSonido] = React.useState(true);
  const [paso, setPaso] = React.useState<"codigo" | "pin" | "sesiones">("codigo");
  const [codigo, setCodigo] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [datos, setDatos] = React.useState<SesionesKiosko | null>(null);
  const [elegidaId, setElegidaId] = React.useState<string | null>(null);
  const [tema, setTema] = React.useState("");
  const [procesando, setProcesando] = React.useState(false);
  const [aviso, setAviso] = React.useState<AvisoKiosko | null>(null);
  const credenciales = React.useRef<CredencialesKiosko | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const timerAviso = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const enfocar = React.useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  React.useEffect(() => {
    enfocar();
    return () => {
      if (timerAviso.current) clearTimeout(timerAviso.current);
    };
  }, [enfocar]);

  const reiniciar = React.useCallback(() => {
    credenciales.current = null;
    setPaso("codigo");
    setCodigo("");
    setPin("");
    setDatos(null);
    setElegidaId(null);
    setTema("");
    enfocar();
  }, [enfocar]);

  const mostrarAviso = React.useCallback((nuevo: AvisoKiosko, ms: number) => {
    if (timerAviso.current) clearTimeout(timerAviso.current);
    setAviso(nuevo);
    timerAviso.current = setTimeout(() => setAviso(null), ms);
  }, []);

  const avisarError = React.useCallback(
    (error: unknown) => {
      kioskoAudio.reproducirError(sonido);
      mostrarAviso(
        { tipo: "error", titulo: "No se registró", mensaje: mensajeDeError(error, estaEnLinea) },
        TIEMPO_AUTO_LIMPIEZA_ERROR_MS,
      );
    },
    [estaEnLinea, mostrarAviso, sonido],
  );

  useInactividad({ activo: paso !== "codigo" || Boolean(codigo), onInactividad: reiniciar });

  const identificar = async (pinCompleto: string) => {
    const cred = { codigo: codigo.trim(), pin: pinCompleto };
    setProcesando(true);
    try {
      const respuesta = await sesionesEnKiosko(token, cred);
      locutarConNombre(
        respuesta.docenteNombre,
        respuesta.sesiones.length === 0 ? (respuesta.mensaje ?? "") : "Elija su clase.",
        sonido,
      );
      if (respuesta.sesiones.length === 0) {
        mostrarAviso(
          { tipo: "info", titulo: respuesta.docenteNombre, mensaje: respuesta.mensaje ?? "" },
          TIEMPO_AUTO_CIERRE_AVISO_MS,
        );
        reiniciar();
        return;
      }
      credenciales.current = cred;
      setDatos(respuesta);
      setElegidaId(respuesta.destacadaId ?? respuesta.sesiones[0].id);
      setPaso("sesiones");
    } catch (error) {
      avisarError(error);
      reiniciar();
    } finally {
      setProcesando(false);
    }
  };

  const firmar = async (tipo: "ingreso" | "salida") => {
    const cred = credenciales.current;
    if (!cred || !elegidaId) return;
    setProcesando(true);
    try {
      const resultado =
        tipo === "ingreso"
          ? await firmarIngreso(token, elegidaId, { ...cred, tema })
          : await firmarSalida(token, elegidaId, cred);
      kioskoAudio.reproducirExito(sonido);
      locutarConNombre(
        datos?.docenteNombre ?? "",
        tipo === "ingreso" ? "Ingreso firmado." : "Salida firmada.",
        sonido,
      );
      mostrarAviso(
        {
          tipo: "exito",
          titulo: tipo === "ingreso" ? "Ingreso firmado" : "Salida firmada",
          mensaje: resultado.mensaje,
        },
        TIEMPO_AUTO_CIERRE_AVISO_MS,
      );
      reiniciar();
    } catch (error) {
      avisarError(error);
    } finally {
      setProcesando(false);
    }
  };

  const cambiarEntrada = (valor: string) => {
    kioskoAudio.reproducirTecla(sonido);
    if (paso === "codigo") {
      const recortado = valor.slice(0, LONGITUD_CODIGO_MAXIMA);
      setCodigo(recortado);
      if (recortado.length === LONGITUD_CODIGO_DEFECTO) setPaso("pin");
    } else if (paso === "pin") {
      const recortado = valor.slice(0, LONGITUD_PIN_DEFECTO);
      setPin(recortado);
      if (recortado.length === LONGITUD_PIN_DEFECTO) void identificar(recortado);
    }
  };

  const enviarEntrada = () => {
    if (paso === "codigo" && codigo.length >= 3) setPaso("pin");
    else if (paso === "pin" && pin.length === LONGITUD_PIN_DEFECTO) void identificar(pin);
    enfocar();
  };

  const valor = paso === "pin" ? pin : codigo;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between p-4 sm:p-6 lg:p-8">
      <KioskoAvisoResultado aviso={aviso} onCerrar={() => setAviso(null)} />
      <KioskoHeader
        institucion={null}
        equipo={equipo}
        sonidoHabilitado={sonido}
        onAlternarSonido={() => setSonido((s) => !s)}
      />

      <main className="my-auto grid grid-cols-1 items-center gap-8 py-6 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-6">
          <KioskoReloj hora={horaFormateada} fecha={fechaFormateada} />
          <div className="border-border/80 bg-card/60 space-y-2 rounded-3xl border p-5 shadow-2xs">
            <h2 className="text-foreground text-base font-bold sm:text-lg">
              Firma de sesiones de clase
            </h2>
            <p className="text-muted-foreground text-sm">
              Ingrese su código o DNI y su PIN. Elija la sesión, escriba el tema y firme el ingreso;
              al terminar la clase, firme la salida.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:col-span-6">
          <div className="border-border/80 bg-card space-y-5 rounded-3xl border p-6 shadow-xl sm:p-7">
            {paso === "sesiones" && datos ? (
              <ListaSesionesKiosko
                docenteNombre={datos.docenteNombre}
                sesiones={datos.sesiones}
                elegidaId={elegidaId}
                onElegir={setElegidaId}
                tema={tema}
                onTema={setTema}
                procesando={procesando}
                onFirmarIngreso={() => void firmar("ingreso")}
                onFirmarSalida={() => void firmar("salida")}
                onTerminar={reiniciar}
              />
            ) : (
              <>
                <KioskoEntradaCodigo
                  valor={valor}
                  onCambiar={cambiarEntrada}
                  onEnter={enviarEntrada}
                  inputRef={inputRef}
                  deshabilitado={procesando}
                  esModoPin={paso === "pin"}
                  etiqueta={paso === "pin" ? "PIN de seguridad" : "Código de docente o DNI"}
                  placeholder={paso === "pin" ? "••••" : "Digite o pase su carné..."}
                />
                <KioskoTeclado
                  onPulsarNumero={(d) => cambiarEntrada(valor + d)}
                  onBorrarTodo={() => (paso === "pin" ? setPin("") : setCodigo(""))}
                  onBorrarUltimo={() =>
                    paso === "pin"
                      ? setPin((p) => p.slice(0, -1))
                      : setCodigo((c) => c.slice(0, -1))
                  }
                  onEnviar={enviarEntrada}
                  deshabilitado={procesando}
                  puedeEnviar={
                    paso === "pin" ? pin.length === LONGITUD_PIN_DEFECTO : codigo.length >= 3
                  }
                  textoBoton={
                    procesando
                      ? "Verificando..."
                      : paso === "pin"
                        ? "Ver mis sesiones"
                        : "Continuar"
                  }
                />
              </>
            )}
          </div>
        </div>
      </main>

      <KioskoFooter
        institucion={null}
        estaEnLinea={estaEnLinea}
        totalPendientes={0}
        enviandoCola={false}
      />
    </div>
  );
}
