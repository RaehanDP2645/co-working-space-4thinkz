import React from 'react';
import { IconMenu, IconLogo } from './Icons';

export default function Topbar({ user, onToggleSidebar }) {
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
        </div>

        <button className="menu-toggle-btn" onClick={onToggleSidebar}>
          <IconMenu />
        </button>
      </div>
    </div>
  );
}
