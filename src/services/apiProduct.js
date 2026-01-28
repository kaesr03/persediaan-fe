const URL = import.meta.env.BACKEND_API;

const API_URL = URL || 'http://localhost:8000';

export async function getProducts(param) {
  let url = `${API_URL}/products`;

  const params = [];

  if (param?.page) params.push(`page=${param.page}`);
  if (param?.name) params.push(`name=${encodeURIComponent(param.name)}`);
  if (param?.category)
    params.push(`category=${encodeURIComponent(param.category)}`);
  if (param?.brand) params.push(`brand=${encodeURIComponent(param.brand)}`);

  if (params.length) {
    url += `?${params.join('&')}&limit=10`;
  }

  const res = await fetch(url, {
    credentials: 'include',
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  const data = await res.json();
  if (!res.ok) throw Error(data.message);

  return data;
}

export async function getProductOptions() {
  const url = `${API_URL}/products/options`;

  const res = await fetch(url, {
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw Error(data.message);

  return data;
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      error = {
        message: res.statusText || 'Request Gagal',
        status: res.status,
      };
    }
    throw error;
  }

  return res;
}

export async function createProduct(body) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    body,
    credentials: 'include',
  });

  return res;
}

export async function updateProduct(id, body) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PATCH',
    body,
    credentials: 'include',
  });

  return res;
}

export async function addProductStock(id, qty) {
  const res = await fetch(`${API_URL}/products/${id}/add`, {
    method: 'PATCH',
    body: JSON.stringify(qty),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return res;
}
