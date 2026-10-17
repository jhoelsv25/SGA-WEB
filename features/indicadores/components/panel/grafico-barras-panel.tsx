"use client";

import type { ResumenSesionesHoyDto, IndicadoresBimestreActualDto } from "../../types";

export interface GraficoBarrasPanelProps {
  sesionesHoy: ResumenSesionesHoyDto;
  indicadoresBimestreActual: IndicadoresBimestreActualDto;
  className?: string;
}

/**
 * Gráfico de barras vectorial implementado exclusivamente en SVG nativo para el panel directivo.
 * Presenta dos secciones analíticas:
 * 1. Distribución de sesiones programadas para hoy según su estado operativo.
 * 2. Avance porcentual de los tres indicadores de la tesis en el bimestre actual.
 */
export function GraficoBarrasPanel({
  sesionesHoy,
  indicadoresBimestreActual,
  className = "",
}: GraficoBarrasPanelProps) {
  // Configuración de Sesiones
  const totalSesiones = sesionesHoy.totalSesiones;
  const itemsSesiones = [
    { label: "Cumplidas", valor: sesionesHoy.cumplidas, color: "#059669", colorDark: "#10B981" },
    { label: "En curso", valor: sesionesHoy.enCurso, color: "#D97706", colorDark: "#F59E0B" },
    { label: "Pendientes", valor: sesionesHoy.pendientes, color: "#0284C7", colorDark: "#38BDF8" },
    {
      label: "No cumplidas",
      valor: sesionesHoy.noCumplidas,
      color: "#E11D48",
      colorDark: "#FB7185",
    },
    {
      label: "Justificadas",
      valor: sesionesHoy.justificadas,
      color: "#7C3AED",
      colorDark: "#A78BFA",
    },
  ];

  // Configuración de Indicadores Bimestre
  const itemsIndicadores = [
    {
      codigo: "CSP",
      nombre: "Sesiones",
      valor: indicadoresBimestreActual.cspPorcentaje,
      color: "#7A1228",
      colorDark: "#A32035",
    },
    {
      codigo: "ISA",
      nombre: "Libretas",
      valor: indicadoresBimestreActual.isaPorcentaje,
      color: "#1E3A8A",
      colorDark: "#3B82F6",
    },
    {
      codigo: "IGM",
      nombre: "Materiales",
      valor: indicadoresBimestreActual.igmPorcentaje,
      color: "#0F766E",
      colorDark: "#14B8A6",
    },
  ];

  const maxSesion = Math.max(1, ...itemsSesiones.map((s) => s.valor));

  return (
    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2 ${className}`}>
      {/* 1. Gráfico SVG: Sesiones del día por estado */}
      <div className="border-border/60 bg-card rounded-2xl border p-5 shadow-xs">
        <div className="mb-4">
          <h3 className="text-foreground text-sm font-semibold sm:text-base">
            Sesiones de hoy por estado
          </h3>
          <p className="text-muted-foreground text-xs">
            {totalSesiones > 0
              ? `${totalSesiones} sesion${totalSesiones > 1 ? "es" : ""} programada${totalSesiones > 1 ? "s" : ""} en la jornada`
              : "No hay sesiones programadas en la fecha actual"}
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox="0 0 420 180"
            className="h-auto w-full min-w-[340px]"
            role="img"
            aria-labelledby="titulo-grafico-sesiones"
          >
            <title id="titulo-grafico-sesiones">Gráfico de sesiones de hoy por estado</title>
            <desc>
              Distribución de sesiones de hoy: cumplidas, en curso, pendientes, no cumplidas y
              justificadas.
            </desc>

            {/* Líneas guía horizontales */}
            {[0, 0.5, 1].map((frac, idx) => {
              const y = 140 - frac * 110;
              return (
                <line
                  key={`linea-ses-${idx}`}
                  x1="30"
                  y1={y}
                  x2="410"
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.12}
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* Barras verticales para cada estado */}
            {itemsSesiones.map((item, index) => {
              const xCentro = 70 + index * 70;
              const alturaBarra = totalSesiones > 0 ? (item.valor / maxSesion) * 110 : 0;
              const yBarra = 140 - alturaBarra;

              return (
                <g
                  key={item.label}
                  tabIndex={0}
                  role="graphics-symbol"
                  aria-label={`${item.label}: ${item.valor}`}
                >
                  {/* Barra */}
                  <rect
                    x={xCentro - 18}
                    y={yBarra}
                    width={36}
                    height={Math.max(2, alturaBarra)}
                    rx={4}
                    fill={item.color}
                    className="transition-all duration-300"
                  />

                  {/* Valor numérico encima de la barra */}
                  <text
                    x={xCentro}
                    y={yBarra - 6}
                    textAnchor="middle"
                    className="fill-foreground text-[11px] font-bold"
                  >
                    {item.valor}
                  </text>

                  {/* Etiqueta inferior */}
                  <text
                    x={xCentro}
                    y={156}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px] font-medium"
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. Gráfico SVG: Indicadores de la tesis (Bimestre en curso) */}
      <div className="border-border/60 bg-card rounded-2xl border p-5 shadow-xs">
        <div className="mb-4">
          <h3 className="text-foreground text-sm font-semibold sm:text-base">
            Indicadores de la tesis (Bimestre actual)
          </h3>
          <p className="text-muted-foreground text-xs">
            {indicadoresBimestreActual.periodoNombre
              ? `${indicadoresBimestreActual.periodoNombre} · Escala porcentual de 0 % a 100 %`
              : "Avance de eficacia institucional de la investigación"}
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox="0 0 420 180"
            className="h-auto w-full min-w-[340px]"
            role="img"
            aria-labelledby="titulo-grafico-indicadores"
          >
            <title id="titulo-grafico-indicadores">Gráfico de indicadores del bimestre</title>
            <desc>Valores porcentuales de CSP, ISA e IGM para el bimestre en curso.</desc>

            {/* Líneas guía horizontales de porcentaje */}
            {[0, 50, 100].map((pct) => {
              const y = 140 - (pct / 100) * 110;
              return (
                <g key={`guia-ind-${pct}`}>
                  <line
                    x1="45"
                    y1={y}
                    x2="410"
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={pct === 100 ? 0.35 : 0.12}
                    strokeDasharray={pct === 100 ? undefined : "3 3"}
                  />
                  <text
                    x="38"
                    y={y + 3}
                    textAnchor="end"
                    className="fill-muted-foreground text-[9px] font-medium"
                  >
                    {pct}%
                  </text>
                </g>
              );
            })}

            {/* Barras verticales para CSP, ISA, IGM */}
            {itemsIndicadores.map((item, index) => {
              const xCentro = 110 + index * 110;
              const pctValor = item.valor ?? 0;
              const alturaBarra =
                item.valor !== null ? (Math.min(100, Math.max(0, pctValor)) / 100) * 110 : 0;
              const yBarra = 140 - alturaBarra;

              return (
                <g
                  key={item.codigo}
                  tabIndex={0}
                  role="graphics-symbol"
                  aria-label={`${item.codigo} (${item.nombre}): ${item.valor !== null ? `${item.valor.toFixed(2)} %` : "Sin datos"}`}
                >
                  {/* Barra */}
                  <rect
                    x={xCentro - 24}
                    y={yBarra}
                    width={48}
                    height={Math.max(2, alturaBarra)}
                    rx={5}
                    fill={item.color}
                    className="transition-all duration-300"
                  />

                  {/* Valor numérico encima de la barra */}
                  <text
                    x={xCentro}
                    y={yBarra - 6}
                    textAnchor="middle"
                    className="fill-foreground text-[11px] font-extrabold"
                  >
                    {item.valor !== null ? `${item.valor.toFixed(1)}%` : "N/D"}
                  </text>

                  {/* Etiqueta inferior */}
                  <text
                    x={xCentro}
                    y={156}
                    textAnchor="middle"
                    className="fill-foreground text-[11px] font-bold"
                  >
                    {item.codigo}
                  </text>
                  <text
                    x={xCentro}
                    y={168}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[9px]"
                  >
                    {item.nombre}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
