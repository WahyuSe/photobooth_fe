'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SessionTimer.module.css';
import { useToast } from '@/hooks/useToast';

export default function SessionTimer() {
  const router = useRouter();
  const { addToast } = useToast();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const endSession = useCallback((message: string = 'Sesi Anda telah berakhir') => {
    localStorage.removeItem('pb_session_id');
    localStorage.removeItem('pb_session_expires');
    addToast('error', message);
    router.replace('/');
  }, [addToast, router]);

  useEffect(() => {
    const id = localStorage.getItem('pb_session_id');
    const expires = localStorage.getItem('pb_session_expires');

    if (!id || !expires) {
      endSession('Silakan mulai sesi dari halaman utama');
      return;
    }

    setSessionId(id);

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(expires).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      
      setTimeLeft(diff);

      if (diff <= 0) {
        endSession();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endSession]);

  // Heartbeat to backend every 30 seconds
  useEffect(() => {
    if (!sessionId) return;

    const ping = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${sessionId}/heartbeat`, {
          method: 'POST',
        });
        const data = await res.json();
        if (!data.success || !data.active) {
          endSession(data.message || 'Sesi telah diakhiri oleh admin');
        }
      } catch (err) {
        console.error('Heartbeat failed', err);
      }
    };

    const pingInterval = setInterval(ping, 30000);
    return () => clearInterval(pingInterval);
  }, [sessionId, endSession]);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 60; // Merah jika sisa <= 1 menit

  return (
    <div className={`${styles.timer} ${isWarning ? styles.warning : ''}`}>
      <span>⏳</span>
      <span>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
