import React from "react";
import RoomCard from "./RoomCard";

/**
 * RoomList
 * --------
 * Menerima JSON Array dari API dan merender daftar RoomCard.
 *
 * Props:
 * - rooms: Array<object>  -> data ruangan dari API (lihat shape di RoomCard.jsx)
 * - onBook: (room) => void -> dipanggil saat tombol "Pesan Sekarang" diklik
 * - isLoading: boolean      -> tampilkan skeleton loading
 * - emptyMessage: string    -> pesan saat data kosong / tidak ada hasil filter
 */
export default function RoomList({
  rooms = [],
  onBook,
  isLoading = false,
  emptyMessage = "Belum ada ruangan yang tersedia untuk pencarian ini.",
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <RoomCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line-200 bg-sage-50/50 px-6 py-16 text-center">
        <span className="text-3xl">🔍</span>
        <p className="text-sm font-medium text-ink-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {rooms.map((room) => (
        <RoomCard key={room.id ?? room.name} room={room} onBook={onBook} />
      ))}
    </div>
  );
}

function RoomCardSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col overflow-hidden rounded-2xl border border-line-200 bg-white sm:flex-row">
      <div className="h-48 w-full shrink-0 bg-sage-100 sm:h-auto sm:w-64" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-4 w-2/3 rounded bg-sage-100" />
        <div className="h-3 w-1/3 rounded bg-sage-100" />
        <div className="flex gap-1.5">
          <div className="h-5 w-14 rounded bg-sage-100" />
          <div className="h-5 w-14 rounded bg-sage-100" />
          <div className="h-5 w-14 rounded bg-sage-100" />
        </div>
        <div className="mt-auto flex justify-end gap-3 border-t border-dashed border-line-200 pt-3">
          <div className="h-5 w-24 rounded bg-sage-100" />
          <div className="h-9 w-32 rounded-xl bg-sage-100" />
        </div>
      </div>
    </div>
  );
}
