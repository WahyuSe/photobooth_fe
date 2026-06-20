'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SelectGridPage() {
  const router = useRouter();
  const [selectedGrid, setSelectedGrid] = useState<'grid2x3' | 'grid2x4' | null>(null);

  useEffect(() => {
    // Check if session exists
    const sessionId = localStorage.getItem('pb_session_id');
    if (!sessionId) {
      router.push('/');
    }
  }, [router]);

  const handleNext = () => {
    if (selectedGrid) {
      localStorage.setItem('pb_layout', selectedGrid);
      // In a real scenario we could also update the backend session here with gridType
      router.push('/booth');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Pilih Layout Foto! 📐</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Pilih jumlah foto yang ingin kamu ambil.</p>
      </div>

      <div style={{ display: 'flex', gap: '32px', marginBottom: '60px' }}>
        {/* Grid 2x3 Option */}
        <div 
          onClick={() => setSelectedGrid('grid2x3')}
          style={{ 
            cursor: 'pointer',
            border: selectedGrid === 'grid2x3' ? '4px solid var(--pink-hot)' : '4px solid transparent',
            background: 'var(--bg-secondary)',
            padding: '24px',
            borderRadius: '16px',
            transition: 'all 0.3s',
            transform: selectedGrid === 'grid2x3' ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <div style={{ width: '150px', height: '225px', background: '#333', display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '4px' }}>
             {/* 3 Photos layout mock (left side 3, right side mirrored) */}
             <div style={{ width: '100%', height: '100%', display: 'flex', gap: '4px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                </div>
             </div>
          </div>
          <h3 style={{ textAlign: 'center', marginTop: '16px' }}>Grid 2x3<br/><small style={{fontSize:'14px', color:'var(--text-secondary)'}}>(3 Foto, Kiri Kanan Sama)</small></h3>
        </div>

        {/* Grid 2x4 Option */}
        <div 
          onClick={() => setSelectedGrid('grid2x4')}
          style={{ 
            cursor: 'pointer',
            border: selectedGrid === 'grid2x4' ? '4px solid var(--pink-hot)' : '4px solid transparent',
            background: 'var(--bg-secondary)',
            padding: '24px',
            borderRadius: '16px',
            transition: 'all 0.3s',
            transform: selectedGrid === 'grid2x4' ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <div style={{ width: '150px', height: '225px', background: '#333', display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '4px' }}>
             {/* 4 Photos layout mock (left side 4, right side mirrored) */}
             <div style={{ width: '100%', height: '100%', display: 'flex', gap: '4px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                  <div style={{ flex: 1, background: '#666' }} />
                </div>
             </div>
          </div>
          <h3 style={{ textAlign: 'center', marginTop: '16px' }}>Grid 2x4<br/><small style={{fontSize:'14px', color:'var(--text-secondary)'}}>(4 Foto, Kiri Kanan Sama)</small></h3>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn btn-primary btn-lg" 
          onClick={handleNext} 
          disabled={!selectedGrid}
          style={{ padding: '16px 40px', fontSize: '20px', borderRadius: '40px' }}
        >
          Lanjut ke Kamera 📸
        </button>
      </div>
    </div>
  );
}
