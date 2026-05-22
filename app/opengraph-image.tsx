import { ImageResponse } from "next/og";

export const alt = "Trait — Big Five and Dark Triad trait notes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #f4f2f9 0%, #e8e4f4 45%, #d8d2ec 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
            height: 140,
            background: "#5b6ab8",
            borderRadius: 32,
            marginBottom: 36,
          }}
        >
          <span style={{ fontSize: 88, fontWeight: 600, color: "#faf8ff" }}>T</span>
        </div>
        <span
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: "#1e1b2e",
            letterSpacing: "-0.02em",
          }}
        >
          Trait
        </span>
        <span
          style={{
            marginTop: 20,
            fontSize: 32,
            color: "#5c5674",
            maxWidth: 720,
            textAlign: "center",
            lineHeight: 1.35,
          }}
        >
          Big Five &amp; Dark Triad quizzes with plain-language notes
        </span>
      </div>
    ),
    { ...size },
  );
}
