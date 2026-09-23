import { ImageResponse } from "next/og";
import { site, tituloHeroTexto } from "@/content/site";
import { brandMarkDataUri, INK, PAPER } from "./brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: INK,
          color: PAPER,
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brandMarkDataUri()} width={176} height={100} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: "#d9d9dc" }}>
            <div style={{ width: 48, height: 1, background: "#a8a8ad", marginRight: 18 }} />
            {site.hero.rotulo}
          </div>
          <div style={{ fontSize: 72, fontWeight: 600, marginTop: 28, lineHeight: 1.02, maxWidth: 980 }}>
            {tituloHeroTexto}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
