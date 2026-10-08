import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminal Kiosko | SGA Colegio",
  description: "Pantalla interactiva de marcación de asistencia y firma de sesiones.",
};

export default function KioskoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col justify-between overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {children}
    </div>
  );
}
