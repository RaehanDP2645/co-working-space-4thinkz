import React, { useState } from 'react';
import { TIME_SLOTS, rupiah } from '../constants';
import { IconChevronLeft, IconChevronRight } from '../components/Icons';

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DOW = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];

export default function DateTimePage({ room, onBack, onNext }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState("09.00 - 10.00");

  const { year, month } = view;

  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isSameDay = (d) => selected && selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === d;
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setView({ year: y, month: m });
  };

  const years = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 3 + i);

  const dateLabel = selected
    ? `${selected.getDate()} ${MONTHS[selected.getMonth()]} ${selected.getFullYear()}`
    : "";

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
              <button className="cal-nav" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => changeMonth(-1)}><IconChevronLeft /></button>
              <div className="cal-title">
                <span>{MONTHS[month]}</span>
                <select className="cal-year" value={year} onChange={(e) => setView({ ...view, year: Number(e.target.value) })}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button className="cal-nav" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => changeMonth(1)}><IconChevronRight /></button>
            </div>
            <div className="cal-grid">
              {DOW.map(d => <div className="cal-dow" key={d}>{d}</div>)}
              {Array.from({ length: offset }).map((_, i) => <div key={"e" + i} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                <button key={d} className={"cal-day" + (isSameDay(d) ? " selected" : "") + (isToday(d) ? " today" : "")} onClick={() => setSelected(new Date(year, month, d))}>{d}</button>
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
            <button className="btn-primary" disabled={!selected} onClick={() => onNext({ date: dateLabel, isoDate: selected ? selected.getFullYear() + "-" + String(selected.getMonth()+1).padStart(2,"0") + "-" + String(selected.getDate()).padStart(2,"0") : "", day: selected ? selected.getDate() : null, month, year, time })}>Lanjutkan →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
