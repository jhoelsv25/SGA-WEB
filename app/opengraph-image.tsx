import { ImageResponse } from "next/og";
import { siteConfig } from "@/config";

export const alt = `Intranet Educativa · ${siteConfig.institution.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: "linear-gradient(135deg, #4c0519 0%, #881337 55%, #5b0c24 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 20px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.22)",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <span>{siteConfig.institution.badge}</span>
        </div>

        <div
          style={{
            display: "flex",
            padding: "8px 18px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.16)",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.06em",
          }}
        >
          {siteConfig.acronym} · SECUNDARIA
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "960px" }}>
        <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.1 }}>
          Intranet Educativa y Gestión Académica
        </div>
        <div style={{ fontSize: 26, color: "rgba(255,255,255,0.86)", lineHeight: 1.4 }}>
          {`${siteConfig.institution.name} · ${siteConfig.institution.administration.ugel}, ${siteConfig.institution.administration.dre}`}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.22)",
          paddingTop: "24px",
          fontSize: 20,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <span>Asistencia</span>
          <span>·</span>
          <span>Sesiones de clase</span>
          <span>·</span>
          <span>Aula virtual</span>
          <span>·</span>
          <span>Libretas SIAGIE</span>
        </div>
        <div style={{ fontWeight: 600 }}>{siteConfig.institution.location.reference}</div>
      </div>
    </div>,
    { ...size },
  );
}
