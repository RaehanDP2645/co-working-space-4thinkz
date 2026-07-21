import { ROOMS, rupiah } from '../constants';

// ============================================================
//  RuangKita AI Engine
//  Client-side, rule-based "AI" - no backend / API key needed.
//  Provides (1) smart room recommendations and (2) a contextual
//  chatbot that answers questions about rooms, prices, capacity,
//  the booking flow and payments.
// ============================================================

const PURPOSE_KEYWORDS = {
  meeting: ['meeting', 'rapat', 'pertemuan', 'diskusi', 'presentasi', 'presenter', 'laporan'],
  event: ['event', 'acara', 'seminar', 'workshop', 'pesta', 'konferensi', 'pelatihan', 'training'],
  private: ['private', 'fokus', 'focus', 'sendiri', 'solo', 'kerja sendiri', 'individual'],
  open: ['open', 'coworking', 'co-working', 'bersama', 'team', 'tim', 'kolaborasi'],
};

function detectPurpose(text) {
  const lower = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const [purpose, keywords] of Object.entries(PURPOSE_KEYWORDS)) {
    const score = keywords.reduce((acc, k) => acc + (lower.includes(k) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = purpose;
    }
  }
  return best;
}

function extractCapacity(text) {
  const match = text.match(/(\d+)\s*(orang|person|ppl|peserta|karyawan|team|tim)/i);
  if (match) return parseInt(match[1], 10);
  const digits = text.match(/(\d+)/);
  if (digits) return parseInt(digits[1], 10);
  return null;
}

function extractBudget(text) {
  const match = text.match(/(\d[\d.]*)\s*(jt|juta|ribu|k|rb)?/i);
  if (!match) return null;
  let num = parseFloat(match[1].replace(/\./g, ''));
  const unit = (match[2] || '').toLowerCase();
  if (unit === 'jt' || unit === 'juta') num *= 1_000_000;
  else if (unit === 'rb' || unit === 'ribu' || unit === 'k') num *= 1_000;
  return num;
}

// ---------------- Recommendations ----------------

export function getRecommendations({ purpose, capacity, budget, privacy } = {}) {
  const cap = capacity ?? null;
  const bud = budget ?? null;

  const privFilter = (privacy || '').toLowerCase();
  const scored = ROOMS.map((room) => {
    let score = 0;
    const reasons = [];

    // Capacity fit
    if (cap != null) {
      if (room.cap >= cap * 0.8 && room.cap <= cap * 1.5) {
        score += 3;
        reasons.push(`kapasitas pas untuk ${cap} orang`);
      } else if (room.cap >= cap) {
        score += 1;
        reasons.push(`cukup untuk ${cap} orang`);
      } else {
        score -= 2;
      }
    }

    // Budget fit (per jam)
    if (bud != null) {
      if (room.price <= bud) {
        score += 3;
        reasons.push(`sesuai budget ${rupiah(bud)}/jam`);
      } else {
        score -= 1;
      }
    }

    // Purpose fit
    if (purpose === 'event' && room.cap >= 30) { score += 3; reasons.push('luas, cocok untuk event'); }
    if (purpose === 'meeting' && room.cap >= 2 && room.cap <= 20) { score += 2; reasons.push('nyaman untuk meeting'); }
    if (purpose === 'private' && room.cap <= 4) { score += 4; reasons.push('privat & tenang'); }
    if (purpose === 'open' && room.cap >= 20) { score += 2; reasons.push('cocok untuk kerja tim'); }

    // Cheapest tie-breaker when nothing specific is requested
    if (cap == null && bud == null && purpose == null) {
      score += (1 - room.price / 1_000_000);
    } else {
      score += (1 - room.price / 1_000_000) * 0.5;
    }

    return { room, score, reasons };
  });

  return scored
    .filter((s) => s.score > -2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// ---------------- Chatbot ----------------

const GREETING = /(halo|hai|hi|hey|selamat|apa kabar|pagi|siang|sore|malam)/i;
const THANKS = /(makasih|terima kasih|thanks|thx|mantap|keren)/i;
const PRICE = /(harga|price|biaya|tarif|berapa|cost|murah|mahal)/i;
const CAPACITY = /(kapasitas|orang|person|muat|besar|kecil)/i;
const RECOMMEND = /(rekomendasi|saran|sarankan|recommend|bagus|terbaik|cocok|suggest)/i;
const BOOKING = /(booking|cara|pesan|reservasi|reserv|order|langkah|step)/i;
const PAYMENT = /(bayar|pembayaran|payment|transfer|ovo|gopay|kartu|lunas)/i;
const CANCEL = /(batal|cancel|refund|hapus)/i;
const LIST = /(daftar|list|ruangan|room|available|tersedia)/i;

const BASE_PROMPT =
  'Halo! Saya Asisten AI RuangKita. Saya bisa membantu Anda menemukan ruangan yang tepat, ' +
  'menjelaskan cara booking & pembayaran, serta memberi rekomendasi. Ketik kebutuhan Anda, ' +
  'misalnya "ruangan meeting untuk 10 orang budget 200rb".';

export function getBasePrompt() {
  return BASE_PROMPT;
}

export function getSuggestions() {
  return [
    'Rekomendasi ruangan meeting 10 orang',
    'Ruangan untuk event 50 orang',
    'Ruang paling murah?',
    'Cara booking ruangan?',
    'Cara bayar reservasi?',
  ];
}

export function getAIResponse(rawMessage, context = {}) {
  const message = (rawMessage || '').trim();
  if (!message) return BASE_PROMPT;

  const lower = message.toLowerCase();
  const rooms = context.rooms || ROOMS;
  const reservations = context.reservations || [];

  // Greeting
  if (GREETING.test(message) && message.split(' ').length <= 4) {
    return 'Halo! Saya Asisten AI RuangKita. Mau cari ruangan untuk apa hari ini? ' +
      'Anda bisa sebutkan tujuan, jumlah orang, dan budget ya.';
  }

  // Thanks
  if (THANKS.test(message)) {
    return 'Sama-sama! Kalau butuh bantuan lain soal ruangan, booking, atau pembayaran, tinggal tanya ya.';
  }

  // Cancellation / refund
  if (CANCEL.test(message)) {
    return 'Untuk membatalkan reservasi: buka menu "Reservasi Saya", pilih reservasi yang ingin dibatalkan, ' +
      'lalu tekan tombol batal. Jika sudah dibayar, pengembalian dana (refund) akan diproses maksimal 3-7 hari kerja.';
  }

  // Payment
  if (PAYMENT.test(message)) {
    return 'Cara pembayaran di RuangKita: (1) buka "Reservasi Saya" / "Pembayaran", (2) pilih reservasi, ' +
      '(3) pilih metode - Manual Bank Transfer, OVO/Gopay, atau Kartu Kredit, (4) lakukan pembayaran, ' +
      'lalu status berubah menjadi "Lunas". Admin akan memverifikasi untuk transfer manual.';
  }

  // Booking flow
  if (BOOKING.test(message) && !RECOMMEND.test(message)) {
    return 'Langkah booking ruangan: (1) Pilih menu "Daftar Ruangan", (2) Pilih ruangan, ' +
      '(3) Tentukan tanggal & jam, (4) Isi data pemesan, (5) Lakukan pembayaran. ' +
      'Mau saya rekomendasikan ruangan yang cocok untuk Anda?';
  }

  // Recommendation request (explicit or implied)
  if (RECOMMEND.test(message) || CAPACITY.test(message) || PURPOSE_KEYWORDS.event.some(k => lower.includes(k)) || PURPOSE_KEYWORDS.meeting.some(k => lower.includes(k)) || PURPOSE_KEYWORDS.private.some(k => lower.includes(k))) {
    const purpose = detectPurpose(message);
    const capacity = extractCapacity(message);
    const budget = extractBudget(message);

    if (purpose || capacity || budget) {
      const recs = getRecommendations({ purpose, capacity, budget });
      if (recs.length) {
        const lines = recs.map((r, i) => {
          const reason = r.reasons.length ? ` (${r.reasons.join(', ')})` : '';
          return `${i + 1}. ${r.room.name} - ${rupiah(r.room.price)}/jam, kapasitas ${r.room.cap} orang${reason}`;
        });
        let intro = 'Berikut rekomendasi ruangan untuk Anda';
        if (purpose) intro += ` (tujuan: ${purpose})`;
        if (capacity) intro += ` (${capacity} orang)`;
        if (budget) intro += ` (budget ${rupiah(budget)}/jam)`;
        return `${intro}:\n${lines.join('\n')}\n\nKetik "pesan <nama ruangan>" untuk mulai booking.`;
      }
      return 'Maaf, belum ada ruangan yang cocok dengan kriteria tersebut. Coba ubah jumlah orang atau budget ya.';
    }
    return 'Tentu! Ceritakan kebutuhan Anda - misalnya tujuan (meeting/event/privat), jumlah orang, dan budget per jam. ' +
      'Contoh: "ruangan meeting untuk 8 orang budget 200rb".';
  }

  // Price questions
  if (PRICE.test(message)) {
    if (lower.includes('murah') || lower.includes('termurah') || lower.includes('paling murah')) {
      const cheapest = [...rooms].sort((a, b) => a.price - b.price)[0];
      return `Ruangan termurah kami adalah ${cheapest.name} dengan ${rupiah(cheapest.price)}/jam (kapasitas ${cheapest.cap} orang).`;
    }
    if (lower.includes('mahal') || lower.includes('termahal') || lower.includes('paling mahal')) {
      const priciest = [...rooms].sort((a, b) => b.price - a.price)[0];
      return `Ruangan termahal kami adalah ${priciest.name} dengan ${rupiah(priciest.price)}/jam (kapasitas ${priciest.cap} orang).`;
    }
    const sorted = [...rooms].sort((a, b) => a.price - b.price);
    const list = sorted.map(r => `• ${r.name}: ${rupiah(r.price)}/jam`).join('\n');
    return `Daftar harga ruangan per jam:\n${list}`;
  }

  // Capacity questions
  if (CAPACITY.test(message)) {
    const sorted = [...rooms].sort((a, b) => b.cap - a.cap);
    const list = sorted.map(r => `• ${r.name}: ${r.cap} orang`).join('\n');
    return `Kapasitas ruangan yang tersedia:\n${list}`;
  }

  // List rooms
  if (LIST.test(message)) {
    const list = rooms.map(r => `• ${r.name} (${r.cap} orang, ${rupiah(r.price)}/jam)`).join('\n');
    return `Ruangan yang tersedia di RuangKita:\n${list}`;
  }

  // Context about user's reservations
  if (reservations.length && /(reservasi saya|pesanan saya|booking saya|status)/i.test(message)) {
    const pending = reservations.filter(r => r.status === 'unpaid');
    if (pending.length) {
      return `Anda memiliki ${pending.length} reservasi yang belum dibayar: ` +
        pending.map(r => `${r.room.name} (${r.code})`).join(', ') +
        '. Buka menu "Pembayaran" untuk melunasi.';
    }
    return 'Semua reservasi Anda sudah lunas.';
  }

  // Fallback
  return 'Maaf, saya belum paham pertanyaannya. Saya bisa membantu: mencari & merekomendasikan ruangan, ' +
    'menjelaskan cara booking dan pembayaran, serta info harga & kapasitas. Coba ketik "rekomendasi ruangan meeting 10 orang".';
}
