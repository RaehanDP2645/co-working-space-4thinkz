import React, { useState } from 'react';
import { IconLogo } from '../../components/Icons';
export default function AdminLoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    if (email === 'admin@ruangkita.com' && password === 'admin123') {
      setError('');
      onLogin(true);
    } else {
      setError('Email atau password admin salah. (Gunakan admin@ruangkita.com / admin123)');
    }
  };
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="brand-mark">
          <IconLogo />
          <div className="name">RuangKita</div>
        </div>
        <div className="brand-tagline">Sistem Reservasi Ruangan</div>
        <form onSubmit={handleAdminSubmit} style={{ textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center', margin: '0 0 4px', fontSize: '24px', color: 'var(--ink)' }}>Admin Login</h2>
          <p className="sub" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '13px', color: 'var(--ink-soft)' }}>
            Silakan masuk menggunakan akun admin Anda
          </p>
          {error && (
            <div style={{ background: '#FBE4E0', color: '#C03A26', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px', fontWeight: 500 }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>Email Admin</label>
            <input
              type="email"
              placeholder="admin@ruangkita.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13.5px', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13.5px', outline: 'none' }}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' }}>
            Masuk Sebagai Admin
          </button>
        </form>
        <div className="login-footnote" style={{ marginTop: '24px' }}>© 2026 RuangKita. All rights reserved.</div>
      </div>
    </div>
  );
}
