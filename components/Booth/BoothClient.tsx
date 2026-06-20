'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';
import styles from './BoothClient.module.css';
import EmailModal from '@/components/UI/EmailModal';
import Toast from '@/components/UI/Toast';
import { useToast } from '@/hooks/useToast';
import { Template } from '@/lib/templates';

const COUNTDOWN_SECONDS = 3;

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
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/event/config`)
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
  }, [isCountingDown, isDone, capturePhoto]);

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
    <div className={styles.wrapper}>
      {/* Flash overlay */}
      {isFlashing && <div className={styles.flashOverlay} aria-hidden="true" />}

      <div className={styles.main}>
        {/* Camera Section */}
        <div className={styles.cameraSection}>
          <div className={styles.cameraWrapper}>
            {cameraError ? (
              <div className={styles.cameraError}>
                <span>📷</span>
                <p>Kamera tidak dapat diakses</p>
                <small>Pastikan Anda mengizinkan akses kamera di browser</small>
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
                    className={styles.webcam}
                    onUserMedia={() => setCameraReady(true)}
                    onUserMediaError={() => setCameraError(true)}
                    videoConstraints={{ width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: 'user' }}
                  />
                  {/* Viewfinder overlay */}
                  <div className={styles.viewfinderOverlay}>
                    <div className={styles.vfCorner} />
                    <div className={styles.vfCorner} />
                    <div className={styles.vfCorner} />
                    <div className={styles.vfCorner} />
                  </div>
                </>
              )
            )}

            {/* Countdown */}
            {isCountingDown && countdown > 0 && (
              <div className={styles.countdownOverlay}>
                <span key={countdown} className={styles.countdownNum}>{countdown}</span>
              </div>
            )}

            {/* Done overlay */}
            {isDone && (
              <div className={styles.doneOverlay}>
                <span>✅</span>
                <p>Semua foto sudah diambil!</p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className={styles.cameraControls}>
            <div className={styles.captureRow} style={{ justifyContent: 'center' }}>
              {!autoCapture && !isDone && (
                <button
                  id="btn-auto-capture"
                  className="btn btn-primary"
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
        <div className={styles.rightPanel}>
          <h2 className={styles.panelTitle}>Hasil Foto ({photos.length}/{maxPhotos})</h2>

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
                  slotElements.push(
                    <div 
                      key={i} 
                      className={`${styles.photoSlot} ${activeMobileSlot === i ? styles.activeSlot : ''}`} 
                      style={{ animationDelay: `${i * 0.05}s` }}
                      onClick={() => setActiveMobileSlot(activeMobileSlot === i ? null : i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Foto ${photoIndex + 1}`} className={styles.photo} />
                      {col === 0 && (
                        <div className={styles.photoOverlay} style={{ flexDirection: 'column', gap: '8px' }}>
                          <button
                            className={`btn btn-sm btn-secondary`}
                            onClick={(e) => { e.stopPropagation(); setPreviewPhoto(src); }}
                          >
                            🔍 Detail
                          </button>
                          <button
                            className={`btn btn-sm btn-danger`}
                            onClick={(e) => { e.stopPropagation(); retakePhoto(photoIndex); }}
                          >
                            🔁 Retake
                          </button>
                        </div>
                      )}
                      <span className={styles.photoNum}>{photoIndex + 1}</span>
                    </div>
                  );
                } else {
                  slotElements.push(
                    <div key={`empty-${i}`} className={`${styles.photoSlot} ${styles.emptySlot}`}>
                      <span>{photoIndex + 1}</span>
                    </div>
                  );
                }
              }

              return (
                <div className={styles.photoGrid} id="photo-result">
                  {slotElements}
                </div>
              );
            }

            // Fallback for linear / strip
            return (
              <div className={(layout === 'strip' || layout === 'strip3') ? styles.photoStrip : styles.photoGrid} id="photo-result">
                {photos.map((src, i) => (
                  <div 
                    key={i} 
                    className={`${styles.photoSlot} ${activeMobileSlot === i ? styles.activeSlot : ''}`} 
                    style={{ animationDelay: `${i * 0.1}s` }}
                    onClick={() => setActiveMobileSlot(activeMobileSlot === i ? null : i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Foto ${i + 1}`} className={styles.photo} />
                    <div className={styles.photoOverlay} style={{ flexDirection: 'column', gap: '8px' }}>
                      <button
                        className={`btn btn-sm btn-secondary`}
                        onClick={(e) => { e.stopPropagation(); setPreviewPhoto(src); }}
                      >
                        🔍 Detail
                      </button>
                      <button
                        className={`btn btn-sm btn-danger`}
                        onClick={(e) => { e.stopPropagation(); retakePhoto(i); }}
                      >
                        🔁 Retake
                      </button>
                    </div>
                    <span className={styles.photoNum}>{i + 1}</span>
                  </div>
                ))}
                {Array.from({ length: maxPhotos - photos.length }).map((_, i) => (
                  <div key={`empty-${i}`} className={`${styles.photoSlot} ${styles.emptySlot}`}>
                    <span>{photos.length + i + 1}</span>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className={styles.actionBar}>
            <button
              id="btn-go-editor"
              className="btn btn-primary w-full"
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
      <div className={styles.printArea} aria-hidden="true">
        <div className={(layout === 'strip' || layout === 'strip3') ? styles.printStrip : styles.printGrid}>
          {photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`Foto ${i + 1}`} className={styles.printPhoto} />
          ))}
        </div>
        <div className={styles.printFooter}>
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
            className="btn btn-secondary" 
            style={{ position: 'absolute', top: '20px', right: '20px' }}
            onClick={(e) => { e.stopPropagation(); setPreviewPhoto(null); }}
          >
            ❌ Tutup
          </button>
        </div>
      )}
    </div>
  );
}
