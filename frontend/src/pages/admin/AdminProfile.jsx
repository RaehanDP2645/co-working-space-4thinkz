import React, { useState } from 'react';

export default function AdminProfile({ user, onUpdateUser }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || 'admin@ruangkita.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    onUpdateUser({ ...user, name, email });
    setProfileMsg({ type: 'success', text: 'Profil admin berhasil diperbarui!' });
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Semua kolom wajib diisi.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }
    setPasswordMsg({ type: 'success', text: 'Password berhasil diubah!' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(null), 3000);
  };

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Profil Admin</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13.5px', marginTop: '4px' }}>Kelola nama admin, email kontak, dan kata sandi akses.</p>
        </div>
      </div>

      <div className="two-col" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/ Profile Card /}
        <div className="panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '16px' }}>Detail Informasi</h3>
          
          {profileMsg && (
            <div style={{ 
              background: profileMsg.type === 'success' ? 'var(--green-100)' : '#FBE4E0', 
              color: profileMsg.type === 'success' ? 'var(--green-700)' : '#C03A26', 
              padding: '10px 12px', 
              borderRadius: '8px', 
              fontSize: '12.5px', 
              marginBottom: '16px',
              fontWeight: 500
            }}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Nama Lengkap</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Alamat Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
              Simpan Profil
            </button>
          </form>
        </div>

        {}
        <div className="panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '16px' }}>Ganti Password</h3>

          {passwordMsg && (
            <div style={{ 
              background: passwordMsg.type === 'success' ? 'var(--green-100)' : '#FBE4E0', 
              color: passwordMsg.type === 'success' ? 'var(--green-700)' : '#C03A26', 
              padding: '10px 12px', 
              borderRadius: '8px', 
              fontSize: '12.5px', 
              marginBottom: '16px',
              fontWeight: 500
            }}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Password Lama</label>
              <input 
                type="password" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Password Baru</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Konfirmasi Password Baru</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
              Perbarui Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
