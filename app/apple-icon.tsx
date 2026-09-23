import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Monograma provisorio ate o logo oficial da UAI Viagens chegar em alta
// resolucao (ver CLAUDE.md > Identidade visual).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#c41e2a",
          color: "#ffffff",
          fontSize: 96,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        U
      </div>
    ),
    { ...size }
  );
}
