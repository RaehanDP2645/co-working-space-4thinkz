import React, { useState, useEffect, useRef } from 'react';

export default function ProfilePage({ user, onUpdateUser, onChangePassword, onUpdateAvatar }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [showCurPass, setShowCurPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    setNama(user?.name || "");
    setEmail(user?.email || "");
    setHp(user?.phone || "");
    setAvatarPreview(user?.avatar || null);
  }, [user]);

  const initialAvatar = (name) => {
    return (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setAvatarPreview(reader.result); setAvatarModal(false); };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null); setSaving(true);
    try {
      await onUpdateUser({ name: nama, email, phone: hp });
      if (avatarPreview && avatarPreview !== user?.avatar && (avatarPreview.startsWith('#') || avatarPreview.startsWith('data:'))) {
        await onUpdateAvatar(avatarPreview);
      }
      setMsg("Profil berhasil disimpan.");
    } catch (e) {
      setErr(e.message || "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (newPass && newPass !== confPass) {
      setErr("Konfirmasi password baru tidak cocok.");
      return;
    }
    if (newPass && newPass.length < 6) {
      setErr("Password baru minimal 6 karakter.");
      return;
    }
    setChangingPass(true);
    try {
      await onChangePassword(curPass, newPass, confPass);
      setMsg("Password berhasil diubah.");
      setCurPass(""); setNewPass(""); setConfPass("");
    } catch (e2) {
      setErr(e2.message || "Gagal mengubah password.");
    } finally {
      setChangingPass(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const hasGoogleAvatar = user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:'));

  return (
    <div className="profile-page">
      {/* ════════ HEADER ════════ */}
      <div className="profile-banner">
        <div className="profile-batik" />
        <div className="profile-banner-inner">
          <div className="profile-avatar-area" onClick={() => setAvatarModal(true)}>
            <div className="profile-ring">
              <div className="profile-pic">
                {avatarPreview && (avatarPreview.startsWith('http') || avatarPreview.startsWith('data:') || avatarPreview.startsWith('/')) ? (
                  <img src={avatarPreview} alt={nama} />
                ) : (
                  <span>{initialAvatar(nama)}</span>
                )}
              </div>
            </div>
            <div className="profile-cam-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
          </div>
          <div className="profile-banner-text">
            <h1>{nama || "Pengguna"}</h1>
            <p>{email}</p>
            {hasGoogleAvatar && (
              <span className="profile-badge-google">
                <svg width="13" height="13" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Akun Google
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ════════ ALERTS ════════ */}
      {msg && (
        <div className="pf-alert pf-alert-ok">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {msg}
        </div>
      )}
      {err && (
        <div className="pf-alert pf-alert-err">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {err}
        </div>
      )}

      {/* ════════ SINGLE ROW: Profile + Password ════════ */}
      <div className="pf-card">
        <div className="pf-columns">
          {/* ── Kolom Kiri: Informasi Profil ── */}
          <div className="pf-col">
            <div className="pf-col-head">
              <div className="pf-card-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span>Informasi Profil</span>
            </div>
            <form onSubmit={handleSave} className="pf-col-form">
              <label className="pf-label">Nama Lengkap</label>
              <input className="pf-input" value={nama} onChange={e => setNama(e.target.value)} required placeholder="Nama lengkap Anda" />

              <label className="pf-label">Email</label>
              <input className="pf-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Alamat email" />

              <label className="pf-label">No. Handphone</label>
              <div className="pf-input-group">
                <span className="pf-input-prefix">+62</span>
                <input className="pf-input pf-input-with-prefix" value={hp} onChange={e => setHp(e.target.value)} placeholder="812 3456 7890" />
              </div>

              <button className="pf-btn pf-btn-primary" type="submit" disabled={saving}>
                {saving && <span className="pf-spinner" />}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>

          {/* ── Divider ── */}
          <div className="pf-divider" />

          {/* ── Kolom Kanan: Keamanan ── */}
          <div className="pf-col">
            <div className="pf-col-head">
              <div className="pf-card-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <span>Ganti Password</span>
            </div>
            <form onSubmit={handleChangePassword} className="pf-col-form">
              <label className="pf-label">Password Saat Ini</label>
              <div className="pf-pw-wrap">
                <input className="pf-input" type={showCurPass ? "text" : "password"} value={curPass} onChange={e => setCurPass(e.target.value)} placeholder="Masukkan password saat ini" />
                <button type="button" className="pf-pw-toggle" onClick={() => setShowCurPass(s => !s)} tabIndex={-1}>
                  {showCurPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>

              <label className="pf-label">Password Baru</label>
              <div className="pf-pw-wrap">
                <input className="pf-input" type={showNewPass ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min. 6 karakter" />
                <button type="button" className="pf-pw-toggle" onClick={() => setShowNewPass(s => !s)} tabIndex={-1}>
                  {showNewPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>

              <label className="pf-label">Konfirmasi Password Baru</label>
              <input className="pf-input pf-input-last" type="password" value={confPass} onChange={e => setConfPass(e.target.value)} placeholder="Ulangi password baru" />

              {newPass.length > 0 && (
                <div className="pf-strength-hint">
                  <div className="pf-strength-bar">
                    <div className="pf-strength-fill" style={{
                      width: newPass.length >= 8 ? '100%' : newPass.length >= 6 ? '60%' : '30%',
                      background: newPass.length >= 8 ? '#16A34A' : newPass.length >= 6 ? '#C9A227' : '#EF4444'
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: newPass.length >= 8 ? '#16A34A' : newPass.length >= 6 ? '#a16207' : '#EF4444' }}>
                    {newPass.length >= 8 ? 'Kuat' : newPass.length >= 6 ? 'Cukup' : 'Lemah'}
                  </span>
                </div>
              )}

              <button className="pf-btn pf-btn-outline" type="submit" disabled={changingPass}>
                {changingPass && <span className="pf-spinner pf-spinner-outline" />}
                {changingPass ? "Mengubah..." : "Ubah Password"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ════════ BOTTOM INFO ════════ */}
      <div className="pf-info-strip">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>Foto profil dari Google akan otomatis ditampilkan. Anda bisa menggantinya kapan saja dengan upload foto sendiri.</span>
      </div>

      {/* ════════ AVATAR MODAL ════════ */}
      {avatarModal && (
        <div className="pf-modal-backdrop" onClick={() => setAvatarModal(false)}>
          <div className="pf-modal" onClick={e => e.stopPropagation()}>
            <div className="pf-modal-head">
              <h3>Ubah Foto Profil</h3>
              <button className="pf-modal-close" onClick={() => setAvatarModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="pf-modal-body">
              <div className="pf-modal-preview">
                {avatarPreview && (avatarPreview.startsWith('http') || avatarPreview.startsWith('data:') || avatarPreview.startsWith('/')) ? (
                  <img src={avatarPreview} alt="" />
                ) : (
                  <span>{initialAvatar(nama)}</span>
                )}
              </div>
              <button className="pf-btn pf-btn-primary" onClick={() => fileRef.current?.click()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Pilih Foto dari Perangkat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
