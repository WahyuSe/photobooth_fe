'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Disable SSR for webcam component
const BoothClient = dynamic(() => import('@/components/Booth/BoothClient'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a14] text-[#a0a0c0] gap-4">
      <div className="text-[48px]">📸</div>
      <p>Memuat PhotoBooth...</p>
    </div>
  ),
});

import SessionTimer from '@/components/Session/SessionTimer';

export default function BoothPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const id = localStorage.getItem('pb_session_id');
    const expires = localStorage.getItem('pb_session_expires');

    // Jika tidak ada data sesi lokal
    if (!id || !expires) {
      window.location.replace('/');
      return;
    }

    // 1. Cek kedaluwarsa waktu lokal terlebih dahulu
    const now = new Date().getTime();
    const end = new Date(expires).getTime();
    if (end <= now) {
      localStorage.removeItem('pb_session_id');
      localStorage.removeItem('pb_session_expires');
      window.location.replace('/');
      return;
    }

    // 2. Verifikasi langsung ke database backend apakah sesi benar-benar AKTIF
    const verifyWithBackend = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${id}/heartbeat`, {
          method: 'POST',
        });
        const data = await res.json();

        if (data.success && data.active) {
          // Sesi valid di database
          setHasSession(true);
        } else {
          // Sesi sudah dibatalkan/diakhiri di database
          localStorage.removeItem('pb_session_id');
          localStorage.removeItem('pb_session_expires');
          window.location.replace('/');
        }
      } catch (err) {
        // Jika server backend tidak terjangkau (offline), fallback ke status lokal
        console.warn('Gagal verifikasi sesi ke server, menggunakan fallback lokal', err);
        setHasSession(true);
      }
    };

    verifyWithBackend();
  }, []);

  // Saat SSR (di server) dan saat rendering pertama di browser (sebelum useEffect berjalan):
  // Kita merender kerangka loading statis agar HTML server dan client COCOK 100%.
  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a14] text-[#a0a0c0] gap-4">
        <div className="text-[48px]">📸</div>
        <p>Memverifikasi sesi...</p>
      </div>
    );
  }

  // Setelah mount, jika verifikasi belum selesai atau gagal
  if (!hasSession) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a14] text-[#a0a0c0] gap-4">
        <div className="text-[48px]">📸</div>
        <p>Memverifikasi sesi...</p>
      </div>
    );
  }

  return (
    <>
      <SessionTimer />
      <BoothClient />
    </>
  );
}
