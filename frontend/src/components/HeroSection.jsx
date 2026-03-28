import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
  'THILINOMICE', '·', 'LIVE EVENT', '·', 'SPI EDGE', '·',
  'SELECT 2 SESSIONS', '·', 'INTERACTIVE', '·', 'EXCLUSIVE', '·',
  'THILINOMICE', '·', 'LIVE EVENT', '·', 'SPI EDGE', '·',
  'SELECT 2 SESSIONS', '·', 'INTERACTIVE', '·', 'EXCLUSIVE', '·',
];

function LogoBox({ label }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5"
    >
      <div
        style={{
          width: 52, height: 52,
          border: '2px solid #3F3F46',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" stroke="#DFE104" strokeWidth="1.5" fill="none" />
          <path d="M6 12h12M12 6l6 6-6 6" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <span
        style={{
          fontSize: 9, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#A1A1AA',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function HeroSection({ onStart }) {
  return (
    <div
      className="min-h-dvh flex flex-col safe-top safe-bottom"
      style={{ background: '#09090B' }}
    >

      {/* ── Top bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-5 pt-6 pb-4"
        style={{ borderBottom: '1px solid #27272A' }}
      >
        <LogoBox label="SPI" />

        <div style={{
          border: '1px solid #3F3F46',
          padding: '4px 14px',
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#A1A1AA',
          }}>
            SPI EDGE
          </span>
        </div>

        <LogoBox label="EDGE" />
      </motion.div>

      {/* ── Main title block ── */}
      <div className="flex-1 flex flex-col justify-center px-5 py-8">

        {/* Event label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#DFE104',
            marginBottom: 12,
          }}
        >
          ✦ Live Event
        </motion.p>

        {/* Giant title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(2.8rem, 14vw, 8rem)',
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#FAFAFA',
            marginBottom: 16,
          }}
        >
          THILI<br />NOMICE
        </motion.h1>

        {/* Yellow rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{
            height: 3, background: '#DFE104',
            width: '100%', transformOrigin: 'left',
            marginBottom: 16,
          }}
        />

        {/* Hosted by */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: 13, fontWeight: 500,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#A1A1AA',
            marginBottom: 32,
          }}
        >
          Hosted by SPI EDGE
        </motion.p>

        {/* Tags row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-2 flex-wrap"
          style={{ marginBottom: 40 }}
        >
          {['Interactive', 'Exclusive', 'Select 2'].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#A1A1AA',
                border: '1px solid #3F3F46',
                padding: '6px 12px',
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={onStart}
            className="btn-primary"
            whileTap={{ scale: 0.97 }}
            style={{ fontSize: 14, letterSpacing: '0.2em' }}
          >
            Start — Choose Sessions
          </motion.button>
        </motion.div>
      </div>

      {/* ── Marquee strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ background: '#DFE104', borderTop: '2px solid #DFE104', overflow: 'hidden' }}
      >
        <div className="marquee-wrap" style={{ padding: '10px 0' }}>
          <div className="marquee-track">
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#000000',
                  padding: '0 16px',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Admin link ── */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid #27272A', textAlign: 'center' }}>
        <a
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/admin');
            window.location.reload();
          }}
          style={{
            fontSize: 9, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#3F3F46',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.color = '#A1A1AA'}
          onMouseLeave={(e) => e.target.style.color = '#3F3F46'}
        >
          Admin Portal
        </a>
      </div>
    </div>
  );
}
