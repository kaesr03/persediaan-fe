import { useFetcher, useLoaderData } from 'react-router-dom';
import { getProductOptions, getProducts } from '../../services/apiProduct';
import { createExpense } from '../../services/apiExpense';
import SuccessModal from '../../ui/SuccessModal';
import ExpenseForm from './ExpenseForm';

export default function ExpenseFormWrapper() {
  const fetcher = useFetcher();
  const { products } = useLoaderData();
  const submitKey = fetcher.data?.submitId;
  const key = fetcher.data?.status === 'success' ? submitKey : 'form';

  const isSuccess =
    fetcher.state === 'idle' && fetcher.data?.status === 'success';

  return (
    <>
      <ExpenseForm key={key} fetcher={fetcher} products={products} />
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
  const description = form.get('description') || null;
  const amount = form.get('amount') || null;

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
  if (!amount) errors.amount = 'wajib ada total harga produk';

  cleanProducts.forEach((p, i) => {
    if (!p.productId) errors[`p_${i}_id`] = `productId item ${i} invalid`;
    if (!p.name) errors[`p_${i}_name`] = `Nama produk item ${i} wajib`;
    if (!p.quantity || p.quantity < 1)
      errors[`p_${i}_quantity`] = `Quantity item ${i} minimal 1`;
    if (p.sellingPrice == null || p.sellingPrice < 0)
      errors[`p_${i}_price`] = `Harga item ${i} invalid`;
  });

  const computedTotal = cleanProducts.reduce(
    (s, p) => s + p.quantity * p.purchasePrice,
    0,
  );

  const payload = {
    date: date ? new Date(date) : new Date(),
    amount: computedTotal,
    description,
    products: cleanProducts.map((p) => ({
      productId: p.productId,
      name: p.name,
      quantity: p.quantity,
      purchasePrice: p.purchasePrice,
    })),
  };

  const res = await createExpense(payload);

  const response = await res.json();
  return response;

  // const data = await createExpense;
  // return data;
}
