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
  const [layout, setLayout] = useState<'strip' | 'grid2x2' | 'grid3x2' | 'single' | 'strip3' | 'grid'>('strip');
  const [template, setTemplate] = useState<Template | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  
  // Load template on mount
  useEffect(() => {
    const tplId = localStorage.getItem('pb_template_id');
    if (tplId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/templates`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const found = data.data.find((t: Template) => t.id === tplId);
            if (found) {
              setTemplate(found);
              setLayout(found.layout as any);
            }
          }
        });
    }
  }, []);

  const maxPhotos = template
    ? template.photoCount
    : (layout === 'grid3x2' ? 6 : (layout === 'strip3' ? 3 : (layout === 'single' ? 1 : 4)));
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
    let count = COUNTDOWN_SECONDS;
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

  // Auto-capture mode
  const [autoCapture, setAutoCapture] = useState(false);
  useEffect(() => {
    if (autoCapture && !isCountingDown && !isDone && cameraReady) {
      const timer = setTimeout(() => startCountdown(), 1500);
      return () => clearTimeout(timer);
    }
  }, [autoCapture, isCountingDown, isDone, cameraReady, startCountdown]);

  return (
    <div className={styles.wrapper}>
      {/* Flash overlay */}
      {isFlashing && <div className={styles.flashOverlay} aria-hidden="true" />}

      {/* Header */}
      <header className={styles.header}>
        <div style={{ width: 100 }} /> {/* Spacer */}
        <h1 className={styles.headerTitle}>📸 PhotoBooth</h1>
        <div className={styles.headerActions}>
          <span className={styles.photoCount}>{photos.length}/{maxPhotos}</span>
        </div>
      </header>

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
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.92}
                  mirrored
                  className={styles.webcam}
                  onUserMedia={() => setCameraReady(true)}
                  onUserMediaError={() => setCameraError(true)}
                  videoConstraints={{ width: 1280, height: 720, facingMode: 'user' }}
                />
                {/* Viewfinder overlay */}
                <div className={styles.viewfinderOverlay}>
                  <div className={styles.vfCorner} />
                  <div className={styles.vfCorner} />
                  <div className={styles.vfCorner} />
                  <div className={styles.vfCorner} />
                </div>
              </>
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
            <div className={styles.captureRow}>
              <button
                id="btn-auto-capture"
                className={`btn btn-sm ${autoCapture ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => setAutoCapture(p => !p)}
                disabled={isDone}
              >
                {autoCapture ? '⏹ Stop Auto' : '🔄 Auto Capture'}
              </button>

              <button
                id="btn-capture"
                className={`btn btn-primary ${styles.captureBtn}`}
                onClick={startCountdown}
                disabled={isCountingDown || isDone || !cameraReady}
              >
                {isCountingDown ? `⏱ ${countdown}` : '📸 Ambil Foto'}
              </button>

              <button
                id="btn-reset"
                className="btn btn-sm btn-secondary"
                onClick={resetAll}
                disabled={photos.length === 0}
              >
                🔄 Ulang Semua
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel — Photo Strip */}
        <div className={styles.rightPanel}>
          <h2 className={styles.panelTitle}>Hasil Foto</h2>

          <div className={(layout === 'strip' || layout === 'strip3') ? styles.photoStrip : styles.photoGrid} id="photo-result">
            {/* Taken photos */}
            {photos.map((src, i) => (
              <div key={i} className={styles.photoSlot} style={{ animationDelay: `${i * 0.1}s` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Foto ${i + 1}`} className={styles.photo} />
                <div className={styles.photoOverlay}>
                  <button
                    id={`btn-retake-${i}`}
                    className={`btn btn-sm btn-danger`}
                    onClick={() => retakePhoto(i)}
                  >
                    🔁 Retake
                  </button>
                </div>
                <span className={styles.photoNum}>{i + 1}</span>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: maxPhotos - photos.length }).map((_, i) => (
              <div key={`empty-${i}`} className={`${styles.photoSlot} ${styles.emptySlot}`}>
                <span>{photos.length + i + 1}</span>
              </div>
            ))}
          </div>

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
            >
              🎨 Selesai & Edit Foto
            </button>

            <div className={styles.actionRow}>
              <button
                id="btn-print"
                className="btn btn-secondary flex-1"
                onClick={handlePrint}
                disabled={photos.length === 0 || isPrinting}
              >
                {isPrinting ? <><span className="spinner" /> Menyiapkan...</> : '🖨️ Print'}
              </button>
              <button
                id="btn-email"
                className="btn btn-gold flex-1"
                onClick={() => setShowEmailModal(true)}
                disabled={photos.length === 0}
              >
                📧 Email
              </button>
            </div>
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
    </div>
  );
}
