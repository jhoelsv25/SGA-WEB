"use client";

import * as React from "react";
import { Key01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FichaAccesos } from "./ficha-accesos";
import { useBuscarPersonas } from "./hooks";

export function AccesosPage() {
  const [texto, setTexto] = React.useState("");
  const [busqueda, setBusqueda] = React.useState("");
  const [elegida, setElegida] = React.useState<string | null>(null);
  const resultados = useBuscarPersonas(busqueda);

  // Se busca cuando se deja de escribir
  React.useEffect(() => {
    const espera = setTimeout(() => setBusqueda(texto.trim()), 350);
    return () => clearTimeout(espera);
  }, [texto]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accesos y credenciales"
        description="Busque a un docente, estudiante o personal y restablezca su PIN, carné, código biométrico o contraseña."
        icon={Key01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Accesos y credenciales" },
        ]}
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <section className="bg-card border-border/60 space-y-3 rounded-2xl border p-4 lg:col-span-5">
          <div className="space-y-1.5">
            <Label htmlFor="buscar-persona">DNI o nombres y apellidos</Label>
            <Input
              id="buscar-persona"
              type="search"
              autoComplete="off"
              placeholder="Escriba al menos 3 caracteres"
              value={texto}
              maxLength={100}
              onChange={(e) => setTexto(e.target.value)}
              className="min-h-10"
            />
          </div>
          {resultados.isFetching && <Spinner className="mx-auto size-5" />}
          {resultados.isError && (
            <p className="text-destructive text-sm">{resultados.error.message}</p>
          )}
          {resultados.data?.length === 0 && (
            <p className="text-muted-foreground text-sm">No se encontró a nadie.</p>
          )}
          <ul className="space-y-1">
            {resultados.data?.map((p) => (
              <li key={p.personaId}>
                <button
                  type="button"
                  aria-pressed={elegida === p.personaId}
                  onClick={() => setElegida(p.personaId)}
                  className={cn(
                    "hover:bg-muted/60 w-full rounded-xl px-3 py-2 text-left",
                    elegida === p.personaId && "bg-primary/10",
                  )}
                >
                  <span className="block text-sm font-medium">{p.nombreCompleto}</span>
                  <span className="text-muted-foreground block text-xs">
                    {p.documento} · {p.grupos.join(", ") || "Sin grupo"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {resultados.data?.length === 20 && (
            <p className="text-muted-foreground text-xs">
              Se muestran 20 resultados. Escriba más para afinar.
            </p>
          )}
        </section>
        <section className="bg-card border-border/60 min-w-0 rounded-2xl border p-5 lg:col-span-7">
          {elegida ? (
            <FichaAccesos personaId={elegida} />
          ) : (
            <p className="text-muted-foreground text-sm">Elija una persona para ver sus accesos.</p>
          )}
        </section>
      </div>
    </div>
  );
}
