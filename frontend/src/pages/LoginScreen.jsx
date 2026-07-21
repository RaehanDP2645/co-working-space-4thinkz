import React, { useState } from 'react';
import { GoogleIcon, IconLogo, IconCalendar, IconFileText, IconBell } from '../components/Icons';

export default function LoginScreen({ onLogin, onSwitchToRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login gagal');
      }
      const key = window.location.pathname.startsWith('/admin') ? 'token_admin' : 'token_user';
      localStorage.setItem(key, data.token);
      try {
        await onLogin({ token: data.token, email: form.email, password: form.password });
      } catch (loginErr) {
        localStorage.removeItem(key);
        setError(loginErr.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google/redirect';
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="brand-mark">
          <IconLogo />
          <div className="name">RuangKita</div>
        </div>
        <div className="brand-tagline">Sistem Reservasi Ruangan</div>

        <h2 style={{ fontSize: '24px', margin: '0 0 4px', color: 'var(--ink)' }}>Selamat Datang</h2>
        <p className="sub" style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '24px' }}>
          Login untuk melanjutkan reservasi ruangan
        </p>

        <form onSubmit={handleLocalLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          <input className="search-input" type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="search-input" type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <div style={{ color: '#C03A26', fontSize: 12 }}>{error}</div>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk dengan Email'}
          </button>
        </form>

        <div className="divider">atau</div>

        <button className="btn-google" type="button" onClick={handleGoogleLogin} style={{ marginBottom: '16px' }}>
          <GoogleIcon /> Login dengan Google
        </button>

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
          Belum punya akun?{' '}
          <button type="button" className="link-btn" onClick={onSwitchToRegister} style={{ color: 'var(--green-700)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Daftar di sini
          </button>
        </div>

        <div className="login-footnote" style={{ marginTop: '24px' }}>© 2026 RuangKita. All rights reserved.</div>
      </div>
    </div>
  );
}
