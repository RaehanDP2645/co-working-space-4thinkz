import React, { useState } from 'react';
import { rupiah } from '../../constants';

export default function AdminReports({ bookings, payments, customers, rooms }) {
  const [reportType, setReportType] = useState('Booking'); // Booking, Pendapatan, Pelanggan, Ruangan
  const [filterPeriod, setFilterPeriod] = useState('Bulanan'); // Harian, Mingguan, Bulanan, Tahunan, Custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [exportToast, setExportToast] = useState(null);

  const handleExport = (format) => {
    setExportToast(`Mengekspor Laporan ${reportType} (${filterPeriod}) dalam format ${format}...`);
    setTimeout(() => {
      if (format === 'Excel') {
        const headers = reportType === 'Booking' ? 'Kode,Pelanggan,Ruangan,Tanggal,Status\n' : 'Invoice,Booking,Pelanggan,Nominal,Status\n';
        const rows = reportType === 'Booking' 
          ? bookings.map(b => `${b.code},${b.customerName},${b.room.name},${b.date},${b.status}`).join('\n')
          : payments.map(p => `${p.invoice},${p.bookingCode},${p.customerName},${p.amount},${p.status}`).join('\n');
        
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Laporan_${reportType}_${filterPeriod}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.print();
      }
      setExportToast(null);
    }, 2000);
  };

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Laporan Operasional</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13.5px', marginTop: '4px' }}>Analisis data transaksi, tingkat reservasi, dan performa ruangan secara periodik.</p>
        </div>
      </div>

      {exportToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--green-700)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow)',
          zIndex: 1100,
          fontWeight: 600,
          fontSize: '13.5px'
        }}>
          {exportToast}
        </div>
      )}

      {/* Control Row */}
      <div className="panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Report Type */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tipe Laporan</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
            >
              <option value="Booking">Laporan Booking</option>
              <option value="Pendapatan">Laporan Pendapatan</option>
              <option value="Pelanggan">Laporan Pelanggan</option>
              <option value="Ruangan">Laporan Ruangan</option>
            </select>
          </div>

          {/* Time Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Periode Filter</label>
            <select 
              value={filterPeriod} 
              onChange={(e) => setFilterPeriod(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
            >
              <option value="Harian">Harian</option>
              <option value="Mingguan">Mingguan</option>
              <option value="Bulanan">Bulanan</option>
              <option value="Tahunan">Tahunan</option>
              <option value="Custom Date">Custom Date</option>
            </select>
          </div>

          {/* Custom Date Fields */}
          {filterPeriod === 'Custom Date' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tanggal Mulai</label>
                <input 
                  type="date" 
                  value={customStartDate} 
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  style={{ width: '100%', padding: '9px', border: '1px solid var(--line)', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tanggal Selesai</label>
                <input 
                  type="date" 
                  value={customEndDate} 
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  style={{ width: '100%', padding: '9px', border: '1px solid var(--line)', borderRadius: '8px' }}
                />
              </div>
            </>
          )}

          {/* Export Actions */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <button 
              onClick={() => handleExport('PDF')}
              className="btn-primary" 
              style={{ flex: 1, padding: '11px', borderRadius: '8px', background: '#C03A26' }}
            >
              Export PDF
            </button>
            <button 
              onClick={() => handleExport('Excel')}
              className="btn-primary" 
              style={{ flex: 1, padding: '11px', borderRadius: '8px' }}
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      <div className="panel" style={{ padding: '24px' }}>
        <h4 style={{ margin: '0 0 16px', fontSize: '15px' }}>Preview Data Laporan</h4>
        <div style={{ overflowX: 'auto' }}>
          {reportType === 'Booking' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)', color: 'var(--ink-soft)' }}>
                  <th style={{ padding: '8px' }}>Kode Booking</th>
                  <th style={{ padding: '8px' }}>Nama Customer</th>
                  <th style={{ padding: '8px' }}>Ruangan</th>
                  <th style={{ padding: '8px' }}>Tanggal</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{b.code}</td>
                    <td style={{ padding: '10px 8px' }}>{b.customerName}</td>
                    <td style={{ padding: '10px 8px' }}>{b.room.name}</td>
                    <td style={{ padding: '10px 8px' }}>{b.date}</td>
                    <td style={{ padding: '10px 8px' }}>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'Pendapatan' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)', color: 'var(--ink-soft)' }}>
                  <th style={{ padding: '8px' }}>Invoice</th>
                  <th style={{ padding: '8px' }}>Booking</th>
                  <th style={{ padding: '8px' }}>Customer</th>
                  <th style={{ padding: '8px' }}>Nominal</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{p.invoice}</td>
                    <td style={{ padding: '10px 8px' }}>{p.bookingCode}</td>
                    <td style={{ padding: '10px 8px' }}>{p.customerName}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{rupiah(p.amount)}</td>
                    <td style={{ padding: '10px 8px' }}>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'Pelanggan' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)', color: 'var(--ink-soft)' }}>
                  <th style={{ padding: '8px' }}>Nama</th>
                  <th style={{ padding: '8px' }}>Email</th>
                  <th style={{ padding: '8px' }}>Status Akun</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{c.name}</td>
                    <td style={{ padding: '10px 8px' }}>{c.email}</td>
                    <td style={{ padding: '10px 8px' }}>{c.status || 'Aktif'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'Ruangan' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)', color: 'var(--ink-soft)' }}>
                  <th style={{ padding: '8px' }}>Nama Ruangan</th>
                  <th style={{ padding: '8px' }}>Tipe</th>
                  <th style={{ padding: '8px' }}>Kapasitas</th>
                  <th style={{ padding: '8px' }}>Harga / Jam</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{r.name}</td>
                    <td style={{ padding: '10px 8px' }}>{r.type || 'Meeting Room'}</td>
                    <td style={{ padding: '10px 8px' }}>{r.cap} Orang</td>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{rupiah(r.price)}</td>
                    <td style={{ padding: '10px 8px' }}>{r.status || 'Aktif'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
