import React, { useState } from 'react';
import { IconMenu, IconLogo, IconClose, IconBell } from './Icons';

export default function Topbar({ user, onToggleSidebar, notifications = [], onClearNotification }) {
  return (
    <div className="topbar">
      <div className="topbar-mobile-brand">
        <IconLogo />
        <span className="topbar-brand">RuangKita</span>
      </div>

      <div className="topbar-desktop-left">
        <span className="topbar-user-name">{user.name}</span>
      </div>

      <div className="topbar-right">
        <div className="topbar-desktop-right">
          <div className="user-avatar-chip">
            {user.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
          </div>
          <NotifBell notifications={notifications} onClear={onClearNotification} />
        </div>

        <button className="menu-toggle-btn" onClick={onToggleSidebar}>
          <IconMenu />
        </button>
      </div>
    </div>
  );
}

function NotifBell({ notifications, onClear }) {
  const [open, setOpen] = useState(false);
  const items = notifications || [];
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position:'relative', background:'#fff', border:'1.4px solid var(--green-700)', color:'var(--green-700)', width:38, height:38, borderRadius:'10px', display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
        aria-label="Notifikasi"
      >
        <IconBell />
        {items.length > 0 && (
          <span style={{ position:'absolute', top:-5, right:-5, background:'#C03A26', color:'#fff', fontSize:10, fontWeight:700, minWidth:18, height:18, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px' }}>{items.length}</span>
        )}
      </button>
      {open && (
        <div style={{ position:'absolute', right:0, top:46, width:300, background:'#fff', borderRadius:'14px', boxShadow:'0 18px 46px -16px rgba(0,0,0,0.25)', border:'1px solid #e7ece8', zIndex:300, overflow:'hidden' }}>
          <div style={{ padding:'12px 14px', borderBottom:'1px solid #f0f0f0', fontWeight:700, fontSize:14, color:'var(--ink)' }}>Notifikasi</div>
          {items.length === 0 ? (
            <div style={{ padding:'18px 14px', fontSize:13, color:'var(--ink-soft)', textAlign:'center' }}>Tidak ada notifikasi.</div>
          ) : (
            items.map(n => (
              <div key={n.id} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'11px 14px', borderBottom:'1px solid #f5f5f5' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, color:'var(--ink)', lineHeight:1.5 }}>{n.text}</div>
                  <div style={{ fontSize:11, color:'var(--ink-soft)', marginTop:2 }}>{n.time}</div>
                </div>
                <button onClick={() => onClear && onClear(n.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink-soft)', padding:2 }} aria-label="Hapus">
                  <IconClose size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
