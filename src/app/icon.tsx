import { ImageResponse } from "next/og";

/** Matches `--scheme-brand-600` / `--scheme-accent-600` in `custom.css`. */
const ACCENT = "#d9772e";
const CANVAS = "#161412";

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
          background: CANVAS,
          borderRadius: "7px",
        }}
      >
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "3px",
            background: ACCENT,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
