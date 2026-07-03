import React from 'react';
import { IconHome, IconRooms, IconCalendar, IconPayment, IconHistory, IconProfile, IconLogout, IconClose, IconLogo } from './Icons';

export default function Sidebar({ page, setPage, onLogout, isOpen, onClose }) {
  const items = [
    { key: "dashboard", label: "Dashboard", ic: <IconHome /> },
    { key: "rooms", label: "Daftar Ruangan", ic: <IconRooms /> },
    { key: "myres", label: "Reservasi Saya", ic: <IconCalendar /> },
    { key: "payment", label: "Pembayaran", ic: <IconPayment /> },
    { key: "history", label: "Riwayat", ic: <IconHistory /> },
    { key: "profile", label: "Profil", ic: <IconProfile /> },
  ];

  const handleNav = (key) => {
    setPage(key === "rooms" ? "rooms" : key);
    if (onClose) onClose();
  };

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header-wrapper">
          <div className="brand-mark">
            <IconLogo />
            <div className="name">RuangKita</div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className="brand-tagline">Sistem Reservasi Ruangan</div>
        
        {items.map(it => (
          <button key={it.key} className={"nav-item" + (page === it.key || (it.key==="rooms" && ["rooms","date","form","payment-flow"].includes(page)) ? " active" : "")}
            onClick={() => handleNav(it.key)}>
            <span className="ic" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{it.ic}</span>{it.label}
          </button>
        ))}
        <div className="nav-spacer" />
        <button className="nav-item" onClick={() => { onLogout(); if (onClose) onClose(); }}>
          <span className="ic" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}><IconLogout /></span>Logout
        </button>
      </div>
    </>
  );
}
