import HTMLFlipBook from 'react-pageflip';
import { useRef, useState, useCallback, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// ─── Page flip sound (subtle paper rustle) ────────────────────────────────────
function playFlipSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3) * 0.25;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch { /* silently fail */ }
}

// ─── Chapter accent colors ────────────────────────────────────────────────────
const CHAPTER_COLORS = [
  { primary: '#7c3aed', light: '#ede9fe', border: '#c4b5fd' }, // violet
  { primary: '#0369a1', light: '#e0f2fe', border: '#7dd3fc' }, // sky
  { primary: '#b45309', light: '#fef3c7', border: '#fcd34d' }, // amber
  { primary: '#15803d', light: '#dcfce7', border: '#86efac' }, // green
  { primary: '#c2410c', light: '#ffedd5', border: '#fdba74' }, // orange
  { primary: '#be123c', light: '#ffe4e6', border: '#fda4af' }, // rose
];

const SESSION_ICONS = ['✦', '⚙', '◈', '❋', '◆', '★'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

// ─── COVER PAGE ───────────────────────────────────────────────────────────────
const CoverPage = forwardRef((_props, ref) => (
  <div ref={ref} style={{ width: '100%', height: '100%' }}>
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #1a0533 0%, #2d1b69 45%, #0e1f5e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '36px 24px 28px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top ornamental border */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)',
          marginBottom: 12,
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ height: '1px', flex: 1, background: 'rgba(212,175,55,0.3)' }} />
          <span style={{ color: 'rgba(212,175,55,0.7)', fontSize: 10, letterSpacing: 6, textTransform: 'uppercase', fontFamily: 'Orbitron, sans-serif' }}>SPI EDGE</span>
          <div style={{ height: '1px', flex: 1, background: 'rgba(212,175,55,0.3)' }} />
        </div>
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)',
          marginTop: 12,
        }} />
      </div>

      {/* Center: star + title */}
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        {/* Decorative star / emblem */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
          border: '1px solid rgba(212,175,55,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 0 40px rgba(212,175,55,0.15)',
        }}>
          <span style={{ color: 'rgba(212,175,55,0.9)' }}>✦</span>
        </div>

        {/* Presents line */}
        <p style={{
          color: 'rgba(212,175,55,0.6)',
          fontSize: 10,
          letterSpacing: 5,
          textTransform: 'uppercase',
          fontFamily: 'Bricolage Grotesque, sans-serif',
          margin: 0,
        }}>
          PRESENTS
        </p>

        {/* Main title */}
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 900,
          fontSize: 'clamp(26px, 8vw, 34px)',
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.1,
          textAlign: 'center',
          letterSpacing: '0.02em',
          textShadow: '0 0 40px rgba(212,175,55,0.3)',
        }}>
          THILINOMICE
        </h1>

        {/* Gold divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '80%' }}>
          <div style={{ height: '1px', flex: 1, background: 'rgba(212,175,55,0.4)' }} />
          <span style={{ color: 'rgba(212,175,55,0.6)', fontSize: 12 }}>◈</span>
          <div style={{ height: '1px', flex: 1, background: 'rgba(212,175,55,0.4)' }} />
        </div>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
          margin: 0,
          letterSpacing: '0.03em',
        }}>
          An Interactive Event Experience
        </p>

        {/* Chapter count */}
        <div style={{
          display: 'flex',
          gap: 6,
          marginTop: 8,
        }}>
          {[1,2,3,4,5,6].map(n => (
            <div key={n} style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(212,175,55,0.4)',
            }} />
          ))}
        </div>
        <p style={{
          color: 'rgba(212,175,55,0.5)',
          fontSize: 10,
          letterSpacing: 3,
          textTransform: 'uppercase',
          fontFamily: 'Bricolage Grotesque, sans-serif',
          margin: 0,
        }}>
          SIX SESSIONS
        </p>
      </div>

      {/* Bottom */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
          marginBottom: 10,
        }} />
        <p style={{
          color: 'rgba(255,255,255,0.25)',
          fontSize: 9,
          letterSpacing: 3,
          textTransform: 'uppercase',
          fontFamily: 'Bricolage Grotesque, sans-serif',
          margin: 0,
        }}>
          Flip to Begin →
        </p>
      </div>

      {/* Subtle background pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
      }} />
    </div>
  </div>
));
CoverPage.displayName = 'CoverPage';

// ─── SESSION CHAPTER PAGE ─────────────────────────────────────────────────────
const SessionPage = forwardRef(({ page, pageIndex, isSelected, onToggle }, ref) => {
  const ch = CHAPTER_COLORS[pageIndex] || CHAPTER_COLORS[0];
  const chNum = ROMAN[pageIndex] || String(pageIndex + 1);
  const icon = SESSION_ICONS[pageIndex] || '✦';

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(160deg, #fffdf7 0%, #f8f4ef 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          borderLeft: `4px solid ${ch.primary}`,
        }}
      >
        {/* Selected glow overlay */}
        {isSelected && (
          <div style={{
            position: 'absolute',
            inset: 0,
            border: `2px solid ${ch.primary}`,
            boxShadow: `inset 0 0 20px ${ch.primary}22, 0 0 20px ${ch.primary}44`,
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: 2,
            animation: 'selectedPulse 2s ease-in-out infinite',
          }} />
        )}

        {/* Chapter header strip */}
        <div style={{
          background: ch.light,
          borderBottom: `1px solid ${ch.border}`,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Chapter badge */}
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: ch.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                color: 'white',
                fontSize: 13,
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
              }}>{chNum}</span>
            </div>
            <div>
              <p style={{
                margin: 0,
                fontSize: 8,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: ch.primary,
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 600,
                opacity: 0.7,
              }}>Chapter {pageIndex + 1}</p>
              <p style={{
                margin: 0,
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#8a7a6a',
                fontFamily: 'Bricolage Grotesque, sans-serif',
              }}>THILINOMICE</p>
            </div>
          </div>

          {/* Selected badge */}
          {isSelected && (
            <div style={{
              background: ch.primary,
              color: 'white',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: 20,
              fontFamily: 'Bricolage Grotesque, sans-serif',
            }}>
              ✓ Selected
            </div>
          )}
        </div>

        {/* Page body */}
        <div style={{
          flex: 1,
          padding: '16px 18px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflow: 'hidden',
        }}>
          {/* Icon + Title */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}>
              <span style={{
                fontSize: 28,
                color: ch.primary,
                lineHeight: 1,
                opacity: 0.85,
              }}>{icon}</span>
              <div style={{
                height: '1px',
                flex: 1,
                background: `linear-gradient(90deg, ${ch.border}, transparent)`,
              }} />
            </div>

            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              fontSize: 'clamp(17px, 5vw, 22px)',
              color: '#1c1410',
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '0.01em',
            }}>
              {page.title}
            </h2>
          </div>

          {/* Ornamental divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ height: '1px', flex: 1, background: '#e5ddd3' }} />
            <span style={{ color: ch.primary, fontSize: 10, opacity: 0.6 }}>◈</span>
            <div style={{ height: '1px', flex: 1, background: '#e5ddd3' }} />
          </div>

          {/* Body text */}
          <p style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: 'clamp(11px, 3.2vw, 13px)',
            color: '#4a3f35',
            lineHeight: 1.75,
            margin: 0,
            flex: 1,
          }}>
            {page.content}
          </p>

          {/* Synopsis pill */}
          {page.synopsis && (
            <div style={{
              background: ch.light,
              border: `1px solid ${ch.border}`,
              borderRadius: 8,
              padding: '7px 12px',
              flexShrink: 0,
            }}>
              <p style={{
                margin: 0,
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: ch.primary,
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 600,
                marginBottom: 3,
                opacity: 0.8,
              }}>Session Brief</p>
              <p style={{
                margin: 0,
                fontSize: 11,
                color: '#5a4a3a',
                fontFamily: 'Playfair Display, serif',
                fontStyle: 'italic',
                lineHeight: 1.4,
              }}>{page.synopsis}</p>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(page.id); }}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 8,
                border: `1.5px solid ${ch.primary}`,
                background: isSelected ? ch.primary : 'transparent',
                color: isSelected ? 'white' : ch.primary,
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {isSelected ? '✓ Registered' : 'Register'}
            </button>
            {isSelected && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggle(page.id); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1.5px solid #dc2626',
                  background: 'transparent',
                  color: '#dc2626',
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Page number footer */}
        <div style={{
          borderTop: '1px solid #e5ddd3',
          padding: '6px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{
            height: '1px',
            flex: 1,
            background: 'linear-gradient(90deg, #e5ddd3, transparent)',
          }} />
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 11,
            color: '#b8a898',
            fontStyle: 'italic',
            padding: '0 12px',
          }}>
            — {pageIndex + 1} —
          </span>
          <div style={{
            height: '1px',
            flex: 1,
            background: 'linear-gradient(90deg, transparent, #e5ddd3)',
          }} />
        </div>
      </div>
    </div>
  );
});
SessionPage.displayName = 'SessionPage';

// ─── BACK COVER / COMPLETE PAGE ───────────────────────────────────────────────
const CompletePage = forwardRef(({ selectedCount, onComplete }, ref) => (
  <div ref={ref} style={{ width: '100%', height: '100%' }}>
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #0e1f5e 0%, #2d1b69 60%, #1a0533 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 24px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top ornament */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ height: '1px', flex: 1, background: 'rgba(212,175,55,0.3)' }} />
          <span style={{ color: 'rgba(212,175,55,0.5)', fontSize: 14 }}>✦</span>
          <div style={{ height: '1px', flex: 1, background: 'rgba(212,175,55,0.3)' }} />
        </div>
      </div>

      {/* Center content */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, flex: 1, justifyContent: 'center' }}>
        {/* Emblem */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '1px solid rgba(212,175,55,0.4)',
          background: 'rgba(212,175,55,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          color: 'rgba(212,175,55,0.8)',
          boxShadow: '0 0 30px rgba(212,175,55,0.1)',
        }}>
          ★
        </div>

        <div>
          <p style={{
            color: 'rgba(212,175,55,0.6)',
            fontSize: 9,
            letterSpacing: 4,
            textTransform: 'uppercase',
            fontFamily: 'Bricolage Grotesque, sans-serif',
            margin: '0 0 10px',
          }}>
            FINIS
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            fontSize: 22,
            color: 'white',
            margin: '0 0 8px',
            lineHeight: 1.2,
          }}>
            Your Story<br />Awaits
          </h2>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.45)',
            fontSize: 12,
            margin: 0,
            lineHeight: 1.6,
          }}>
            {selectedCount === 0
              ? 'Go back and choose your sessions to continue.'
              : `${selectedCount} session${selectedCount > 1 ? 's' : ''} selected. Ready to register.`}
          </p>
        </div>

        {/* Complete button */}
        <button
          onClick={selectedCount > 0 ? onComplete : undefined}
          disabled={selectedCount === 0}
          style={{
            width: '100%',
            maxWidth: 220,
            padding: '14px 24px',
            borderRadius: 10,
            border: selectedCount > 0
              ? '1.5px solid rgba(212,175,55,0.6)'
              : '1.5px solid rgba(255,255,255,0.1)',
            background: selectedCount > 0
              ? 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.1))'
              : 'rgba(255,255,255,0.03)',
            color: selectedCount > 0 ? 'rgba(212,175,55,0.9)' : 'rgba(255,255,255,0.2)',
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selectedCount > 0 ? '0 0 20px rgba(212,175,55,0.15)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {selectedCount === 0 ? 'No Sessions Selected' : 'Complete Registration →'}
        </button>
      </div>

      {/* Bottom */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)',
          marginBottom: 10,
        }} />
        <p style={{
          color: 'rgba(255,255,255,0.2)',
          fontSize: 9,
          letterSpacing: 3,
          textTransform: 'uppercase',
          fontFamily: 'Bricolage Grotesque, sans-serif',
          margin: 0,
        }}>
          SPI EDGE · THILINOMICE
        </p>
      </div>

      {/* Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
      }} />
    </div>
  </div>
));
CompletePage.displayName = 'CompletePage';

// ─── MAIN FLIPBOOK SECTION ────────────────────────────────────────────────────
export default function FlipBookSection({ selectedPages, setSelectedPages, pagesData, setPagesData, onComplete }) {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookDimensions, setBookDimensions] = useState({ width: 300, height: 440 });

  // Total pages = 1 cover + N sessions + 1 complete = N+2
  const totalPages = pagesData.length + 2;
  const lastPage = totalPages - 1;
  const isOnCover = currentPage === 0;
  const isOnComplete = currentPage === lastPage;
  // session page index = currentPage - 1 (since page 0 is cover)
  const currentSessionIndex = currentPage - 1; // -1 on cover, sessions.length on complete page

  useEffect(() => {
    axios.get('/api/pages')
      .then((res) => { setPagesData(res.data); setLoading(false); })
      .catch(() => {
        setPagesData([
          { id: 1, title: 'Keynote Address', content: 'Experience an inspiring talk from visionary leaders shaping tomorrow\'s world. A session that ignites passion and sets the tone for the entire THILINOMICE event.', synopsis: 'Opening keynote with industry leaders' },
          { id: 2, title: 'Tech Workshop', content: 'Hands-on immersion into cutting-edge technologies. Participants gain practical skills through live demonstrations, interactive exercises, and real-world problem solving.', synopsis: 'Interactive technology workshop session' },
          { id: 3, title: 'Panel Discussion', content: 'Diverse voices. One stage. Industry experts and innovators come together to debate, discuss, and dissect the future of technology and innovation.', synopsis: 'Expert panel on innovation trends' },
          { id: 4, title: 'Networking Session', content: 'Where connections become collaborations. Engage with peers, mentors, and potential partners in a curated environment designed to spark meaningful relationships.', synopsis: 'Professional networking and collaboration' },
          { id: 5, title: 'Innovation Showcase', content: 'Witness the next wave of breakthroughs. Talented innovators present groundbreaking projects redefining possibilities across industries.', synopsis: 'Showcase of innovative projects' },
          { id: 6, title: 'Award Ceremony', content: 'A grand celebration of excellence and achievement. Join us as we honor outstanding contributors who made an extraordinary impact at THILINOMICE.', synopsis: 'Closing awards and recognition ceremony' },
        ]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(vw - 24, 360);
      const h = Math.min(vh * 0.62, 500);
      setBookDimensions({ width: Math.floor(w), height: Math.floor(h) });
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const toggleSelect = useCallback((id) => {
    setErrorMsg('');
    setSelectedPages((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 2) {
        setErrorMsg('You may only choose 2 sessions.');
        setTimeout(() => setErrorMsg(''), 3000);
        return prev;
      }
      return [...prev, id];
    });
  }, [setSelectedPages]);

  const flipNext = () => {
    if (isFlipping || currentPage >= lastPage) return;
    playFlipSound();
    bookRef.current?.pageFlip().flipNext();
  };

  const flipPrev = () => {
    if (isFlipping || currentPage <= 0) return;
    playFlipSound();
    bookRef.current?.pageFlip().flipPrev();
  };

  const onFlip = (e) => { setCurrentPage(e.data); setIsFlipping(false); };
  const onFlipStart = () => setIsFlipping(true);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Bricolage Grotesque, sans-serif', letterSpacing: 2 }}>
            LOADING...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col safe-top safe-bottom">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-5 pt-5 pb-3"
      >
        <p style={{
          fontSize: 9,
          letterSpacing: 5,
          textTransform: 'uppercase',
          color: 'rgba(212,175,55,0.7)',
          fontFamily: 'Bricolage Grotesque, sans-serif',
          margin: '0 0 4px',
        }}>
          SPI EDGE · EVENT GUIDE
        </p>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          fontSize: 20,
          color: 'white',
          margin: 0,
          letterSpacing: '0.02em',
        }}>
          THILINOMICE
        </h2>

        {/* Selection tracker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{
              height: 3,
              borderRadius: 2,
              width: selectedPages[i] ? 32 : 20,
              background: selectedPages[i]
                ? 'rgba(212,175,55,0.8)'
                : 'rgba(255,255,255,0.12)',
              transition: 'all 0.3s ease',
            }} />
          ))}
          <span style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'Bricolage Grotesque, sans-serif',
            marginLeft: 4,
          }}>
            {selectedPages.length}/2 chosen
          </span>
        </div>
      </motion.div>

      {/* Error toast */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              margin: '0 16px 4px',
              padding: '10px 16px',
              borderRadius: 10,
              background: 'rgba(220,38,38,0.15)',
              border: '1px solid rgba(220,38,38,0.35)',
              color: '#f87171',
              fontSize: 12,
              textAlign: 'center',
              fontFamily: 'Bricolage Grotesque, sans-serif',
            }}
          >
            ⚠ {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '4px 12px 8px',
      }}>

        {/* Book shadow container */}
        <div style={{
          filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.5)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        }}>
          {pagesData.length > 0 && (
            <HTMLFlipBook
              ref={bookRef}
              width={bookDimensions.width}
              height={bookDimensions.height}
              size="fixed"
              drawShadow={true}
              flippingTime={700}
              usePortrait={true}
              startPage={0}
              mobileScrollSupport={false}
              showCover={false}
              showPageCorners={true}
              maxShadowOpacity={0.6}
              onFlip={onFlip}
              onFlipStart={onFlipStart}
            >
              {/* Cover */}
              <CoverPage />

              {/* Session pages */}
              {pagesData.map((page, i) => (
                <SessionPage
                  key={page.id}
                  page={page}
                  pageIndex={i}
                  isSelected={selectedPages.includes(page.id)}
                  onToggle={toggleSelect}
                />
              ))}

              {/* Complete/back page */}
              <CompletePage selectedCount={selectedPages.length} onComplete={onComplete} />
            </HTMLFlipBook>
          )}
        </div>

        {/* Page indicator dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              style={{
                width: i === currentPage ? 20 : 6,
                height: 6,
                borderRadius: i === currentPage ? 3 : '50%',
                background: i === currentPage
                  ? 'rgba(212,175,55,0.8)'
                  : i < currentPage
                    ? 'rgba(212,175,55,0.3)'
                    : 'rgba(255,255,255,0.12)',
                transition: 'all 0.3s ease',
                boxShadow: i === currentPage ? '0 0 8px rgba(212,175,55,0.4)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Navigation controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 320 }}>
          <button
            onClick={flipPrev}
            disabled={currentPage === 0 || isFlipping}
            className="btn-ghost"
            style={{
              flex: 1,
              borderRadius: 10,
              padding: '12px',
              fontSize: 11,
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: 'uppercase',
              opacity: currentPage === 0 ? 0.25 : 1,
            }}
          >
            ← Prev
          </button>

          {/* Center page info */}
          <div style={{ textAlign: 'center', minWidth: 60 }}>
            <p style={{
              margin: 0,
              color: 'rgba(212,175,55,0.6)',
              fontSize: 9,
              letterSpacing: 2,
              fontFamily: 'Bricolage Grotesque, sans-serif',
              textTransform: 'uppercase',
            }}>
              {isOnCover ? 'Cover' : isOnComplete ? 'End' : `Ch. ${currentPage}`}
            </p>
            <p style={{
              margin: '2px 0 0',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 11,
              fontFamily: 'Playfair Display, serif',
            }}>
              {currentPage + 1} / {totalPages}
            </p>
          </div>

          <button
            onClick={flipNext}
            disabled={currentPage === lastPage || isFlipping}
            className="btn-ghost"
            style={{
              flex: 1,
              borderRadius: 10,
              padding: '12px',
              fontSize: 11,
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: 'uppercase',
              opacity: currentPage === lastPage ? 0.25 : 1,
            }}
          >
            Next →
          </button>
        </div>

        {/* Context hint */}
        {isOnCover && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: 'rgba(255,255,255,0.2)',
              fontSize: 10,
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            Swipe or tap Next to explore sessions
          </motion.p>
        )}
      </div>
    </div>
  );
}
