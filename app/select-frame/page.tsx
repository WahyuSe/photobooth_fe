'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Template } from '@/lib/templates';
import TemplatePicker from '@/components/Editor/TemplatePicker';
import styles from '../page.module.css'; // Reuse some basic styles or create custom

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
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Pilih Bingkai Favoritmu! 🖼️</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Pilih template bingkai sebelum mulai mengambil foto.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', flex: 1, width: '100%' }}>
        {selectedTemplate && (
          <TemplatePicker 
            templates={templates} 
            selected={selectedTemplate} 
            onSelect={setSelectedTemplate} 
          />
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button className="btn btn-primary btn-lg" onClick={handleNext} disabled={!selectedTemplate}>
          Lanjut ke Kamera 📸
        </button>
      </div>
    </div>
  );
}
