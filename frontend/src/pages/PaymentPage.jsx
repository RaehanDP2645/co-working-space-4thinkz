import React, { useState } from 'react';
import { rupiah } from '../constants';

export default function PaymentPage({ reservations, onConfirmPayment }) {
  const unpaid = reservations.filter(r => r.status === "unpaid");
  const [selectedRes, setSelectedRes] = useState(null);
  const [method, setMethod] = useState("qris");
  const handlePay = (res) => {
    setSelectedRes(res);
  };
  const handleConfirm = () => {
    onConfirmPayment(selectedRes.id);
    setSelectedRes(null);
  };
  return (
    <div className="page-pad">
      <h2>Pembayaran</h2>
      <p style={{ color: "var(--ink-soft)", marginTop: -6, marginBottom: 22, fontSize: 13.5 }}>Selesaikan pembayaran untuk reservasi Anda.</p>
      {selectedRes ? (
        <div className="two-col">
          <div className="panel">
            <div className="section-title">Pilih Metode Pembayaran</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, border: "1px solid var(--line)", borderRadius: 8, cursor: "pointer" }}>
                <input type="radio" name="paymethod" checked={method === "qris"} onChange={() => setMethod("qris")} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>QRIS (Gopay, OVO, ShopeePay)</div>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>Verifikasi otomatis, instan</div>
                </div>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, border: "1px solid var(--line)", borderRadius: 8, cursor: "pointer" }}>
                <input type="radio" name="paymethod" checked={method === "va"} onChange={() => setMethod("va")} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>Virtual Account (BCA, Mandiri, BNI)</div>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>Transfer via ATM atau M-Banking</div>
                </div>
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-outline" onClick={() => setSelectedRes(null)}>Kembali</button>
              <button className="btn-primary" onClick={handleConfirm}>Konfirmasi Pembayaran</button>
            </div>
          </div>

          <div className="panel">
            <div className="section-title">Detail Pemesanan</div>
            <div className="summary-room">
              <img src={selectedRes.room.img} alt="" />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green-700)" }}>{selectedRes.code}</div>
                <div className="sn">{selectedRes.room.name}</div>
              </div>
            </div>
            <div className="summary-row"><span>Tanggal</span><b>{selectedRes.date}</b></div>
            <div className="summary-row"><span>Waktu</span><b>{selectedRes.time}</b></div>
            <div className="summary-total"><span>Total Tagihan</span><span>{rupiah(selectedRes.room.price)}</span></div>
          </div>
        </div>
      ) : unpaid.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-soft)" }}>
          Tidak ada tagihan pembayaran aktif.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {unpaid.map(res => (
            <div className="panel recent-item" key={res.id} style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <img src={res.room.img} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green-700)" }}>{res.code}</div>
                  <div className="ri-name">{res.room.name}</div>
                  <div className="ri-meta">📅 {res.date} · Total: <b>{rupiah(res.room.price)}</b></div>
                </div>
              </div>
              <button className="btn-primary" onClick={() => handlePay(res)}>Bayar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
