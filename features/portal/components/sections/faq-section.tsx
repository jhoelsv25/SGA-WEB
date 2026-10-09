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
    category: "Acceso",
    question: "¿Cómo ingreso por primera vez o si olvidé mi contraseña?",
    answer:
      "La cuenta la crea el colegio y te entrega una contraseña temporal. Al ingresar por primera vez debes cambiarla por una propia (mínimo 8 caracteres, con letras y números). Si la olvidaste, usa «¿Olvidaste tu contraseña?» en el inicio de sesión con tu usuario y tu fecha de nacimiento.",
  },
  {
    category: "Asistencia",
    question: "¿Cómo funciona el kiosko de marcación?",
    answer:
      "El kiosko está en equipos autorizados dentro del colegio. Cada persona marca su ingreso y salida con su código personal; el sistema registra la hora y calcula la tardanza según el turno y su tolerancia.",
  },
  {
    category: "Libretas",
    question: "¿Dónde veo las notas y la libreta?",
    answer:
      "La libreta oficial es la del SIAGIE: el colegio la carga en PDF y el estudiante y su apoderado pueden descargarla. Las únicas notas que se registran en el sistema son las del aula virtual de reforzamiento.",
  },
  {
    category: "Privacidad",
    question: "¿Cómo se protegen los datos de los estudiantes?",
    answer:
      "El acceso es por rol, las contraseñas se guardan cifradas y los cambios importantes quedan en la bitácora de auditoría. Los datos se tratan conforme a la Ley N.° 29733 de Protección de Datos Personales.",
  },
  {
    category: "Dispositivos",
    question: "¿Puedo usarlo desde el celular?",
    answer:
      "Sí. Funciona en el navegador del celular, la tablet o la computadora, sin instalar nada.",
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
                  aria-controls={`faq-respuesta-${index}`}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-primary text-xs font-semibold">{faq.category}</span>
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
                  <div
                    id={`faq-respuesta-${index}`}
                    className="border-border/40 text-muted-foreground animate-in fade-in-50 border-t px-5 py-4 text-sm leading-relaxed duration-200"
                  >
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
