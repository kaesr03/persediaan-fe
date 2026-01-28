const URL = import.meta.env.BACKEND_API;

const API_URL = URL || 'http://localhost:8000';

export async function getSales(param) {
  let url = `${API_URL}/sales`;

  const params = [];

  if (param?.page) params.push(`page=${param.page}`);
  if (param?.date) params.push(`date=${param.date}`);
  if (param?.buyerName)
    params.push(`buyerName=${encodeURIComponent(param.buyerName)}`);
  if (param?.sortQuery)
    params.push(`sort=${encodeURIComponent(param.sortQuery)}`);
  if (param?.status) params.push(`status=${encodeURIComponent(param.status)}`);

  if (params.length) {
    url += `?${params.join('&')}&limit=10`;
  }

  const res = await fetch(url, {
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw Error(data.message);

  return data;
}

export async function getSale(id) {
  const url = `${API_URL}/sales/${id}`;

  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok) throw Error(`Tidak dapat menemukan penjualan dengan id #${id}`);

  const { data } = await res.json();
  return data;
}

export async function createSale(body) {
  const res = await fetch(`${API_URL}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  return res;
}

export async function updateSaleStatus(id, body) {
  const res = await fetch(`${API_URL}/sales/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  return res;
}
