import React, { useState } from 'react';
import { rupiah } from '../../constants';

export default function AdminBookings({ 
  bookings, 
  onUpdateStatus, 
  onCancelBooking
}) {
  const [filter, setFilter] = useState('All'); // All, Pending, Paid, Confirmed, Completed, Cancelled
  const [localSearch, setLocalSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // AI Recommendation simulation based on booking context
  const getAiRecommendation = (booking) => {
    if (!booking) return '';
    const roomName = booking.room.name;
    const customer = booking.customerName;
    return `Berdasarkan riwayat ${customer}, pelanggan cenderung memesan ${roomName} untuk sesi berdurasi singkat. Rekomendasi AI: Berikan penawaran upgrade ke paket full-day dengan diskon 15% atau tawarkan add-on konsumsi (Coffee Break/Snack Box) saat status reservasi dikonfirmasi.`;
  };

  // Filter & Search Logic
  const filteredBookings = bookings.filter(b => {
    // Search filter
    const matchesSearch = localSearch 
      ? (b.code.toLowerCase().includes(localSearch.toLowerCase()) || 
         b.customerName.toLowerCase().includes(localSearch.toLowerCase()) ||
         b.room.name.toLowerCase().includes(localSearch.toLowerCase()))
      : true;

    // Tab filter
    if (filter === 'All') return matchesSearch;
    if (filter === 'Pending') return (b.status === 'Pending' || b.status === 'unpaid') && matchesSearch;
    return b.status.toLowerCase() === filter.toLowerCase() && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'unpaid':
        return <span className="badge warn">Pending</span>;
      case 'paid':
        return <span className="badge ok" style={{ background: '#E3F2FD', color: '#0D47A1' }}>Paid</span>;
      case 'confirmed':
        return <span className="badge ok">Confirmed</span>;
      case 'completed':
        return <span className="badge ok" style={{ background: '#D2F4E6', color: '#145A32' }}>Completed</span>;
      case 'cancelled':
        return <span className="badge danger">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const handleOpenStatusEdit = (b) => {
    setEditingStatusId(b.id);
    setNewStatus(b.status);
  };

  const handleSaveStatus = (id) => {
    onUpdateStatus(id, newStatus);
    setEditingStatusId(null);
  };

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Kelola Booking</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13.5px', marginTop: '4px' }}>Melihat, menyaring, dan mengubah seluruh reservasi ruangan.</p>
        </div>
      </div>

      {/* Tabs & Search Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--line)', marginBottom: '20px', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['All', 'Pending', 'Paid', 'Confirmed', 'Completed', 'Cancelled'].map(t => (
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
            placeholder="Cari booking (Kode, Pelanggan, Ruangan)..."
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

      {/* Table Panel */}
      <div className="panel" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2.5px solid var(--line)', color: 'var(--ink-soft)', fontSize: '13px' }}>
                <th style={{ padding: '12px 8px' }}>Kode</th>
                <th style={{ padding: '12px 8px' }}>Pelanggan</th>
                <th style={{ padding: '12px 8px' }}>Ruangan</th>
                <th style={{ padding: '12px 8px' }}>Jadwal</th>
                <th style={{ padding: '12px 8px' }}>Jumlah Orang</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--ink-soft)' }}>
                    Tidak ada data booking ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--line)', fontSize: '13.5px' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 700, color: 'var(--green-700)' }}>{b.code}</td>
                    <td style={{ padding: '14px 8px', fontWeight: 500 }}>{b.customerName}</td>
                    <td style={{ padding: '14px 8px' }}>{b.room.name}</td>
                    <td style={{ padding: '14px 8px' }}>
                      <div style={{ fontWeight: 600 }}>{b.date}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{b.time}</div>
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'center' }}>{b.capacity} Orang</td>
                    <td style={{ padding: '14px 8px' }}>
                      {editingStatusId === b.id ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select 
                            value={newStatus} 
                            onChange={(e) => setNewStatus(e.target.value)}
                            style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--line)', fontSize: '12px' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button 
                            onClick={() => handleSaveStatus(b.id)}
                            style={{ background: 'var(--green-700)', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusBadge(b.status)}
                          <button 
                            onClick={() => handleOpenStatusEdit(b)}
                            style={{ background: 'none', border: 'none', color: 'var(--green-700)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            Ubah
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => setSelectedBooking(b)}
                          style={{ background: 'var(--green-100)', color: 'var(--green-700)', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                        >
                          Detail
                        </button>
                        {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                          <button 
                            onClick={() => onCancelBooking(b.id)}
                            style={{ background: '#FBE4E0', color: '#C03A26', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                          >
                            Batalkan
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: 'var(--shadow)',
            position: 'relative'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
              Detail Booking: <span style={{ color: 'var(--green-700)' }}>{selectedBooking.code}</span>
            </h3>

            {/* Info Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {/* Customer */}
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data Customer</h4>
                <div style={{ background: '#FAF7EF', padding: '12px', borderRadius: '8px', fontSize: '13.5px' }}>
                  <div style={{ fontWeight: 700 }}>{selectedBooking.customerName}</div>
                  <div style={{ color: 'var(--ink-soft)' }}>Email: {selectedBooking.customerEmail}</div>
                  <div style={{ color: 'var(--ink-soft)' }}>Telp: +62 812-3456-7890</div>
                </div>
              </div>

              {/* Room */}
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data Ruangan</h4>
                <div style={{ background: '#FAF7EF', padding: '12px', borderRadius: '8px', fontSize: '13.5px' }}>
                  <div style={{ fontWeight: 700 }}>{selectedBooking.room.name}</div>
                  <div style={{ color: 'var(--ink-soft)' }}>Kapasitas: {selectedBooking.room.cap || selectedBooking.capacity} Orang</div>
                  <div style={{ color: 'var(--green-700)', fontWeight: 600, marginTop: '4px' }}>Harga: {rupiah(selectedBooking.room.price)}/jam</div>
                </div>
              </div>

              {/* Payment Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--ink-soft)' }}>Metode Pembayaran</h4>
                  <div style={{ background: '#FAF7EF', padding: '10px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 600 }}>
                    {selectedBooking.paymentMethod || 'Manual Bank Transfer'}
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--ink-soft)' }}>Status Booking</h4>
                  <div style={{ marginTop: '2px' }}>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div style={{ background: 'var(--green-100)', border: '1px solid #C4DFD2', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--green-900)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  💡 Hasil AI Recommendation
                </h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--green-900)', lineHeight: 1.5 }}>
                  {getAiRecommendation(selectedBooking)}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="btn-primary"
                style={{ padding: '8px 20px', borderRadius: '8px' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
