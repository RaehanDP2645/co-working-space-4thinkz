import React from 'react';
import { 
  IconHome, 
  IconCalendar, 
  IconRooms, 
  IconPayment, 
  IconHistory, 
  IconProfile, 
  IconLogout, 
  IconClose, 
  IconLogo 
} from './Icons';

export default function AdminSidebar({ page, setPage, onLogout, isOpen, onClose }) {
  const items = [
    { key: "dashboard", label: "Dashboard", ic: <IconHome /> },
    { key: "bookings", label: "Booking", ic: <IconCalendar /> },
    { key: "rooms", label: "Ruangan", ic: <IconRooms /> },
    { key: "payments", label: "Pembayaran", ic: <IconPayment /> },
    { key: "customers", label: "Pelanggan", ic: <IconHistory /> }, // Reusing IconHistory for customers
    { key: "reports", label: "Laporan", ic: <IconHistory /> }, // Reusing icons or customizing
    { key: "profile", label: "Profil", ic: <IconProfile /> },
  ];

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header-wrapper">
          <div className="brand-mark">
            <IconLogo />
            <div className="name" style={{ color: 'var(--green-700)' }}>RuangKita</div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className="brand-tagline" style={{ fontWeight: 600, fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '-4px', marginBottom: '24px', paddingLeft: '48px' }}>
          Admin Panel
        </div>
        
        {items.map(it => (
          <button 
            key={it.key} 
            className={"nav-item" + (page === it.key ? " active" : "")}
            onClick={() => { setPage(it.key); if (onClose) onClose(); }}
          >
            <span className="ic" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{it.ic}</span>
            {it.label}
          </button>
        ))}
        
        <div className="nav-spacer" />
        
        <button className="nav-item" style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', borderRadius: 0 }} onClick={() => { onLogout(); if (onClose) onClose(); }}>
          <span className="ic" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}><IconLogout /></span>
          Logout
        </button>
      </div>
    </>
  );
}
