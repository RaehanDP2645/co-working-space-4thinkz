import React, { useState } from 'react';
import { rupiah } from '../constants';

export default function FormPage({ room, schedule, onBack, onSubmit }) {
  const [form, setForm] = useState({ nama:"", email:"", hp:"", note:"" });
  const update = (k, v) => setForm(prev => ({...prev, [k]: v}));

  return (
    <div className="page-pad">
      <h2 style={{marginTop:0}}>Formulir Reservasi</h2>
      <p style={{color:"var(--ink-soft)", marginTop:-6, marginBottom:22, fontSize:13.5}}>Lengkapi data berikut untuk melanjutkan</p>

      <div className="form-grid">
        <div className="panel">
          <div className="field"><label>Nama Lengkap</label><input placeholder="Masukkan nama lengkap" value={form.nama} onChange={e=>update("nama", e.target.value)} /></div>
          <div className="field"><label>Email</label><input placeholder="Masukkan email" value={form.email} onChange={e=>update("email", e.target.value)} /></div>
          <div className="field"><label>No. HP</label><input placeholder="Masukkan nomor HP" value={form.hp} onChange={e=>update("hp", e.target.value)} /></div>
          <div className="field"><label>Tujuan / Keterangan</label><textarea placeholder="Masukkan tujuan atau keterangan reservasi" value={form.note} onChange={e=>update("note", e.target.value)} /></div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <button className="btn-outline" onClick={onBack}>‹ Kembali</button>
            <button className="btn-primary" onClick={() => onSubmit(form)}>Lanjutkan ke Pembayaran →</button>
          </div>
        </div>

        <div className="panel">
          <div className="section-title">Ringkasan Reservasi</div>
          <div className="summary-room">
            <img src={room.img} alt="" />
            <div className="sn">{room.name}</div>
          </div>
          <div className="summary-row"><span>Tanggal</span><b>{schedule.day} Mei 2024</b></div>
          <div className="summary-row"><span>Waktu</span><b>{schedule.time} (1 Jam)</b></div>
          <div className="summary-row"><span>Kapasitas</span><b>{room.cap} Orang</b></div>
          <div className="summary-row"><span>Harga / Jam</span><b>{rupiah(room.price)}</b></div>
          <div className="summary-total"><span>Total Harga</span><span>{rupiah(room.price)}</span></div>
        </div>
      </div>
    </div>
  );
}
