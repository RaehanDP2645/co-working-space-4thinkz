import React, { useState } from 'react';
import { IconProfile, IconCalendar } from '../components/Icons';

export default function ProfilePage({ user, onUpdateUser }) {
  const [nama, setNama] = useState(user.name);
  const [email, setEmail] = useState("aksa@example.com");
  const [hp, setHp] = useState("081234567890");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({ name: nama });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = nama.split(" ").map(w => w[0]).slice(0, 2).join("");

  return (
    <div className="profile-page-wrap">
      <div className="profile-hero">
        <div className="profile-hero-inner">
          <div className="profile-avatar-ring">
            <div className="profile-avatar-lg">{initials}</div>
          </div>
          <h2 className="profile-hero-name">{nama}</h2>
          <p className="profile-hero-role">Penyewa RuangKita</p>
          <div className="profile-hero-badge">
            <IconProfile size={12} /> Member Aktif
          </div>
        </div>
      </div>

      <div className="page-pad profile-content">
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === "edit" ? "active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            Edit Profil
          </button>
          <button
            className={`profile-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Informasi Akun
          </button>
        </div>

        {activeTab === "info" && (
          <div className="profile-card profile-card-info animate-fade-in">
            <div className="profile-info-header">
              <div className="profile-info-icon"><IconProfile size={18} /></div>
              <div>
                <h3 className="profile-card-title">Detail Akun</h3>
                <p className="profile-card-sub">Informasi profil Anda saat ini</p>
              </div>
            </div>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <div className="profile-info-item-icon"><IconProfile size={14} /></div>
                <div>
                  <span className="profile-info-label">Nama Lengkap</span>
                  <span className="profile-info-value">{nama}</span>
                </div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-item-icon"><IconProfile size={14} /></div>
                <div>
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{email}</span>
                </div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-item-icon"><IconProfile size={14} /></div>
                <div>
                  <span className="profile-info-label">No. Handphone</span>
                  <span className="profile-info-value">{hp}</span>
                </div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-item-icon"><IconCalendar size={14} /></div>
                <div>
                  <span className="profile-info-label">Member Sejak</span>
                  <span className="profile-info-value">Juni 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "edit" && (
          <form className="profile-card profile-card-form animate-fade-in" onSubmit={handleSave}>
            <div className="profile-info-header">
              <div className="profile-info-icon"><IconProfile size={18} /></div>
              <div>
                <h3 className="profile-card-title">Edit Profil</h3>
                <p className="profile-card-sub">Perbarui informasi profil Anda</p>
              </div>
            </div>
            <div className="profile-form-grid">
              <div className="field">
                <label>Nama Lengkap</label>
                <div className="profile-input-wrap">
                  <input value={nama} onChange={e => setNama(e.target.value)} required />
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <div className="profile-input-wrap">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="field">
                <label>No. Handphone</label>
                <div className="profile-input-wrap">
                  <input value={hp} onChange={e => setHp(e.target.value)} required />
                </div>
              </div>
            </div>
            <div className="profile-form-actions">
              <button className="btn-primary profile-btn-save" type="submit">
                Simpan Perubahan
              </button>
              {saved && (
                <div className="profile-save-toast">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  Profil berhasil disimpan!
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
