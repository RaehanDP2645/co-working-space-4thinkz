import React from "react";
import { getFacilityIcon } from "./FacilityIcons";

/**
 * Format angka jadi format Rupiah, contoh: 150000 -> "Rp 150.000"
 * (sejalan dengan helper `rupiah` di constants.js, dibuat lokal di sini
 * supaya RoomCard tidak punya dependency keluar)
 */
function formatRupiah(value) {
  const n = Number(value) || 0;
  return "Rp " + n.toLocaleString("id-ID");
}

/**
 * RoomCard
 * --------
 * Menampilkan satu ruangan meeting dalam bentuk card premium ala Traveloka,
 * dengan foto di kiri (atas saat mobile), detail di kanan, badge fasilitas,
 * dan harga + tombol pesan di pojok kanan bawah.
 *
 * Props (`room`) mendukung data dari constants.js maupun bentuk yang lebih
 * lengkap dari API, dengan fallback yang aman untuk field opsional:
 *
 * {
 *   id: number | string,
 *   name: string,            // nama ruangan
 *   img | image: string,     // url foto
 *   cap | capacity: number,  // kapasitas orang
 *   location | building: string, // nama gedung/lokasi (badge)
 *   price: number,           // harga per jam (angka)
 *   facilities: string[],    // contoh: ["WiFi", "AC", "Proyektor"]
 *   isAvailable: boolean,    // opsional, default true
 * }
 */
export default function RoomCard({ room, onBook }) {
  const {
    name = "Nama Ruangan",
    img,
    image,
    cap,
    capacity,
    location,
    building,
    price = 0,
    facilities = [],
    isAvailable = true,
  } = room || {};

  const photo = img || image || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600";
  const maxCapacity = capacity ?? cap;
  const locationLabel = location || building;

  const handleBook = () => {
    if (onBook) onBook(room);
  };

  return (
    <div
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row"
    >
      {/* Foto: kiri di desktop, atas di mobile */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-64">
        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900/55">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-900">
              Penuh
            </span>
          </div>
        )}
      </div>

      {/* Detail */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-snug text-ink-900">
              {name}
            </h3>

            {locationLabel && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-semibold text-sage-700">
                📍 {locationLabel}
              </span>
            )}
          </div>

          {maxCapacity != null && (
            <p className="text-sm text-ink-500">
              👤 Maks {maxCapacity} Orang
            </p>
          )}

          {facilities.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {facilities.map((facility, idx) => {
                const FacilityIcon = getFacilityIcon(facility);
                return (
                  <span
                    key={`${facility}-${idx}`}
                    className="inline-flex items-center gap-1 rounded-md bg-sage-50 px-2 py-1 text-[11px] font-medium text-sage-800"
                  >
                    <FacilityIcon className="text-sage-600" />
                    {facility}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Harga + tombol, rata kanan bawah */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-dashed border-line-200 pt-3">
          <div className="mr-auto leading-tight">
            <span className="text-lg font-extrabold text-sage-700">
              {formatRupiah(price)}
            </span>
            <span className="ml-1 text-xs font-medium text-ink-500">/ jam</span>
          </div>

          <button
            type="button"
            onClick={handleBook}
            disabled={!isAvailable}
            className="rounded-xl bg-sage-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sage-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink-500/40"
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
