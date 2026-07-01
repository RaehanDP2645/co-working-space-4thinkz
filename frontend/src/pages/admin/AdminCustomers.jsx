import React, { useState } from 'react';
import { rupiah } from '../../constants';

export default function AdminCustomers({ 
  customers, 
  bookings, 
  payments
}) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [localSearch, setLocalSearch] = useState('');

  // Search filter
  const filteredCustomers = customers.filter(c => {
    return localSearch
      ? (c.name.toLowerCase().includes(localSearch.toLowerCase()) || 
         c.email.toLowerCase().includes(localSearch.toLowerCase()))
      : true;
  });

  const getCustomerStats = (email) => {
    const customerBookings = bookings.filter(b => b.customerEmail === email);
    const totalTransactions = payments
      .filter(p => p.customerEmail === email && p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      bookingCount: customerBookings.length,
      totalSpent: totalTransactions,
      bookingList: customerBookings
    };
  };

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Kelola Pelanggan</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13.5px', marginTop: '4px' }}>Memonitor data, profil, riwayat reservasi, dan transaksi pelanggan.</p>
        </div>
      </div>

      {/* Toolbar with Search Input */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--line)', marginBottom: '20px', paddingBottom: '12px' }}>
        <div style={{ minWidth: '280px' }}>
          <input 
            type="text"
            placeholder="Cari pelanggan (Nama, Email)..."
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

      {/* Customer List */}
      <div className="panel" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2.5px solid var(--line)', color: 'var(--ink-soft)', fontSize: '13px' }}>
                <th style={{ padding: '12px 8px' }}>Nama</th>
                <th style={{ padding: '12px 8px' }}>Email</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>Total Booking</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Total Transaksi</th>
                <th style={{ padding: '12px 8px' }}>Status Akun</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--ink-soft)' }}>
                    Tidak ada data pelanggan ditemukan.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const stats = getCustomerStats(c.email);
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--line)', fontSize: '13.5px' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: '14px 8px' }}>{c.email}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'center' }}>{stats.bookingCount} Kali</td>
                      <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: 700, color: 'var(--green-700)' }}>
                        {rupiah(stats.totalSpent)}
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <span className="badge ok">{c.status || 'Aktif'}</span>
                      </td>
                      <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                        <button 
                          onClick={() => setSelectedCustomer({ ...c, stats })}
                          style={{ background: 'var(--green-100)', color: 'var(--green-700)', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Side Drawer / Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            width: '100%',
            maxWidth: '480px',
            height: '100%',
            boxShadow: 'var(--shadow)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Detail Pelanggan</h3>
              <button 
                onClick={() => setSelectedCustomer(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--ink-soft)' }}
              >
                ✕
              </button>
            </div>

            {/* Profile Section */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'var(--green-700)', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '22px', 
                fontWeight: 700,
                margin: '0 auto 12px'
              }}>
                {selectedCustomer.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
              </div>
              <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{selectedCustomer.name}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)' }}>{selectedCustomer.email}</p>
            </div>

            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#FAF7EF', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Total Booking</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green-700)', marginTop: '4px' }}>{selectedCustomer.stats.bookingCount}</div>
              </div>
              <div style={{ background: '#FAF7EF', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Total Pengeluaran</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--green-700)', marginTop: '4px' }}>{rupiah(selectedCustomer.stats.totalSpent)}</div>
              </div>
            </div>

            {/* Booking History */}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '14px', borderBottom: '1px solid var(--line)', paddingBottom: '6px' }}>Riwayat Booking</h4>
              {selectedCustomer.stats.bookingList.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)', textAlign: 'center', padding: '20px' }}>Belum ada riwayat booking.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedCustomer.stats.bookingList.map(b => (
                    <div key={b.id} style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '10px', fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--green-700)' }}>{b.code}</span>
                        <span style={{ fontWeight: 600 }}>{b.status}</span>
                      </div>
                      <div style={{ fontWeight: 500 }}>{b.room.name}</div>
                      <div style={{ color: 'var(--ink-soft)', fontSize: '11px', marginTop: '2px' }}>{b.date} | {b.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => setSelectedCustomer(null)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '20px' }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
