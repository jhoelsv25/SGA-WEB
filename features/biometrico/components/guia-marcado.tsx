"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ComputerIcon,
  FingerPrintScanIcon,
  InformationCircleIcon,
  TeachingIcon,
} from "@hugeicons/core-free-icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const REGLAS = [
  {
    titulo: "La primera marca es la entrada",
    detalle: "Una sola marca en el día es entrada, aunque sea por la tarde.",
  },
  {
    titulo: "La última marca es la salida",
    detalle: "Si vuelve a marcar más tarde, la salida pasa a ser esa última hora.",
  },
  {
    titulo: "Las marcas intermedias no cuentan",
    detalle:
      "No cambian la entrada ni la salida. Las del reloj y del kiosko se conservan para revisarlas. A mano solo se acepta una entrada más temprana o una salida más tarde.",
  },
  {
    titulo: "Dos vías casi a la vez cuentan una sola",
    detalle:
      "Una marca del reloj o del kiosko a menos de 30 minutos de otra hecha por una vía distinta (también a mano) es la misma asistencia. El margen es configurable; 30 es el valor inicial.",
  },
];

const VIAS = [
  {
    nombre: "Reloj biométrico",
    para: "Asistencia del personal",
    icono: FingerPrintScanIcon,
    pasos: [
      "La persona marca en el reloj. Vale la hora del reloj.",
      "El programa de la computadora autorizada trae las marcas a las horas de sincronización. Hasta entonces no aparecen aquí.",
      "Cada persona se reconoce por su código biométrico.",
      "Si repite antes de tener salida y en menos de 5 minutos (valor inicial), se toma como una doble lectura.",
      "Si no hay un turno activo, la marca queda en espera.",
      "La voz y los sonidos del reloj dependen del aparato: este sistema no los controla.",
    ],
  },
  {
    nombre: "Kiosko de asistencia",
    para: "Entrada y salida del día",
    icono: ComputerIcon,
    pasos: [
      "Ingrese el código del carné o el DNI y luego el PIN. Vale la hora del sistema.",
      "El kiosko decide solo si es entrada o salida, con las mismas reglas del reloj.",
      "Al terminar dice en voz alta el nombre y el resultado.",
      "Los estudiantes solo registran la entrada.",
    ],
  },
  {
    nombre: "Kiosko de sesiones de clase",
    para: "Firma de cada clase del docente",
    icono: TeachingIcon,
    pasos: [
      "Ingrese el código o el DNI y luego el PIN. El kiosko saluda diciendo el nombre.",
      "Elija la clase, escriba el tema y firme el ingreso.",
      "Al terminar la clase, vuelva a identificarse y firme la salida.",
      "Firmar una clase NO registra la asistencia del día: se marcan por separado.",
    ],
  },
];

export function GuiaMarcado({ abierta = false }: { abierta?: boolean }) {
  const [abierto, setAbierto] = React.useState(abierta);

  return (
    <Collapsible
      open={abierto}
      onOpenChange={setAbierto}
      className="border-border/60 bg-card rounded-2xl border shadow-xs"
    >
      <CollapsibleTrigger className="focus-visible:ring-primary/30 flex w-full items-center gap-3 rounded-2xl p-4 text-left outline-none focus-visible:ring-2">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="text-primary size-5 shrink-0"
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className="text-foreground block text-sm font-bold">
            ¿Cómo funciona el marcado?
          </span>
          <span className="text-muted-foreground block text-xs">
            Reloj biométrico, kiosko de asistencia y kiosko de sesiones de clase
          </span>
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={cn("size-4 shrink-0 transition-transform", abierto && "rotate-180")}
          aria-hidden="true"
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="border-border/60 space-y-5 border-t p-4">
        <section aria-labelledby="guia-vias" className="space-y-3">
          <h2 id="guia-vias" className="text-foreground text-sm font-bold">
            Tres formas de marcar, cada una con su uso
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {VIAS.map((via) => (
              <div key={via.nombre} className="min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={via.icono}
                    className="text-primary size-5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">{via.nombre}</h3>
                    <p className="text-muted-foreground text-xs">{via.para}</p>
                  </div>
                </div>
                <ol className="text-muted-foreground list-decimal space-y-1.5 pl-5 text-xs">
                  {via.pasos.map((paso) => (
                    <li key={paso}>{paso}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="guia-reglas" className="border-border/60 space-y-3 border-t pt-4">
          <h2 id="guia-reglas" className="text-foreground text-sm font-bold">
            Qué marca vale en la asistencia (reloj, kiosko de asistencia y registro manual)
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {REGLAS.map((regla) => (
              <div key={regla.titulo} className="border-primary/40 min-w-0 border-l-2 pl-3">
                <dt className="text-foreground text-xs font-semibold">{regla.titulo}</dt>
                <dd className="text-muted-foreground text-xs">{regla.detalle}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted-foreground text-xs">
            <strong className="text-foreground">Ejemplo:</strong> 07:59, 08:00, 09:49 y 18:10 →
            entrada 07:59 y salida 18:10.
          </p>
          <p className="text-muted-foreground text-xs">
            <strong className="text-foreground">Tardanza y salida:</strong> se miden con el turno de
            cada tipo de personal, que es el horario del Reglamento Interno (o con las clases del
            docente, si así está configurado en Variables del sistema), más la tolerancia del turno.
            El detalle de cada día está en Asistencia → Control diario.
          </p>
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
}
