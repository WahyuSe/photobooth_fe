"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pressed, setPressed] = useState(false);

  const handleStartSession = async () => {
    if (isStarting) return;
    setIsStarting(true);
    setErrorMsg("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/sessions/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gridType: null }),
        },
      );
      const data = await res.json();

      if (data.success && data.data) {
        const session = data.data;
        localStorage.setItem("pb_session_id", session.id);
        localStorage.setItem("pb_session_expires", session.expiresAt);
        router.push("/select-grid");
      } else {
        setErrorMsg(data.message || "Gagal memulai sesi. Coba lagi.");
        setIsStarting(false);
      }
    } catch (err) {
      console.error("Start error", err);
      setErrorMsg("Koneksi ke server gagal.");
      setIsStarting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0a0a0f",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Ambient glow background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 78% 50%, rgba(189,0,255,0.10) 0%, transparent 45%), radial-gradient(circle at 15% 80%, rgba(0,224,255,0.05) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1600,
          margin: "0 auto",
          padding: "0 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: 40,
        }}
        className="nb-hero-grid"
      >
        {/* LEFT COLUMN */}
        <div style={{ maxWidth: 540 }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(189,0,255,0.4)",
              background: "rgba(189,0,255,0.08)",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: "#d9a3ff",
                textTransform: "uppercase",
                lineHeight: 1.5,
              }}
            >
              Live Event
              <br />
              Active
            </span>
          </div>

          <h1
            style={{
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.15,
              margin: "0 0 24px",
              color: "#f1f0f5",
            }}
          >
            Selamat Datang di
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #e9a3ff 0%, #a3c9ff 60%, #9fe8ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NeonBooth PRO
            </span>
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: "#9099ab",
              margin: "0 0 36px",
              maxWidth: 480,
            }}
          >
            Klik tombol di bawah untuk mulai sesi foto seru kamu! Abadikan momen
            terbaik dengan filter neon eksklusif dan cetak hasilnya secara
            instan.
          </p>

          {errorMsg && (
            <div
              style={{
                color: "#f87171",
                marginBottom: 20,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {errorMsg}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {[
                "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=faces",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #0a0a0f",
                    marginLeft: i === 0 ? 0 : -12,
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                />
              ))}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#1c1c26",
                  border: "2px solid #0a0a0f",
                  marginLeft: -12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#cfd3da",
                }}
              >
                +50
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1,
                color: "#6b7280",
                textTransform: "uppercase",
              }}
            >
              Telah digunakan di sesi ini
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN — interactive start circle */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 520,
          }}
        >
          {/* small camera icon top-right */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 40,
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#15151d",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CameraIcon color="#5fd9e8" />
          </div>

          {/* small left dot icon */}
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "46%",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#15151d",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#3a3a46",
              }}
            />
          </div>

          {/* small flower/settings icon bottom-left */}
          <div
            style={{
              position: "absolute",
              left: 36,
              top: "60%",
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#15151d",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FlowerIcon color="#bd00ff" />
          </div>

          {/* outer ring */}
          <div
            style={{
              width: 340,
              height: 340,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* main button */}
            <button
              onClick={handleStartSession}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              onMouseLeave={() => setPressed(false)}
              disabled={isStarting}
              style={{
                width: 260,
                height: 260,
                borderRadius: "50%",
                border: "none",
                cursor: isStarting ? "default" : "pointer",
                background:
                  "radial-gradient(circle at 35% 30%, #f3c9ff 0%, #c9b8ff 35%, #a9d7f7 65%, #9fe8ff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: pressed
                  ? "0 0 40px rgba(189,0,255,0.5), inset 0 0 30px rgba(255,255,255,0.3)"
                  : "0 0 70px rgba(189,0,255,0.45), 0 0 120px rgba(0,224,255,0.15)",
                transform: pressed ? "scale(0.97)" : "scale(1)",
                transition: "transform 0.15s ease, box-shadow 0.2s ease",
              }}
            >
              {isStarting ? (
                <span
                  style={{
                    width: 36,
                    height: 36,
                    border: "4px solid rgba(123,0,204,0.25)",
                    borderTopColor: "#7b00cc",
                    borderRadius: "50%",
                    animation: "nb-spin 0.8s linear infinite",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: 3,
                    color: "#5a1d8f",
                  }}
                >
                  MULAI
                </span>
              )}
            </button>
          </div>

          <span
            style={{
              marginTop: 28,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#5b6270",
              textTransform: "uppercase",
            }}
          >
            {isStarting
              ? "Menyiapkan sesi..."
              : "Sentuh untuk memulai pengalaman"}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes nb-spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .nb-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </main>
  );
}

function CameraIcon({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function FlowerIcon({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6M12 17v6M4.2 4.2l4.2 4.2M15.5 15.5l4.3 4.3M1 12h6M17 12h6M4.2 19.8l4.2-4.2M15.5 8.5l4.3-4.3" />
    </svg>
  );
}
