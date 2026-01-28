import { Link, useFetcher, useLoaderData } from 'react-router-dom';
import { getSale, updateSaleStatus } from '../../services/apiSales';
import { useState } from 'react';
import SaleEdit from './SaleEdit';
import SuccessModal from '../../ui/SuccessModal';

const SaleDetail = () => {
  const fetcher = useFetcher();
  const { sale } = useLoaderData();
  const [openEditModal, setOpenEditModal] = useState(false);

  const isSuccess =
    fetcher.state === 'idle' && fetcher.data?.status === 'success';

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Link
        to="/sales"
        className="mb-4 inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        Kembali
      </Link>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-black uppercase">Detail Penjualan</h1>

          <div className="flex items-center gap-2">
            <span
              className={`rounded px-3 py-1 text-xs font-bold ${
                sale.status === 'PAID'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {sale.status === 'PAID' ? 'Sudah Lunas' : 'Belum Lunas'}
            </span>
            <button
              onClick={() => setOpenEditModal(true)}
              className="w-full rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 sm:w-auto"
            >
              Edit status
            </button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <p>
            <span className="text-gray-500">Tanggal:</span>
            {new Date(sale.date).toLocaleDateString('id-ID')}
          </p>
          <p>
            <span className="text-gray-500">Tanggal Dibayar:</span>
            {sale.paidAt
              ? new Date(sale.paidAt).toLocaleDateString('id-ID')
              : ' Belum Dibayar'}
          </p>
          <p>
            <span className="text-gray-500">Pembeli:</span> {sale.buyerName}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Produk</th>
                <th className="border px-3 py-2 text-right">Jumlah</th>
                <th className="border px-3 py-2 text-right">Harga</th>
                <th className="border px-3 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {sale.products.map((p, i) => (
                <tr key={i}>
                  <td className="border px-3 py-2">{p.name}</td>
                  <td className="border px-3 py-2 text-right">{p.quantity}</td>
                  <td className="border px-3 py-2 text-right">
                    Rp {p.sellingPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="border px-3 py-2 text-right font-semibold">
                    Rp {(p.quantity * p.sellingPrice).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right text-lg font-bold text-green-600">
          Total: Rp {sale.total.toLocaleString('id-ID')}
        </div>
      </div>

      <SuccessModal
        open={isSuccess}
        message={fetcher.data?.message}
        onClose={() => fetcher.reset()}
      />

      <SaleEdit
        fetcher={fetcher}
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        sale={sale}
      />
    </div>
  );
};

export default SaleDetail;

export async function loader({ request, params }) {
  const id = params.saleId;

  const sale = await getSale(id);

  return sale;
}

export async function action({ request, params }) {
  const id = params.saleId;
  const data = await request.formData();

  const status = data.get('status');
  const paidAt = data.get('paidAt');
  const loadStatus = { status, paidAt };

  const res = await updateSaleStatus(id, loadStatus);

  const response = await res.json();
  return response;
}
