import React, { useState } from 'react';
import { IconLogo, IconCalendar, IconFileText, IconBell } from '../components/Icons';

export default function RegisterScreen({ onSwitchToLogin, onRegistered }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }
      localStorage.setItem('token', data.token);
      onRegistered();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

        <h2 style={{ fontSize: '24px', margin: '0 0 4px', color: 'var(--ink)' }}>Buat Akun</h2>
        <p className="sub" style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '24px' }}>
          Daftar untuk mulai reservasi ruangan
        </p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          <input className="search-input" type="text" placeholder="Nama Lengkap" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="search-input" type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="search-input" type="password" placeholder="Password (min 8)" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input className="search-input" type="password" placeholder="Konfirmasi Password" value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required />
          {error && <div style={{ color: '#C03A26', fontSize: 12 }}>{error}</div>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
          Sudah punya akun?{' '}
          <button type="button" className="link-btn" onClick={onSwitchToLogin} style={{ color: 'var(--green-700)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Masuk di sini
          </button>
        </div>

        <div className="login-footnote" style={{ marginTop: '24px' }}>© 2026 RuangKita. All rights reserved.</div>
      </div>
    </div>
  );
}
