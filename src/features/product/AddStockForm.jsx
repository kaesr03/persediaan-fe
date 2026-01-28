import Header from '../../ui/Header';
import { useEffect, useState } from 'react';

const AddStockForm = ({ fetcher, isOpen, onClose, product }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (
      fetcher.state === 'idle' &&
      fetcher.data?.status === 'success' &&
      typeof onClose === 'function'
    ) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!isOpen) return null;

  const labelCssStyles = 'block text-sm font-medium text-gray-700';
  const inputCssStyles =
    'block w-full mb-3 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none';

  return (
    <div className="bg-opacity-50 fixed inset-0 z-20 bg-gray-600">
      <div className="relative top-32 mx-auto w-full max-w-md rounded-md border bg-white p-5 shadow-lg">
        <Header name="Tambah Stock Produk" />

        <fetcher.Form
          method="PATCH"
          action={`/products/${product._id}`}
          className="mt-5 space-y-4"
          noValidate
        >
          <div className="rounded-md border bg-gray-50 p-3">
            <p className="text-sm text-gray-600">Stock saat ini</p>
            <p className="text-2xl font-bold text-gray-800">
              {product.quantity}
            </p>
          </div>
          <input name="addStock" value={true} readOnly hidden />

          <div>
            <label htmlFor="quantity" className={labelCssStyles}>
              Tambah jumlah stock
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              min="1"
              placeholder="Masukkan jumlah stock"
              className={inputCssStyles}
              required
            />
            {fetcher.data?.errors?.quantity && (
              <p className="-mt-2 text-sm text-red-600">
                {fetcher.data.errors.quantity}
              </p>
            )}
          </div>

          <div>
            <label className={labelCssStyles}>Tanggal Masuk</label>
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCssStyles}
            />
          </div>

          {fetcher.data?.status === 'fail' && (
            <p className="text-sm text-red-600">{fetcher.data.message}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              disabled={fetcher.state === 'submitting'}
              className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Tambah Stock
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-500 px-4 py-2 font-semibold text-white hover:bg-gray-700"
            >
              Batal
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default AddStockForm;
