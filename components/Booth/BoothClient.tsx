'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';
import EmailModal from '@/components/UI/EmailModal';
import Toast from '@/components/UI/Toast';
import { useToast } from '@/hooks/useToast';
import { Template } from '@/lib/templates';

export default function BoothClient() {
  const webcamRef = useRef<Webcam>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [layout, setLayout] = useState<'grid2x3' | 'grid2x4' | 'strip' | 'grid2x2' | 'grid3x2' | 'single' | 'strip3' | 'grid'>('grid2x4');
  const [template, setTemplate] = useState<Template | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  const [photoCountdown, setPhotoCountdown] = useState(5);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [activeMobileSlot, setActiveMobileSlot] = useState<number | null>(null);
  
  // Load layout on mount
  useEffect(() => {
    const l = localStorage.getItem('pb_layout') as any;
    if (l) setLayout(l);

    // Get event config for photoCountdown
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/event/config`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setPhotoCountdown(data.data.photoCountdown || 5);
        }
      })
      .catch(err => console.error('Failed to load event config:', err));
  }, []);

  const maxPhotos = layout === 'grid2x3' ? 3 : (layout === 'grid2x4' ? 4 : 4);
  const isDone = photos.length >= maxPhotos;

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 500);
      setPhotos(prev => [...prev, imageSrc]);
    }
  }, []);

  const startCountdown = useCallback(() => {
    if (isCountingDown || isDone) return;
    setIsCountingDown(true);
    let count = photoCountdown;
    setCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        setCountdown(0);
        setIsCountingDown(false);
        capturePhoto();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [isCountingDown, isDone, capturePhoto, photoCountdown]);

  const retakePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setPhotos([]);
    setIsCountingDown(false);
    setCountdown(0);
  };

  const handlePrint = () => {
    if (photos.length === 0) return;
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const handleSendEmail = async (email: string, name: string) => {
    if (photos.length === 0) return;
    setIsSendingEmail(true);

    try {
      // Compose the photo strip into a single canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const photoWidth = 400;
      const photoHeight = 300;
      const padding = 16;
      const footerH = 60;

      if (layout === 'strip' || layout === 'strip3') {
        canvas.width = photoWidth + padding * 2;
        canvas.height = photoHeight * photos.length + padding * (photos.length + 1) + footerH;
      } else if (layout === 'single') {
        canvas.width = photoWidth + padding * 2;
        canvas.height = photoHeight + padding * 2 + footerH;
      } else if (layout === 'grid3x2') {
        canvas.width = photoWidth * 2 + padding * 3;
        canvas.height = photoHeight * 3 + padding * 4 + footerH;
      } else {
        canvas.width = photoWidth * 2 + padding * 3;
        canvas.height = photoHeight * 2 + padding * 3 + footerH;
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.src = photos[i];
        await new Promise<void>(res => { img.onload = () => res(); });

        let x = padding, y = padding;
        if (layout === 'strip' || layout === 'strip3') {
          y = padding + i * (photoHeight + padding);
        } else if (layout === 'single') {
          x = padding;
          y = padding;
        } else {
          x = padding + (i % 2) * (photoWidth + padding);
          y = padding + Math.floor(i / 2) * (photoHeight + padding);
        }
        ctx.drawImage(img, x, y, photoWidth, photoHeight);
      }

      // Footer
      const footerY = canvas.height - footerH;
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, footerY, canvas.width, footerH);
      ctx.fillStyle = '#c850c0';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📸 PhotoBooth App', canvas.width / 2, footerY + 22);
      ctx.fillStyle = '#888';
      ctx.font = '13px Inter, sans-serif';
      ctx.fillText(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), canvas.width / 2, footerY + 44);

      const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, imageBase64, mimeType: 'image/jpeg' }),
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

  // Auto-capture mode (always on when started)
  const [autoCapture, setAutoCapture] = useState(false);
  useEffect(() => {
    if (autoCapture && !isCountingDown && !isDone && cameraReady) {
      const timer = setTimeout(() => startCountdown(), 1000);
      return () => clearTimeout(timer);
    }
  }, [autoCapture, isCountingDown, isDone, cameraReady, startCountdown]);

  return (
    <div className="flex flex-col min-h-screen relative bg-[#0a0a0f] print:hidden">
      {/* Flash overlay */}
      {isFlashing && <div className="fixed inset-0 bg-white z-[999] pointer-events-none animate-[shutter_0.5s_ease_forwards]" aria-hidden="true" />}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] flex-1 gap-0">
        {/* Camera Section */}
        <div className="flex flex-col bg-black">
          <div className="relative flex-1 bg-[radial-gradient(circle_at_center,rgba(236,178,255,0.1)_0%,#000_70%)] aspect-video overflow-hidden">
            {cameraError ? (
              <div className="flex flex-col items-center justify-center gap-3 h-full min-h-[300px] text-[#9099ab]">
                <span className="text-[64px]">📷</span>
                <p className="text-lg font-semibold">Kamera tidak dapat diakses</p>
                <small className="text-[13px] text-gray-500">Pastikan Anda mengizinkan akses kamera di browser</small>
              </div>
            ) : (
              !isDone && (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={1}
                    mirrored
                    className="w-full h-full object-cover block"
                    onUserMedia={() => setCameraReady(true)}
                    onUserMediaError={() => setCameraError(true)}
                    videoConstraints={{ width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: 'user' }}
                  />
                  {/* Viewfinder overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute w-6 h-6 border-[#c850c0]/70 border-solid top-5 left-5 border-t-2 border-l-2 border-r-0 border-b-0" />
                    <div className="absolute w-6 h-6 border-[#c850c0]/70 border-solid top-5 right-5 border-t-2 border-r-2 border-l-0 border-b-0" />
                    <div className="absolute w-6 h-6 border-[#c850c0]/70 border-solid bottom-5 left-5 border-b-2 border-l-2 border-r-0 border-t-0" />
                    <div className="absolute w-6 h-6 border-[#c850c0]/70 border-solid bottom-5 right-5 border-b-2 border-r-2 border-l-0 border-t-0" />
                  </div>
                </>
              )
            )}

            {/* Countdown */}
            {isCountingDown && countdown > 0 && (
              <div className="absolute top-8 right-8 z-[100] flex items-center justify-center">
                <span key={countdown} className="text-[80px] font-extrabold text-white leading-none shadow-countdown animate-[countdown-pop_1s_ease_forwards] drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  {countdown}
                </span>
              </div>
            )}

            {/* Done overlay */}
            {isDone && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm">
                <span className="text-[64px]">✅</span>
                <p className="text-[20px] font-semibold text-white">Semua foto sudah diambil!</p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="p-4 md:px-6 bg-white/5 backdrop-blur-[20px] border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {!autoCapture && !isDone && (
                <button
                  id="btn-auto-capture"
                  className="bg-gradient-to-r from-[#bd00ff] to-[#7b00cc] text-white hover:scale-105 shadow-[0_0_24px_rgba(189,0,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  style={{ padding: '16px 40px', fontSize: '20px', borderRadius: '40px' }}
                  onClick={() => setAutoCapture(true)}
                  disabled={!cameraReady}
                >
                  🚀 Mulai Foto Otomatis
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel — Photo Strip */}
        <div className="border-l border-white/10 bg-white/5 backdrop-blur-[20px] flex flex-col p-5 gap-4 overflow-y-auto">
          <h2 className="text-base font-semibold text-white">Hasil Foto ({photos.length}/{maxPhotos})</h2>

          {(() => {
            if (layout === 'grid2x3' || layout === 'grid2x4') {
              const rows = layout === 'grid2x3' ? 3 : 4;
              const totalSlots = rows * 2;
              const slotElements = [];

              for (let i = 0; i < totalSlots; i++) {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const photoIndex = row;
                const src = photos[photoIndex];

                if (src) {
                  const isActive = activeMobileSlot === i;
                  slotElements.push(
                    <div 
                      key={i} 
                      className={`relative rounded-md overflow-hidden border border-white/20 aspect-[4/3] animate-[slideDown_0.4s_ease_both] group ${isActive ? 'active-slot' : ''}`} 
                      style={{ animationDelay: `${i * 0.05}s` }}
                      onClick={() => setActiveMobileSlot(isActive ? null : i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Foto ${photoIndex + 1}`} className="w-full h-full object-cover block" />
                      {col === 0 && (
                        <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto ${isActive ? '!opacity-100 !bg-black/50 !pointer-events-auto' : ''}`}>
                          <button
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
                            onClick={(e) => { e.stopPropagation(); setPreviewPhoto(src); }}
                          >
                            🔍 Detail
                          </button>
                          <button
                            className="bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
                            onClick={(e) => { e.stopPropagation(); retakePhoto(photoIndex); }}
                          >
                            🔁 Retake
                          </button>
                        </div>
                      )}
                      <span className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 rounded-full text-[11px] font-bold text-white flex items-center justify-center">{photoIndex + 1}</span>
                    </div>
                  );
                } else {
                  slotElements.push(
                    <div key={`empty-${i}`} className="relative rounded-md border border-dashed border-white/20 aspect-[4/3] bg-white/5 flex items-center justify-center text-[#9099ab] text-lg font-light">
                      <span>{photoIndex + 1}</span>
                    </div>
                  );
                }
              }

              return (
                <div className="grid grid-cols-2 gap-2" id="photo-result">
                  {slotElements}
                </div>
              );
            }

            // Fallback for linear / strip
            return (
              <div className={(layout === 'strip' || layout === 'strip3') ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"} id="photo-result">
                {photos.map((src, i) => {
                  const isActive = activeMobileSlot === i;
                  return (
                    <div 
                      key={i} 
                      className={`relative rounded-md overflow-hidden border border-white/20 aspect-[4/3] animate-[slideDown_0.4s_ease_both] group ${isActive ? 'active-slot' : ''}`} 
                      style={{ animationDelay: `${i * 0.1}s` }}
                      onClick={() => setActiveMobileSlot(isActive ? null : i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover block" />
                      <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto ${isActive ? '!opacity-100 !bg-black/50 !pointer-events-auto' : ''}`}>
                        <button
                          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
                          onClick={(e) => { e.stopPropagation(); setPreviewPhoto(src); }}
                        >
                          🔍 Detail
                        </button>
                        <button
                          className="bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
                          onClick={(e) => { e.stopPropagation(); retakePhoto(i); }}
                        >
                          🔁 Retake
                        </button>
                      </div>
                      <span className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 rounded-full text-[11px] font-bold text-white flex items-center justify-center">{i + 1}</span>
                    </div>
                  );
                })}
                {Array.from({ length: maxPhotos - photos.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="relative rounded-md border border-dashed border-white/20 aspect-[4/3] bg-white/5 flex items-center justify-center text-[#9099ab] text-lg font-light">
                    <span>{photos.length + i + 1}</span>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-auto pt-4 border-t border-white/20">
            <button
              id="btn-go-editor"
              className="bg-gradient-to-r from-[#bd00ff] to-[#7b00cc] text-white hover:opacity-90 w-full disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-lg transition-opacity"
              onClick={() => {
                if (photos.length > 0) {
                  localStorage.setItem('pb_photos', JSON.stringify(photos));
                  window.location.href = '/editor';
                }
              }}
              disabled={photos.length === 0}
              style={{ fontSize: '18px', padding: '16px' }}
            >
              🎨 Pilih Template
            </button>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendEmail}
          isLoading={isSendingEmail}
        />
      )}

      {/* Toast */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Print area */}
      <div className="hidden print:block print:p-[20mm]" aria-hidden="true">
        <div className={(layout === 'strip' || layout === 'strip3') ? "print:flex print:flex-col print:gap-[8mm] print:items-center" : "print:grid print:grid-cols-2 print:gap-[6mm]"}>
          {photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`Foto ${i + 1}`} className="w-full max-w-[80mm] rounded-[4mm] print:break-inside-avoid" />
          ))}
        </div>
        <div className="text-center mt-[8mm] text-[11pt] text-[#888] border-t border-[#eee] pt-[4mm]">
          <p>📸 PhotoBooth App · {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      
      {/* Detail Preview Modal */}
      {previewPhoto && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setPreviewPhoto(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewPhoto} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', border: '2px solid white', borderRadius: '8px' }} alt="Detail Preview" />
          <button 
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md px-4 py-2 rounded-lg font-bold" 
            style={{ position: 'absolute', top: '20px', right: '20px' }}
            onClick={(e) => { e.stopPropagation(); setPreviewPhoto(null); }}
          >
            ❌ Tutup
          </button>
        </div>
      )}

      {/* Required Animations using inline style since tailwind config is not dynamically updateable easily */}
      <style>{`
        @keyframes shutter {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes countdown-pop {
          0% { transform: scale(0.5); opacity: 0; }
          40% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
