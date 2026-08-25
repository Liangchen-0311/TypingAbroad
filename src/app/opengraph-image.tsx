import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = `${SITE_NAME} — English typing practice`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "64px 72px",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0b0a08",
        color: "#f4f1ea",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", fontSize: 32, fontWeight: 700 }}>
        <span style={{ color: "#d5a323", marginRight: 10 }}>T/</span>
        <span>{SITE_NAME}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
        <div style={{ color: "#d5a323", fontSize: 24, letterSpacing: 2, marginBottom: 24 }}>
          IELTS · TOEFL · ACADEMIC ENGLISH
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>
          {SITE_TAGLINE}
        </div>
      </div>
      <div style={{ color: "#9c978d", fontSize: 25 }}>typeabroad.com</div>
    </div>,
    size,
  );
}
