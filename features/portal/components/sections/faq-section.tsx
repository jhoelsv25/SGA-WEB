"use client";

import * as React from "react";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon, Call02Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { PORTAL_FAQS } from "../../constants/faq";

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Columna izquierda editorial sin card */}
          <div className="space-y-6 lg:col-span-4">
            <div>
              <p className="text-primary flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase">
                <span className="bg-primary h-px w-10" />
                Guía rápida
              </p>
              <h2 className="text-foreground mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:leading-[1.05]">
                Orientación para la comunidad educativa
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                Respuestas directas sobre el acceso a {siteConfig.acronym}, el kiosko de portería y
                la descarga de libretas.
              </p>
            </div>

            <div className="border-primary/40 space-y-2.5 border-l-2 pl-4">
              <p className="text-foreground text-sm font-bold">Mesa de ayuda del colegio</p>
              <a
                href={`mailto:${siteConfig.institution.contact.supportEmail}`}
                className="text-muted-foreground hover:text-primary flex items-center gap-2 text-xs font-medium transition-colors"
              >
                <HugeiconsIcon icon={Mail01Icon} className="text-primary size-4 shrink-0" />
                <span>{siteConfig.institution.contact.supportEmail}</span>
              </a>
              <a
                href={`tel:${siteConfig.institution.contact.supportPhone.replace(/[^\d+]/g, "")}`}
                className="text-muted-foreground hover:text-primary flex items-center gap-2 text-xs font-medium transition-colors"
              >
                <HugeiconsIcon icon={Call02Icon} className="text-primary size-4 shrink-0" />
                <span>{siteConfig.institution.contact.supportPhone}</span>
              </a>
              <p className="text-muted-foreground text-xs">
                {siteConfig.institution.contact.schedule}
              </p>
            </div>
          </div>

          {/* Acordeón editorial con divisores limpios */}
          <div className="divide-border/80 border-border/80 divide-y border-y lg:col-span-8">
            {PORTAL_FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                      <span className="text-primary shrink-0 text-[11px] font-bold tracking-wider uppercase">
                        {faq.category}
                      </span>
                      <span className="text-foreground text-sm font-semibold sm:text-base">
                        {faq.question}
                      </span>
                    </div>
                    <span className="text-muted-foreground shrink-0">
                      <HugeiconsIcon
                        icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
                        className="size-4.5"
                      />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-muted-foreground pb-4 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
