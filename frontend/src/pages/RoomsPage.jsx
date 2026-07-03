import React, { useState } from 'react';
import { ROOMS, rupiah } from '../constants';
import { IconInfo } from '../components/Icons';

export default function RoomsPage({ onSelect }) {
  const [query, setQuery] = useState("");
  const filtered = ROOMS.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="page-pad">
      <h2 style={{marginTop:0}}>Pilih Ruangan</h2>
      <p style={{color:"var(--ink-soft)", marginTop:-6, marginBottom:22, fontSize:13.5}}>Pilih ruangan yang sesuai dengan kebutuhan Anda</p>

      <div className="toolbar">
        <input className="search-input" placeholder="Cari ruangan..." value={query} onChange={e=>setQuery(e.target.value)} />
        <select className="select-cap"><option>Semua Kapasitas</option></select>
      </div>

      <div className="room-grid">
        {filtered.map(r => (
          <div className="room-card" key={r.id}>
            <img src={r.img} alt={r.name} />
            <div className="rc-body">
              <div className="rc-name">{r.name}</div>
              <div className="rc-cap">Kapasitas: {r.cap} Orang</div>
              <div className="rc-price">{rupiah(r.price)} / jam</div>
              <button className="btn-outline" style={{marginTop:8}} onClick={() => onSelect(r)}>Pilih Ruangan</button>
            </div>
          </div>
        ))}
      </div>

      <div className="info-strip" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ color: 'var(--green-900)', display: 'inline-flex', marginTop: 2 }}><IconInfo /></span>
        <span><b>Informasi Harga</b><br/>Harga yang tertera adalah harga per jam. Pajak akan dihitung saat pembayaran.</span>
      </div>
    </div>
  );
}


