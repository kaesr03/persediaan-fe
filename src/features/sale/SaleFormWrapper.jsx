import { useFetcher, useLoaderData } from 'react-router-dom';
import SaleForm from './SaleForm';
import { createSale } from '../../services/apiSales';
import { getProductOptions } from '../../services/apiProduct';
import SuccessModal from '../../ui/SuccessModal';

export default function SaleFormWrapper() {
  const fetcher = useFetcher();
  const { products } = useLoaderData();

  const submitKey = fetcher.data?.submitId;
  const key = fetcher.data?.status === 'success' ? submitKey : 'form';

  const isSuccess =
    fetcher.state === 'idle' && fetcher.data?.status === 'success';

  return (
    <>
      <SaleForm key={key} fetcher={fetcher} products={products} />
      <SuccessModal
        open={isSuccess}
        message={fetcher.data?.message}
        onClose={() => fetcher.reset()}
      />
    </>
  );
}

export async function loader() {
  const data = await getProductOptions();

  return data.data;
}

export async function action({ request }) {
  const form = await request.formData();

  const date = form.get('date') || null;
  const buyerName = form.get('buyerName') || '';
  const status = form.get('status') || 'UNPAID';
  const paidAt = form.get('paidAt') || null;

  const products = [];
  for (const [key, value] of form.entries()) {
    const m = key.match(/^products\[(\d+)\]\[(\w+)\]$/);
    if (!m) continue;
    const idx = Number(m[1]);
    const field = m[2];

    products[idx] = products[idx] || {};
    if (field === 'quantity' || field === 'sellingPrice') {
      products[idx][field] = Number(value);
    } else {
      products[idx][field] = value;
    }
  }

  const cleanProducts = products.filter(Boolean);

  const errors = {};
  if (!buyerName.trim()) errors.buyerName = 'Nama pembeli wajib diisi';
  if (!cleanProducts.length) errors.products = 'Produk wajib dipilih';

  cleanProducts.forEach((p, i) => {
    if (!p.productId) errors[`p_${i}_id`] = `productId item ${i} invalid`;
    if (!p.name) errors[`p_${i}_name`] = `Nama produk item ${i} wajib`;
    if (!p.quantity || p.quantity < 1)
      errors[`p_${i}_quantity`] = `Quantity item ${i} minimal 1`;
    if (p.sellingPrice == null || p.sellingPrice < 0)
      errors[`p_${i}_price`] = `Harga item ${i} invalid`;
  });

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors };
  }

  const computedTotal = cleanProducts.reduce(
    (s, p) => s + p.quantity * p.sellingPrice,
    0,
  );

  const payload = {
    date: date ? new Date(date) : new Date(),
    buyerName: buyerName.trim(),
    status,
    paidAt: paidAt ? new Date(paidAt) : null,
    total: computedTotal,
    products: cleanProducts.map((p) => ({
      productId: p.productId,
      name: p.name,
      quantity: p.quantity,
      sellingPrice: p.sellingPrice,
    })),
  };

  const res = await createSale(payload);
  const response = await res.json();
  return response;
}
