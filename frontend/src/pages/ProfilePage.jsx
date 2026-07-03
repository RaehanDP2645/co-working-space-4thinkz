import React, { useState } from 'react';

export default function ProfilePage({ user, onUpdateUser }) {
  const [nama, setNama] = useState(user.name);
  const [email, setEmail] = useState("aksa@example.com");
  const [hp, setHp] = useState("081234567890");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({ name: nama });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-pad">
      <h2>Profil Pengguna</h2>
      <p style={{color:"var(--ink-soft)", marginTop:-6, marginBottom:22, fontSize:13.5}}>Kelola informasi profil Anda.</p>

      <div className="two-col" style={{gridTemplateColumns:"1fr 2fr"}}>
        <div className="panel" style={{textAlign:"center"}}>
          <div className="av" style={{width:80, height:80, borderRadius:"50%", background:"var(--green-700)", color:"#fff", display:"flex", alignItems:"center", justifySelf:"center", justifyContent:"center", fontWeight:700, fontSize:28, marginBottom:12, margin:"0 auto"}}>
            {nama.split(" ").map(w=>w[0]).slice(0,2).join("")}
          </div>
          <h3 style={{margin:"8px 0 2px"}}>{nama}</h3>
          <p style={{fontSize:12.5, color:"var(--ink-soft)", margin:0}}>Penyewa RuangKita</p>
        </div>

        <form className="panel" onSubmit={handleSave}>
          <div className="field">
            <label>Nama Lengkap</label>
            <input value={nama} onChange={e=>setNama(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>No. Handphone</label>
            <input value={hp} onChange={e=>setHp(e.target.value)} required />
          </div>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <button className="btn-primary" type="submit">Simpan Perubahan</button>
            {saved && <span style={{fontSize:13, color:"var(--green-700)", fontWeight:600}}>✓ Profil berhasil disimpan!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
