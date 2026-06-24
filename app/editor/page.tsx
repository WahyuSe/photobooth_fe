'use client';

import dynamic from 'next/dynamic';
import SessionTimer from '@/components/Session/SessionTimer';

const EditorClient = dynamic(() => import('@/components/Editor/EditorClient'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a14] text-[#a0a0c0] gap-4">
      <div className="text-[48px]">🎨</div>
      <p>Memuat Editor...</p>
    </div>
  ),
});

export default function EditorPage() {
  return (
    <>
      <SessionTimer />
      <EditorClient />
    </>
  );
}
