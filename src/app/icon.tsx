import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

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
          background: "#C44536",
          color: "white",
          fontSize: 168,
          fontWeight: 800,
          letterSpacing: -8,
          fontFamily: "system-ui",
        }}
      >
        D2DK
      </div>
    ),
    { ...size },
  );
}
