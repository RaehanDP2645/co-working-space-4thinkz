// Proxy ke backend Laravel (yang meneruskan ke PayWuzz secara server-side).
// API key PayWuzz tetap di backend, frontend tidak memanggil PayWuzz langsung.
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function getTokenKey() {
  return window.location.pathname.startsWith('/admin') ? 'token_admin' : 'token_user';
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem(getTokenKey());
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Payment API error: ${res.status}`);
  }
  return data;
}

// Mengembalikan bentuk { data, payment_id } agar cocok dengan ekspektasi frontend.
export async function createTransaction({ orderId, amount, paymentMethod, redirectUrl, metadata }) {
  const res = await request('/payments/create', {
    method: 'POST',
    body: JSON.stringify({
      orderId,
      amount,
      paymentMethod,
      redirectUrl,
      metadata,
    }),
  });
  return res.data;
}

export async function getTransaction(orderId) {
  const res = await request(`/payments/${encodeURIComponent(orderId)}`);
  return res.data;
}

export async function cancelTransaction(orderId) {
  const res = await request(`/payments/${encodeURIComponent(orderId)}/cancel`, {
    method: 'POST',
  });
  return res.data;
}

export async function simulatePayment(orderId) {
  const res = await request(`/payments/${encodeURIComponent(orderId)}/simulate`, {
    method: 'POST',
  });
  return res.data;
}

export async function getPaymentMethods() {
  const res = await request('/payments/methods');
  return res.data;
}
