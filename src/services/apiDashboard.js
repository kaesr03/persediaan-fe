const URL = import.meta.env.VITE_BACKEND_API;

const API_URL = URL || 'http://localhost:8000';

export async function getDashboard(param) {
  let url = `${API_URL}/dashboard`;

  const params = [];

  if (param?.totalStockCategory)
    params.push(`totalStockCategory=${param.totalStockCategory}`);
  if (param?.year) params.push(`year=${param.year}`);
  if (param?.totalStockSoldCategory)
    params.push(`totalStockSoldCategory=${param.totalStockSoldCategory}`);
  if (param?.popularProductsCategory)
    params.push(
      `popularProductsCategory=${encodeURIComponent(param.popularProductsCategory)}`,
    );
  if (param?.totalIncomeCategory)
    params.push(
      `totalIncomeCategory=${encodeURIComponent(param.totalIncomeCategory)}`,
    );

  if (params.length) {
    url += `?${params.join('&')}`;
  }

  const res = await fetch(url, {
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw Error(data.message);

  return data;
}
