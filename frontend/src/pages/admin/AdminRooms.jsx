import React, { useState } from 'react';
import { rupiah } from '../../constants';

export default function AdminRooms({ 
  rooms, 
  onAddRoom, 
  onUpdateRoom, 
  onToggleRoomStatus 
}) {
  const [editingRoom, setEditingRoom] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Meeting Room');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [facilities, setFacilities] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('Aktif');

  const handleOpenAdd = () => {
    setName('');
    setType('Meeting Room');
    setCapacity('');
    setPrice('');
    setFacilities('');
    setImageUrl('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600');
    setStatus('Aktif');
    setIsAdding(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRoom(r);
    setName(r.name);
    setType(r.type || 'Meeting Room');
    setCapacity(r.cap || '');
    setPrice(r.price || '');
    setFacilities(r.facilities || 'WiFi, Proyektor, Sound System, Papan Tulis');
    setImageUrl(r.img || '');
    setStatus(r.status || 'Aktif');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !capacity || !price) return;

    const roomData = {
      name,
      type,
      cap: parseInt(capacity),
      price: parseInt(price),
      facilities,
      img: imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600',
      status
    };

    if (isAdding) {
      onAddRoom(roomData);
      setIsAdding(false);
    } else if (editingRoom) {
      onUpdateRoom(editingRoom.id, roomData);
      setEditingRoom(null);
    }
  };

  return (
    <div className="page-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Kelola Ruangan</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13.5px', marginTop: '4px' }}>Tambah, edit, aktifkan/nonaktifkan ruangan untuk sistem reservasi.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="btn-primary"
          style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 600 }}
        >
          + Tambah Ruangan
        </button>
      </div>

      {/* Room Table/Grid view */}
      <div className="panel" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2.5px solid var(--line)', color: 'var(--ink-soft)', fontSize: '13px' }}>
                <th style={{ padding: '12px 8px' }}>Foto</th>
                <th style={{ padding: '12px 8px' }}>Nama Ruangan</th>
                <th style={{ padding: '12px 8px' }}>Tipe</th>
                <th style={{ padding: '12px 8px' }}>Kapasitas</th>
                <th style={{ padding: '12px 8px' }}>Harga / Jam</th>
                <th style={{ padding: '12px 8px' }}>Fasilitas</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--line)', fontSize: '13.5px' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <img 
                      src={r.img} 
                      alt={r.name} 
                      style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--line)' }}
                    />
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 700 }}>{r.name}</td>
                  <td style={{ padding: '12px 8px' }}>{r.type || 'Meeting Room'}</td>
                  <td style={{ padding: '12px 8px' }}>{r.cap} Orang</td>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--green-700)' }}>{rupiah(r.price)}</td>
                  <td style={{ padding: '12px 8px', fontSize: '12.5px', color: 'var(--ink-soft)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.facilities || 'WiFi, Proyektor, Sound System'}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {r.status === 'Nonaktif' ? (
                      <span className="badge danger">Nonaktif</span>
                    ) : (
                      <span className="badge ok">Aktif</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleOpenEdit(r)}
                        style={{ background: 'var(--green-100)', color: 'var(--green-700)', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => onToggleRoomStatus(r.id)}
                        style={{ 
                          background: r.status === 'Nonaktif' ? 'var(--green-100)' : '#FBE4E0', 
                          color: r.status === 'Nonaktif' ? 'var(--green-700)' : '#C03A26', 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          fontWeight: 600, 
                          fontSize: '12px' 
                        }}
                      >
                        {r.status === 'Nonaktif' ? 'Aktifkan' : 'Nonaktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal (Add / Edit) */}
      {(isAdding || editingRoom) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <form 
            onSubmit={handleSave}
            style={{
              background: '#fff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: 'var(--shadow)'
            }}
          >
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
              {isAdding ? 'Tambah Ruangan Baru' : 'Edit Ruangan'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Nama Ruangan</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Jenis Ruangan</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                  >
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Event Space">Event Space</option>
                    <option value="Private Office">Private Office</option>
                    <option value="Coworking Space">Coworking Space</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Kapasitas (Orang)</label>
                  <input 
                    type="number" 
                    value={capacity} 
                    onChange={(e) => setCapacity(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Harga / Jam (Rp)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Fasilitas (pisahkan dengan koma)</label>
                <input 
                  type="text" 
                  value={facilities} 
                  onChange={(e) => setFacilities(e.target.value)}
                  placeholder="e.g. WiFi, Proyektor, Sound System"
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>URL Foto Ruangan</label>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                />
                <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>* Simulasikan upload foto dengan menempelkan tautan gambar Unsplash.</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setEditingRoom(null); }}
                style={{ padding: '8px 16px', background: 'none', border: '1px solid var(--line)', borderRadius: '8px', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                style={{ padding: '8px 20px', borderRadius: '8px' }}
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
