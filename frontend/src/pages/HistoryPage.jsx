import React from 'react';

export default function HistoryPage({ history }) {
  return (
    <div className="page-pad">
      <h2>Riwayat Reservasi</h2>
      <p style={{color:"var(--ink-soft)", marginTop:-6, marginBottom:22, fontSize:13.5}}>Daftar riwayat reservasi yang telah selesai atau dibatalkan.</p>

      {history.length === 0 ? (
        <div className="panel" style={{textAlign:"center", padding:"40px 20px", color:"var(--ink-soft)"}}>
          Belum ada riwayat reservasi.
        </div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          {history.map(item => (
            <div className="panel recent-item" key={item.id} style={{justifyContent:"space-between", opacity:0.8}}>
              <div style={{display:"flex", gap:16, alignItems:"center"}}>
                <img src={item.room.img} alt="" style={{width:50, height:50, borderRadius:8, objectFit:"cover"}} />
                <div>
                  <div className="ri-name" style={{fontSize:13.5}}>{item.room.name}</div>
                  <div className="ri-meta">📅 {item.date} · 🕒 {item.time}</div>
                </div>
              </div>
              <span className={`badge ${item.status === "completed" ? "ok" : "danger"}`}>
                {item.status === "completed" ? "Selesai" : "Dibatalkan"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
