import React, { useState } from 'react';
import { TIME_SLOTS, rupiah } from '../constants';
import { IconChevronLeft, IconChevronRight } from '../components/Icons';

export default function DateTimePage({ room, onBack, onNext }) {
  const [day, setDay] = useState(22);
  const [time, setTime] = useState("09.00 - 10.00");
  const days = Array.from({length:31}, (_,i)=>i+1);

  return (
    <div className="page-pad">
      <h2 style={{marginTop:0}}>Pilih Tanggal &amp; Jam</h2>
      <p style={{color:"var(--ink-soft)", marginTop:-6, marginBottom:22, fontSize:13.5}}>Pilih tanggal dan jam untuk reservasi ruangan</p>

      <div className="dt-grid">
        <div>
          <div className="room-detail-card">
            <img src={room.img} alt="" />
            <div className="rd-body">
              <div style={{fontWeight:700, fontSize:14.5}}>{room.name}</div>
              <div style={{fontSize:12.5, color:"var(--ink-soft)"}}>Kapasitas: {room.cap} Orang</div>
              <div style={{fontWeight:700, color:"var(--green-700)", fontSize:13.5, marginTop:4}}>{rupiah(room.price)} / jam</div>
            </div>
          </div>
          <div className="panel">
            <div className="section-title" style={{marginBottom:10}}>Ketersediaan</div>
            <div className="legend">
              <div><span className="lg-dot" style={{background:"#2BA84A"}}></span>Tersedia</div>
              <div><span className="lg-dot" style={{background:"#E0A100"}}></span>Terbatas</div>
              <div><span className="lg-dot" style={{background:"#D8473A"}}></span>Tidak Tersedia</div>
            </div>
          </div>
        </div>

        <div>
          <div className="calendar">
            <div className="cal-head">
              <button className="cal-nav" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconChevronLeft /></button>
              <span>Mei 2024</span>
              <button className="cal-nav" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconChevronRight /></button>
            </div>
            <div className="cal-grid">
              {["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map(d=><div className="cal-dow" key={d}>{d}</div>)}
              {Array.from({length:3}).map((_,i)=><div key={"e"+i} />)}
              {days.map(d => (
                <button key={d} className={"cal-day" + (d===day?" selected":"") + (d===24?" today":"")} onClick={()=>setDay(d)}>{d}</button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-title">Pilih Jam</div>
            <div className="time-grid">
              {TIME_SLOTS.map(t => (
                <button key={t} className={"time-slot" + (t===time?" selected":"")} onClick={()=>setTime(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{display:"flex", justifyContent:"space-between", marginTop:18}}>
            <button className="btn-outline" onClick={onBack}>‹ Kembali</button>
            <button className="btn-primary" onClick={() => onNext({day, time})}>Lanjutkan →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
