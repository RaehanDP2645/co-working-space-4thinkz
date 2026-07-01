import React from 'react';

export default function MyReservationsPage({ reservations, onPay }) {
  const activeRes = reservations.filter(r => r.status === "unpaid" || r.status === "paid");
  return (
    <div className="page-pad">
      <h2>Reservasi Saya</h2>
      <p style={{color:"var(--ink-soft)", marginTop:-6, marginBottom:22, fontSize:13.5}}>Berikut adalah daftar reservasi aktif Anda.</p>
      
      {activeRes.length === 0 ? (
        <div className="panel" style={{textAlign:"center", padding:"40px 20px", color:"var(--ink-soft)"}}>
          Belum ada reservasi aktif. Silakan lakukan pemesanan di menu Daftar Ruangan.
        </div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:16}}>
          {activeRes.map(res => (
            <div className="panel recent-item" key={res.id} style={{justifyContent:"space-between", flexWrap:"wrap", gap:16}}>
              <div style={{display:"flex", gap:16, alignItems:"center"}}>
                <img src={res.room.img} alt="" style={{width:80, height:80, borderRadius:10, objectFit:"cover"}} />
                <div>
                  <div style={{fontSize:12, fontWeight:700, color:"var(--green-700)"}}>{res.code}</div>
                  <div className="ri-name" style={{fontSize:16, marginTop:2}}>{res.room.name}</div>
                  <div className="ri-meta" style={{marginTop:4}}>
                    📅 {res.date} · 🕒 {res.time} · 👥 {res.room.cap} Orang
                  </div>
                </div>
              </div>
              <div style={{display:"flex", alignItems:"center", gap:12}}>
                {res.status === "unpaid" ? (
                  <>
                    <span className="badge warn">Menunggu Pembayaran</span>
                    <button className="btn-primary" onClick={() => onPay(res)}>Bayar Sekarang</button>
                  </>
                ) : (
                  <span className="badge ok">Sudah Dibayar</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
