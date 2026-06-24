'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Template } from '@/lib/templates';
import TemplatePicker from '@/components/Editor/TemplatePicker';

export default function SelectFramePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    // Session check
    const sessionId = localStorage.getItem('pb_session_id');
    if (!sessionId) {
      router.push('/');
      return;
    }

    // Fetch templates
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/templates`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          const layout = localStorage.getItem('pb_layout');
          const filtered = layout ? data.data.filter((t: Template) => t.layout === layout) : data.data;
          
          if (filtered.length > 0) {
            setTemplates(filtered);
            setSelectedTemplate(filtered[0]);
          } else {
            setTemplates(data.data);
            setSelectedTemplate(data.data[0]);
          }
        }
      })
      .catch(err => console.error('Failed to load templates:', err));
  }, [router]);

  const handleNext = () => {
    if (selectedTemplate) {
      localStorage.setItem('pb_template_id', selectedTemplate.id);
      localStorage.setItem('pb_layout', selectedTemplate.layout);
      router.push('/booth');
    }
  };

  if (templates.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <span className="w-10 h-10 border-4 border-[#ecb2ff33] border-t-[#ecb2ff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] p-6 md:p-10 text-[#f1f0f5] font-sans">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-[32px] font-extrabold mb-2">Pilih Bingkai Favoritmu! 🖼️</h1>
        <p className="text-[#9099ab] text-base">Pilih template bingkai sebelum mulai mengambil foto.</p>
      </div>

      <div className="max-w-[800px] mx-auto flex-1 w-full">
        {selectedTemplate && (
          <TemplatePicker 
            templates={templates} 
            selected={selectedTemplate} 
            onSelect={setSelectedTemplate} 
          />
        )}
      </div>

      <div className="text-center mt-10">
        <button 
          onClick={handleNext} 
          disabled={!selectedTemplate}
          className={`px-10 py-4 text-lg md:text-[20px] rounded-full font-bold transition-all duration-300 ${
            selectedTemplate
              ? "bg-gradient-to-r from-[#bd00ff] to-[#7b00cc] text-white hover:scale-105 shadow-[0_0_24px_rgba(189,0,255,0.4)] cursor-pointer"
              : "bg-[#1c1c26] text-[#5b6270] cursor-not-allowed border border-white/5"
          }`}
        >
          Lanjut ke Kamera 📸
        </button>
      </div>
    </div>
  );
}
