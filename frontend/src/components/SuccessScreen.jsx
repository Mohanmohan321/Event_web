import { motion } from 'framer-motion';

function ConfettiPiece({ delay, isYellow }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: isYellow ? 8 : 6,
        height: isYellow ? 3 : 6,
        background: isYellow ? '#DFE104' : '#FAFAFA',
        left: `${Math.random() * 100}%`,
        top: '-10px',
      }}
      animate={{
        y: ['0vh', '110vh'],
        rotate: [0, Math.random() * 720 - 360],
        x: [0, (Math.random() - 0.5) * 80],
        opacity: [1, 1, 0],
      }}
      transition={{ duration: Math.random() * 2 + 2.5, delay, ease: 'easeIn' }}
    />
  );
}


export default function SuccessScreen({ selectedCards, cards }) {
  const confetti = Array.from({ length: 28 }, (_, i) => i);
  // selectedCards is [slot1Id | null, slot2Id | null]
  const slotCards = (selectedCards || [null, null]).map(
    (id) => id ? (cards || []).find((c) => c.id === id) || null : null
  );

  return (
    <div
      className="min-h-dvh flex flex-col safe-top safe-bottom"
      style={{ background: '#09090B', position: 'relative', overflow: 'hidden' }}
    >
      {/* Confetti */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
        {confetti.map((i) => <ConfettiPiece key={i} delay={i * 0.07} isYellow={i % 3 === 0} />)}
      </div>

      {/* ── Accent header block ── */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
        style={{ background: '#DFE104', padding: '28px 20px 24px' }}
      >
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#000000', marginBottom: 6 }}>
          Registration Complete
        </p>
        <h1
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(2.2rem, 12vw, 5rem)',
            fontWeight: 900, lineHeight: 0.9,
            letterSpacing: '-0.02em', textTransform: 'uppercase',
            color: '#000000',
          }}
        >
          YOU'RE<br />IN!
        </h1>
      </motion.div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 20px' }}>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 28 }}
        >
          Registration complete. See you at{' '}
          <strong style={{ color: '#FAFAFA', textTransform: 'uppercase' }}>THILINOMICE</strong>.
        </motion.p>

        {/* Selected sessions */}
        {slotCards.some(Boolean) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ marginBottom: 24 }}
          >
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 12 }}>
              Your Sessions
            </p>
            <div style={{ border: '2px solid #27272A' }}>
              {slotCards.map((card, slotIdx) =>
                card ? (
                  <div
                    key={card.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px',
                      borderBottom: slotIdx === 0 && slotCards[1] ? '1px solid #27272A' : 'none',
                    }}
                  >
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                      <span
                        style={{
                          width: 36, height: 36,
                          background: '#DFE104',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
                          fontSize: 12, color: '#000',
                        }}
                      >
                        S{slotIdx + 1}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DFE104', marginBottom: 2 }}>
                        Slot {slotIdx + 1}
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#FAFAFA' }}>
                        {card.title}
                      </p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </motion.div>
        )}

        {/* Branding row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            borderTop: '2px solid #27272A', paddingTop: 16, marginBottom: 20,
          }}
        >
          <div>
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#3F3F46', marginBottom: 3 }}>Presented by</p>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 900, letterSpacing: '0.05em', color: '#FAFAFA' }}>SPI EDGE</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#3F3F46', marginBottom: 3 }}>Event</p>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 900, letterSpacing: '0.05em', color: '#DFE104' }}>THILINOMICE</p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{ textAlign: 'center', fontSize: 9, color: '#3F3F46', letterSpacing: '0.15em', textTransform: 'uppercase' }}
        >
          You may now close this page
        </motion.p>
      </div>
    </div>
  );
}
