import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

const SaleEdit = ({ isOpen, onClose, sale, fetcher }) => {
  const [status, setStatus] = useState(sale.status);
  const [paidDate, setPaidDate] = useState(
    sale.paindAt || new Date().toISOString().split('T')[0],
  );

  useEffect(() => {
    if (
      (fetcher.state === 'loading' || fetcher.state === 'submitting') &&
      fetcher.data?.status === 'success' &&
      typeof onClose === 'function'
    ) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="mb-4 text-lg font-black uppercase">
          Edit Status Penjualan
        </h1>

        <fetcher.Form
          action={`/sales/${sale._id}`}
          method="PATCH"
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Pembayaran
            </label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="UNPAID">Belum Lunas</option>
              <option value="PAID">Sudah Lunas</option>
            </select>
          </div>

          {status === 'PAID' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Dibayar
              </label>
              <input
                type="date"
                name="paidAt"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
            >
              Batal
            </button>

            <button
              disabled={
                fetcher.state === 'loading' || fetcher.state === 'submitting'
              }
              type="submit"
              className="isabled:cursor-not-allowed rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
            >
              {fetcher.state === 'loading' || fetcher.state === 'submitting' ? (
                <Loader className="spin" weight="bold" />
              ) : (
                'Simpan'
              )}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default SaleEdit;
