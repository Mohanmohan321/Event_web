import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CARD_NUMS = ['01', '02', '03', '04', '05'];

function FlipCard({ card, index, isFlipped, isSelected, canSelect, slotLabel, onFlip, onSelect }) {
  return (
    <div
      className="card-scene flex-shrink-0"
      style={{ width: 'min(82vw, 310px)', height: 460 }}
    >
      <motion.div
        className="card-inner w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0.2, 0.2, 1] }}
        whileTap={{ scale: 0.98 }}
        onClick={onFlip}
      >

        {/* ══ FRONT ══ */}
        <div
          className="card-face card-front w-full h-full flex flex-col"
          style={{
            background: isSelected ? '#DFE104' : '#09090B',
            border: `2px solid ${isSelected ? '#DFE104' : '#3F3F46'}`,
            padding: '16px 16px 14px',
            transition: 'background 0.25s, border-color 0.25s',
          }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between" style={{ marginBottom: 8, flexShrink: 0 }}>
            <span
              style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: isSelected ? '#000000' : '#A1A1AA',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              Card {CARD_NUMS[index]}
            </span>

            {isSelected ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  background: '#000000',
                  color: '#DFE104',
                  padding: '3px 8px',
                }}
              >
                ✓ {slotLabel}
              </motion.span>
            ) : (
              <span style={{ fontSize: 10, color: '#3F3F46', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                TAP TO FLIP
              </span>
            )}
          </div>

          {/* Image or decorative number */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', minHeight: 0 }}>
            {card.image ? (
              <img
                src={card.image}
                alt={card.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 'clamp(5rem, 20vw, 8rem)',
                  fontWeight: 900,
                  lineHeight: 0.85,
                  letterSpacing: '-0.04em',
                  color: isSelected ? 'rgba(0,0,0,0.12)' : '#27272A',
                  userSelect: 'none',
                  transition: 'color 0.25s',
                }}
              >
                {CARD_NUMS[index]}
              </span>
            )}
          </div>

          {/* Title + desc */}
          <div style={{ borderTop: `1px solid ${isSelected ? 'rgba(0,0,0,0.15)' : '#27272A'}`, paddingTop: 12, marginTop: 8, flexShrink: 0 }}>
            <h3
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 14, fontWeight: 700,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                color: isSelected ? '#000000' : '#FAFAFA',
                lineHeight: 1.2,
                marginBottom: 5,
                transition: 'color 0.25s',
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontSize: 11, fontWeight: 400,
                color: isSelected ? 'rgba(0,0,0,0.65)' : '#A1A1AA',
                lineHeight: 1.5,
                transition: 'color 0.25s',
              }}
            >
              {card.description}
            </p>
          </div>
        </div>

        {/* ══ BACK ══ */}
        <div
          className="card-face card-back w-full h-full flex flex-col"
          style={{
            background: '#09090B',
            border: `2px solid ${isSelected ? '#DFE104' : '#3F3F46'}`,
            padding: '16px 16px 14px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Back header */}
          <div style={{ marginBottom: 10, flexShrink: 0 }}>
            <span
              style={{
                fontSize: 9, fontWeight: 700,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: '#DFE104',
                display: 'block', marginBottom: 4,
              }}
            >
              Synopsis — {CARD_NUMS[index]}
            </span>
            <h3
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 15, fontWeight: 700,
                letterSpacing: '0.03em', textTransform: 'uppercase',
                color: '#FAFAFA', lineHeight: 1.2,
              }}
            >
              {card.title}
            </h3>
          </div>

          {/* Divider */}
          <div style={{ height: 2, background: '#27272A', marginBottom: 10, flexShrink: 0 }} />

          {/* Back image (if any) */}
          {card.image && (
            <div style={{ height: 90, overflow: 'hidden', marginBottom: 10, flexShrink: 0 }}>
              <img
                src={card.image}
                alt={card.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          {/* Synopsis */}
          <p
            style={{
              fontSize: 12, fontWeight: 400,
              color: '#A1A1AA', lineHeight: 1.6,
              flex: 1,
              overflowY: 'auto',
            }}
          >
            {card.synopsis}
          </p>

          {/* Select button only — no flip-back button */}
          <div style={{ marginTop: 14, flexShrink: 0 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              disabled={!isSelected && !canSelect}
              style={{
                width: '100%',
                minHeight: 52,
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 12, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                border: 'none', borderRadius: 0, cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
                ...(isSelected
                  ? { background: '#DFE104', color: '#000000' }
                  : canSelect
                  ? { background: '#FAFAFA', color: '#000000' }
                  : { background: '#27272A', color: '#3F3F46', cursor: 'not-allowed' }
                ),
              }}
            >
              {isSelected ? `✓ ${slotLabel} — Deselect` : 'Select This Card'}
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default function FlipCardSection({ cards, selectedCards, setSelectedCards, onComplete }) {
  // Only one card can be flipped at a time — flipping one auto-collapses others
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const filledCount = selectedCards.filter(Boolean).length;

  const toggleFlip = (id) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
    setError('');
  };

  // Slot-based select: fills slot 1 first, then slot 2
  const toggleSelect = (card) => {
    setError('');
    const [s1, s2] = selectedCards;

    if (s1 === card.id) {
      // Deselect from slot 1
      setSelectedCards([null, s2]);
    } else if (s2 === card.id) {
      // Deselect from slot 2
      setSelectedCards([s1, null]);
    } else if (s1 === null) {
      // Fill slot 1
      setSelectedCards([card.id, s2]);
    } else if (s2 === null) {
      // Fill slot 2
      setSelectedCards([s1, card.id]);
    } else {
      setError('Max 2 cards. Deselect one first.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getSlotLabel = (cardId) => {
    if (selectedCards[0] === cardId) return 'SLOT 1';
    if (selectedCards[1] === cardId) return 'SLOT 2';
    return '';
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / cards.length;
      setActiveIndex(Math.min(Math.round(el.scrollLeft / cardWidth), cards.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [cards.length]);

  return (
    <div
      className="min-h-dvh flex flex-col safe-top safe-bottom"
      style={{ background: '#09090B' }}
    >

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '20px 20px 0', borderBottom: '1px solid #27272A', paddingBottom: 16 }}
      >
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#DFE104', marginBottom: 4 }}>
          THILINOMICE
        </p>
        <h2
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
            fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '-0.01em', lineHeight: 1,
            color: '#FAFAFA',
          }}
        >
          Choose Your Sessions
        </h2>
        <p style={{ fontSize: 12, color: '#A1A1AA', marginTop: 6, letterSpacing: '0.05em' }}>
          Flip a card to read the synopsis — you must select <strong style={{ color: '#FAFAFA' }}>exactly 2</strong>
        </p>
      </motion.div>

      {/* ── Selection slots ── */}
      <div
        style={{
          display: 'flex', gap: 0,
          borderBottom: '1px solid #27272A',
        }}
      >
        {[0, 1].map((slot) => {
          const card = cards.find((c) => c.id === selectedCards[slot]);
          return (
            <div
              key={slot}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRight: slot === 0 ? '1px solid #27272A' : 'none',
                background: card ? 'rgba(223,225,4,0.06)' : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: card ? '#DFE104' : '#3F3F46', marginBottom: 3 }}>
                Slot {slot + 1}
              </p>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: card ? '#FAFAFA' : '#3F3F46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {card ? card.title : '— Empty —'}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              background: '#FAFAFA',
              borderBottom: '2px solid #000',
            }}
          >
            <p style={{
              padding: '10px 20px',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#09090B',
            }}>
              ⚠ {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Horizontal scroll cards ── */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingTop: 24,
          paddingBottom: 16,
          paddingLeft: 'calc(50vw - min(41vw, 155px))',
          paddingRight: 'calc(50vw - min(41vw, 155px))',
          flex: '1 0 auto',
        }}
      >
        {cards.map((card, index) => (
          <div key={card.id} style={{ scrollSnapAlign: 'center' }}>
            <FlipCard
              card={card}
              index={index}
              isFlipped={flippedCardId === card.id}
              isSelected={selectedCards[0] === card.id || selectedCards[1] === card.id}
              canSelect={filledCount < 2}
              slotLabel={getSlotLabel(card.id)}
              onFlip={() => toggleFlip(card.id)}
              onSelect={() => toggleSelect(card)}
            />
          </div>
        ))}
      </div>

      {/* ── Dot indicators ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '4px 0 12px' }}>
        {cards.map((_, i) => (
          <div
            key={i}
            style={{
              height: 4,
              width: i === activeIndex ? 24 : 6,
              background: i === activeIndex ? '#DFE104' : '#27272A',
              transition: 'all 0.25s',
            }}
          />
        ))}
      </div>

      {/* ── Continue button ── */}
      <div style={{ padding: '12px 20px 20px', borderTop: '1px solid #27272A' }}>
        <AnimatePresence>
          {filledCount === 2 && (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={onComplete}
              className="btn-primary"
              style={{ fontSize: 13, letterSpacing: '0.18em' }}
            >
              Continue ({filledCount}/2 selected) →
            </motion.button>
          )}
        </AnimatePresence>

        <p style={{
          textAlign: 'center', marginTop: 10,
          fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#3F3F46',
        }}>
          {filledCount === 0 ? 'Flip cards and select 2 sessions' : filledCount === 1 ? 'Select 1 more to continue' : 'Both slots filled — ready!'}
        </p>
      </div>
    </div>
  );
}
