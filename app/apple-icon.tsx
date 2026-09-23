import { ImageResponse } from "next/og";
import { brandMarkDataUri, INK } from "./brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          backgroundColor: INK,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brandMarkDataUri()} width={132} height={75} alt="" />
      </div>
    ),
    { ...size },
  );
}
