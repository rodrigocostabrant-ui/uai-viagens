import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Monograma provisorio ate o logo oficial da UAI Viagens chegar em alta
// resolucao (ver CLAUDE.md > Identidade visual).
export default function Icon() {
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
          fontSize: 20,
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
