import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terminal Kiosko | ${siteConfig.institution.shortName}`,
  description: "Terminal interactivo de marcación de asistencia y control de acceso institucional.",
};

export default function KioskoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col justify-between overflow-hidden font-sans select-none motion-reduce:animate-none motion-reduce:transition-none">
      {children}
    </div>
  );
}
