import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { person } from "@/resources";

export const runtime = "nodejs";

/** Matches `--scheme-brand-600` in `src/resources/custom.css`. */
const ACCENT = "#d9772e";

let cachedAvatarDataUrl: string | null | undefined;

function getAvatarDataUrl(): string | null {
  if (cachedAvatarDataUrl !== undefined) {
    return cachedAvatarDataUrl;
  }
  try {
    const rel = person.avatar.replace(/^\//, "");
    const full = path.join(process.cwd(), "public", rel);
    if (!fs.existsSync(full)) {
      cachedAvatarDataUrl = null;
      return null;
    }
    const buf = fs.readFileSync(full);
    const ext = path.extname(rel).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    cachedAvatarDataUrl = `data:${mime};base64,${buf.toString("base64")}`;
    return cachedAvatarDataUrl;
  } catch {
    cachedAvatarDataUrl = null;
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Portfolio";
  const avatarSrc = getAvatarDataUrl();

  // No custom fonts: avoids slow network fetches to Google Fonts on every OG request.
  // Avatar is read from /public once and cached in memory.
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        padding: "6rem",
        paddingTop: "7.5rem",
        background:
          "linear-gradient(148deg, #181512 0%, #0f0e0c 48%, #1a1510 100%)",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "10px",
          background: ACCENT,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "4rem",
          fontStyle: "normal",
          color: "white",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <span
            style={{
              padding: "1rem",
              paddingLeft: 0,
              fontSize: "6rem",
              lineHeight: "7rem",
              letterSpacing: "-0.03em",
              whiteSpace: "wrap",
              textWrap: "balance",
              overflow: "hidden",
            }}
          >
            {title}
          </span>
          <div
            style={{
              width: "10rem",
              height: "6px",
              borderRadius: "3px",
              background: ACCENT,
              opacity: 0.95,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5rem",
          }}
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt=""
              style={{
                width: "12rem",
                height: "12rem",
                objectFit: "cover",
                borderRadius: "100%",
                border: `5px solid ${ACCENT}`,
              }}
            />
          ) : null}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "4.5rem",
                lineHeight: "4.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
              }}
            >
              {person.name}
            </span>
            <span
              style={{
                fontSize: "2.5rem",
                lineHeight: "2.5rem",
                whiteSpace: "pre-wrap",
                textWrap: "balance",
                opacity: "0.62",
              }}
            >
              {person.role}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1280,
      height: 720,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
