'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    // Polling for pending sessions every 2 seconds
    const interval = setInterval(async () => {
      if (isStarting) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/sessions/pending`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setIsStarting(true);
          const session = data.data;
          
          // Set to ACTIVE
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/sessions/${session.id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ACTIVE' })
          });

          localStorage.setItem('pb_session_id', session.id);
          localStorage.setItem('pb_session_expires', session.expiresAt);
          
          router.push('/select-frame');
        }
      } catch (err) {
        console.error('Polling error', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isStarting, router]);

  return (
    <main className={styles.main}>
      {/* Background particles */}
      <div className={styles.bgParticles} aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={styles.particle} style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>

      <section className={styles.hero} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.heroContent} style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div className={styles.badge} style={{ margin: '0 auto 24px' }}>
            <span>✨</span>
            <span>PhotoBooth Professional</span>
          </div>

          <h1 className={styles.title}>
            Capture Momen
            <br />
            <span className="text-gradient">Terbaik Anda</span>
          </h1>

          <p className={styles.subtitle} style={{ marginTop: '24px', fontSize: '18px' }}>
            Silakan panggil operator untuk memulai sesi Anda. 
            Bersiaplah dengan senyum terbaikmu!
          </p>

          <div style={{ marginTop: '40px' }}>
            {isStarting ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px', borderTopColor: 'var(--pink-hot)' }} />
                <p style={{ color: 'var(--pink-light)', fontWeight: 600 }}>Menyiapkan kamera...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '24px', animation: 'pulse 2s infinite' }}>⏳</span>
                <span style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '1px' }}>MENUNGGU OPERATOR</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
