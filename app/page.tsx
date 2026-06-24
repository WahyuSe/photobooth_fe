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
    <main className="min-h-screen w-full bg-[#0a0a0f] relative overflow-hidden flex items-center font-sans">
      {/* Ambient glow background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 78% 50%, rgba(189,0,255,0.10) 0%, transparent 45%), radial-gradient(circle at 15% 80%, rgba(0,224,255,0.05) 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10 text-center md:text-left py-10 md:py-0">
        {/* LEFT COLUMN */}
        <div className="max-w-135 mx-auto md:mx-0">
          {/* <div className="inline-block px-4.5 py-2 rounded-full border border-[#bd00ff66] bg-[#bd00ff14] mb-7">
            <span className="text-[11px] font-extrabold tracking-[1.5px] text-[#d9a3ff] uppercase leading-relaxed">
              Live Event
              <br />
              Active
            </span>
          </div> */}

          <h1 className="text-4xl md:text-[52px] font-extrabold leading-[1.15] mb-6 text-[#f1f0f5]">
            Selamat Datang di
            <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-[#e9a3ff] via-[#a3c9ff] to-[#9fe8ff]">
              Photobooth
            </span>
          </h1>

          <p className="text-[17px] leading-[1.7] text-[#9099ab] mb-9 max-w-120 mx-auto md:mx-0">
            Klik tombol di bawah untuk mulai sesi foto seru kamu! Abadikan momen
            terbaik dengan filter neon eksklusif dan cetak hasilnya secara
            instan.
          </p>

          {errorMsg && (
            <div className="text-red-400 mb-5 font-semibold text-sm">
              {errorMsg}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — interactive start circle */}
        <div className="relative flex flex-col items-center justify-center min-h-100 md:min-h-130 mt-8 md:mt-0">
          {/* small camera icon top-right */}
          <div className="absolute top-5 right-10 w-13 h-13 rounded-2xl bg-[#15151d] border border-white/5 items-center justify-center hidden md:flex">
            <CameraIcon color="#5fd9e8" />
          </div>

          {/* small left dot icon */}
          <div className="absolute -left-2 top-[46%] w-11 h-11 rounded-xl bg-[#15151d] border border-white/5 items-center justify-center hidden md:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a46]" />
          </div>

          {/* small flower/settings icon bottom-left */}
          <div className="absolute left-9 top-[60%] w-12 h-12 rounded-2xl bg-[#15151d] border border-white/5 items-center justify-center hidden md:flex">
            <FlowerIcon color="#bd00ff" />
          </div>

          {/* outer ring */}
          <div className="w-70 h-70 md:w-85 md:h-85 rounded-full border border-white/10 flex items-center justify-center relative">
            {/* main button */}
            <button
              onClick={handleStartSession}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              onMouseLeave={() => setPressed(false)}
              disabled={isStarting}
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #f3c9ff 0%, #c9b8ff 35%, #a9d7f7 65%, #9fe8ff 100%)",
              }}
              className={`w-55 h-55 md:w-65 md:h-65 rounded-full flex items-center justify-center transition-all duration-150 ease-out border-none ${
                isStarting ? "cursor-default" : "cursor-pointer"
              } ${
                pressed
                  ? "scale-[0.97] shadow-[0_0_40px_rgba(189,0,255,0.5),inset_0_0_30px_rgba(255,255,255,0.3)]"
                  : "scale-100 shadow-[0_0_70px_rgba(189,0,255,0.45),0_0_120px_rgba(0,224,255,0.15)]"
              }`}
            >
              {isStarting ? (
                <span className="w-9 h-9 border-4 border-[#7b00cc40] border-t-[#7b00cc] rounded-full animate-spin" />
              ) : (
                <span className="text-[22px] font-extrabold tracking-[3px] text-[#5a1d8f]">
                  MULAI
                </span>
              )}
            </button>
          </div>

          <span className="mt-7 text-xs font-bold tracking-[2px] text-[#5b6270] uppercase">
            {isStarting
              ? "Menyiapkan sesi..."
              : "Sentuh untuk memulai pengalaman"}
          </span>
        </div>
      </div>
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
