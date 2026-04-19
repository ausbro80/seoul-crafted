import { ImageResponse } from "next/og";

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
          background: "#C44536",
          color: "white",
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: -2,
          fontFamily: "system-ui",
        }}
      >
        D2DK
      </div>
    ),
    { ...size },
  );
}
