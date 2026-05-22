import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "#5b6ab8",
          borderRadius: 8,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#faf8ff",
            fontFamily: "Georgia, serif",
            marginTop: -2,
          }}
        >
          T
        </span>
      </div>
    ),
    { ...size },
  );
}
