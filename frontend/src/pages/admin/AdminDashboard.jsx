import React from 'react';
import { rupiah } from '../../constants';

export default function AdminDashboard({ 
  bookings, 
  rooms, 
  customers, 
  payments, 
  onViewBookingDetail 
}) {
  // Statistics Calculations
  const totalCustomers = customers.length;
  const totalRooms = rooms.length;
  
  const todayStr = "29 Jun 2026"; // Mocking today's date context
  
  const bookingsToday = bookings.filter(b => b.date.includes("29 Jun") || b.date.includes("Hari Ini")).length;
  const bookingsPending = bookings.filter(b => b.status === 'Pending' || b.status === 'unpaid').length;
  const bookingsCompleted = bookings.filter(b => b.status === 'Completed' || b.status === 'Completed').length;
  
  // Revenue
  const revenueToday = payments
    .filter(p => p.status === 'Paid' && (p.date === todayStr || p.date === 'Hari Ini'))
    .reduce((sum, p) => sum + p.amount, 0);
    
  const revenueThisMonth = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const activeRoomsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Paid').length; // occupied rooms

  // Mock weekly data for booking graph
  const weeklyBookings = [
    { day: "Senin", count: 8 },
    { day: "Selasa", count: 15 },
    { day: "Rabu", count: 12 },
    { day: "Kamis", count: 22 },
    { day: "Jumat", count: 18 },
    { day: "Sabtu", count: 29 },
    { day: "Minggu", count: 25 }
  ];
  const maxWeeklyCount = Math.max(...weeklyBookings.map(d => d.count));

  // Mock monthly data for revenue graph
  const monthlyRevenue = [
    { month: "Jan", amt: 12500000 },
    { month: "Feb", amt: 14800000 },
    { month: "Mar", amt: 18200000 },
    { month: "Apr", amt: 22000000 },
    { month: "Mei", amt: 29500000 },
    { month: "Jun", amt: revenueThisMonth }
  ];
  const maxMonthlyRevenue = Math.max(...monthlyRevenue.map(m => m.amt));

  // Recent Bookings (top 5)
  const recentBookings = bookings.slice(0, 5);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'unpaid':
        return <span className="badge warn">Pending</span>;
      case 'paid':
      case 'confirmed':
        return <span className="badge ok">Aktif</span>;
      case 'completed':
        return <span className="badge ok" style={{ background: '#D2F4E6', color: '#145A32' }}>Selesai</span>;
      case 'cancelled':
        return <span className="badge danger">Batal</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-pad">
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, var(--green-900), var(--green-700))', color: '#fff', border: 'none' }}>
        <div>
          <h2 style={{ color: '#fff', marginBottom: '8px' }}>Dashboard Ringkasan</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)' }}>Selamat datang kembali di panel administrasi. Berikut adalah status operasional hari ini.</p>
        </div>
        <div className="welcome-illu" style={{ color: 'var(--gold)' }}>📊</div>
      </div>

      {/* Grid Statistik */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="sl">Total Pelanggan</span>
            <span style={{ fontSize: '20px' }}>👥</span>
          </div>
          <div className="sv">{totalCustomers}</div>
          <span style={{ fontSize: '11px', color: 'var(--green-700)', fontWeight: 600 }}>Aktif terdaftar</span>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="sl">Total Ruangan</span>
            <span style={{ fontSize: '20px' }}>🏢</span>
          </div>
          <div className="sv">{totalRooms}</div>
          <span style={{ fontSize: '11px', color: 'var(--green-700)', fontWeight: 600 }}>Tersedia di katalog</span>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="sl">Booking Hari Ini</span>
            <span style={{ fontSize: '20px' }}>📅</span>
          </div>
          <div className="sv">{bookingsToday}</div>
          <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600 }}>Perlu diproses</span>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="sl">Booking Pending</span>
            <span style={{ fontSize: '20px' }}>⏳</span>
          </div>
          <div className="sv">{bookingsPending}</div>
          <span style={{ fontSize: '11px', color: '#C03A26', fontWeight: 600 }}>Menunggu pembayaran</span>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="sl">Booking Selesai</span>
            <span style={{ fontSize: '20px' }}>✅</span>
          </div>
          <div className="sv">{bookingsCompleted}</div>
          <span style={{ fontSize: '11px', color: 'var(--green-700)', fontWeight: 600 }}>Reservasi selesai</span>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="sl">Pendapatan Hari Ini</span>
            <span style={{ fontSize: '20px' }}>💵</span>
          </div>
          <div className="sv" style={{ fontSize: '18px' }}>{rupiah(revenueToday)}</div>
          <span style={{ fontSize: '11px', color: 'var(--green-700)', fontWeight: 600 }}>Tunai & transfer</span>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="sl">Pendapatan Bulan Ini</span>
            <span style={{ fontSize: '20px' }}>💰</span>
          </div>
          <div className="sv" style={{ fontSize: '18px' }}>{rupiah(revenueThisMonth)}</div>
          <span style={{ fontSize: '11px', color: 'var(--green-700)', fontWeight: 600 }}>Akumulasi bulan Juni</span>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="sl">Ruangan Terpakai</span>
            <span style={{ fontSize: '20px' }}>🔑</span>
          </div>
          <div className="sv">{activeRoomsCount} / {totalRooms}</div>
          <span style={{ fontSize: '11px', color: 'var(--green-700)', fontWeight: 600 }}>Tingkat okupansi tinggi</span>
        </div>
      </div>

      {/* Grid Grafik */}
      <div className="two-col" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Grafik Booking */}
        <div className="panel">
          <div className="section-title">Grafik Booking Mingguan</div>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', height: '200px', paddingTop: '20px', borderBottom: '2px solid var(--line)' }}>
            {weeklyBookings.map((d, i) => {
              const heightPct = (d.count / maxWeeklyCount) * 100;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', marginBottom: '4px' }}>{d.count}</div>
                  <div style={{ 
                    width: '60%', 
                    height: `${heightPct * 1.5}px`, // scaled
                    background: 'var(--green-700)', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }}></div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginTop: '8px' }}>{d.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grafik Pendapatan */}
        <div className="panel">
          <div className="section-title">Grafik Pendapatan Bulanan</div>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', height: '200px', paddingTop: '20px', borderBottom: '2px solid var(--line)' }}>
            {monthlyRevenue.map((m, i) => {
              const heightPct = (m.amt / maxMonthlyRevenue) * 100;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--ink-soft)', marginBottom: '4px' }}>{(m.amt/1000000).toFixed(1)}M</div>
                  <div style={{ 
                    width: '50%', 
                    height: `${heightPct * 1.5}px`, // scaled
                    background: 'var(--gold)', 
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }}></div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginTop: '8px' }}>{m.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Terbaru Table */}
      <div className="panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div className="section-title" style={{ margin: 0 }}>Booking Terbaru</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2.5px solid var(--line)', color: 'var(--ink-soft)', fontSize: '13px' }}>
                <th style={{ padding: '12px 8px' }}>Kode Booking</th>
                <th style={{ padding: '12px 8px' }}>Nama Customer</th>
                <th style={{ padding: '12px 8px' }}>Nama Ruangan</th>
                <th style={{ padding: '12px 8px' }}>Tanggal</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px', textRight: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--line)', fontSize: '13.5px' }}>
                  <td style={{ padding: '14px 8px', fontWeight: 700, color: 'var(--green-700)' }}>{b.code}</td>
                  <td style={{ padding: '14px 8px', fontWeight: 500 }}>{b.customerName}</td>
                  <td style={{ padding: '14px 8px' }}>{b.room.name}</td>
                  <td style={{ padding: '14px 8px' }}>{b.date}</td>
                  <td style={{ padding: '14px 8px' }}>{getStatusBadge(b.status)}</td>
                  <td style={{ padding: '14px 8px' }}>
                    <button 
                      onClick={() => onViewBookingDetail(b)}
                      style={{ background: 'var(--green-100)', color: 'var(--green-700)', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '12px' }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
