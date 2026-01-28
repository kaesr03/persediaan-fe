const URL = import.meta.env.BACKEND_API;

const API_URL = URL || 'http://localhost:8000';

export async function getBrands(param) {
  let url = `${API_URL}/brands`;

  const params = [];

  if (param?.page) params.push(`page=${param.page}`);
  if (param?.name) params.push(`name=${encodeURIComponent(param.name)}`);

  if (params.length) {
    url += `?${params.join('&')}&limit=18`;
  }

  const res = await fetch(url, {
    credentials: 'include',
  });

  // fetch won't throw error on 400 errors (e.g. when URL is wrong), so we need to do it manually. This will then go into the catch block, where the message is set
  const data = await res.json();
  if (!res.ok) throw Error(data.message);

  return data;
}

export async function getBrandsOptions() {
  const url = `${API_URL}/brands/options`;

  const res = await fetch(url, {
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw Error(data.message);

  return data;
}

export async function createBrand(body) {
  const res = await fetch(`${API_URL}/brands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  return res;
}

export async function deleteBrand(id) {
  const res = await fetch(`${API_URL}/brands/${id}`, {
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

export async function updateBrand(id, body) {
  const res = await fetch(`${API_URL}/brands/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  return res;
}
