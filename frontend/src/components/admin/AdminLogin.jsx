import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return setError('Enter the password.');
    if (password === '2026') {
      onLogin('admin-2026');
    } else {
      setError('Incorrect password.');
      setPassword('');
    }
  };

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center safe-top safe-bottom"
      style={{ background: '#09090B', padding: '0 20px' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 380 }}
      >

        {/* Logo / header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              width: 48, height: 48,
              border: '2px solid #DFE104',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" stroke="#DFE104" strokeWidth="1.5" fill="none" />
              <path d="M6 11h10M11 6v10" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#DFE104', marginBottom: 6 }}>
            SPI EDGE
          </p>
          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.8rem, 8vw, 3rem)',
              fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '-0.01em', lineHeight: 1,
              color: '#FAFAFA',
            }}
          >
            Admin Portal
          </h1>
        </div>

        {/* Divider */}
        <div style={{ height: 2, background: '#27272A', marginBottom: 32 }} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 8, display: 'block' }}>
            Password
          </label>

          <div style={{ position: 'relative', marginBottom: 28 }}>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="kt-input"
              style={{ paddingRight: 48 }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#A1A1AA', padding: 8, minHeight: 44, minWidth: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {showPass ? (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

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

          <button type="submit" className="btn-primary" style={{ fontSize: 13, letterSpacing: '0.2em' }}>
            Sign In →
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.location.reload(); }}
            style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3F3F46', textDecoration: 'none' }}
          >
            ← Back to event
          </a>
        </div>
      </motion.div>
    </div>
  );
}
