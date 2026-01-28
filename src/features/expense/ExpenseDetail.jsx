import { Link, useLoaderData } from 'react-router-dom';
import Header from '../../ui/Header';
import { getExpense } from '../../services/apiExpense';

const ExpenseDetail = () => {
  const { expense } = useLoaderData();
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-6">
      <Header name="Detail Pengeluaran" />

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {new Date(expense.date).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <p className="text-lg font-semibold break-all">
            {expense.description || 'Tanpa keterangan'}
          </p>
        </div>

        <div className="space-y-3">
          {expense.products.map((p, i) => (
            <div
              key={i}
              className="flex justify-between rounded border bg-gray-50 p-3"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">
                  {p.quantity} &times; Rp
                  {p.purchasePrice.toLocaleString('id-ID')}
                </p>
              </div>

              <p className="font-semibold">
                Rp
                {(Number(p.quantity) * Number(p.purchasePrice)).toLocaleString(
                  'id-ID',
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t pt-4 font-bold">
          <span>Total</span>
          <span className="text-red-600">
            Rp {expense.amount.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <Link
        to="/expenses"
        className="inline-block rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
      >
        Kembali
      </Link>
    </div>
  );
};

export default ExpenseDetail;

export async function loader({ request, params }) {
  const id = params.expenseId;

  const expense = await getExpense(id);

  return expense;
}
