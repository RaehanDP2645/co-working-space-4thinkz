import React, { useState } from 'react';
import { rupiah } from '../../constants';

export default function AdminPayments({ 
  payments, 
  onVerifyPayment
}) {
  const [filter, setFilter] = useState('All'); // All, Pending, Paid, Failed, Refund
  const [localSearch, setLocalSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Filter & Search Logic
  const filteredPayments = payments.filter(p => {
    const matchesSearch = localSearch 
      ? (p.invoice.toLowerCase().includes(localSearch.toLowerCase()) || 
         p.bookingCode.toLowerCase().includes(localSearch.toLowerCase()) ||
         p.customerName.toLowerCase().includes(localSearch.toLowerCase()))
      : true;

    if (filter === 'All') return matchesSearch;
    return p.status.toLowerCase() === filter.toLowerCase() && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="badge warn">Pending</span>;
      case 'paid':
        return <span className="badge ok">Paid</span>;
      case 'failed':
        return <span className="badge danger">Failed</span>;
      case 'refund':
        return <span className="badge ok" style={{ background: '#E0F7FA', color: '#006064' }}>Refund</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Kelola Pembayaran</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13.5px', marginTop: '4px' }}>Verifikasi transaksi pembayaran manual dan pantau status tagihan.</p>
        </div>
      </div>

      {/* Tabs & Search Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--line)', marginBottom: '20px', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['All', 'Pending', 'Paid', 'Failed', 'Refund'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                background: filter === t ? 'var(--green-700)' : '#fff',
                color: filter === t ? '#fff' : 'var(--ink-soft)',
                border: '1px solid var(--line)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {t === 'All' ? 'Semua' : t}
            </button>
          ))}
        </div>
        <div style={{ minWidth: '260px' }}>
          <input 
            type="text"
            placeholder="Cari transaksi (Invoice, Booking, Cust)..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '20px',
              border: '1px solid var(--line)',
              fontSize: '13.5px',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="panel" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2.5px solid var(--line)', color: 'var(--ink-soft)', fontSize: '13px' }}>
                <th style={{ padding: '12px 8px' }}>Invoice</th>
                <th style={{ padding: '12px 8px' }}>Booking</th>
                <th style={{ padding: '12px 8px' }}>Customer</th>
                <th style={{ padding: '12px 8px' }}>Nominal</th>
                <th style={{ padding: '12px 8px' }}>Metode</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--ink-soft)' }}>
                    Tidak ada data transaksi pembayaran.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--line)', fontSize: '13.5px' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 700 }}>{p.invoice}</td>
                    <td style={{ padding: '14px 8px', fontWeight: 600, color: 'var(--green-700)' }}>{p.bookingCode}</td>
                    <td style={{ padding: '14px 8px' }}>{p.customerName}</td>
                    <td style={{ padding: '14px 8px', fontWeight: 700 }}>{rupiah(p.amount)}</td>
                    <td style={{ padding: '14px 8px' }}>{p.method}</td>
                    <td style={{ padding: '14px 8px' }}>{getStatusBadge(p.status)}</td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => setSelectedPayment(p)}
                          style={{ background: 'var(--green-100)', color: 'var(--green-700)', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                        >
                          Lihat Detail
                        </button>
                        {p.status === 'Pending' && (
                          <button 
                            onClick={() => onVerifyPayment(p.id)}
                            style={{ background: 'var(--green-700)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                          >
                            Verifikasi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            padding: '28px',
            boxShadow: 'var(--shadow)',
            position: 'relative'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
              Detail Invoice: <span style={{ color: 'var(--green-700)' }}>{selectedPayment.invoice}</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Kode Booking:</span>
                <span style={{ fontWeight: 700, color: 'var(--green-700)' }}>{selectedPayment.bookingCode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Pelanggan:</span>
                <span style={{ fontWeight: 600 }}>{selectedPayment.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Nominal Pembayaran:</span>
                <span style={{ fontWeight: 700 }}>{rupiah(selectedPayment.amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Metode Pembayaran:</span>
                <span>{selectedPayment.method}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Tanggal Transaksi:</span>
                <span>{selectedPayment.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ink-soft)' }}>Status Transaksi:</span>
                <div>{getStatusBadge(selectedPayment.status)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setSelectedPayment(null)}
                style={{ padding: '8px 16px', background: 'none', border: '1px solid var(--line)', borderRadius: '8px', cursor: 'pointer' }}
              >
                Tutup
              </button>
              {selectedPayment.status === 'Pending' && (
                <button 
                  onClick={() => { onVerifyPayment(selectedPayment.id); setSelectedPayment(null); }}
                  className="btn-primary"
                  style={{ padding: '8px 20px', borderRadius: '8px' }}
                >
                  Verifikasi Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
