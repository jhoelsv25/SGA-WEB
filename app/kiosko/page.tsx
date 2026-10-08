"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  RefreshIcon,
  SecurityLockIcon,
  ShieldCheckIcon,
  UserCheck01Icon,
  School01Icon,
  Key01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { KIOSK_TOKEN_STORAGE_KEY } from "@/features/equipos/consts";
import { useValidarKioskoQuery } from "@/features/equipos/hooks";
import { useInstitucionQuery } from "@/features/institucion/hooks";

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

  // Consulta de validación con TanStack Query
  const {
    data: validationResult,
    isLoading: isValidating,
    refetch: checkToken,
  } = useValidarKioskoQuery(effectiveToken || undefined);

  // Reloj en tiempo real
  const [currentTime, setCurrentTime] = React.useState<Date | null>(null);

  // Teclado numérico / Entrada de código PIN de marcación
  const [pinValue, setPinValue] = React.useState("");

  // Datos de la institución
  const { data: institucion } = useInstitucionQuery();

  // Efecto del reloj con intervalo asíncrono
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(new Date());
    }, 0);
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleKeypadPress = (val: string) => {
    if (pinValue.length < 12) {
      setPinValue((prev) => prev + val);
    }
  };

  const handleClearPin = () => {
    setPinValue("");
  };

  const handleDeleteDigit = () => {
    setPinValue((prev) => prev.slice(0, -1));
  };

  // Pantalla de Carga
  if (isValidating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-2xl">
          <Spinner className="h-10 w-10 text-blue-500" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-slate-200">
          Iniciando Terminal SGA...
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Verificando autorización y seguridad del dispositivo
        </p>
      </div>
    );
  }

  // Escenario Gherkin: Equipo NO Autorizado o Desactivado
  if (!effectiveToken || !validationResult?.valido || !validationResult.equipo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <div className="relative w-full max-w-md space-y-6 rounded-3xl border border-rose-500/30 bg-slate-900/90 p-8 shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/10 text-rose-500 shadow-inner">
            <HugeiconsIcon icon={SecurityLockIcon} className="h-10 w-10 stroke-[1.8]" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-400">
              <HugeiconsIcon icon={Alert02Icon} className="h-3.5 w-3.5" />
              Terminal No Habilitada
            </span>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Este equipo no está autorizado. Comuníquese con el área de TI.
            </h1>
            <p className="pt-1 text-xs leading-relaxed text-slate-400">
              Para operar este kiosko de asistencia o firma de sesiones, el personal de Soporte TI
              debe registrar y autorizar este navegador desde el panel de administración.
            </p>
          </div>

          <div className="space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-left font-mono text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Estado clave local:</span>
              <span className={effectiveToken ? "text-amber-400" : "text-rose-400"}>
                {effectiveToken ? "Token presente pero no activo" : "Sin clave configurada"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Hora del sistema:</span>
              <span>{currentTime ? currentTime.toLocaleTimeString("es-PE") : "—"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => checkToken()}
              className="w-full gap-2 border-slate-700 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700"
            >
              <HugeiconsIcon icon={RefreshIcon} className="h-3.5 w-3.5" />
              Reintentar Verificación
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full text-xs text-slate-400 hover:text-slate-200"
            >
              <Link href="/login">Acceso para Soporte TI y Administrador</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Escenario Gherkin: Equipo AUTORIZADO (Libre uso de marcación o sesiones)
  const equipo = validationResult.equipo;
  const isSesiones = equipo.proposito === "sesiones";

  const formattedDate = currentTime
    ? new Intl.DateTimeFormat("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(currentTime)
    : "";

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between p-6">
      {/* Cabecera Superior del Kiosko */}
      <header className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-4">
          {institucion?.logoUrl ? (
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700/60 bg-white/5 p-2">
              <Image
                src={
                  institucion.logoUrl.startsWith("http")
                    ? institucion.logoUrl
                    : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3000"}${institucion.logoUrl}`
                }
                alt="Logo"
                width={56}
                height={56}
                className="max-h-full max-w-full object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-600/20 text-blue-400">
              <HugeiconsIcon icon={School01Icon} className="h-7 w-7" />
            </div>
          )}

          <div>
            <h1 className="text-base font-bold tracking-wide text-white">
              {institucion?.nombre || "Colegio Carmelinas — SGA"}
            </h1>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-200">{equipo.nombre}</span>
              <span>•</span>
              <span>{equipo.ubicacion}</span>
            </div>
          </div>
        </div>

        {/* Estado Operativo y Propósito */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
              isSesiones
                ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            <span
              className={`h-2 w-2 animate-ping rounded-full ${
                isSesiones ? "bg-purple-400" : "bg-emerald-400"
              }`}
            />
            {isSesiones ? "Kiosko de Sesiones Docentes" : "Kiosko de Marcación"}
          </div>

          <div className="hidden items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 sm:flex">
            <HugeiconsIcon icon={ShieldCheckIcon} className="h-4 w-4 text-emerald-400" />
            <span>Terminal Autorizada</span>
          </div>
        </div>
      </header>

      {/* Cuerpo Central: Reloj y Pad de Marcación */}
      <main className="my-auto grid grid-cols-1 items-center gap-8 py-6 lg:grid-cols-12">
        {/* Columna Izquierda: Gran Reloj Digital y Mensaje de Bienvenida */}
        <div className="space-y-6 text-center lg:col-span-6 lg:text-left">
          <div className="space-y-2">
            <span className="text-sm font-semibold tracking-wider text-blue-400 capitalize uppercase">
              {formattedDate}
            </span>
            <div className="font-mono text-6xl font-black tracking-tight text-white tabular-nums drop-shadow-md sm:text-7xl lg:text-8xl">
              {formattedTime}
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5">
            <h2 className="flex items-center justify-center gap-2 text-lg font-bold text-slate-100 lg:justify-start">
              <HugeiconsIcon
                icon={isSesiones ? Key01Icon : UserCheck01Icon}
                className="h-5 w-5 text-blue-400"
              />
              {isSesiones ? "Firma de Sesión de Clase" : "Registro de Asistencia Escolar"}
            </h2>
            <p className="text-xs leading-relaxed text-slate-400">
              {isSesiones
                ? "Profesores: Ingrese su documento de identidad y PIN de seguridad para firmar el inicio o cierre de su clase programada."
                : `Estudiantes y personal habilitado (${equipo.usuariosPermitidos.join(", ")}): Digite su código o pase su tarjeta de identificación.`}
            </p>

            <div className="flex flex-wrap justify-center gap-1.5 pt-2 lg:justify-start">
              {equipo.usuariosPermitidos.map((u) => (
                <span
                  key={u}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 capitalize"
                >
                  ✓ {u}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Teclado Numérico y Entrada de Código */}
        <div className="mx-auto w-full max-w-md lg:col-span-6">
          <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
            {/* Pantalla del Código ingresado */}
            <div className="space-y-1.5">
              <label className="block text-center text-xs font-semibold text-slate-400">
                {isSesiones ? "Código de Docente o DNI" : "Código de Estudiante / DNI"}
              </label>
              <div className="flex h-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 px-4 font-mono text-2xl font-bold tracking-widest text-blue-400 shadow-inner">
                {pinValue ? (
                  pinValue
                ) : (
                  <span className="text-sm font-normal tracking-normal text-slate-600">
                    Ingrese número o use el teclado...
                  </span>
                )}
              </div>
            </div>

            {/* Teclado táctil numérico */}
            <div className="grid grid-cols-3 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num.toString())}
                  className="h-14 rounded-2xl bg-slate-800 text-xl font-bold text-slate-100 shadow-xs transition-colors hover:bg-slate-700 active:scale-95 active:bg-blue-600"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="h-14 rounded-2xl bg-slate-800/60 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-950/40 hover:text-rose-300"
              >
                BORRAR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress("0")}
                className="h-14 rounded-2xl bg-slate-800 text-xl font-bold text-slate-100 transition-colors hover:bg-slate-700 active:bg-blue-600"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDeleteDigit}
                className="h-14 rounded-2xl bg-slate-800/60 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700"
              >
                ⌫
              </button>
            </div>

            {/* Botón de Confirmación / Enviar */}
            <Button
              disabled={!pinValue}
              onClick={() => {
                alert(
                  isSesiones
                    ? `[RF-011] Código recibido: ${pinValue}. Conectando con módulo de firma de sesiones de clase...`
                    : `[RF-010] Código recibido: ${pinValue}. Conectando con módulo de marcación y asistencia...`,
                );
                setPinValue("");
              }}
              className="h-12 w-full gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5" />
              Continuar Marcación
            </Button>
          </div>
        </div>
      </main>

      {/* Pie de Página del Kiosko */}
      <footer className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Servicio en línea • Conectado a SGA API</span>
        </div>
        <div>
          <span>Soporte TI: {institucion?.telefono || "Anexo 101"}</span>
        </div>
      </footer>
    </div>
  );
}

export default function KioskoPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
          <Spinner className="mr-2 h-6 w-6 text-blue-500" />
          Cargando entorno Kiosko...
        </div>
      }
    >
      <KioskoContent />
    </React.Suspense>
  );
}
