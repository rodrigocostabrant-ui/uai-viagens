import { ImageResponse } from "next/og";
import { brandMarkDataUri, INK } from "./brand";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Marca vetorizada a partir do print do Instagram; trocar pelo logo oficial quando chegar.
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
          backgroundColor: INK,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brandMarkDataUri()} width={28} height={16} alt="" />
      </div>
    ),
    { ...size },
  );
}
