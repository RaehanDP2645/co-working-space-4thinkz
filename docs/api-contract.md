# API Contract — Coworking Space 4Think

Base URL (local): `http://localhost:8000/api`

Semua response JSON pakai format konsisten:
```json
{ "message": "...", "data": { ... } }
```
Error validasi (422) pakai format bawaan Laravel: `{ "message": "...", "errors": { "field": ["..."] } }`

Endpoint yang butuh login wajib kirim header:

## Auth

| Method | Endpoint | Auth | Body | Keterangan |
|---|---|---|---|---|
| POST | `/register` | - | `nama, email, password, password_confirmation` | Balikin `{ user, token }` |
| POST | `/login` | - | `email, password` | Balikin `{ user, token }` |
| POST | `/logout` | Bearer | - | Cabut token yang aktif |
| GET | `/user` | Bearer | - | Data user yang login |
| GET | `/auth/google/redirect` | - | - | Buka di browser (bukan fetch/AJAX), redirect ke Google |
| GET | `/auth/google/callback` | - | - | Dipanggil Google, lalu redirect ke `FRONTEND_URL/auth/callback?code=...` |
| POST | `/auth/exchange` | - | `code` | Tukar kode sekali-pakai (60 detik) jadi `{ user, token }` asli |

**Alur Google Login di frontend:**
1. Tombol "Login Google" arahkan browser ke `GET /api/auth/google/redirect` (full page redirect, bukan Axios).
2. User akan diarahkan balik ke `FRONTEND_URL/auth/callback?code=xxxxx`.
3. Di halaman itu, baca `code` dari query string, lalu `POST /api/auth/exchange` dengan `{ code }`.
4. Simpan `token` dari response ke state/storage, pakai untuk request selanjutnya.

## Ruangan

| Method | Endpoint | Auth | Body | Keterangan |
|---|---|---|---|---|
| GET | `/rooms` | - | - | Daftar semua ruangan |
| GET | `/rooms/{id}` | - | - | Detail 1 ruangan |
| POST | `/rooms` | Bearer + Admin | lihat di bawah | Tambah ruangan |
| PUT | `/rooms/{id}` | Bearer + Admin | lihat di bawah | Edit ruangan |
| DELETE | `/rooms/{id}` | Bearer + Admin | - | Hapus (soft delete) |

**Body untuk POST/PUT `/rooms`:**
```json
{
  "nama_ruangan": "Meeting Room A",
  "jenis_ruangan": "Meeting Room",
  "kapasitas": 10,
  "harga": 150000,
  "tingkat_privasi": "sedang",
  "mendukung_presentasi": true,
  "mendukung_event": false,
  "status": "tersedia"
}
```
`jenis_ruangan` hanya boleh: `Meeting Room`, `Private Office`, `Hot Desk`, `Event Space`.
`tingkat_privasi` hanya boleh: `rendah`, `sedang`, `tinggi`.
`status` hanya boleh: `tersedia`, `perbaikan`, `nonaktif`.

**Contoh response `GET /rooms`:**
```json
{
  "message": "Daftar ruangan berhasil diambil.",
  "data": [
    {
      "id": 1,
      "nama_ruangan": "Meeting Room A",
      "jenis_ruangan": "Meeting Room",
      "kapasitas": 10,
      "harga": "150000.00",
      "tingkat_privasi": "sedang",
      "mendukung_presentasi": true,
      "mendukung_event": false,
      "status": "tersedia",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

> Dokumen ini akan terus di-update seiring fitur baru (Booking, Payment, Recommendation, dst).