import React from 'react';
import { rupiah } from '../constants';

export default function MyReservationsPage({ reservations, onPay, onCancel, showToast }) {
  const [cancelDone, setCancelDone] = React.useState(false);

  const activeRes = reservations.filter(r =>
    r.status === "unpaid" || r.status === "paid" || r.status === "partial" || r.status === "pending_payment" || r.status === "confirmed"
  );

  // hitung sisa waktu pembayaran
  const getRemaining = (batas) => {
    if (!batas) return null;
    const diff = new Date(batas).getTime() - Date.now();
    if (diff <= 0) return "Kadaluarsa";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h + "j " + m + "m lagi";
  };

  const handleCancel = (res) => {
    if (!window.confirm("Batalkan reservasi " + res.code + "?")) return;
    onCancel(res.id);
    setCancelDone(true);
    setTimeout(() => setCancelDone(false), 2500);
  };

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
                  {(res.status === "unpaid" || res.status === "pending_payment") && res.batasPembayaran && (
                    <div style={{marginTop:4, fontSize:11.5, color: res.isExpired ? "#C03A26" : "var(--gold)", fontWeight:600}}>
                      ⏳ Batas bayar: {getRemaining(res.batasPembayaran)}
                    </div>
                  )}
                </div>
              </div>
              <div style={{display:"flex", alignItems:"center", gap:12}}>
                {res.status === "unpaid" ? (
                  <>
                    <span className="badge warn">Menunggu Pembayaran</span>
                    <button className="btn-primary" onClick={() => onPay(res)}>Bayar Sekarang</button>
                  </>
                ) : res.status === "partial" ? (
                  <>
                    <span className="badge ok">DP Dibayar</span>
                    <button className="btn-primary" onClick={() => onPay(res)}>
                      Bayar Sisa {rupiah(res.room.price - res.dpAmount)}
                    </button>
                  </>
                ) : res.status === "pending_payment" ? (
                  <span className="badge warn">Menunggu Konfirmasi</span>
                ) : (
                  <span className="badge ok">Lunas</span>
                )}
                {(res.status === "unpaid" || res.status === "pending_payment") && (
                  <button
                    className="btn-outline"
                    style={{color:"#C03A26", borderColor:"#C03A26", background:"#FBE4E0"}}
                    onClick={() => handleCancel(res)}
                  >
                    Batalkan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelDone && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.45)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2000,
          animation: "fadeIn 0.25s ease"
        }}>
          <div style={{
            background: "#fff", padding: "28px 32px", borderRadius: "16px",
            textAlign: "center", boxShadow: "var(--shadow)",
            animation: "popIn 0.3s cubic-bezier(0.18,0.89,0.32,1.28)"
          }}>
            <div style={{ fontSize: "42px", marginBottom: "8px" }}>✅</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--green-900)" }}>Reservasi Dibatalkan</div>
            <div style={{ fontSize: "12.5px", color: "var(--ink-soft)", marginTop: "4px" }}>
              Reservasi telah masuk ke riwayat dengan status dibatalkan.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
