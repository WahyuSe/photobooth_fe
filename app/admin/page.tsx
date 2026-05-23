'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/UI/Toast';
import { Template } from '@/lib/templates';

// Load the react-konva AdminLayoutEditor dynamically (SSR disabled)
const AdminLayoutEditor = dynamic(() => import('@/components/Editor/AdminLayoutEditor'), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'white', zIndex: 1000, flexDirection: 'column', gap: 16
    }}>
      <span className="spinner" />
      <p>Memuat Visual Canvas Editor...</p>
    </div>
  )
});

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'sessions' | 'templates' | 'settings'>('sessions');
  const [sessions, setSessions] = useState<any[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // System Settings States
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  
  // Custom Session Creator States
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [newSessionUser, setNewSessionUser] = useState('Tamu');
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionDuration, setNewSessionDuration] = useState(10);
  
  // Search Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Admin layout editor states
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [layoutEditorMode, setLayoutEditorMode] = useState<'create' | 'edit'>('create');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [tempSlotsJson, setTempSlotsJson] = useState<string | undefined>(undefined);
  const [aspectRatio, setAspectRatio] = useState('1:3');
  const [layout, setLayout] = useState<'strip' | 'grid2x2' | 'grid3x2' | 'single' | 'strip3' | 'grid'>('strip');

  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    description: '',
    layout: 'strip',
    photoCount: 4,
    frameColor: '#ffffff',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#e91e8c',
    fonts: 'Inter',
    overlayImage: '',
    slotsJson: '',
    aspectRatio: '1:3'
  });
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    setToken(localStorage.getItem('pb_admin_token'));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('pb_admin_token', data.token);
        setToken(data.token);
        addToast('success', 'Login berhasil');
      } else {
        addToast('error', data.message || 'Login gagal');
      }
    } catch {
      addToast('error', 'Koneksi gagal');
    }
  };

  const fetchSessions = async (search: string = searchQuery) => {
    try {
      const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/sessions/history${queryParam}`);
      const data = await res.json();
      if (data.success) setSessions(data.data);
    } catch {
      console.error('Failed to fetch sessions');
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/templates`);
      const data = await res.json();
      if (data.success) setTemplates(data.data);
    } catch {
      console.error('Failed to fetch templates');
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/settings`);
      const data = await res.json();
      if (data.success && data.data) {
        setWhatsappEnabled(data.data.whatsappEnabled);
      }
    } catch (e) {
      console.error('Failed to fetch settings:', e);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappEnabled })
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Pengaturan berhasil disimpan!');
      } else {
        addToast('error', data.message || 'Gagal menyimpan pengaturan.');
      }
    } catch {
      addToast('error', 'Koneksi gagal saat menyimpan pengaturan.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Debounced real-time search trigger
  useEffect(() => {
    if (token) {
      if (activeTab === 'sessions') {
        const delayDebounceFn = setTimeout(() => {
          fetchSessions(searchQuery);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
      } else if (activeTab === 'templates') {
        fetchTemplates();
      } else if (activeTab === 'settings') {
        fetchSettings();
      }
    }
  }, [token, searchQuery, activeTab]);


  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/sessions/create-pending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userName: newSessionUser, 
          sessionName: newSessionName, 
          durationMinutes: Number(newSessionDuration) 
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `Sesi baru "${data.data.sessionCode}" berhasil dibuat!`);
        setShowSessionModal(false);
        // Reset form
        setNewSessionUser('Tamu');
        setNewSessionName('');
        setNewSessionDuration(10);
        fetchSessions();
      } else {
        addToast('error', 'Gagal membuat sesi');
      }
    } catch {
      addToast('error', 'Koneksi gagal');
    }
  };

  const endSession = async (id: string, status: 'CANCELLED' | 'FINISHED' = 'CANCELLED') => {
    if (status === 'CANCELLED' && !confirm('Batalkan sesi ini?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/sessions/${id}/status`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      addToast('success', status === 'CANCELLED' ? 'Sesi dibatalkan' : 'Sesi diakhiri');
      fetchSessions();
    } catch {
      addToast('error', 'Gagal mengubah status sesi');
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Hapus template ini?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/templates/${id}`, { method: 'DELETE' });
      addToast('success', 'Template dihapus');
      fetchTemplates();
    } catch {
      addToast('error', 'Gagal menghapus template');
    }
  };

  const addTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate)
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Template berhasil ditambahkan');
        setShowAddModal(false);
        // Reset newTemplate Form
        setNewTemplate({
          name: '',
          description: '',
          layout: 'strip',
          photoCount: 4,
          frameColor: '#ffffff',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          accentColor: '#e91e8c',
          fonts: 'Inter',
          overlayImage: '',
          slotsJson: '',
          aspectRatio: '1:3'
        });
        fetchTemplates();
      } else {
        addToast('error', data.message || 'Gagal menambahkan template');
      }
    } catch {
      addToast('error', 'Koneksi gagal');
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setNewTemplate({ ...newTemplate, overlayImage: data.url });
        addToast('success', 'Gambar overlay diunggah');
      } else {
        addToast('error', data.message || 'Gagal unggah gambar');
      }
    } catch {
      addToast('error', 'Gagal unggah gambar');
    } finally {
      setUploadingImage(false);
    }
  };

  // Open layout editor for editing existing templates
  const handleOpenLayoutEditorForEdit = (t: Template) => {
    setEditingTemplate(t);
    setLayoutEditorMode('edit');
    setTempSlotsJson(t.slotsJson || undefined);
    setAspectRatio(t.aspectRatio || (t.layout === 'strip' ? '1:3' : '2:3'));
    setLayout(t.layout as any);
    setShowLayoutEditor(true);
  };

  // Handle saving slots coordinates from layout editor
  const handleSaveLayout = async (slotsJson: string) => {
    if (layoutEditorMode === 'create') {
      let count = 4;
      if (layout === 'strip3') count = 3;
      else if (layout === 'grid3x2') count = 6;
      else if (layout === 'single') count = 1;

      setNewTemplate(prev => ({
        ...prev,
        slotsJson,
        aspectRatio,
        layout: layout as any,
        photoCount: count
      }));
      setShowLayoutEditor(false);
      addToast('success', 'Letak foto disimpan ke draft template! Klik Simpan di bawah modal untuk menyimpan ke database.');
    } else if (layoutEditorMode === 'edit' && editingTemplate) {
      try {
        let count = 4;
        if (layout === 'strip3') count = 3;
        else if (layout === 'grid3x2') count = 6;
        else if (layout === 'single') count = 1;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/templates/${editingTemplate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotsJson,
            aspectRatio,
            layout: layout as any,
            photoCount: count
          })
        });
        const data = await res.json();
        if (data.success) {
          addToast('success', 'Tata letak template berhasil diperbarui! 🎉');
          setShowLayoutEditor(false);
          fetchTemplates();
        } else {
          addToast('error', data.message || 'Gagal menyimpan tata letak.');
        }
      } catch {
        addToast('error', 'Koneksi gagal saat menyimpan tata letak.');
      }
    }
  };

  if (!token) {
    return (
      <div className={styles.loginContainer}>
        <div className="card" style={{ padding: '32px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ marginBottom: '16px' }}>Admin Login</h2>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🛡️ Admin Dashboard</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => {
          localStorage.removeItem('pb_admin_token');
          setToken(null);
        }}>Logout</button>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'sessions' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          Active Sessions
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'templates' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'settings' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Pengaturan Kiosk
        </button>
      </div>


      <main className={styles.content}>
        {activeTab === 'sessions' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h2>Riwayat Sesi Terakhir</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowSessionModal(true)}>🚀 Mulai Sesi Baru</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => fetchSessions()}>Refresh</button>
                </div>
              </div>
              
              {/* Search Bar Input */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="🔍 Cari nama, event, atau kode sesi..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ 
                    paddingLeft: '36px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            <div className={styles.grid}>
              {sessions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Belum ada sesi yang cocok.</p>
              ) : sessions.map(s => {
                const expires = new Date(s.expiresAt);
                const isWarning = s.isActive && (expires.getTime() - Date.now()) < 60000;
                const isExpired = expires.getTime() <= Date.now();
                let statusColor = 'var(--text-muted)';
                let statusText = s.status;
                if (s.status === 'ACTIVE') { statusColor = 'var(--teal)'; statusText = 'Aktif'; }
                if (s.status === 'PENDING') { statusColor = 'var(--gold)'; statusText = 'Menunggu'; }
                if (s.status === 'FINISHED') { statusColor = 'var(--purple-mid)'; statusText = 'Selesai'; }
                if (s.status === 'CANCELLED') { statusColor = '#f87171'; statusText = 'Dibatalkan'; }

                return (
                  <div 
                    key={s.id} 
                    className="card" 
                    style={{ 
                      padding: '16px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px',
                      border: s.sessionCode ? '1px solid rgba(233, 30, 140, 0.2)' : '1px solid var(--border-color)',
                      boxShadow: s.isActive ? '0 0 12px rgba(233, 30, 140, 0.1)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <strong style={{ fontSize: '16px' }}>{s.userName}</strong>
                        {s.sessionName && (
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            🎬 {s.sessionName}
                          </span>
                        )}
                      </div>
                      <span style={{ color: isWarning ? '#f87171' : statusColor, fontWeight: 'bold', fontSize: '13px' }}>
                        {statusText}
                      </span>
                    </div>

                    {s.sessionCode && (
                      <div style={{ 
                        background: 'rgba(233, 30, 140, 0.08)', 
                        padding: '6px 10px', 
                        borderRadius: '6px', 
                        display: 'inline-flex', 
                        alignSelf: 'flex-start', 
                        fontSize: '13px', 
                        color: '#f472b6', 
                        fontWeight: 'bold',
                        border: '1px solid rgba(233, 30, 140, 0.15)'
                      }}>
                        🔑 Kode: {s.sessionCode}
                      </div>
                    )}

                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {s.id.slice(0,8)}...</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Dibuat: {new Date(s.startTime).toLocaleTimeString()} ({new Date(s.startTime).toLocaleDateString()})</p>
                    {s.isActive && !isExpired && (
                      <button className="btn btn-danger btn-sm" style={{ marginTop: 'auto', width: '100%' }} onClick={() => endSession(s.id, 'CANCELLED')}>
                        Batalkan Sesi
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2>Daftar Template</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>+ Tambah Template</button>
            </div>
            
            <div className={styles.grid}>
              {templates.map(t => (
                <div key={t.id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: t.backgroundColor, border: `2px solid ${t.frameColor}`, borderRadius: '4px' }} />
                    <strong style={{ flex: 1 }}>{t.name}</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Layout: {t.layout} (Rasio: {t.aspectRatio || '1:3'})</p>
                  <p style={{ fontSize: '13px' }}>{t.description}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleOpenLayoutEditorForEdit(t)}>
                      Atur Letak Foto 📐
                    </button>
                    <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => deleteTemplate(t.id)}>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2>⚙️ Pengaturan Fitur Kiosk</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Atur fitur sosial dan integrasi yang ditampilkan pada layar kiosk photobooth setelah pengguna selesai mengedit foto.
              </p>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0' }} />

              {/* WhatsApp Toggle Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong style={{ fontSize: '15px' }}>🟢 Aktifkan Fitur WhatsApp (Share)</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Tampilkan opsi kirim link foto Google Drive ke WhatsApp pada layar sukses penyelesaian.
                  </span>
                </div>
                <button
                  style={{
                    width: '60px',
                    height: '32px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    background: whatsappEnabled ? '#22c55e' : 'rgba(255,255,255,0.08)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    padding: 0
                  }}
                  onClick={() => setWhatsappEnabled(p => !p)}
                  type="button"
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '3px',
                    left: whatsappEnabled ? '31px' : '4px',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </button>
              </div>

              {/* Save Button */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
              >
                {isSavingSettings ? 'Menyimpan...' : '💾 Simpan Pengaturan'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add Template Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="modal-box" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '16px' }}>Tambah Template Baru</h2>
            <form onSubmit={addTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="label">Nama Template</label>
                <input required className="input" value={newTemplate.name} onChange={e => setNewTemplate({...newTemplate, name: e.target.value})} />
              </div>
              <div>
                <label className="label">Deskripsi</label>
                <input required className="input" value={newTemplate.description} onChange={e => setNewTemplate({...newTemplate, description: e.target.value})} />
              </div>
              <div>
                <label className="label">Layout Default</label>
                <select 
                  className="input" 
                  value={newTemplate.layout} 
                  onChange={e => {
                    const val = e.target.value as any;
                    let pc = 4;
                    let ar = '1:3';
                    if (val === 'strip') { pc = 4; ar = '1:3'; }
                    else if (val === 'strip3') { pc = 3; ar = '1:3'; }
                    else if (val === 'grid2x2') { pc = 4; ar = '2:3'; }
                    else if (val === 'grid3x2') { pc = 6; ar = '2:3'; }
                    else if (val === 'single') { pc = 1; ar = '3:4'; }
                    setNewTemplate({
                      ...newTemplate, 
                      layout: val,
                      photoCount: pc,
                      aspectRatio: ar
                    });
                  }}
                >
                  <option value="strip">Strip (4 Foto)</option>
                  <option value="strip3">Strip 3 Foto</option>
                  <option value="grid2x2">Grid 2x2 (4 Foto)</option>
                  <option value="grid3x2">Grid 3x2 (6 Foto)</option>
                  <option value="single">Single (1 Foto)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Frame Color</label>
                  <input type="color" style={{ width: '100%', height: '40px' }} value={newTemplate.frameColor} onChange={e => setNewTemplate({...newTemplate, frameColor: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Bg Color</label>
                  <input type="color" style={{ width: '100%', height: '40px' }} value={newTemplate.backgroundColor} onChange={e => setNewTemplate({...newTemplate, backgroundColor: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Overlay PNG (Opsional, transparan)</label>
                {newTemplate.overlayImage && (
                  <div style={{ marginBottom: '8px', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '4px' }}>
                    <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${newTemplate.overlayImage}`} alt="Overlay" style={{ maxHeight: '100px' }} />
                  </div>
                )}
                <input type="file" accept="image/png" className="input" onChange={handleUploadImage} disabled={uploadingImage} />
                {uploadingImage && <span style={{ fontSize: '12px' }}>Mengunggah...</span>}
              </div>

              {/* Set visual photo coordinates button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <label className="label">Atur Tata Letak Foto</label>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', padding: '10px' }}
                  onClick={() => {
                    setLayoutEditorMode('create');
                    setTempSlotsJson(newTemplate.slotsJson || undefined);
                    setAspectRatio(newTemplate.aspectRatio || '1:3');
                    setLayout(newTemplate.layout as any || 'strip');
                    setShowLayoutEditor(true);
                  }}
                >
                  📐 {newTemplate.slotsJson ? 'Ubah Tata Letak (Telah Diatur)' : 'Atur Letak Bingkai secara Visual'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary flex-1" onClick={() => setShowAddModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary flex-1">Simpan Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {showSessionModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowSessionModal(false); }}>
          <div className="modal-box" style={{ maxWidth: '400px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '16px' }}>🚀 Mulai Sesi Kiosk Baru</h2>
            <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="label">Nama Pelanggan (User)</label>
                <input 
                  required 
                  className="input" 
                  value={newSessionUser} 
                  onChange={e => setNewSessionUser(e.target.value)} 
                  placeholder="Contoh: Tamu, Budi, Clara"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="label">Nama Sesi / Nama Event (Opsional)</label>
                <input 
                  className="input" 
                  value={newSessionName} 
                  onChange={e => setNewSessionName(e.target.value)} 
                  placeholder="Contoh: Ultah Clara ke-17, Wedding Ani & Budi"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="label">Durasi Sesi (Menit)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="120"
                  required 
                  className="input" 
                  value={newSessionDuration} 
                  onChange={e => setNewSessionDuration(Number(e.target.value))} 
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary flex-1" onClick={() => setShowSessionModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary flex-1">Buat Sesi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Visual Layout Editor Modal */}
      {showLayoutEditor && (
        <AdminLayoutEditor
          initialSlotsJson={tempSlotsJson}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          layout={layout}
          setLayout={setLayout}
          photoCount={layoutEditorMode === 'create' ? (newTemplate.photoCount || 4) : (editingTemplate?.photoCount || 4)}
          frameColor={layoutEditorMode === 'create' ? (newTemplate.frameColor || '#ffffff') : (editingTemplate?.frameColor || '#ffffff')}
          backgroundColor={layoutEditorMode === 'create' ? (newTemplate.backgroundColor || '#ffffff') : (editingTemplate?.backgroundColor || '#ffffff')}
          frameWidth={layoutEditorMode === 'create' ? (newTemplate.frameWidth || 20) : (editingTemplate?.frameWidth || 20)}
          overlayImage={layoutEditorMode === 'create' ? (newTemplate.overlayImage || undefined) : (editingTemplate?.overlayImage || undefined)}
          onSave={handleSaveLayout}
          onClose={() => setShowLayoutEditor(false)}
        />
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
