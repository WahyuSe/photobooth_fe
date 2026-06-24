'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TemplatePicker from './TemplatePicker';
import CanvasEditor, { PhotoSlot } from './CanvasEditor';
import EmailModal from '@/components/UI/EmailModal';
import Toast from '@/components/UI/Toast';
import { useToast } from '@/hooks/useToast';
import { Template } from '@/lib/templates';

function getInitialSlots(
  ratio: string,
  layoutType: 'grid2x3' | 'grid2x4' | 'strip' | 'grid2x2' | 'grid3x2' | 'single' | 'strip3' | 'grid',
  photoCount: number,
  padding: number
): PhotoSlot[] {
  // Tentukan dimensi virtual canvas
  let w = 1200;
  let h = 1800;
  if (ratio === '1:3') {
    w = 600;
    h = 1800;
  } else if (ratio === '1:1') {
    w = 1200;
    h = 1200;
  } else if (ratio === '3:4') {
    w = 1200;
    h = 1600;
  }

  const slots: PhotoSlot[] = [];
  const FOOTER_H = 150;
  const usableHeight = h - FOOTER_H;

  if (layoutType === 'strip' || layoutType === 'strip3' || (ratio === '1:3' && layoutType !== 'grid2x2' && layoutType !== 'grid3x2')) {
    // vertical strip
    const count = layoutType === 'strip' ? 4 : (layoutType === 'strip3' ? 3 : 4);
    const sideMargin = padding * 1.5;
    const slotW = w - sideMargin * 2;
    const totalGaps = (count - 1) * padding;
    const slotH = (usableHeight - padding * 2 - totalGaps) / count;

    for (let i = 0; i < count; i++) {
      slots.push({
        id: `slot-${i}`,
        photoIndex: i < photoCount ? i : -1,
        x: sideMargin,
        y: padding + i * (slotH + padding),
        width: slotW,
        height: slotH,
        imageScale: 1,
        imageX: 0,
        imageY: 0
      });
    }
  } else if (layoutType === 'grid2x2' || (layoutType === 'grid' && photoCount <= 4)) {
    // 2x2 grid
    const rows = 2;
    const cols = 2;
    const sideMargin = padding * 1.5;
    const totalW = w - sideMargin * 2;
    const slotW = (totalW - padding) / cols;
    const slotH = (usableHeight - padding * 2 - padding) / rows;

    for (let i = 0; i < 4; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      slots.push({
        id: `slot-${i}`,
        photoIndex: i < photoCount ? i : -1,
        x: sideMargin + col * (slotW + padding),
        y: padding + row * (slotH + padding),
        width: slotW,
        height: slotH,
        imageScale: 1,
        imageX: 0,
        imageY: 0
      });
    }
  } else if (layoutType === 'grid3x2' || layoutType === 'grid') {
    // 3 rows, 2 columns (6 photos)
    const rows = 3;
    const cols = 2;
    const sideMargin = padding * 1.5;
    const totalW = w - sideMargin * 2;
    const slotW = (totalW - padding) / cols;
    const slotH = (usableHeight - padding * 2 - padding * 2) / rows;

    for (let i = 0; i < 6; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      slots.push({
        id: `slot-${i}`,
        photoIndex: i < photoCount ? i : -1,
        x: sideMargin + col * (slotW + padding),
        y: padding + row * (slotH + padding),
        width: slotW,
        height: slotH,
        imageScale: 1,
        imageX: 0,
        imageY: 0
      });
    }
  } else if (layoutType === 'grid2x3') {
    // 3 rows, 2 columns (Left is photo 0,1,2. Right is photo 0,1,2 - mirrored)
    const rows = 3;
    const cols = 2;
    const sideMargin = padding * 1.5;
    const totalW = w - sideMargin * 2;
    const slotW = (totalW - padding) / cols;
    const slotH = (usableHeight - padding * 2 - padding * 2) / rows;

    for (let i = 0; i < 6; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      slots.push({
        id: `slot-${i}`,
        photoIndex: row < photoCount ? row : -1, // Use row as the photo index (0, 1, 2)
        x: sideMargin + col * (slotW + padding),
        y: padding + row * (slotH + padding),
        width: slotW,
        height: slotH,
        imageScale: 1,
        imageX: 0,
        imageY: 0
      });
    }
  } else if (layoutType === 'grid2x4') {
    // 4 rows, 2 columns (Left is photo 0,1,2,3. Right is photo 0,1,2,3 - mirrored)
    const rows = 4;
    const cols = 2;
    const sideMargin = padding * 1.5;
    const totalW = w - sideMargin * 2;
    const slotW = (totalW - padding) / cols;
    const slotH = (usableHeight - padding * 2 - padding * 3) / rows;

    for (let i = 0; i < 8; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      slots.push({
        id: `slot-${i}`,
        photoIndex: row < photoCount ? row : -1, // Use row as the photo index (0, 1, 2, 3)
        x: sideMargin + col * (slotW + padding),
        y: padding + row * (slotH + padding),
        width: slotW,
        height: slotH,
        imageScale: 1,
        imageX: 0,
        imageY: 0
      });
    }
  } else {
    // single photo
    const sideMargin = padding * 1.5;
    const slotW = w - sideMargin * 2;
    const slotH = usableHeight - padding * 2;
    slots.push({
      id: `slot-0`,
      photoIndex: 0 < photoCount ? 0 : -1,
      x: sideMargin,
      y: padding,
      width: slotW,
      height: slotH,
      imageScale: 1,
      imageX: 0,
      imageY: 0
    });
  }

  return slots;
}

export default function EditorClient() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [layout, setLayout] = useState<'grid2x3' | 'grid2x4' | 'strip' | 'grid2x2' | 'grid3x2' | 'grid' | 'single' | 'strip3'>('strip');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Dynamic customized template configuration
  const [dynamicTemplate, setDynamicTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const [customText, setCustomText] = useState('');
  const [showDate, setShowDate] = useState(true);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'text'>('layout');
  const { toasts, addToast, removeToast } = useToast();

  // Layout editor specific states
  const [slots, setSlots] = useState<PhotoSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isLayoutLocked, setIsLayoutLocked] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('1:3');
  const [autoFill, setAutoFill] = useState(false);
  const [enablePhotoDrag, setEnablePhotoDrag] = useState(false);

  // Google Drive state
  const [googleDriveUrl, setGoogleDriveUrl] = useState<string | null>(null);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);

  // Auto finish and WhatsApp states
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [showAutoFinishModal, setShowAutoFinishModal] = useState(false);
  const [isFinishingAuto, setIsFinishingAuto] = useState(false);
  const [finishCountdown, setFinishCountdown] = useState(25);
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState('');



  // Load photos from localStorage (saved from booth page)
  useEffect(() => {
    const saved = localStorage.getItem('pb_photos');
    const savedLayout = localStorage.getItem('pb_layout') as any;
    if (saved) {
      try {
        setPhotos(JSON.parse(saved));
      } catch {
        setPhotos([]);
      }
    }
    if (savedLayout) setLayout(savedLayout);

    const tplId = localStorage.getItem('pb_template_id');

    // Fetch templates
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/templates`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          let layoutTemplates = data.data;
          if (savedLayout) {
             layoutTemplates = data.data.filter((t: Template) => t.layout === savedLayout);
             if (layoutTemplates.length === 0) layoutTemplates = data.data; // fallback if no templates for layout
          }
          setTemplates(layoutTemplates);

          const found = layoutTemplates.find((t: Template) => t.id === tplId);
          if (found) {
            setSelectedTemplate(found);
            setLayout(found.layout as any);
            const defaultRatio = found.aspectRatio || (found.layout === 'strip' ? '1:3' : '2:3');
            setAspectRatio(defaultRatio);
          } else {
            const fallback = layoutTemplates[0];
            setSelectedTemplate(fallback);
            setLayout(fallback.layout as any);
            const defaultRatio = fallback.aspectRatio || (fallback.layout === 'strip' ? '1:3' : '2:3');
            setAspectRatio(defaultRatio);
          }
        }
      })
      .catch(err => console.error('Failed to load templates:', err));

    // Fetch categories
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch(err => console.error('Failed to load categories:', err));

    // Fetch settings to check if WhatsApp share is enabled
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setWhatsappEnabled(data.data.whatsappEnabled);
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);


  // Initialize dynamicTemplate when selectedTemplate loads
  useEffect(() => {
    if (selectedTemplate) {
      setDynamicTemplate(selectedTemplate);
      const defaultRatio = selectedTemplate.aspectRatio || (selectedTemplate.layout === 'strip' ? '1:3' : '2:3');
      setAspectRatio(defaultRatio);
    }
  }, [selectedTemplate]);

  // Sync slots when layout properties change
  useEffect(() => {
    if (dynamicTemplate) {
      if (dynamicTemplate.slotsJson) {
        try {
          const parsedSlots = JSON.parse(dynamicTemplate.slotsJson);
          if (Array.isArray(parsedSlots) && parsedSlots.length > 0) {
            const mappedSlots = parsedSlots.map((s) => ({
              ...s,
              photoIndex: s.photoIndex !== undefined && s.photoIndex !== null && s.photoIndex < photos.length ? s.photoIndex : -1
            }));
            setSlots(mappedSlots);
            setSelectedSlotId(null);
            return;
          }
        } catch (e) {
          console.error('Failed to parse slotsJson from template:', e);
        }
      }

      const initialSlots = getInitialSlots(
        aspectRatio,
        dynamicTemplate.layout as any,
        photos.length || dynamicTemplate.photoCount || 4,
        dynamicTemplate.frameWidth || 20
      );
      setSlots(initialSlots);
      setSelectedSlotId(null);
    }
  }, [dynamicTemplate?.id, dynamicTemplate?.slotsJson, dynamicTemplate?.layout, aspectRatio, photos.length]);

  const finishSession = async () => {
    const sessionId = localStorage.getItem('pb_session_id');
    if (sessionId) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/sessions/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      } catch (e) {
        console.error(e);
      }
    }
    
    // Clear data and go home
    localStorage.removeItem('pb_session_id');
    localStorage.removeItem('pb_session_expires');
    localStorage.removeItem('pb_template_id');
    localStorage.removeItem('pb_photos');
    window.location.href = '/';
  };

  const handleExport = (dataUrl: string) => {
    setFinalImage(dataUrl);
  };

  const handleDownload = () => {
    if (!finalImage) return;
    const a = document.createElement('a');
    a.href = finalImage;
    a.download = `photobooth-${Date.now()}.jpg`;
    a.click();
    addToast('success', 'Foto berhasil diunduh! 📥');
  };

  const handlePrint = () => {
    if (!finalImage) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>PhotoBooth Print</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#fff; margin:0; }
        img { max-width:100%; max-height:100vh; object-fit:contain; }
        @page { margin: 0; size: auto; }
        @media print { 
          body { min-height:unset; margin: 0; }
          img { max-width: 100vw; max-height: 100vh; object-fit: contain; }
        }
      </style>
      </head><body>
      <img src="${finalImage}" onload="window.print(); window.close();" />
      </body></html>
    `);
    win.document.close();
  };

  const handleSendEmail = async (email: string, name: string) => {
    if (!finalImage) return;
    setIsSendingEmail(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, imageBase64: finalImage, mimeType: 'image/jpeg' }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEmailModal(false);
        addToast('success', `Foto berhasil dikirim ke ${email} 🎉`);
      } else {
        addToast('error', data.message || 'Gagal mengirim email.');
      }
    } catch {
      addToast('error', 'Gagal terhubung ke server.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const uploadToGoogleDrive = async () => {
    if (!finalImage) {
      addToast('error', 'Silakan render atau tunggu sampai kanvas selesai dimuat.');
      return;
    }
    setIsUploadingToDrive(true);
    try {
      const sessionCode = localStorage.getItem('pb_session_id') || 'guest';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/upload/google-drive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: finalImage, sessionName: sessionCode }),
      });
      const data = await res.json();
      if (data.success) {
        setGoogleDriveUrl(data.url);
        setShowDriveModal(true);
        addToast('success', 'Foto berhasil diunggah ke Google Drive! ☁️');
      } else {
        addToast('error', data.message || 'Gagal mengunggah ke Google Drive.');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Koneksi gagal saat mencoba mengunggah ke Google Drive.');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  // Countdown timer for automatic session redirect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showAutoFinishModal && finishCountdown > 0 && !isFinishingAuto) {
      interval = setInterval(() => {
        setFinishCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            confirmFinishAndClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showAutoFinishModal, finishCountdown, isFinishingAuto]);

  const confirmFinishAndClose = async () => {
    setShowAutoFinishModal(false);
    await finishSession();
  };

  const handleAutoFinish = async () => {
    if (!finalImage) {
      addToast('error', 'Foto Anda belum selesai diproses. Silakan tunggu sebentar.');
      return;
    }

    setIsFinishingAuto(true);
    setShowAutoFinishModal(true);
    setGoogleDriveUrl(null); // Reset link
    setFinishCountdown(25); // Start 25 seconds countdown

    try {
      // 1. Upload to Google Drive in background
      const sessionCode = localStorage.getItem('pb_session_id') || 'guest';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/upload/google-drive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: finalImage, sessionName: sessionCode }),
      });
      const data = await res.json();
      
      if (data.success) {
        setGoogleDriveUrl(data.url);
        addToast('success', 'Foto berhasil diunggah ke Google Drive! ☁️');
      } else {
        addToast('error', data.message || 'Gagal mengunggah ke Google Drive.');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Koneksi gagal saat mencoba mengunggah ke Google Drive.');
    } finally {
      setIsFinishingAuto(false);
      
      // 2. Trigger the browser print window automatically
      handlePrint();
    }
  };

  const handleWhatsAppShare = () => {
    if (!googleDriveUrl) return;
    
    let cleanNumber = whatsAppNumber.replace(/\D/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '62' + cleanNumber.slice(1);
    }
    
    if (!cleanNumber.startsWith('62') && cleanNumber.length > 0) {
      addToast('error', 'Harap masukkan nomor WhatsApp yang valid diawali angka 0 atau 62.');
      return;
    }
    
    if (cleanNumber.length === 0) {
      addToast('error', 'Harap masukkan nomor WhatsApp Anda.');
      return;
    }

    const message = encodeURIComponent(`Halo! Ini adalah link foto Photobooth Anda 📸:\n\n${googleDriveUrl}\n\nTerima kasih telah berkunjung! ✨`);
    const waLink = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${message}`;
    
    window.open(waLink, '_blank');
    addToast('success', 'Membuka WhatsApp untuk mengirim foto... 🚀');
    setShowWhatsAppInput(false);
    setWhatsAppNumber('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const readers = files.slice(0, 6).map(file => {
      return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(results => {
      setPhotos(results);
      localStorage.setItem('pb_photos', JSON.stringify(results));
      addToast('info', `${results.length} foto berhasil dimuat`);
    });
  };

  // Layout adjustment mechanics
  const resetPhotoAdjustments = () => {
    setSlots(slots.map(s => ({
      ...s,
      imageScale: 1,
      imageX: 0,
      imageY: 0
    })));
    addToast('info', 'Posisi dan zoom foto di-reset ke awal 🔄');
  };

  const selectedSlot = slots.find(s => s.id === selectedSlotId);

  const handleZoomChange = (val: number) => {
    if (!selectedSlotId) return;
    setSlots(slots.map(s => {
      if (s.id === selectedSlotId) {
        return { ...s, imageScale: val };
      }
      return s;
    }));
  };

  const handlePhotoIndexChange = (idx: number) => {
    if (!selectedSlotId) return;
    setSlots(slots.map(s => {
      if (s.id === selectedSlotId) {
        return { ...s, photoIndex: idx };
      }
      return s;
    }));
  };

  return (
    <div className={"flex flex-col h-screen overflow-hidden bg-[#0a0a0f]"}>
      <div className={"grid grid-cols-1 md:grid-cols-[320px_1fr] flex-1 min-h-0"}>
        {/* Left Panel — Tools */}
        <div className={"border-r border-white/10 bg-white/5 backdrop-blur-[20px] p-5 overflow-y-auto h-full flex flex-col gap-4"}>
          {/* Upload photos */}
          {photos.length === 0 && (
            <div className={"flex flex-col items-center gap-3 py-8 px-5 border-2 border-dashed border-white/10 rounded-lg text-center text-white/80"}>
              <span>📁</span>
              <p>Upload foto untuk diedit</p>
              <label className="btn btn-primary btn-sm" htmlFor="file-upload">
                Pilih Foto
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <small>atau pergi ke <Link href="/booth" style={{ color: 'var(--pink-light)' }}>booth</Link> untuk ambil foto</small>
            </div>
          )}

          {photos.length > 0 && (
            <>
              {/* Tab switcher */}
              <div className={"flex gap-1 bg-white/5 rounded-md p-1 mb-2"}>
                <button
                  id="tab-layout"
                  className={`flex-1 py-2.5 px-2 text-[11px] font-semibold rounded-md text-white/80 transition-all bg-transparent border-none cursor-pointer flex items-center justify-center gap-1 ${activeTab === 'layout' ? "!bg-gradient-to-r !from-[#bd00ff] !to-[#7b00cc] !text-white shadow-[0_4px_12px_rgba(233,30,140,0.25)]" : ''}`}
                  onClick={() => setActiveTab('layout')}
                >
                  📐 Tata Letak & Bingkai
                </button>
                <button
                  id="tab-text"
                  className={`flex-1 py-2.5 px-2 text-[11px] font-semibold rounded-md text-white/80 transition-all bg-transparent border-none cursor-pointer flex items-center justify-center gap-1 ${activeTab === 'text' ? "!bg-gradient-to-r !from-[#bd00ff] !to-[#7b00cc] !text-white shadow-[0_4px_12px_rgba(233,30,140,0.25)]" : ''}`}
                  onClick={() => setActiveTab('text')}
                >
                  ✍️ Teks & Tanggal
                </button>
              </div>

              {/* Layout Panel */}
              {activeTab === 'layout' && (
                <div className={"flex flex-col gap-3.5"}>
                  <div className={"p-3 bg-white/5 border border-white/10 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.1)]"}>
                    <strong style={{ fontSize: '13px', color: 'white', display: 'block', marginBottom: '4px' }}>
                      📸 Sesuaikan Posisi Foto
                    </strong>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.4' }}>
                      Tata letak frame telah dikonfigurasi secara presisi oleh Admin. 
                      Anda dapat menggeser foto di dalam frame untuk memposisikan wajah secara pas, atau klik kotak foto untuk mengatur zoom.
                    </span>
                  </div>

                  {/* Live Template Picker */}
                  {templates.length > 0 && selectedTemplate && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <select 
                          className="input" 
                          value={selectedCategory} 
                          onChange={e => setSelectedCategory(e.target.value)}
                          style={{ width: '100%', fontSize: '13px', padding: '8px' }}
                        >
                          <option value="">Semua Kategori</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <TemplatePicker
                        templates={selectedCategory ? templates.filter((t: any) => t.categoryId === selectedCategory) : templates}
                        selected={selectedTemplate}
                        onSelect={(t) => {
                          setSelectedTemplate(t);
                          setLayout(t.layout as any);
                          const defaultRatio = t.aspectRatio || (t.layout === 'strip' ? '1:3' : '2:3');
                          setAspectRatio(defaultRatio);
                          // Clear active slot selection on template change
                          setSelectedSlotId(null);
                        }}
                      />
                    </div>
                  )}

                  {/* Auto-fill Toggle Switch */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '2px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>
                        🔄 Isi Otomatis Slot Kosong
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        Ulangi foto yang diambil untuk mengisi frame kosong
                      </span>
                    </div>
                    <button
                      className={`w-10 h-[22px] rounded-full bg-white/10 border border-white/10 relative cursor-pointer transition-colors ${autoFill ? "!bg-[#bd00ff] !border-[#bd00ff] shadow-[0_0_10px_rgba(233,30,140,0.4)]" : ''}`}
                      onClick={() => setAutoFill(p => !p)}
                      type="button"
                      style={{ flexShrink: 0 }}
                    >
                      <span className={"absolute top-[1px] left-[1px] w-4 h-4 rounded-full bg-white transition-transform toggleThumb-class"} />
                    </button>
                  </div>

                  {/* Enable Photo Drag Toggle Switch */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '6px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>
                        🖐️ Mode Geser Posisi Foto
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        Geser foto di dalam bingkai untuk memposisikan wajah
                      </span>
                    </div>
                    <button
                      className={`w-10 h-[22px] rounded-full bg-white/10 border border-white/10 relative cursor-pointer transition-colors ${enablePhotoDrag ? "!bg-[#bd00ff] !border-[#bd00ff] shadow-[0_0_10px_rgba(233,30,140,0.4)]" : ''}`}
                      onClick={() => {
                        setEnablePhotoDrag(p => !p);
                        addToast('info', !enablePhotoDrag ? 'Mode geser foto aktif! Seret foto pada kanvas 🖐️' : 'Mode geser foto dinonaktifkan 🔒');
                      }}
                      type="button"
                      style={{ flexShrink: 0 }}
                    >
                      <span className={"absolute top-[1px] left-[1px] w-4 h-4 rounded-full bg-white transition-transform toggleThumb-class"} />
                    </button>
                  </div>

                  {/* Selected Slot controls */}
                  {selectedSlotId && selectedSlot ? (
                    <div className={"border border-white/10 rounded-md p-3.5 bg-white/5 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] animate-[fadeIn_0.3s_ease-out]"}>
                      <h4 className={"text-[12px] font-bold text-[#ecb2ff] uppercase tracking-wider border-b border-white/10 pb-1.5 m-0"}>🎯 Slot Foto Terpilih</h4>
                      
                      {/* Photo selector */}
                      <div className={"flex flex-col gap-1.5"}>
                        <label className="label" style={{ fontSize: '11px' }}>Tampilkan Foto:</label>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {Array.from({ length: photos.length }).map((_, idx) => (
                            <button
                              key={idx}
                              className="btn btn-sm"
                              style={{
                                flex: '1 0 30%',
                                padding: '6px 4px',
                                fontSize: '11px',
                                background: selectedSlot.photoIndex === idx ? 'var(--pink-hot)' : 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '4px',
                                fontWeight: selectedSlot.photoIndex === idx ? 'bold' : 'normal',
                                cursor: 'pointer'
                              }}
                              onClick={() => handlePhotoIndexChange(idx)}
                            >
                              Foto {idx + 1}
                            </button>
                          ))}
                          <button
                            key="empty"
                            className="btn btn-sm"
                            style={{
                              flex: '1 0 30%',
                              padding: '6px 4px',
                              fontSize: '11px',
                              background: selectedSlot.photoIndex === -1 ? 'var(--pink-hot)' : 'rgba(255,255,255,0.05)',
                              border: 'none',
                              color: 'white',
                              borderRadius: '4px',
                              fontWeight: selectedSlot.photoIndex === -1 ? 'bold' : 'normal',
                              cursor: 'pointer'
                            }}
                            onClick={() => handlePhotoIndexChange(-1)}
                          >
                            Kosong ❌
                          </button>
                        </div>
                      </div>

                      {/* Zoom selector */}
                      <div className={"flex flex-col gap-1.5"} style={{ marginTop: '14px' }}>
                        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                          <label className="label" style={{ fontSize: '11px', margin: 0 }}>Zoom Foto</label>
                          <span style={{ fontSize: '11px', color: 'var(--pink-light)', fontWeight: 'bold' }}>{Math.round(selectedSlot.imageScale * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          step="0.05"
                          value={selectedSlot.imageScale}
                          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--pink-hot)', marginTop: '6px' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={"flex flex-col items-center justify-center py-6 px-4 bg-white/5 border border-dashed border-white/10 rounded-md text-center"}>
                      <span style={{ fontSize: '20px', marginBottom: '6px' }}>👆</span>
                      <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', margin: 0, textAlign: 'center' }}>
                        Klik salah satu slot foto pada kanvas di sebelah kanan untuk memperbesar atau mengganti urutan foto.
                      </p>
                    </div>
                  )}

                  {/* Reset photo adjustments */}
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={resetPhotoAdjustments}
                    style={{ width: '100%', marginTop: '6px', fontSize: '11px' }}
                  >
                    🔄 Reset Posisi & Zoom Foto
                  </button>
                </div>
              )}

              {/* Text options */}
              {activeTab === 'text' && (
                <div className={"flex flex-col gap-3.5"}>
                  <label className="label">Teks Kustom</label>
                  <input
                    id="input-custom-text"
                    className="input"
                    placeholder="Contoh: Wedding Day 💍"
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    maxLength={40}
                  />
                  <div className={"flex items-center justify-between py-2"}>
                    <label className="label" style={{ margin: 0 }}>Tampilkan Tanggal</label>
                    <button
                      id="toggle-date"
                      className={`w-10 h-[22px] rounded-full bg-white/10 border border-white/10 relative cursor-pointer transition-colors ${showDate ? "!bg-[#bd00ff] !border-[#bd00ff] shadow-[0_0_10px_rgba(233,30,140,0.4)]" : ''}`}
                      onClick={() => setShowDate(p => !p)}
                      aria-pressed={showDate}
                    >
                      <span className={"absolute top-[1px] left-[1px] w-4 h-4 rounded-full bg-white transition-transform toggleThumb-class"} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}


        </div>

        {/* Center — Canvas Editor */}
        <div className={"flex flex-col items-center justify-center bg-[#0a0a0f] bg-[radial-gradient(circle_at_center,rgba(236,178,255,0.1)_0%,transparent_60%)] overflow-hidden relative min-h-0 h-full p-8"}>
          {photos.length > 0 && dynamicTemplate ? (
            <div className="flex flex-col items-center w-full h-full min-h-0 gap-6">
              <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                <CanvasEditor
              photos={photos}
              layout={layout}
              template={dynamicTemplate}
              customText={customText}
              showDate={showDate}
              onExport={handleExport}
              slots={slots}
              setSlots={setSlots}
              selectedSlotId={selectedSlotId}
              setSelectedSlotId={setSelectedSlotId}
              isLayoutLocked={isLayoutLocked}
              aspectRatio={aspectRatio}
              autoFill={autoFill}
              enablePhotoDrag={enablePhotoDrag}
            />
              </div>
              <button
                id="btn-finish"
                className="btn btn-primary btn-sm"
                style={{ background: 'var(--gradient-primary)', borderColor: 'transparent', fontWeight: 'bold', justifyContent: 'center', padding: '16px 40px', fontSize: '18px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(233, 30, 140, 0.4)' }}
                onClick={handleAutoFinish}
                disabled={isFinishingAuto || !finalImage}
              >
                {isFinishingAuto ? 'Processing...' : '🎉 Cetak & Selesai Sesi'}
              </button>
            </div>
          ) : (
            <div className={"flex flex-col items-center gap-4 text-white/80"}>
              <span>🎨</span>
              <p>Canvas akan muncul setelah foto dimuat</p>
            </div>
          )}
        </div>
      </div>

      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendEmail}
          isLoading={isSendingEmail}
        />
      )}

      {showAutoFinishModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl p-8" style={{ maxWidth: '450px', width: '90%', textAlign: 'center' }}>
            {isFinishingAuto ? (
              <div style={{ padding: '20px 0' }}>
                <span className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }} />
                <h3>Memproses Penyelesaian Sesi...</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '8px' }}>
                  Mengunggah foto hasil editan Anda ke Google Drive dan menyiapkan mesin cetak 🖨️
                </p>
              </div>
            ) : (
              <div>
                <h2 style={{ color: 'var(--teal)', marginBottom: '10px' }}>🎉 Sesi Photobooth Selesai!</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
                  Foto Anda sedang diproses untuk dicetak. Silakan ambil hasil cetak Anda di mesin printer! 🖨️
                </p>

                {googleDriveUrl ? (
                  <div style={{ margin: '15px 0' }}>
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
                      Scan QR Code ini untuk unduh versi digital HD ke HP Anda:
                    </p>
                    <div style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      marginBottom: '15px'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(googleDriveUrl)}`}
                        alt="QR Code Google Drive"
                        style={{ display: 'block', width: '180px', height: '180px' }}
                      />
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Gagal menghasilkan link digital Google Drive.</p>
                )}

                {/* WhatsApp Share Section */}
                {whatsappEnabled && googleDriveUrl && (
                  <div style={{
                    marginTop: '10px',
                    padding: '12px',
                    background: 'rgba(34, 197, 94, 0.08)',
                    border: '1px solid rgba(34, 197, 94, 0.15)',
                    borderRadius: '8px',
                    marginBottom: '15px'
                  }}>
                    {!showWhatsAppInput ? (
                      <button
                        className="btn btn-sm"
                        style={{
                          background: '#22c55e',
                          color: 'white',
                          border: 'none',
                          width: '100%',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                        onClick={() => setShowWhatsAppInput(true)}
                      >
                        🟢 Kirim Link ke WhatsApp Anda
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', textAlign: 'left' }}>
                          Nomor WhatsApp (Contoh: 08123456789):
                        </label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="08xxxxxxxxxx"
                            value={whatsAppNumber}
                            onChange={(e) => setWhatsAppNumber(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)',
                              background: 'rgba(0,0,0,0.2)',
                              color: 'white',
                              fontSize: '13px'
                            }}
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ background: '#22c55e', borderColor: 'transparent', padding: '0 12px' }}
                            onClick={handleWhatsAppShare}
                          >
                            Kirim
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '0 8px' }}
                            onClick={() => setShowWhatsAppInput(false)}
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '15px',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  display: 'inline-block'
                }}>
                  ⏱️ Kiosk akan otomatis kembali ke beranda dalam <strong>{finishCountdown}</strong> detik
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', padding: '10px', fontWeight: 'bold' }}
                    onClick={confirmFinishAndClose}
                  >
                    Selesai & Kembali ke Beranda 🏠
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showDriveModal && googleDriveUrl && (

        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setShowDriveModal(false); }}>
          <div className="bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl p-8" style={{ maxWidth: '420px', width: '90%', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '10px', color: 'var(--teal)' }}>☁️ Unggah Google Drive Sukses!</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
              Scan QR Code ini dengan HP Anda untuk mengunduh foto kualitas tinggi langsung dari Google Drive:
            </p>
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '12px',
              display: 'inline-block',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              marginBottom: '20px'
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(googleDriveUrl)}`}
                alt="QR Code Google Drive"
                style={{ display: 'block', width: '200px', height: '200px' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <a
                href={googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', padding: '10px' }}
              >
                🔗 Buka Link Google Drive
              </a>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowDriveModal(false)}
                style={{ width: '100%', padding: '10px' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toggleOn .toggleThumb-class {
          transform: translateX(18px);
        }
      `}</style>


    </div>
  );
}
