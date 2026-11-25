export interface EstiloCursoPaleta {
  gradient: string;
  accent: string;
}

/**
 * Paletas inspiradas en Google Classroom según área curricular o nombre de materia.
 */
export const PALETAS_AREA: Record<string, EstiloCursoPaleta> = {
  matematica: {
    gradient: "from-blue-600 via-indigo-700 to-slate-900",
    accent: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },
  comunicacion: {
    gradient: "from-rose-600 via-red-700 to-neutral-900",
    accent: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  },
  quechua: {
    gradient: "from-amber-500 via-orange-600 to-stone-900",
    accent: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  },
  ingles: {
    gradient: "from-purple-600 via-violet-800 to-slate-900",
    accent: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  },
  arte_cultura: {
    gradient: "from-fuchsia-600 via-purple-700 to-indigo-950",
    accent: "bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300",
  },
  ciencias_sociales: {
    gradient: "from-amber-600 via-orange-700 to-stone-900",
    accent: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  },
  ciencia_tecnologia: {
    gradient: "from-emerald-600 via-teal-700 to-slate-900",
    accent: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  educacion_fisica: {
    gradient: "from-cyan-600 via-teal-700 to-slate-900",
    accent: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
  },
  educacion_religiosa: {
    gradient: "from-sky-600 via-blue-800 to-slate-900",
    accent: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  },
  educacion_trabajo: {
    gradient: "from-yellow-600 via-amber-700 to-neutral-900",
    accent: "bg-yellow-50 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300",
  },
  desarrollo_personal: {
    gradient: "from-teal-600 via-emerald-700 to-slate-900",
    accent: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
  },
  tutoría: {
    gradient: "from-indigo-600 via-purple-700 to-slate-900",
    accent: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  },
};

export const ESTILO_CURSO_DEFAULT: EstiloCursoPaleta = {
  gradient: "from-slate-700 via-slate-800 to-zinc-900",
  accent: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
};
