/**
 * @file route.tsx
 * @description OG image route (/api/og). Generates the 1200×630 Open Graph image used for social media previews.
 */

import { ImageResponse } from "next/og"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#09090b",
        padding: "60px",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Markdown icon - Font Awesome markdown path */}
      <svg height="80" style={{ marginBottom: "32px" }} viewBox="0 0 640 512" width="80">
        <path
          d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.2-46.2V105.2c-.1-25.4-20.8-46.1-46.3-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"
          fill="#fafafa"
        />
      </svg>

      {/* Satori requires display: "flex" on all elements, including text containers */}
      <div
        style={{
          display: "flex",
          fontSize: "56px",
          fontWeight: "600",
          color: "#fafafa",
          letterSpacing: "-1.5px",
        }}
      >
        Markdown Editor
      </div>

      <div
        style={{
          display: "flex",
          fontSize: "24px",
          color: "#a1a1aa",
          marginTop: "16px",
        }}
      >
        Write and preview markdown documents with ease
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}
