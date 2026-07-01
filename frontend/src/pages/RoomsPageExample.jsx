import React, { useState } from "react";
import RoomList from "../components/RoomList";
const SAMPLE_API_ROOMS = [
  {
    id: 1,
    name: "Ruang Meeting A",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    capacity: 10,
    location: "Gedung A, Lt. 2",
    price: 150000,
    facilities: ["WiFi", "AC", "Proyektor"],
    isAvailable: true,
  },
  {
    id: 2,
    name: "Ruang Meeting B",
    img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=600",
    capacity: 20,
    location: "Gedung A, Lt. 3",
    price: 250000,
    facilities: ["WiFi", "AC", "Proyektor", "Whiteboard"],
    isAvailable: true,
  },
  {
    id: 3,
    name: "Ruang Event",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600",
    capacity: 50,
    location: "Gedung B, Lt. 1",
    price: 500000,
    facilities: ["WiFi", "AC", "Sound System", "Proyektor"],
    isAvailable: false,
  },
];

export default function RoomsPageExample({ onSelect }) {
  const [query, setQuery] = useState("");
  const [isLoading] = useState(false);

  const filtered = SAMPLE_API_ROOMS.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-pad">
      <h2 className="font-display mb-1 text-2xl font-semibold text-ink-900">
        Pilih Ruangan
      </h2>
      <p className="mb-6 text-sm text-ink-500">
        Pilih ruangan yang sesuai dengan kebutuhan Anda
      </p>

      <input
        className="mb-6 w-full rounded-xl border border-line-200 px-4 py-3 text-sm focus:border-sage-600 focus:outline-none"
        placeholder="Cari ruangan..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <RoomList
        rooms={filtered}
        isLoading={isLoading}
        onBook={(room) => onSelect && onSelect(room)}
      />
    </div>
  );
}
