import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_CARDS, STORAGE_KEYS } from '../../cardData';
import { BACKEND_URL } from '../../config';

// ─── Image resize helper ───────────────────────────────────────────
function resizeImageToBase64(file, maxPx = 700, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxPx || h > maxPx) {
          if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
          else { w = Math.round(w * maxPx / h); h = maxPx; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─── Card Editor ──────────────────────────────────────────────────
function CardEditorModal({ card, onClose, onSaved }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [synopsis, setSynopsis] = useState(card.synopsis);
  const [imagePreview, setImagePreview] = useState(card.image || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await resizeImageToBase64(file);
      setImagePreview(base64);
    } catch {
      setError('Failed to process image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim() || !synopsis.trim()) return setError('All fields are required.');
    onSaved({ ...card, title: title.trim(), description: description.trim(), synopsis: synopsis.trim(), image: imagePreview });
    onClose();
  };

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)' }} onClick={onClose} />
      <motion.div
        style={{
          position: 'relative', zIndex: 10, width: '100%', maxWidth: 520,
          background: '#09090B',
          borderTop: '2px solid #1F51FF',
          padding: '24px 20px 32px',
          maxHeight: '92dvh', overflowY: 'auto',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      >
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#1F51FF', marginBottom: 4 }}>Editing</p>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, textTransform: 'uppercase', color: '#FAFAFA', marginBottom: 24 }}>
          Card {String(card.id).padStart(2, '0')}
        </h3>

        {/* Image upload */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 10 }}>
            Card Image
          </label>
          {imagePreview ? (
            <div style={{ position: 'relative', marginBottom: 0 }}>
              <img
                src={imagePreview}
                alt="Card preview"
                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', border: '1px solid #27272A' }}
              />
              <div style={{ display: 'flex', gap: 0, marginTop: 0 }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    flex: 1, height: 36, fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                    background: 'transparent', border: '1px solid #3F3F46', borderTop: 'none', borderRight: 'none',
                    color: '#A1A1AA', cursor: 'pointer',
                  }}
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  style={{
                    flex: 1, height: 36, fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                    background: 'transparent', border: '1px solid #3F3F46', borderTop: 'none',
                    color: '#71717A', cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                width: '100%', height: 100,
                background: 'transparent',
                border: '2px dashed #3F3F46',
                color: uploading ? '#3F3F46' : '#71717A',
                cursor: uploading ? 'wait' : 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {uploading ? 'Processing…' : 'Upload Image'}
              </span>
              <span style={{ fontSize: 9, color: '#3F3F46' }}>JPG, PNG, WEBP — auto-resized</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 8 }}>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="kt-input" maxLength={60} />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 8 }}>Description (front)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            rows={3}
            style={{
              background: 'transparent', border: 'none', borderBottom: '2px solid #3F3F46',
              color: '#FAFAFA', fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 16, fontWeight: 500, width: '100%',
              outline: 'none', resize: 'none', padding: '8px 0', lineHeight: 1.6,
            }}
            onFocus={(e) => e.target.style.borderBottomColor = '#1F51FF'}
            onBlur={(e) => e.target.style.borderBottomColor = '#3F3F46'}
          />
          <p style={{ fontSize: 9, color: '#3F3F46', textAlign: 'right', marginTop: 4 }}>{description.length}/200</p>
        </div>

        {/* Synopsis */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 8 }}>Synopsis (back)</label>
          <textarea
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            maxLength={400}
            rows={4}
            style={{
              background: 'transparent', border: 'none', borderBottom: '2px solid #3F3F46',
              color: '#FAFAFA', fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 16, fontWeight: 500, width: '100%',
              outline: 'none', resize: 'none', padding: '8px 0', lineHeight: 1.6,
            }}
            onFocus={(e) => e.target.style.borderBottomColor = '#1F51FF'}
            onBlur={(e) => e.target.style.borderBottomColor = '#3F3F46'}
          />
          <p style={{ fontSize: 9, color: '#3F3F46', textAlign: 'right', marginTop: 4 }}>{synopsis.length}/400</p>
        </div>

        {error && (
          <div style={{ background: '#FAFAFA', color: '#09090B', padding: '10px 14px', marginBottom: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 0 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, minHeight: 52, fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', border: '2px solid #3F3F46', borderRight: 'none', color: '#A1A1AA', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ flex: 2, minHeight: 52, fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFFFFF', cursor: 'pointer' }}
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── CSV Export ────────────────────────────────────────────────────
function exportCSV(submissions) {
  if (!submissions.length) { alert('No submissions yet.'); return; }
  const header = 'name,phone,slot1,slot2,submittedAt';
  const rows = submissions.map((s) => [
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${s.phone || ''}"`,
    `"${(s.slot1CardTitle || s.selectedCards || '').replace(/"/g, '""')}"`,
    `"${(s.slot2CardTitle || '').replace(/"/g, '""')}"`,
    `"${s.createdAt || ''}"`,
  ].join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thilinomice_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Dashboard ────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const [slotFilter, setSlotFilter] = useState(null);
  const [cardFilters, setCardFilters] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Load cards from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.cards);
    setCards(saved ? JSON.parse(saved) : DEFAULT_CARDS);
  }, []);

  // Fetch submissions from backend with 20s timeout + retry support
  const fetchSubmissions = () => {
    setLoadingData(true);
    setFetchError(false);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    fetch(`${BACKEND_URL}/data`, { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setSubmissions(json.data);
        } else {
          throw new Error('bad response');
        }
      })
      .catch(() => setFetchError(true))
      .finally(() => { clearTimeout(timer); setLoadingData(false); });
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleCardSaved = (updated) => {
    const next = cards.map((c) => (c.id === updated.id ? updated : c));
    setCards(next);
    localStorage.setItem(STORAGE_KEYS.cards, JSON.stringify(next));
  };

  const handleDeleteSubmission = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    // Optimistic UI update
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    // Delete from backend
    try {
      await fetch(`${BACKEND_URL}/data/${id}`, { method: 'DELETE' });
    } catch {
      // Backend unreachable — already removed from local view
    }
    // Sync localStorage
    const next = JSON.parse(localStorage.getItem(STORAGE_KEYS.submissions) || '[]').filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.submissions, JSON.stringify(next));
  };

  const toggleCardFilter = (id) => {
    setCardFilters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSlotFilter = (slot) => {
    if (slotFilter === slot) {
      setSlotFilter(null);
      setCardFilters([]);
    } else {
      setSlotFilter(slot);
      setCardFilters([]);
    }
  };

  const clearAllFilters = () => {
    setNameSearch('');
    setCardFilters([]);
    setSlotFilter(null);
    setShowFilterPanel(false);
  };

  const activeFilterCount = (slotFilter !== null ? 1 : 0) + cardFilters.length;
  const hasFilters = nameSearch.trim() || activeFilterCount > 0;

  const filteredSubmissions = submissions.filter((s) => {
    if (nameSearch.trim() && !(s.name || '').toLowerCase().includes(nameSearch.trim().toLowerCase())) return false;

    if (slotFilter !== null && cardFilters.length > 0) {
      // Filter by specific slot AND specific card(s)
      const slotCardId = slotFilter === 1 ? s.slot1CardId : s.slot2CardId;
      if (!cardFilters.includes(slotCardId)) return false;
    } else if (slotFilter !== null) {
      // Filter by slot only: show submissions that have any card in that slot
      const slotCardId = slotFilter === 1 ? s.slot1CardId : s.slot2CardId;
      if (!slotCardId) return false;
    } else if (cardFilters.length > 0) {
      // Filter by card only (any slot)
      if (!cardFilters.includes(s.slot1CardId) && !cardFilters.includes(s.slot2CardId)) return false;
    }

    return true;
  });

  const handleResetCards = () => {
    if (!window.confirm('Reset all cards to default content?')) return;
    setCards(DEFAULT_CARDS);
    localStorage.removeItem(STORAGE_KEYS.cards);
  };

  const TABS = [
    { id: 'submissions', label: 'Registrations' },
    { id: 'cards', label: 'Edit Cards' },
  ];

  return (
    <div className="min-h-dvh flex flex-col safe-top safe-bottom" style={{ background: '#09090B' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #27272A' }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#1F51FF', marginBottom: 2 }}>Admin</p>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FAFAFA' }}>
            THILINOMICE
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => exportCSV(submissions)}
            style={{ minHeight: 44, minWidth: 44, padding: '0 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', border: '2px solid #3F3F46', color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
          <button
            onClick={onLogout}
            style={{ minHeight: 44, minWidth: 44, padding: '0 14px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', border: '2px solid #3F3F46', color: '#A1A1AA', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'flex' }}>
        {[
          { label: 'Registrations', value: submissions.length },
          { label: 'Cards', value: cards.length },
        ].map((stat, i) => (
          <div key={stat.label} style={{ flex: 1, padding: '16px 20px', borderBottom: '1px solid #27272A', borderRight: i === 0 ? '1px solid #27272A' : 'none' }}>
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 4 }}>{stat.label}</p>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 32, fontWeight: 900, color: stat.value > 0 ? '#1F51FF' : '#27272A', lineHeight: 1 }}>
              {String(stat.value).padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #27272A' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, minHeight: 48,
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              background: tab === t.id ? '#1F51FF' : 'transparent',
              border: 'none',
              borderRight: t.id === 'submissions' ? '1px solid #27272A' : 'none',
              color: tab === t.id ? '#FFFFFF' : '#A1A1AA',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">

          {/* Submissions */}
          {tab === 'submissions' && (
            <motion.div key="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* ── Loading state ── */}
              {loadingData && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '28px 20px', borderBottom: '1px solid #27272A' }}>
                  <span className="spinner" style={{ borderTopColor: '#1F51FF', borderColor: '#27272A', width: 16, height: 16 }} />
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3F3F46' }}>Fetching data…</p>
                </div>
              )}

              {/* ── Error / retry state ── */}
              {!loadingData && fetchError && (
                <div style={{ padding: '24px 20px', borderBottom: '1px solid #27272A', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A1A1AA', textAlign: 'center', lineHeight: 1.6 }}>
                    Backend waking up — can take ~30 sec on first load
                  </p>
                  <button
                    onClick={fetchSubmissions}
                    style={{
                      padding: '0 24px', height: 44,
                      background: '#1F51FF', border: 'none', color: '#FFFFFF',
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
                      fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    ↺ Retry
                  </button>
                </div>
              )}

              {/* ── Search + Filter row ── */}
              <div style={{ borderBottom: '1px solid #27272A' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  {/* Name search */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#A1A1AA" strokeWidth={2.5} style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                      style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 500,
                        color: '#FAFAFA',
                      }}
                    />
                    {nameSearch && (
                      <button onClick={() => setNameSearch('')} style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: 0, display: 'flex' }}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                  {/* Filter toggle button */}
                  <button
                    onClick={() => setShowFilterPanel((v) => !v)}
                    style={{
                      minHeight: 48, padding: '0 16px',
                      background: activeFilterCount > 0 ? '#1F51FF' : 'transparent',
                      borderTop: 'none', borderBottom: 'none', borderRight: 'none',
                      borderLeft: '1px solid #27272A',
                      color: activeFilterCount > 0 ? '#FFFFFF' : '#A1A1AA',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
                    </svg>
                    Filter
                    {activeFilterCount > 0 && (
                      <span style={{ background: activeFilterCount > 0 ? '#000' : '#27272A', color: '#1F51FF', borderRadius: 2, padding: '1px 5px', fontSize: 9, fontWeight: 900 }}>
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Filter panel */}
                <AnimatePresence>
                  {showFilterPanel && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ overflow: 'hidden', borderTop: '1px solid #27272A' }}
                    >
                      <div style={{ padding: '14px 16px 16px' }}>

                        {/* Slot filter */}
                        <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#71717A', marginBottom: 8 }}>
                          Filter by slot
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                          {[1, 2].map((slot) => {
                            const active = slotFilter === slot;
                            return (
                              <button
                                key={slot}
                                onClick={() => toggleSlotFilter(slot)}
                                style={{
                                  height: 36, padding: '0 16px',
                                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700,
                                  letterSpacing: '0.15em', textTransform: 'uppercase',
                                  background: active ? '#1F51FF' : 'transparent',
                                  border: `2px solid ${active ? '#1F51FF' : '#3F3F46'}`,
                                  color: active ? '#FFFFFF' : '#71717A',
                                  cursor: 'pointer',
                                  transition: 'all 0.12s',
                                }}
                              >
                                Slot {slot}
                              </button>
                            );
                          })}
                        </div>

                        {/* Card filter */}
                        <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#71717A', marginBottom: 8 }}>
                          {slotFilter ? `Cards in slot ${slotFilter}` : 'Filter by card'}
                        </p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {cards.map((card) => {
                            const active = cardFilters.includes(card.id);
                            return (
                              <button
                                key={card.id}
                                onClick={() => toggleCardFilter(card.id)}
                                style={{
                                  minWidth: 48, height: 36,
                                  fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 900,
                                  background: active ? '#1F51FF' : 'transparent',
                                  border: `2px solid ${active ? '#1F51FF' : '#3F3F46'}`,
                                  color: active ? '#FFFFFF' : '#71717A',
                                  cursor: 'pointer',
                                  transition: 'all 0.12s',
                                }}
                              >
                                {String(card.id).padStart(2, '0')}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Applied filters chips ── */}
              <AnimatePresence>
                {hasFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid #27272A', flexWrap: 'wrap' }}
                  >
                    {/* Name chip */}
                    {nameSearch.trim() && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#18181B', border: '1px solid #3F3F46', padding: '4px 10px', fontSize: 10, fontWeight: 700, color: '#FAFAFA', letterSpacing: '0.05em' }}>
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#A1A1AA" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
                        {nameSearch.trim()}
                        <button onClick={() => setNameSearch('')} style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: 0, display: 'flex', marginLeft: 2 }}>
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    )}
                    {/* Slot chip */}
                    {slotFilter !== null && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Slot {slotFilter}
                        <button onClick={() => toggleSlotFilter(slotFilter)} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: 0, display: 'flex', marginLeft: 2 }}>
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    )}
                    {/* Card chips */}
                    {cardFilters.sort((a, b) => a - b).map((id) => (
                      <span key={id} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#27272A', border: '1px solid #3F3F46', padding: '4px 10px', fontSize: 10, fontWeight: 900, color: '#FAFAFA', fontFamily: 'Orbitron, sans-serif' }}>
                        Card {String(id).padStart(2, '0')}
                        <button onClick={() => toggleCardFilter(id)} style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: 0, display: 'flex', marginLeft: 2 }}>
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    ))}
                    {/* Count + clear all */}
                    <span style={{ fontSize: 9, color: '#71717A', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginLeft: 'auto' }}>
                      {filteredSubmissions.length}/{submissions.length}
                    </span>
                    <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>
                      Clear all
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── List ── */}
              {filteredSubmissions.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 12 }}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#27272A" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#27272A' }}>
                    {hasFilters ? 'No matches found' : 'No registrations yet'}
                  </p>
                </div>
              ) : (
                filteredSubmissions.map((sub, idx) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    style={{ borderBottom: '1px solid #27272A', padding: '16px 20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ width: 36, height: 36, color: '#FFFFFF', flexShrink: 0 }}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#FAFAFA' }}>{sub.name}</p>
                          <p style={{ fontSize: 11, color: '#A1A1AA', marginTop: 1 }}>{sub.phone}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        style={{ minWidth: 36, minHeight: 36, background: 'transparent', border: '1px solid #3F3F46', color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Slot display */}
                    <div style={{ display: 'flex', gap: 0 }}>
                      {[
                        { label: 'S1', title: sub.slot1CardTitle },
                        { label: 'S2', title: sub.slot2CardTitle },
                      ].map((slot, si) => (
                        slot.title ? (
                          <div
                            key={si}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              flex: 1,
                              padding: '7px 10px',
                              background: 'rgba(223,225,4,0.05)',
                              border: '1px solid #27272A',
                              marginRight: si === 0 ? 6 : 0,
                            }}
                          >
                            <span style={{ fontSize: 9, fontWeight: 900, color: '#1F51FF', fontFamily: 'Orbitron, sans-serif', flexShrink: 0 }}>{slot.label}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#FAFAFA', textTransform: 'uppercase', letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slot.title}</span>
                          </div>
                        ) : (
                          sub.slot1CardId === undefined ? null : (
                            <div key={si} style={{ flex: 1, padding: '7px 10px', border: '1px solid #27272A', marginRight: si === 0 ? 6 : 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 9, fontWeight: 900, color: '#3F3F46', fontFamily: 'Orbitron, sans-serif' }}>{slot.label}</span>
                              <span style={{ fontSize: 11, color: '#3F3F46' }}>—</span>
                            </div>
                          )
                        )
                      ))}
                    </div>
                    {/* Fallback for old submissions without slot data */}
                    {sub.slot1CardId === undefined && (
                      <p style={{ fontSize: 11, color: '#A1A1AA', lineHeight: 1.5, marginTop: 6 }}>{sub.selectedCards}</p>
                    )}

                    <p style={{ fontSize: 9, color: '#3F3F46', marginTop: 8, letterSpacing: '0.1em' }}>
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : ''}
                    </p>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Edit Cards */}
          {tab === 'cards' && (
            <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px', borderBottom: '1px solid #27272A' }}>
                <button
                  onClick={handleResetCards}
                  style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3F3F46', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Reset to defaults
                </button>
              </div>
              {cards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid #27272A' }}
                >
                  {/* Card image thumbnail or placeholder */}
                  <div style={{ width: 48, height: 48, flexShrink: 0, overflow: 'hidden', border: '1px solid #27272A', background: '#18181B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {card.image ? (
                      <img src={card.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, fontWeight: 900, color: '#27272A' }}>
                        {String(card.id).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#FAFAFA', marginBottom: 3 }}>{card.title}</p>
                    <p style={{ fontSize: 11, color: '#A1A1AA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.description}</p>
                  </div>
                  <button
                    onClick={() => setEditingCard(card)}
                    style={{ minHeight: 36, minWidth: 56, padding: '0 12px', fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', border: '2px solid #3F3F46', color: '#A1A1AA', cursor: 'pointer', flexShrink: 0 }}
                  >
                    Edit
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card editor modal */}
      <AnimatePresence>
        {editingCard && (
          <CardEditorModal card={editingCard} onClose={() => setEditingCard(null)} onSaved={handleCardSaved} />
        )}
      </AnimatePresence>
    </div>
  );
}
