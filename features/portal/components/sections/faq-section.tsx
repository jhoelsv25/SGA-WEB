"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon, Mail01Icon } from "@hugeicons/core-free-icons";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Acceso y Credenciales",
    question: "¿Cómo accedo a mi cuenta por primera vez o si olvidé mi contraseña?",
    answer:
      "Las cuentas son creadas por la Dirección o Secretaría del colegio. Al ingresar por primera vez, el sistema exige por seguridad cambiar la clave temporal por una personalizada (mínimo 8 caracteres, con letras y números). Si olvidaste tu contraseña, puedes recuperarla en la sección '¿Olvidaste tu contraseña?' ingresando tu usuario y tu fecha de nacimiento registrada en tu matrícula.",
  },
  {
    category: "Portería y Asistencia",
    question: "¿Cómo opera la terminal de marcado escolar (Kiosco) en portería?",
    answer:
      "El Kiosco está instalado en el acceso principal de la institución educativa. Cada estudiante o docente marca su ingreso acercando su carné con código de barras o ingresando su DNI en el teclado numérico. El sistema valida la foto, registra la hora exacta, aplica la tolerancia configurada y emite alertas de tardanza en tiempo real.",
  },
  {
    category: "Calificaciones y CNEB",
    question: "¿Cómo se ingresan y calculan las notas en el sistema?",
    answer:
      "El sistema está 100% adaptado al Currículo Nacional de la Educación Básica (CNEB). Los docentes evalúan por competencias y capacidades utilizando la escala oficial (AD, A, B, C) o numérica según el nivel. El sistema genera automáticamente los consolidados bimestrales y actas finales sin necesidad de cálculos manuales.",
  },
  {
    category: "Seguridad y Privacidad",
    question: "¿Cómo se garantiza la seguridad y privacidad de los datos escolares?",
    answer:
      "Toda la información viaja bajo protocolo seguro HTTPS con cookies blindadas (HttpOnly y SameSite). Las contraseñas están cifradas con algoritmo bcrypt y las operaciones quedan registradas en una bitácora de auditoría inmutable (RF-003). Cumplimos estrictamente con la Ley N° 29733 de Protección de Datos Personales del Perú.",
  },
  {
    category: "Dispositivos y Requisitos",
    question: "¿Puedo consultar mis notas o asistencia desde mi teléfono móvil?",
    answer:
      "Sí. El SGA está desarrollado con tecnología web moderna y responsive. Funciona de manera fluida desde cualquier navegador moderno (Chrome, Edge, Safari, Firefox) tanto en computadoras de escritorio como en tablets y smartphones.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/5 text-primary text-xs font-semibold"
          >
            Preguntas Frecuentes
          </Badge>
          <h2 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Todo lo que necesitas saber sobre el {siteConfig.acronym}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Respuestas directas a las consultas más habituales de directivos, docentes y familias.
          </p>
        </div>

        <div className="mt-12 space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="border-border/80 bg-card overflow-hidden rounded-2xl border transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="hover:bg-muted/40 flex w-full items-center justify-between p-5 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="text-primary text-[10px] font-bold tracking-wider uppercase">
                      {faq.category}
                    </span>
                    <span className="text-foreground text-sm font-bold sm:text-base">
                      {faq.question}
                    </span>
                  </div>
                  <HugeiconsIcon
                    icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
                    className="text-muted-foreground size-4 shrink-0 transition-transform"
                  />
                </button>

                {isOpen && (
                  <div className="border-border/40 text-muted-foreground animate-in fade-in-50 border-t px-5 py-4 text-xs leading-relaxed duration-200 sm:text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Soporte adicional */}
        <div className="border-border bg-muted/30 mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border p-6 text-center sm:flex-row sm:text-left">
          <div className="space-y-1">
            <h3 className="text-foreground text-sm font-bold">¿Tienes alguna otra consulta?</h3>
            <p className="text-muted-foreground text-xs">
              La mesa de ayuda técnica está a tu disposición durante el horario escolar.
            </p>
          </div>
          <a
            href={`mailto:${siteConfig.institution.contact.supportEmail}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs transition-colors"
          >
            <HugeiconsIcon icon={Mail01Icon} className="size-4" />
            <span>Contactar Soporte Técnico</span>
          </a>
        </div>
      </div>
    </section>
  );
}
