"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/features/auth";
import { renovarSesionSilenciosa } from "@/lib/api-client";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldCheckIcon } from "@hugeicons/core-free-icons";

export interface AdminGuardProps {
  children: React.ReactNode;
}

function AdvancingProgressBar() {
  const [progress, setProgress] = React.useState(18);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const remaining = 95 - prev;
        const step = Math.max(1.5, remaining * 0.12);
        return Math.min(92, Math.round(prev + step));
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-muted mt-6 mb-4 h-1.5 w-44 overflow-hidden rounded-full">
      <div
        className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isLoading, isError } = useSession();

  React.useEffect(() => {
    if (!isLoading) {
      if (isError || !session?.user) {
        router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      } else if (
        session.user.mustChangePassword &&
        !session.user.impersonatedBy &&
        pathname !== "/change-password"
      ) {
        router.replace("/change-password");
      }
    }
  }, [isLoading, isError, session, router, pathname]);

  // Renovación silenciosa proactiva por cookie HttpOnly mientras la pestaña esté abierta
  React.useEffect(() => {
    if (!session?.user) return;

    const INTERVALO_MS = 30 * 60 * 1000;
    let ultimoRefresco = Date.now();

    const intentarRefresco = () => {
      if (Date.now() - ultimoRefresco < INTERVALO_MS) return;
      ultimoRefresco = Date.now();
      void renovarSesionSilenciosa();
    };

    const interval = setInterval(intentarRefresco, 5 * 60 * 1000);
    const onFocus = () => intentarRefresco();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [session?.user]);

  // Pantalla de carga / verificación estética de alto nivel
  if (isLoading) {
    return (
      <div className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8">
        {/* Resplandor ambiental institucional en el fondo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="bg-primary/4 dark:bg-primary/15 size-96 rounded-full blur-3xl" />
          <div className="bg-primary/2 size-64 rounded-full blur-2xl" />
        </div>

        {/* Contenedor central de verificación sin bordes toscos */}
        <div className="animate-in fade-in zoom-in-95 relative z-10 mx-auto flex w-full max-w-sm flex-col items-center p-6 text-center duration-200">
          {/* Emblema oficial de la institución */}
          <div className="relative mb-5 flex size-20 items-center justify-center">
            <Image
              src={siteConfig.branding.logo}
              alt={siteConfig.institution.shortName}
              width={64}
              height={64}
              priority
              className="object-contain drop-shadow-sm"
            />
          </div>

          {/* Insignia cápsula */}
          <div className="border-primary/20 bg-primary/10 text-primary mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-widest uppercase">
            <span className="bg-primary size-1.5 animate-pulse rounded-full" />
            <span>{siteConfig.institution.badge}</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-foreground text-lg font-extrabold tracking-tight">
              {siteConfig.shortName}
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Validando credenciales y permisos de acceso al sistema...
            </p>
          </div>

          {/* Barra de progreso con avance dinámico real */}
          <AdvancingProgressBar />

          <div className="text-muted-foreground/80 inline-flex items-center gap-1.5 text-xs font-medium">
            <HugeiconsIcon icon={ShieldCheckIcon} className="text-primary size-3.5" />
            <span>Conexión segura</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !session?.user) {
    return (
      <div className="bg-background relative flex min-h-screen w-full items-center justify-center px-4">
        <div className="animate-in fade-in flex flex-col items-center gap-3 text-center duration-200">
          <div className="bg-primary size-1.5 animate-pulse rounded-full" />
          <p className="text-muted-foreground text-xs font-medium">
            Redirigiendo al inicio de sesión institucional...
          </p>
        </div>
      </div>
    );
  }

  // Si requiere cambio obligatorio de contraseña y aún no redirigió
  if (
    session.user.mustChangePassword &&
    !session.user.impersonatedBy &&
    pathname !== "/change-password"
  ) {
    return (
      <div className="bg-background relative flex min-h-screen w-full items-center justify-center px-4">
        <div className="animate-in fade-in flex flex-col items-center gap-3 text-center duration-200">
          <div className="bg-primary size-1.5 animate-pulse rounded-full" />
          <p className="text-muted-foreground text-xs font-medium">
            Redirigiendo a cambio de contraseña obligatorio...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
