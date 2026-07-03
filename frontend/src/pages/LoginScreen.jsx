import React from 'react';
import { GoogleIcon, IconLogo, IconCalendar, IconFileText, IconBell } from '../components/Icons';

export default function LoginScreen({ onLogin }) {
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

        <button className="btn-google" onClick={() => onLogin(false)} style={{ marginBottom: '24px' }}>
          <GoogleIcon /> Daftar / Login dengan Google
        </button>

        <div className="divider">Fitur Utama</div>

        <div className="feature-list" style={{ marginBottom: '24px' }}>
          <div className="feature-item">
            <div className="dot">
              <IconCalendar />
            </div>
            <div>
              <div className="ft">Reservasi mudah &amp; cepat</div>
              <div className="fd">Pesan ruangan dalam hitungan menit</div>
            </div>
          </div>
          <div className="feature-item">
            <div className="dot">
              <IconFileText />
            </div>
            <div>
              <div className="ft">Kelola reservasi dengan praktis</div>
              <div className="fd">Lihat, ubah, atau batalkan reservasi dengan mudah</div>
            </div>
          </div>
          <div className="feature-item">
            <div className="dot">
              <IconBell />
            </div>
            <div>
              <div className="ft">Notifikasi real-time</div>
              <div className="fd">Dapatkan update status reservasi secara langsung</div>
            </div>
          </div>
        </div>

        <div className="login-footnote" style={{ marginTop: '24px' }}>© 2026 RuangKita. All rights reserved.</div>
      </div>
    </div>
  );
}
