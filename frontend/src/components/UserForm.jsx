import { useState } from 'react';
import { motion } from 'framer-motion';
import { BACKEND_URL } from '../config';

export default function UserForm({ selectedCards, cards, onSuccess, onBack }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // selectedCards is [slot1Id | null, slot2Id | null]
  const slot1Card = cards.find((c) => c.id === selectedCards[0]) || null;
  const slot2Card = cards.find((c) => c.id === selectedCards[1]) || null;
  const slotCards = [slot1Card, slot2Card];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Name is required.');
    if (!phone.trim() || !/^\d{7,15}$/.test(phone.trim())) return setError('Enter a valid phone number (7–15 digits).');

    setLoading(true);

    const submission = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      slot1CardId: selectedCards[0] || null,
      slot1CardTitle: slot1Card?.title || null,
      slot2CardId: selectedCards[1] || null,
      slot2CardTitle: slot2Card?.title || null,
      selectedCards: slotCards
        .map((c, i) => c ? `Slot ${i + 1}: ${c.title}` : null)
        .filter(Boolean)
        .join(' | '),
      synopsis: slotCards.filter(Boolean).map((c) => c.synopsis).join(' | '),
      createdAt: new Date().toISOString(),
    };

    // Always save to localStorage as fallback
    const existing = JSON.parse(localStorage.getItem('thilinomice_submissions') || '[]');
    localStorage.setItem('thilinomice_submissions', JSON.stringify([...existing, submission]));

    // POST to backend (best-effort — user proceeds even if offline)
    try {
      await fetch(`${BACKEND_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: submission.name,
          phone: submission.phone,
          selectedCards: selectedCards.filter(Boolean),
          slot1CardId: submission.slot1CardId,
          slot1CardTitle: submission.slot1CardTitle,
          slot2CardId: submission.slot2CardId,
          slot2CardTitle: submission.slot2CardTitle,
        }),
      });
    } catch {
      // Backend unreachable — localStorage copy already saved above
    }

    setLoading(false);
    onSuccess(submission);
  };

  return (
    <div
      className="min-h-dvh flex flex-col safe-top safe-bottom"
      style={{ background: '#09090B' }}
    >

      {/* ── Header ── */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #27272A' }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#1F51FF', marginBottom: 4 }}>
          Almost There
        </p>
        <h2
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.6rem, 7vw, 2.8rem)',
            fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '-0.01em', lineHeight: 1,
            color: '#FAFAFA',
          }}
        >
          Your Details
        </h2>
      </div>

      {/* ── Selected cards recap ── */}
      <div style={{ borderBottom: '1px solid #27272A' }}>
        <div style={{ padding: '12px 20px 4px' }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A1A1AA' }}>
            Selected Sessions
          </p>
        </div>
        {slotCards.map((card, slotIdx) =>
          card ? (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: slotIdx * 0.06 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 20px',
                borderBottom: slotIdx === 0 && slot2Card ? '1px solid #27272A' : 'none',
              }}
            >
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                <div
                  style={{
                    width: 36, height: 36,
                    color: '#FFFFFF',
                  }}
                >
                  S{slotIdx + 1}
                </div>
                <p style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3F3F46', marginTop: 3 }}>
                  Slot {slotIdx + 1}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#FAFAFA', lineHeight: 1.2 }}>
                  {card.title}
                </p>
                <p style={{ fontSize: 11, color: '#A1A1AA', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60vw' }}>
                  {card.synopsis}
                </p>
              </div>
            </motion.div>
          ) : null
        )}
      </div>

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 20px' }}
      >
        {/* Name */}
        <div style={{ marginBottom: 32 }}>
          <label
            style={{
              display: 'block', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: '#A1A1AA', marginBottom: 8,
            }}
          >
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="kt-input"
            autoComplete="name"
            maxLength={80}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 32 }}>
          <label
            style={{
              display: 'block', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: '#A1A1AA', marginBottom: 8,
            }}
          >
            Phone Number
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="0000000000"
            className="kt-input"
            autoComplete="tel"
            maxLength={15}
          />
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: '#FAFAFA', color: '#09090B',
              padding: '10px 16px', marginBottom: 20,
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            ⚠ {error}
          </motion.div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 0, marginTop: 'auto' }}>
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            style={{
              flex: 1,
              minHeight: 56,
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              background: 'transparent',
              border: '2px solid #3F3F46',
              borderRight: 'none',
              color: '#A1A1AA',
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 2,
              minHeight: 56,
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              background: loading ? '#A1A1AA' : '#1F51FF',
              border: 'none',
              color: '#000000',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? (
              <><span className="spinner" style={{ borderTopColor: '#000', borderColor: 'rgba(0,0,0,0.2)' }} /> Saving…</>
            ) : 'Register Now'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 9, color: '#3F3F46', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 12 }}>
          Your data is kept private by SPI EDGE
        </p>
      </form>
    </div>
  );
}
