"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SelectGridPage() {
  const router = useRouter();
  const [selectedGrid, setSelectedGrid] = useState<
    "grid2x3" | "grid2x4" | null
  >(null);

  useEffect(() => {
    // Check if session exists
    const sessionId = localStorage.getItem("pb_session_id");
    if (!sessionId) {
      router.push("/");
    }
  }, [router]);

  const handleNext = () => {
    if (selectedGrid) {
      localStorage.setItem("pb_layout", selectedGrid);
      // In a real scenario we could also update the backend session here with gridType
      router.push("/booth");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] p-6 md:p-10 items-center justify-center font-sans text-[#f1f0f5]">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-[32px] font-extrabold mb-2">
          Pilih Layout Foto! 📐
        </h1>
        <p className="text-[#9099ab] text-base">
          Pilih jumlah foto yang ingin kamu ambil.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Grid 2x3 Option */}
        <div
          onClick={() => setSelectedGrid("grid2x3")}
          className={`cursor-pointer bg-[#15151d] p-6 rounded-2xl transition-all duration-300 ${
            selectedGrid === "grid2x3"
              ? "border-4 border-[#bd00ff] scale-105 shadow-[0_0_30px_rgba(189,0,255,0.2)]"
              : "border-4 border-transparent scale-100 hover:border-white/10"
          }`}
        >
          <div className="w-37.5 h-56.25 bg-[#0d0d14] flex flex-wrap gap-1 p-1 rounded-md border border-white/5 mx-auto">
            {/* 3 Photos layout mock (left side 3, right side mirrored) */}
            <div className="w-full h-full flex gap-1">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
              </div>
            </div>
          </div>
          <h3 className="text-center mt-5 font-bold text-lg">
            Grid 2x3
            <br />
            <span className="text-sm font-normal text-[#9099ab] mt-1 block">
              (3 Foto, Kiri Kanan Sama)
            </span>
          </h3>
        </div>

        {/* Grid 2x4 Option */}
        <div
          onClick={() => setSelectedGrid("grid2x4")}
          className={`cursor-pointer bg-[#15151d] p-6 rounded-2xl transition-all duration-300 ${
            selectedGrid === "grid2x4"
              ? "border-4 border-[#bd00ff] scale-105 shadow-[0_0_30px_rgba(189,0,255,0.2)]"
              : "border-4 border-transparent scale-100 hover:border-white/10"
          }`}
        >
          <div className="w-37.5 h-56.25 bg-[#0d0d14] flex flex-wrap gap-1 p-1 rounded-md border border-white/5 mx-auto">
            {/* 4 Photos layout mock (left side 4, right side mirrored) */}
            <div className="w-full h-full flex gap-1">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
                <div className="flex-1 bg-[#2a2a35] rounded-sm" />
              </div>
            </div>
          </div>
          <h3 className="text-center mt-5 font-bold text-lg">
            Grid 2x4
            <br />
            <span className="text-sm font-normal text-[#9099ab] mt-1 block">
              (4 Foto, Kiri Kanan Sama)
            </span>
          </h3>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleNext}
          disabled={!selectedGrid}
          className={`px-10 py-4 text-lg md:text-[20px] rounded-full font-bold transition-all duration-300 ${
            selectedGrid
              ? "bg-linear-to-r from-[#bd00ff] to-[#7b00cc] text-white hover:scale-105 shadow-[0_0_24px_rgba(189,0,255,0.4)] cursor-pointer"
              : "bg-[#1c1c26] text-[#5b6270] cursor-not-allowed border border-white/5"
          }`}
        >
          Lanjut ke Kamera 📸
        </button>
      </div>
    </div>
  );
}
