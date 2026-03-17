import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1A1612",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="10" y1="6" x2="10" y2="22"
            stroke="#ebda28" strokeWidth="3" strokeLinecap="round"
          />
          <line
            x1="10" y1="22" x2="24" y2="22"
            stroke="#ebda28" strokeWidth="3" strokeLinecap="round"
          />
          <circle cx="10" cy="22" r="2.8" fill="#ebda28" />
          <circle cx="24" cy="22" r="1.6" fill="#ebda28" opacity="0.55" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
