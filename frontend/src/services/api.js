const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function getTokenKey() {
  return window.location.pathname.startsWith('/admin') ? 'token_admin' : 'token_user';
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem(getTokenKey());
  const headers = {
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `API error: ${res.status}`);
  }
  return data;
}

export const api = {
  getRooms: () => request('/rooms').then(r => r.data),
  getReservations: () => request('/pemesanan').then(r => r.data),
  createReservation: (payload) => request('/pemesanan', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(r => r.data),
  cancelReservation: (id) => request(`/pemesanan/${id}`, { method: 'DELETE' }),
  getUser: () => request('/user').then(r => r.data ?? r.user ?? r),
  updateUser: (data) => request('/user', {
    method: 'PUT',
    body: JSON.stringify({ name: data.name, email: data.email, no_telepon: data.phone }),
  }),
  uploadAvatar: (avatar) => request('/user/avatar', {
    method: 'POST',
    body: JSON.stringify({ avatar }),
  }),
  changePassword: (current_password, password, password_confirmation) => request('/user/password', {
    method: 'POST',
    body: JSON.stringify({ current_password, password, password_confirmation }),
  }),

  // admin login
  adminLogin: (email, password) => request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  // admin dashboard
  getAdminDashboard: () => request('/admin/dashboard').then(r => r.data),

  // admin bookings
  getAdminBookings: () => request('/admin/bookings').then(r => r.data),
  updateBookingStatus: (id, status) => request(`/admin/bookings/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  }).then(r => r.data),
  cancelBooking: (id) => request(`/admin/bookings/${id}/cancel`, {
    method: 'POST',
  }).then(r => r.data),

  // admin payments
  getAdminPayments: () => request('/admin/payments').then(r => r.data),
  verifyPayment: (id) => request(`/admin/payments/${id}/verify`, {
    method: 'POST',
  }).then(r => r.data),

  // admin customers
  getAdminCustomers: () => request('/admin/customers').then(r => r.data),

  // admin rooms
  getAdminRooms: () => request('/admin/ruangan').then(r => r.data),
  createRoom: (payload) => {
    if (payload.gambar_file) {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (k === 'gambar_file') fd.append('gambar', v);
        else if (v !== null && v !== undefined) fd.append(k, v);
      });
      return request('/admin/ruangan', { method: 'POST', body: fd, isFormData: true }).then(r => r.data);
    }
    return request('/admin/ruangan', { method: 'POST', body: JSON.stringify(payload) }).then(r => r.data);
  },
  updateRoom: (id, payload) => {
    if (payload.gambar_file) {
      const fd = new FormData();
      fd.append('_method', 'PUT');
      Object.entries(payload).forEach(([k, v]) => {
        if (k === 'gambar_file') fd.append('gambar', v);
        else if (v !== null && v !== undefined) fd.append(k, v);
      });
      return request(`/admin/ruangan/${id}`, { method: 'POST', body: fd, isFormData: true }).then(r => r.data);
    }
    return request(`/admin/ruangan/${id}`, { method: 'PUT', body: JSON.stringify(payload) }).then(r => r.data);
  },
  toggleRoomStatus: (id) => request(`/admin/ruangan/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'Nonaktif' }),
  }).then(r => r.data),
};
