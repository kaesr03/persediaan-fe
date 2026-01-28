const URL = import.meta.env.BACKEND_API;

const API_URL = URL || 'http://localhost:8000';

export async function getExpenses(param) {
  let url = `${API_URL}/expenses`;

  const params = [];

  if (param?.page) params.push(`page=${param.page}`);
  if (param?.date) params.push(`date=${param.date}`);
  if (param?.sortQuery) params.push(`sort=${param.sortQuery}`);
  if (param?.productName)
    params.push(`productName=${encodeURIComponent(param.productName)}`);

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

export async function getExpense(id) {
  const url = `${API_URL}/expenses/${id}`;

  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok)
    throw Error(`Tidak dapat menemukan pengeluaran dengan id #${id}`);

  const { data } = await res.json();
  return data;
}

export async function createExpense(body) {
  const res = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  return res;
}
