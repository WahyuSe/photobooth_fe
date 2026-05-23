'use client';

import dynamic from 'next/dynamic';

const EditorClient = dynamic(() => import('@/components/Editor/EditorClient'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#0a0a14', color: '#a0a0c0', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>🎨</div>
      <p>Memuat Editor...</p>
    </div>
  ),
});

import SessionTimer from '@/components/Session/SessionTimer';

export default function EditorPage() {
  return (
    <>
      <SessionTimer />
      <EditorClient />
    </>
  );
}
