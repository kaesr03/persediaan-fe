const URL = import.meta.env.BACKEND_API;

const API_URL = URL || 'http://localhost:8000';

export async function getMe() {
  const res = await fetch(`${API_URL}/users/getMe`, {
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw Error(data.message);

  return data;
}

export async function updateMe(body) {
  const res = await fetch(`${API_URL}/users/updateMe`, {
    credentials: 'include',
    method: 'PATCH',

    body: body,
  });

  return res;
}
export async function logout() {
  const res = await fetch(`${API_URL}/users/logout`, {
    credentials: 'include',
    method: 'POST',
  });

  return res;
}
