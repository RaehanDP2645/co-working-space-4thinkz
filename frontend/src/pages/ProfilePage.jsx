import React, { useState, useEffect, useRef } from 'react';

const TEMPLATES = [
  { id: 't1', color: '#166534', label: 'Hijau' },
  { id: 't2', color: '#1D4ED8', label: 'Biru' },
  { id: 't3', color: '#B45309', label: 'Amber' },
  { id: 't4', color: '#9333EA', label: 'Ungu' },
];

export default function ProfilePage({ user, onUpdateUser, onChangePassword, onUpdateAvatar }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    setNama(user?.name || "");
    setEmail(user?.email || "");
    setHp(user?.phone || "");
    setAvatar(user?.avatar || null);
    setAvatarPreview(user?.avatar || null);
  }, [user]);

  const initialAvatar = (name) => {
    return (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const chooseTemplate = (t) => {
    setAvatarPreview(t.color);
  };

  const saveTemplateOrFile = async () => {
    // kalau preview adalah warna template (string hex) atau data uri file
    if (avatarPreview && (avatarPreview.startsWith('#') || avatarPreview.startsWith('data:'))) {
      try {
        await onUpdateAvatar(avatarPreview);
        setAvatar(avatarPreview);
        setMsg("Foto profil diperbarui.");
      } catch (e) {
        setErr(e.message || "Gagal upload foto.");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null); setSaving(true);
    try {
      await onUpdateUser({ name: nama, email, phone: hp });
      await saveTemplateOrFile();
      setMsg("Profil berhasil disimpan.");
    } catch (e) {
      setErr(e.message || "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (newPass && newPass !== confPass) {
      setErr("Konfirmasi password baru tidak cocok.");
      return;
    }
    if (newPass && newPass.length < 6) {
      setErr("Password baru minimal 6 karakter.");
      return;
    }
    try {
      await onChangePassword(curPass, newPass, confPass);
      setMsg("Password berhasil diubah.");
      setCurPass(""); setNewPass(""); setConfPass("");
    } catch (err) {
      setErr(err.message || "Gagal mengubah password.");
    }
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="page-pad">
      <h2>Profil Pengguna</h2>
      <p style={{ color: "var(--ink-soft)", marginTop: -6, marginBottom: 22, fontSize: 13.5 }}>Kelola informasi & keamanan akun Anda.</p>

      {msg && <div style={{ background: "#E7F6EC", color: "var(--green-700)", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{msg}</div>}
      {err && <div style={{ background: "#FBE4E0", color: "#C03A26", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16, fontWeight: 500 }}>{err}</div>}

      {/* Avatar */}
      <div className="panel" style={{ marginBottom: 18, textAlign: "center" }}>
        <div style={{ width: 96, height: 96, margin: "0 auto 14px", borderRadius: "50%", background: avatarPreview && avatarPreview.startsWith('#') ? avatarPreview : "var(--green-700)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 30, overflow: "hidden", boxShadow: "0 10px 26px -12px rgba(22,101,52,0.6)" }}>
          {avatarPreview && (avatarPreview.startsWith('http') || avatarPreview.startsWith('data:') || avatarPreview.startsWith('/')) ? (
            <img src={avatarPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            initialAvatar(nama)
          )}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          <button type="button" className="btn-outline" onClick={() => fileRef.current?.click()}>Upload Foto</button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {TEMPLATES.map(t => (
            <button key={t.id} type="button" onClick={() => chooseTemplate(t)}
              title={t.label}
              style={{ width: 34, height: 34, borderRadius: "50%", background: t.color, border: avatarPreview === t.color ? "3px solid var(--ink)" : "3px solid transparent", cursor: "pointer" }} />
          ))}
        </div>
      </div>

      <form className="panel" onSubmit={handleSave} style={{ marginBottom: 18 }}>
        <h3 style={{ margin: "0 0 14px" }}>Informasi Profil</h3>
        <div className="field"><label>Nama Lengkap</label><input value={nama} onChange={e => setNama(e.target.value)} required /></div>
        <div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="field"><label>No. Handphone</label><input value={hp} onChange={e => setHp(e.target.value)} required /></div>

        <h3 style={{ margin: "22px 0 14px" }}>Ganti Password</h3>
        <div className="field"><label>Password Saat Ini</label><input type="password" value={curPass} onChange={e => setCurPass(e.target.value)} placeholder="Kosongkan jika tidak diubah" /></div>
        <div className="field"><label>Password Baru</label><input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Kosongkan jika tidak diubah" /></div>
        <div className="field"><label>Konfirmasi Password Baru</label><input type="password" value={confPass} onChange={e => setConfPass(e.target.value)} /></div>

        <div style={{ marginTop: 18 }}>
          <button className="btn-primary" type="submit" disabled={saving} style={{ minWidth: 180 }}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
