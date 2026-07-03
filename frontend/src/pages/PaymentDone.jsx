import React from 'react';
import { IconCheckCircle } from '../components/Icons';

export default function PaymentDone({ onBackHome }) {
  return (
    <div className="page-pad" style={{textAlign:"center", paddingTop:80}}>
      <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--green-700)', marginBottom: 16 }}>
        <IconCheckCircle size={64} />
      </div>
      <h2>Reservasi Berhasil Dibuat!</h2>
      <p style={{color:"var(--ink-soft)", maxWidth:420, margin:"0 auto 24px"}}>
        Reservasi Anda menunggu pembayaran. Silakan selesaikan pembayaran melalui menu Pembayaran.
      </p>
      <button className="btn-primary" onClick={onBackHome}>Kembali ke Dashboard</button>
    </div>
  );
}
