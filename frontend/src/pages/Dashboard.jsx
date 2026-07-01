import React from 'react';
import { ROOMS } from '../constants';
import { IconBuilding, IconCalendar, IconClock, IconBookOpen, IconClose, IconLightbulb } from '../components/Icons';
export default function Dashboard({ user, goToRooms }) {
  return (
    <div className="page-pad">
      <div className="welcome-banner">
        <div>
          <h2>Selamat Datang, {user.name.split(" ")[0]}</h2>
          <p>Kelola reservasi ruangan Anda dengan mudah.</p>
        </div>
        <div className="welcome-illu" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconBuilding size={48} />
        </div>
      </div>
      <div className="stat-grid">
        <StatCard icon={<IconCalendar />} color="#EDE7FB" iconColor="#6D4FD6" value="3" label="Reservasi Aktif" desc="Anda memiliki 3 reservasi aktif" />
        <StatCard icon={<IconClock />} color="#FDF1D6" iconColor="#9A6A00" value="1" label="Menunggu Pembayaran" desc="Selesaikan pembayaran Anda" />
        <StatCard icon={<IconBookOpen />} color="#E4F0E7" iconColor="#1F6B45" value="8" label="Riwayat Selesai" desc="Total reservasi selesai" />
        <StatCard icon={<IconClose />} color="#FBE4E0" iconColor="#C03A26" value="2" label="Dibatalkan" desc="Reservasi dibatalkan" />
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="section-title">Reservasi Terbaru</div>
          <div className="recent-item">
            <img src={ROOMS[0].img} alt="" />
            <div style={{flex:1}}>
              <div className="ri-name">Ruang Meeting A</div>
              <div className="ri-meta">24 Mei 2024 · 09.00 - 11.00 · Kapasitas: 10 Orang</div>
            </div>
            <span className="badge warn">Menunggu Pembayaran</span>
          </div>
          <div style={{textAlign:"right", marginTop:12}}>
            <button className="btn-outline" onClick={goToRooms}>Lihat Detail</button>
          </div>
        </div>
        <div className="panel" style={{background:"#FAFCF8", display:"flex", flexDirection:"column", gap:10}}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 0 }}>
            <span style={{ color: 'var(--green-700)', display: 'inline-flex' }}><IconLightbulb /></span>
            Tips Reservasi
          </div>
          <p style={{fontSize:13, color:"var(--ink-soft)", lineHeight:1.6, margin: 0}}>
            Pastikan Anda memilih ruangan, tanggal dan jam dengan benar sebelum melakukan pembayaran.
          </p>
        </div>
      </div>
    </div>
  );
}



function StatCard({ icon, color, iconColor, value, label, desc }) {
  return (
    <div className="stat-card">
      <div className="si" style={{background:color, color:iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
      <div className="sv">{value}</div>
      <div className="sl" style={{fontWeight:600, color:'var(--ink)', fontSize:13}}>{label}</div>
      <div style={{fontSize:11, color:"var(--ink-soft)", marginTop:2}}>{desc}</div>
    </div>
  );
}
