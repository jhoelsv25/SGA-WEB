"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Key01Icon, UserCheck01Icon, ShieldCheckIcon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { KIOSK_TOKEN_STORAGE_KEY } from "@/features/equipos/consts";
import { parseUsuariosPermitidos } from "@/features/equipos";
import { useValidarKioskoQuery } from "@/features/equipos/hooks";
import { useInstitucionQuery } from "@/features/institucion/hooks";
import {
  KioskoAvisoResultado,
  KioskoEntradaCodigo,
  KioskoFooter,
  KioskoHeader,
  KioskoPantallaCarga,
  KioskoPantallaDesconectado,
  KioskoPantallaNoAutorizado,
  KioskoReloj,
  KioskoSelectorTipo,
  KioskoTeclado,
  LONGITUD_CODIGO_DEFECTO,
  LONGITUD_CODIGO_MAXIMA,
  LONGITUD_PIN_DEFECTO,
  MarcacionNoDisponibleError,
  TIEMPO_AUTO_CIERRE_AVISO_MS,
  TIEMPO_AUTO_LIMPIEZA_ERROR_MS,
  detectarTurnoSugerido,
  kioskoAudio,
  locutarMarcacionRegistrada,
  locutarNombrePersona,
  servicioMarcacion,
  useConexionRed,
  useInactividad,
  useRelojDigital,
  type AvisoKiosko,
  type PersonaMarcacion,
  type TipoMarcacion,
} from "@/features/kiosko";

function getLocalStorageKioskToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KIOSK_TOKEN_STORAGE_KEY);
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function KioskoContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const storedToken = React.useSyncExternalStore(
    subscribeToStorage,
    getLocalStorageKioskToken,
    () => null,
  );

  const effectiveToken = tokenFromUrl || storedToken || "";

  // Estado real de conectividad del dispositivo
  const { estaEnLinea } = useConexionRed();

  // Validación de seguridad del equipo con TanStack Query
  const {
    data: validationResult,
    isLoading: isValidating,
    isError: hasValidationError,
    refetch: checkToken,
  } = useValidarKioskoQuery(effectiveToken || undefined);

  // Reloj digital en tiempo real sincronizado
  const { fechaActual, horaFormateada, fechaFormateada } = useRelojDigital();

  // Datos institucionales oficiales
  const { data: institucion } = useInstitucionQuery();

  // Preferencia de audio y síntesis de voz (activado por defecto)
  const [sonidoHabilitado, setSonidoHabilitado] = React.useState<boolean>(true);

  // Entrada de código / PIN y flujo de marcación
  const [paso, setPaso] = React.useState<"codigo" | "pin">("codigo");
  const [codigoValor, setCodigoValor] = React.useState<string>("");
  const [pinValor, setPinValor] = React.useState<string>("");
  const [personaResuelta, setPersonaResuelta] = React.useState<PersonaMarcacion | null>(null);
  const [procesando, setProcesando] = React.useState<boolean>(false);

  // Aviso flotante de resultado o error con temporizador automático
  const [aviso, setAviso] = React.useState<AvisoKiosko | null>(null);

  // Turno detectado automáticamente y selección manual
  const turnoInfo = React.useMemo(() => detectarTurnoSugerido(fechaActual), [fechaActual]);
  const [tipoManual, setTipoManual] = React.useState<TipoMarcacion | null>(null);
  const tipoEfectivo: TipoMarcacion = tipoManual ?? turnoInfo.tipoSugerido;

  // Referencia al input físico para mantener foco permanente
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const timerAvisoRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Enfocar input al cargar y cada vez que se cierre un aviso
  const enfocarEntrada = React.useCallback(() => {
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, []);

  React.useEffect(() => {
    enfocarEntrada();
  }, [enfocarEntrada]);

  // Limpiar temporizadores al desmontar
  React.useEffect(() => {
    return () => {
      if (timerAvisoRef.current) {
        clearTimeout(timerAvisoRef.current);
      }
    };
  }, []);

  // Cerrar aviso y devolver el foco a la entrada
  const cerrarAviso = React.useCallback(() => {
    if (timerAvisoRef.current) {
      clearTimeout(timerAvisoRef.current);
      timerAvisoRef.current = null;
    }
    setAviso(null);
    enfocarEntrada();
  }, [enfocarEntrada]);

  const mostrarAvisoConTiempo = React.useCallback(
    (nuevoAviso: AvisoKiosko, duracionMs: number) => {
      if (timerAvisoRef.current) {
        clearTimeout(timerAvisoRef.current);
      }
      setAviso(nuevoAviso);
      timerAvisoRef.current = setTimeout(() => {
        setAviso(null);
        enfocarEntrada();
      }, duracionMs);
    },
    [enfocarEntrada],
  );

  // Borrado automático por inactividad tras 20 segundos sin uso
  useInactividad({
    activo: Boolean(codigoValor || pinValor || personaResuelta),
    onInactividad: () => {
      setCodigoValor("");
      setPinValor("");
      setPaso("codigo");
      setPersonaResuelta(null);
      enfocarEntrada();
    },
  });

  // Alternar sonido y voz
  const handleAlternarSonido = () => {
    setSonidoHabilitado((prev) => !prev);
    enfocarEntrada();
  };

  // Restablecer el formulario completo
  const reiniciarFormulario = React.useCallback(() => {
    setCodigoValor("");
    setPinValor("");
    setPaso("codigo");
    setPersonaResuelta(null);
    enfocarEntrada();
  }, [enfocarEntrada]);

  // Ejecución del flujo de resolución y marcación
  const procesarMarcacion = React.useCallback(
    async (codigoAProcesar: string, pinAProcesar = "") => {
      if (!codigoAProcesar.trim() || procesando) return;

      setProcesando(true);

      try {
        if (paso === "codigo") {
          // Fase 1: Resolver código de identificación
          const resolucion = await servicioMarcacion.resolverCodigo(codigoAProcesar.trim());

          // Momento 1: Locutar nombre en voz alta si el servicio resolvió a la persona
          locutarNombrePersona(resolucion.persona.nombre, sonidoHabilitado);

          if (resolucion.requierePin) {
            setPersonaResuelta(resolucion.persona);
            setPaso("pin");
            setPinValor("");
            setProcesando(false);
            enfocarEntrada();
            return;
          }

          // Si no requiere PIN, registrar marcación directa
          const resultado = await servicioMarcacion.registrarMarcacion({
            codigo: codigoAProcesar.trim(),
            tipo: tipoEfectivo,
            equipoId: validationResult?.equipo?.id,
          });

          // Momento 2: Locutar confirmación según género
          locutarMarcacionRegistrada(resultado.persona.genero, sonidoHabilitado);
          kioskoAudio.reproducirExito(sonidoHabilitado);

          mostrarAvisoConTiempo(
            {
              tipo: "exito",
              titulo: "Marcación Registrada",
              mensaje: resultado.mensaje || "Asistencia registrada correctamente.",
              persona: resultado.persona,
              tipoMarcacion: resultado.tipo,
              estado: resultado.estado,
              hora: resultado.hora,
            },
            TIEMPO_AUTO_CIERRE_AVISO_MS,
          );

          reiniciarFormulario();
        } else {
          // Fase 2: Registrar con PIN de seguridad
          const resultado = await servicioMarcacion.registrarMarcacion({
            codigo: codigoAProcesar.trim(),
            pin: pinAProcesar.trim(),
            tipo: tipoEfectivo,
            equipoId: validationResult?.equipo?.id,
          });

          locutarMarcacionRegistrada(resultado.persona.genero, sonidoHabilitado);
          kioskoAudio.reproducirExito(sonidoHabilitado);

          mostrarAvisoConTiempo(
            {
              tipo: "exito",
              titulo: "Marcación Registrada",
              mensaje: resultado.mensaje || "Firma y asistencia registradas con éxito.",
              persona: resultado.persona,
              tipoMarcacion: resultado.tipo,
              estado: resultado.estado,
              hora: resultado.hora,
            },
            TIEMPO_AUTO_CIERRE_AVISO_MS,
          );

          reiniciarFormulario();
        }
      } catch (err: unknown) {
        // Manejo amigable sin alert()
        kioskoAudio.reproducirError(sonidoHabilitado);

        const mensajeError =
          err instanceof MarcacionNoDisponibleError
            ? err.message
            : err instanceof Error && err.message
              ? err.message
              : "El registro de asistencia todavía no está habilitado en este equipo.";

        mostrarAvisoConTiempo(
          {
            tipo: "error",
            titulo: "Servicio no disponible",
            mensaje: mensajeError,
          },
          TIEMPO_AUTO_LIMPIEZA_ERROR_MS,
        );

        reiniciarFormulario();
      } finally {
        setProcesando(false);
      }
    },
    [
      paso,
      procesando,
      sonidoHabilitado,
      tipoEfectivo,
      validationResult,
      mostrarAvisoConTiempo,
      reiniciarFormulario,
      enfocarEntrada,
    ],
  );

  // Manejo de cambios en el input físico o lector
  const handleCambioEntrada = (nuevoValor: string) => {
    kioskoAudio.reproducirTecla(sonidoHabilitado);

    if (paso === "codigo") {
      const recortado = nuevoValor.slice(0, LONGITUD_CODIGO_MAXIMA);
      setCodigoValor(recortado);

      // Auto-procesamiento al alcanzar longitud estándar configurada (ej. 8 dígitos de DNI)
      if (recortado.length === LONGITUD_CODIGO_DEFECTO) {
        void procesarMarcacion(recortado);
      }
    } else {
      const recortado = nuevoValor.slice(0, LONGITUD_PIN_DEFECTO);
      setPinValor(recortado);

      // Auto-envío al completar el PIN
      if (recortado.length === LONGITUD_PIN_DEFECTO) {
        void procesarMarcacion(codigoValor, recortado);
      }
    }
  };

  // Manejo de pulsaciones del teclado virtual táctil
  const handlePulsarNumeroVirtual = (digito: string) => {
    if (procesando) return;

    if (paso === "codigo") {
      if (codigoValor.length < LONGITUD_CODIGO_MAXIMA) {
        const siguiente = codigoValor + digito;
        handleCambioEntrada(siguiente);
      }
    } else {
      if (pinValor.length < LONGITUD_PIN_DEFECTO) {
        const siguiente = pinValor + digito;
        handleCambioEntrada(siguiente);
      }
    }
    enfocarEntrada();
  };

  const handleBorrarTodoVirtual = () => {
    kioskoAudio.reproducirTecla(sonidoHabilitado);
    if (paso === "codigo") {
      setCodigoValor("");
    } else {
      setPinValor("");
    }
    enfocarEntrada();
  };

  const handleBorrarUltimoVirtual = () => {
    kioskoAudio.reproducirTecla(sonidoHabilitado);
    if (paso === "codigo") {
      setCodigoValor((prev) => prev.slice(0, -1));
    } else {
      setPinValor((prev) => prev.slice(0, -1));
    }
    enfocarEntrada();
  };

  const handleEnterEntrada = () => {
    if (paso === "codigo") {
      if (codigoValor.trim().length >= 3) {
        void procesarMarcacion(codigoValor);
      }
    } else {
      if (pinValor.trim().length >= 1) {
        void procesarMarcacion(codigoValor, pinValor);
      }
    }
  };

  // PANTALLA 1: Verificando equipo y seguridad
  if (isValidating) {
    return <KioskoPantallaCarga />;
  }

  // PANTALLA 2: Sin conexión a internet o al servidor de la institución
  if (!estaEnLinea || hasValidationError) {
    return <KioskoPantallaDesconectado onReintentar={() => void checkToken()} />;
  }

  // PANTALLA 3: Equipo no autorizado (respuesta válida de la API con valido: false o sin token)
  if (!effectiveToken || !validationResult?.valido || !validationResult.equipo) {
    return (
      <KioskoPantallaNoAutorizado
        tieneTokenLocal={Boolean(effectiveToken)}
        horaActual={horaFormateada}
        onReintentar={() => void checkToken()}
      />
    );
  }

  // PANTALLA 4: Terminal AUTORIZADO y OPERATIVO
  const equipo = validationResult.equipo;
  const esSesiones = equipo.proposito === "sesiones";
  const valorActual = paso === "codigo" ? codigoValor : pinValor;
  const puedeEnviar = paso === "codigo" ? codigoValor.length >= 3 : pinValor.length >= 1;

  return (
    <div
      onClick={enfocarEntrada}
      className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between p-4 sm:p-6 lg:p-8"
    >
      {/* Aviso flotante grande para resultados o alertas */}
      <KioskoAvisoResultado aviso={aviso} onCerrar={cerrarAviso} />

      {/* Cabecera del terminal */}
      <KioskoHeader
        institucion={institucion}
        equipo={equipo}
        sonidoHabilitado={sonidoHabilitado}
        onAlternarSonido={handleAlternarSonido}
      />

      {/* Cuerpo principal del kiosko */}
      <main className="my-auto grid grid-cols-1 items-center gap-8 py-6 lg:grid-cols-12 lg:gap-12">
        {/* Columna Izquierda: Gran reloj y estado de turnos */}
        <div className="space-y-6 lg:col-span-6">
          <KioskoReloj hora={horaFormateada} fecha={fechaFormateada} />

          {/* Selector de Entrada / Salida con sugerencia inteligente */}
          <KioskoSelectorTipo
            tipo={tipoEfectivo}
            onCambiarTipo={(t) => {
              kioskoAudio.reproducirTecla(sonidoHabilitado);
              setTipoManual(t);
              enfocarEntrada();
            }}
            turnoInfo={turnoInfo}
          />

          {/* Tarjeta de instrucciones y usuarios autorizados */}
          <div className="border-border/80 bg-card/60 space-y-3 rounded-3xl border p-5 shadow-2xs backdrop-blur-xs">
            <h2 className="text-foreground flex items-center gap-2 text-base font-bold sm:text-lg">
              <HugeiconsIcon
                icon={esSesiones ? Key01Icon : UserCheck01Icon}
                className="text-primary size-5"
                aria-hidden="true"
              />
              <span>
                {esSesiones ? "Firma de Sesión Docente" : "Control de Asistencia Escolar"}
              </span>
            </h2>

            {(() => {
              const usuarios = parseUsuariosPermitidos(equipo.usuariosPermitidos);
              return (
                <>
                  <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                    {esSesiones
                      ? "Docentes: Ingrese su documento de identidad y PIN de seguridad para firmar el inicio o cierre de su clase programada."
                      : "Estudiantes y personal autorizado: Digite su código en el teclado, use el teclado físico o pase su tarjeta de identificación por el lector."}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {usuarios.map((u) => (
                      <span
                        key={u}
                        className="border-border/80 bg-muted/70 text-muted-foreground inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-semibold capitalize"
                      >
                        <HugeiconsIcon
                          icon={ShieldCheckIcon}
                          className="text-primary size-3.5"
                          aria-hidden="true"
                        />
                        {u}
                      </span>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Columna Derecha: Entrada y Teclado Táctil */}
        <div className="mx-auto w-full max-w-md lg:col-span-6">
          <div className="border-border/80 bg-card space-y-5 rounded-3xl border p-6 shadow-xl sm:p-7">
            {/* Si ya se resolvió la persona y pide PIN, mostrar su nombre */}
            {paso === "pin" && personaResuelta && (
              <div className="border-primary/20 bg-primary/10 text-primary flex items-center justify-between rounded-2xl border p-3.5 text-sm font-bold">
                <span>Hola, {personaResuelta.nombre}</span>
                <span className="text-muted-foreground text-xs font-normal">Ingrese su PIN</span>
              </div>
            )}

            {/* Entrada accesible conectada a teclado físico y lector */}
            <KioskoEntradaCodigo
              valor={valorActual}
              onCambiar={handleCambioEntrada}
              onEnter={handleEnterEntrada}
              inputRef={inputRef}
              deshabilitado={procesando}
              esModoPin={paso === "pin"}
              etiqueta={
                paso === "pin"
                  ? "PIN de Seguridad"
                  : esSesiones
                    ? "Código de Docente o DNI"
                    : "Código de Estudiante o DNI"
              }
              placeholder={paso === "pin" ? "••••" : "Digite o pase su tarjeta..."}
            />

            {/* Teclado numérico táctil ergonómico */}
            <KioskoTeclado
              onPulsarNumero={handlePulsarNumeroVirtual}
              onBorrarTodo={handleBorrarTodoVirtual}
              onBorrarUltimo={handleBorrarUltimoVirtual}
              onEnviar={handleEnterEntrada}
              deshabilitado={procesando}
              puedeEnviar={puedeEnviar}
              textoBoton={
                procesando
                  ? "Verificando..."
                  : paso === "pin"
                    ? "Confirmar PIN"
                    : "Continuar Marcación"
              }
            />
          </div>
        </div>
      </main>

      {/* Pie de página con estado de conexión real y soporte */}
      <KioskoFooter institucion={institucion} estaEnLinea={estaEnLinea} />
    </div>
  );
}

export default function KioskoPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-background text-muted-foreground flex min-h-screen items-center justify-center text-sm">
          <Spinner className="text-primary mr-2 size-6" />
          Cargando entorno Kiosko...
        </div>
      }
    >
      <KioskoContent />
    </React.Suspense>
  );
}
