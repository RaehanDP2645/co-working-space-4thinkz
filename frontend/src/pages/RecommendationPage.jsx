import React, { useState } from 'react';
import { rupiah, getRoomImg } from '../constants';
import { IconSparkles, IconChevronLeft } from '../components/Icons';

const JENIS_AKTIVITAS = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'presentasi', label: 'Presentasi' },
  { value: 'kerja individu', label: 'Kerja Individu' },
  { value: 'kerja tim', label: 'Kerja Tim' },
  { value: 'event', label: 'Event' },
  { value: 'event besar', label: 'Event Besar' },
];

const PRIVASI = [
  { value: 'publik', label: 'Publik' },
  { value: 'semi_private', label: 'Semi-Private' },
  { value: 'private', label: 'Private' },
];

function ScoreBar({ score }) {
  const color = score >= 80 ? '#166534' : score >= 50 ? '#a16207' : '#991b1b';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
      <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 36, textAlign: 'right' }}>{score}%</span>
    </div>
  );
}

export default function RecommendationPage({ onSelect, onBack }) {
  const [form, setForm] = useState({
    jumlah_peserta: 10,
    jenis_aktivitas: 'meeting',
    anggaran: 200000,
    tingkat_privasi: 'semi_private',
    butuh_presentasi: false,
    butuh_event: false,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch('http://localhost:8000/api/rekomendasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mendapatkan rekomendasi');
      setResults(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-pad">
      <button className="btn-outline" onClick={onBack} style={{ marginBottom: 16, alignSelf: 'flex-start' }}>
        ‹ Kembali
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <IconSparkles />
        <h2 style={{ marginTop: 0 }}>Rekomendasi Ruangan AI</h2>
      </div>
      <p style={{ color: 'var(--ink-soft)', marginTop: 0, marginBottom: 24, fontSize: 13.5 }}>
        Sistem pakar kami menggunakan metode <b>Forward Chaining</b> untuk merekomendasikan ruangan paling sesuai
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Form */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="section-title">Kebutuhan Anda</div>

          <div className="field">
            <label>Jenis Aktivitas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {JENIS_AKTIVITAS.map(a => (
                <button key={a.value}
                  className={'chip' + (form.jenis_aktivitas === a.value ? ' selected' : '')}
                  onClick={() => update('jenis_aktivitas', a.value)}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Tingkat Privasi</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PRIVASI.map(p => (
                <button key={p.value}
                  className={'chip' + (form.tingkat_privasi === p.value ? ' selected' : '')}
                  onClick={() => update('tingkat_privasi', p.value)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Jumlah Peserta</label>
            <input className="search-input" type="number" min="1" value={form.jumlah_peserta}
              onChange={e => update('jumlah_peserta', parseInt(e.target.value) || 1)} />
          </div>

          <div className="field">
            <label>Anggaran per Jam (Rp)</label>
            <input className="search-input" type="number" min="0" step="10000" value={form.anggaran}
              onChange={e => update('anggaran', parseInt(e.target.value) || 0)} />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.butuh_presentasi}
                onChange={e => update('butuh_presentasi', e.target.checked)} />
              Butuh Presentasi
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.butuh_event}
                onChange={e => update('butuh_event', e.target.checked)} />
              Butuh Event
            </label>
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Menganalisis...' : 'Dapatkan Rekomendasi'}
          </button>
          {error && <div style={{ color: '#C03A26', fontSize: 12 }}>{error}</div>}
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!results && !loading && (
            <div className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: 'var(--ink-soft)', fontSize: 14 }}>
              <IconSparkles />
              <p style={{ marginTop: 12 }}>Isi kebutuhan Anda lalu klik <b>Dapatkan Rekomendasi</b></p>
            </div>
          )}

          {loading && (
            <div className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
              <div style={{ width: 38, height: 38, border: '4px solid #cfe3d4', borderTopColor: '#166534', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 14 }}>Sistem pakar sedang menganalisis...</p>
            </div>
          )}

          {results && results.map((r, i) => (
            <div className="panel" key={r.id} style={{ position: 'relative', border: i === 0 ? '2px solid var(--green-700)' : undefined }}>
              {i === 0 && (
                <div style={{ position: 'absolute', top: -10, left: 16, background: 'var(--green-700)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 10 }}>
                  Terbaik
                </div>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <img src={getRoomImg(r.nama, r.gambar_url)} alt={r.nama}
                  style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{r.nama}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    {r.jenis} &middot; {r.kapasitas} Orang &middot; {rupiah(r.harga)}/jam &middot; {r.privasi}
                  </div>
                  <ScoreBar score={r.skor} />
                </div>
              </div>

              {r.alasan && r.alasan.length > 0 && (
                <div style={{ marginTop: 10, padding: '10px 12px', background: '#f0fdf4', borderRadius: 8, fontSize: 12.5, lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IconSparkles /> Penjelasan AI
                  </div>
                  {r.alasan.map((a, j) => (
                    <div key={j} style={{ paddingLeft: 8 }}>&#8226; {a}</div>
                  ))}
                </div>
              )}

              {r.fasilitas && r.fasilitas.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {r.fasilitas.map((f, j) => (
                    <span key={j} style={{ fontSize: 11, background: '#e5e7eb', padding: '2px 8px', borderRadius: 6 }}>{f}</span>
                  ))}
                </div>
              )}

              <button className="btn-outline" style={{ marginTop: 10, width: '100%' }}
                onClick={() => onSelect({ id: r.id, name: r.nama, cap: r.kapasitas, price: r.harga, img: getRoomImg(r.nama, r.gambar_url) })}>
                Pilih Ruangan Ini
              </button>
            </div>
          ))}

          {results && results.length === 0 && (
            <div className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--ink-soft)' }}>
              Tidak ada ruangan yang sesuai dengan kriteria Anda. Coba ubah parameter pencarian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
