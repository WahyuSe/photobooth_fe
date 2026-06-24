'use client';

import { useState } from 'react';
import styles from './EmailModal.module.css';

interface Props {
  onClose: () => void;
  onSend: (email: string, name: string) => Promise<void>;
  isLoading: boolean;
}

export default function EmailModal({ onClose, onSend, isLoading }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Email wajib diisi.');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return setError('Format email tidak valid.');
    await onSend(email.trim(), name.trim());
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl p-8 max-w-[420px] w-[90%] text-left">
        <div className={styles.header}>
          <div className={styles.icon}>📧</div>
          <div>
            <h2 className={styles.title}>Kirim ke Email</h2>
            <p className={styles.subtitle}>Foto akan dikirim langsung ke inbox Anda</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className="label" htmlFor="email-input">Alamat Email *</label>
            <input
              id="email-input"
              className="input"
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div>
            <label className="label" htmlFor="name-input">Nama (opsional)</label>
            <input
              id="name-input"
              className="input"
              type="text"
              placeholder="Nama penerima"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <p className={styles.error}>⚠️ {error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn-secondary flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              id="btn-send-email-confirm"
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <><span className="spinner" /> Mengirim...</>
              ) : (
                '📧 Kirim Foto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
