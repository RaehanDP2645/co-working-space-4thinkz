import React, { useState } from 'react';
import { ROOMS, rupiah } from '../constants';
import { getRecommendations } from '../utils/aiEngine';
import { IconSparkles, IconChevronRight, IconClose } from './Icons';

const PURPOSES = [
  { key: 'meeting', label: 'Meeting / Rapat' },
  { key: 'event', label: 'Event / Acara' },
  { key: 'private', label: 'Private / Fokus' },
  { key: 'open', label: 'Open Space / Tim' },
];

export default function AIRecommendations({ onSelect }) {
  const [purpose, setPurpose] = useState('');
  const [capacity, setCapacity] = useState('');
  const [budget, setBudget] = useState('');
  const [results, setResults] = useState(null);

  const find = () => {
    const recs = getRecommendations({
      purpose: purpose || null,
      capacity: capacity ? parseInt(capacity, 10) : null,
      budget: budget ? parseInt(budget, 10) : null,
    });
    setResults(recs);
  };

  const reset = () => {
    setResults(null);
    setPurpose('');
    setCapacity('');
    setBudget('');
  };

  return (
    <div className="ai-rec">
      <div className="ai-rec-head">
        <span className="ai-rec-icon"><IconSparkles size={18} /></span>
        <div>
          <div className="ai-rec-title">Rekomendasi AI</div>
          <div className="ai-rec-sub">Temukan ruangan terbaik untuk kebutuhan Anda</div>
        </div>
      </div>

      {!results && (
        <div className="ai-rec-form">
          <div className="ai-rec-field">
            <label>Tujuan</label>
            <div className="ai-rec-chips">
              {PURPOSES.map((p) => (
                <button
                  key={p.key}
                  className={`ai-rec-chip ${purpose === p.key ? 'active' : ''}`}
                  onClick={() => setPurpose(purpose === p.key ? '' : p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-rec-row">
            <div className="ai-rec-field">
              <label>Jumlah Orang</label>
              <input
                type="number" min="1" placeholder="cth. 10"
                value={capacity} onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            <div className="ai-rec-field">
              <label>Budget / jam (Rp)</label>
              <input
                type="number" min="1" placeholder="cth. 200000"
                value={budget} onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <button className="ai-rec-btn" onClick={find}>
            <IconSparkles size={16} /> Dapatkan Rekomendasi
          </button>
        </div>
      )}

      {results && (
        <div>
          {results.length === 0 && (
            <div className="ai-rec-empty">
              Tidak ada ruangan yang cocok. Coba ubah kriteria Anda.
            </div>
          )}
          {results.map((r, i) => (
            <div className="ai-rec-item" key={r.room.id}>
              <div className="ai-rec-rank">{i + 1}</div>
              <img src={r.room.img} alt={r.room.name} />
              <div className="ai-rec-info">
                <div className="ai-rec-name">{r.room.name}</div>
                <div className="ai-rec-meta">{rupiah(r.room.price)}/jam · {r.room.cap} orang</div>
                {r.reasons.length > 0 && (
                  <div className="ai-rec-reason">✨ {r.reasons.join(', ')}</div>
                )}
              </div>
              <button className="ai-rec-pick" onClick={() => onSelect && onSelect(r.room)}>
                Pilih <IconChevronRight size={14} />
              </button>
            </div>
          ))}
          <button className="ai-rec-btn ghost" onClick={reset}>
            <IconClose size={14} /> Ubah Kriteria
          </button>
        </div>
      )}
    </div>
  );
}
