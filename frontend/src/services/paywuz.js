const API_BASE = 'https://api.paywuz.id/v1';
const API_KEY = 'pk_sand_9be561b3c78a3bf951d55daefade26ea';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Paywuz API error: ${res.status}`);
  }
  return data;
}

export async function createTransaction({ orderId, amount, paymentMethod, redirectUrl, metadata }) {
  const body = {
    orderId,
    amount,
    paymentMethod,
  };
  if (redirectUrl) body.redirectUrl = redirectUrl;
  if (metadata) body.metadata = metadata;

  const res = await request('/transactions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function getTransaction(orderId) {
  const res = await request(`/transactions/${orderId}`);
  return res.data;
}

export async function cancelTransaction(orderId) {
  const res = await request(`/transactions/${orderId}/cancel`, {
    method: 'POST',
  });
  return res.data;
}

export async function simulatePayment(orderId) {
  const res = await request(`/transactions/${orderId}/simulate`, {
    method: 'POST',
  });
  return res.data;
}

export async function getPaymentMethods() {
  const res = await request('/payment-methods');
  return res.data;
}
