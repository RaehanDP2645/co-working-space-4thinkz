import React from "react";

/**
 * Ikon-ikon kecil untuk fasilitas ruangan (WiFi, AC, Proyektor, dst).
 * Dipakai oleh RoomCard. Semua ikon bersifat stroke-based, mewarisi
 * `currentColor`, jadi warnanya ikut className parent.
 */

const base = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconWifi = (props) => (
  <svg {...base} {...props}>
    <path d="M5 13a10 10 0 0 1 14 0" />
    <path d="M8.5 16.5a5 5 0 0 1 7 0" />
    <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconAC = (props) => (
  <svg {...base} {...props}>
    <rect x="2" y="6" width="20" height="6" rx="2" />
    <path d="M6 12v2" />
    <path d="M12 12v3" />
    <path d="M18 12v2" />
  </svg>
);

export const IconProjector = (props) => (
  <svg {...base} {...props}>
    <rect x="2" y="8" width="13" height="8" rx="2" />
    <circle cx="8.5" cy="12" r="2" />
    <path d="M15 11l6-3v8l-6-3" />
  </svg>
);

export const IconWhiteboard = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="4" width="18" height="12" rx="1" />
    <path d="M8 20l2-4" />
    <path d="M16 20l-2-4" />
    <path d="M7 8h6" />
  </svg>
);

export const IconSound = (props) => (
  <svg {...base} {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

export const IconParking = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M9 16V8h3.5a2.5 2.5 0 1 1 0 5H9" />
  </svg>
);

export const IconCoffee = (props) => (
  <svg {...base} {...props}>
    <path d="M3 8h14v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8z" />
    <path d="M17 9h2a2 2 0 1 1 0 4h-2" />
    <path d="M6 2c0 1-1 1-1 2s1 1 1 2" />
    <path d="M10 2c0 1-1 1-1 2s1 1 1 2" />
  </svg>
);

export const IconTV = (props) => (
  <svg {...base} {...props}>
    <rect x="2" y="5" width="20" height="13" rx="2" />
    <path d="M9 21h6" />
    <path d="M12 18v3" />
  </svg>
);

export const IconGeneric = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

/**
 * Map nama fasilitas (case-insensitive, fleksibel terhadap variasi penulisan
 * dari API) ke komponen ikonnya. Dipakai oleh RoomCard.facilityIcon helper.
 */
export const FACILITY_ICON_MAP = [
  { match: /wifi|wi-fi|internet/i, icon: IconWifi },
  { match: /\bac\b|air ?cond/i, icon: IconAC },
  { match: /proyektor|projector/i, icon: IconProjector },
  { match: /whiteboard|papan tulis/i, icon: IconWhiteboard },
  { match: /sound|speaker|audio/i, icon: IconSound },
  { match: /parkir|parking/i, icon: IconParking },
  { match: /kopi|coffee|snack|minum/i, icon: IconCoffee },
  { match: /tv|televisi|screen|layar/i, icon: IconTV },
];

export function getFacilityIcon(facilityName = "") {
  const found = FACILITY_ICON_MAP.find((f) => f.match.test(facilityName));
  return found ? found.icon : IconGeneric;
}
