import React, { useState } from 'react';
import { IconMenu, IconLogo, IconBell, IconChevronDown } from './Icons';

export default function AdminTopbar({ 
  user, 
  onToggleSidebar, 
  setPage, 
  onLogout 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  
  const mockNotifications = [
    { id: 1, text: "Booking baru oleh Budi Santoso (RB-90234)", time: "10 menit yang lalu" },
    { id: 2, text: "Pembayaran terverifikasi untuk Invoice #INV-82741", time: "1 jam yang lalu" },
    { id: 3, text: "Ruangan Meeting A telah dinonaktifkan sementara", time: "3 jam yang lalu" }
  ];

  return (
    <div className="admin-topbar">
      {/* Left side: Logo & Brand */}
      <div className="admin-topbar-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconLogo />
          <span className="admin-topbar-brand">
            RuangKita <span className="admin-topbar-badge">Admin</span>
          </span>
        </div>
      </div>

      {/* Center: Flexible Spacer */}
      <div className="admin-topbar-center" />

      {/* Right side: Notifications, Avatar, Dropdown, Hamburger */}
      <div className="admin-topbar-right">
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="admin-topbar-btn"
            onBlur={() => setTimeout(() => setNotifDropdownOpen(false), 200)}
            aria-label="Notifikasi"
          >
            <IconBell width={20} height={20} />
            <span className="admin-topbar-badge-count">{mockNotifications.length}</span>
          </button>

          {notifDropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: '290px',
              background: '#ffffff',
              border: '1px solid #f0f0f0',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 110
            }}>
              <div style={{ fontWeight: 700, fontSize: '14px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', color: '#1b231e', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                <span>Notifikasi</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockNotifications.map(n => (
                  <div key={n.id} style={{ fontSize: '12.5px', color: '#5b6760', paddingBottom: '8px', borderBottom: '1px solid #f9f9f9', lineHeight: '1.4' }}>
                    <div style={{ color: '#1b231e', fontWeight: 500 }}>{n.text}</div>
                    <div style={{ fontSize: '11px', color: '#9aa39c', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="admin-topbar-user"
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
          >
            <div className="admin-topbar-avatar">
              AD
            </div>
            <span className="admin-topbar-username">Admin</span>
            <span className="admin-topbar-chevron" style={{ display: 'flex', alignItems: 'center' }}>
              <IconChevronDown />
            </span>
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: '180px',
              background: '#ffffff',
              border: '1px solid #f0f0f0',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 110
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1b231e' }}>{user?.name || 'Administrator'}</div>
                <div style={{ fontSize: '11px', color: '#5b6760', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'admin@ruangkita.com'}</div>
              </div>
              <button 
                onClick={() => setPage('profile')}
                style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', fontSize: '13px', color: '#1b231e', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = '#f9f9f9'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                Profil Saya
              </button>
              <button 
                onClick={onLogout}
                style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', fontSize: '13px', color: '#EF4444', fontWeight: 600, cursor: 'pointer', borderTop: '1px solid #f0f0f0', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger menu - HANYA muncul di mobile (<768px) dan di paling kanan */}
        <button 
          className="admin-topbar-btn admin-topbar-hamburger" 
          onClick={onToggleSidebar}
          aria-label="Menu"
        >
          <IconMenu />
        </button>
      </div>
    </div>
  );
}
