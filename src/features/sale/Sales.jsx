import { PlusCircleIcon, SearchIcon } from 'lucide-react';
import { Link, useLoaderData, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { id } from 'date-fns/locale';

import { getSales } from '../../services/apiSales';

import Header from '../../ui/Header';
import PaginationArrows from '../../ui/PaginationArrows';
import SortByDate from '../../ui/SortByDate';

function formatDateForQuery(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const Sales = () => {
  const data = useLoaderData();
  const sales = data.data.sales;
  const [searchParams, setSearchParams] = useSearchParams();

  const buyerName = searchParams.get('buyerName') || '';
  const [date, setDate] = useState(searchParams.get('date') || '');

  const page = Number(searchParams.get('page')) || 1;

  const totalPages = data.totalPages;

  if (!sales) {
    return (
      <div className="py-4 text-center text-red-500">Gagal Fetching Data</div>
    );
  }

  return (
    <div className="mx-auto w-full pb-5">
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama pembeli"
            className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
            value={buyerName}
            onChange={(e) => {
              const v = e.target.value;
              setSearchParams((prev) => {
                const p = new URLSearchParams(prev);
                v ? p.set('buyerName', v) : p.delete('buyerName');
                p.delete('page');
                return p;
              });
            }}
          />
        </div>

        <div className="relative flex items-center rounded-lg border border-gray-300 bg-white px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          {/* <input
            type="date"
            onChange={(selectedDate) => {
              setDate(selectedDate);

              setSearchParams((prev) => {
                const p = new URLSearchParams(prev);

                if (selectedDate) {
                  p.set('date');
                } else {
                  p.delete('date');
                }

                p.delete('page');
                return p;
              });
            }}
            className="w-full bg-transparent px-3 py-2 text-sm text-gray-700 focus:outline-none"
            name="date"
            placeholderText="Cari berdasarkan tanggal"
          /> */}

          <DatePicker
            selected={date}
            onChange={(selectedDate) => {
              setDate(selectedDate);

              setSearchParams((prev) => {
                const p = new URLSearchParams(prev);

                if (selectedDate) {
                  p.set('date', formatDateForQuery(selectedDate));
                } else {
                  p.delete('date');
                }

                p.delete('page');
                return p;
              });
            }}
            dateFormat="dd/MM/yyyy"
            locale={id}
            placeholderText="Cari berdasarkan tanggal"
            className="w-full bg-transparent px-3 py-2 text-sm text-gray-700 focus:outline-none"
          />

          {date && (
            <button
              type="button"
              onClick={() => {
                setDate(null);
                setSearchParams((prev) => {
                  const p = new URLSearchParams(prev);
                  p.delete('date');
                  p.delete('page');
                  return p;
                });
              }}
              className="absolute right-3 text-gray-400 hover:text-red-500"
              title="Reset tanggal"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-row gap-2 sm:flex-row sm:items-center sm:gap-3">
          <SortByDate />
          <select
            onChange={(e) => {
              const v = e.target.value;
              setSearchParams((prev) => {
                const p = new URLSearchParams(prev);
                v ? p.set('status', v) : p.delete('status');
                p.delete('page');
                return p;
              });
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none md:w-[155px]"
          >
            <option value="">Semua Penjualan</option>
            <option value="PAID">Lunas</option>
            <option value="UNPAID">Belum Lunas</option>
          </select>
        </div>

        <Link
          to="/sales/new"
          className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-gray-200 hover:bg-blue-700"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5 text-gray-200" />
          Catat Penjualan
        </Link>
      </div>

      {/* <div className="mb-4 flex items-center justify-between">
        <SortByDate className="mr-4" />
        <div className="flex items-center gap-3">
          <select
            onChange={(e) => updateQuery('category', e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none md:w-[145px]"
          >
            <option value="">Semua Kategori</option>
            {categoryOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Link
          to="/sales/new"
          className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-gray-200 hover:bg-blue-700"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5 !text-gray-200" /> Catat
          Penjualan
        </Link>
      </div> */}

      <div className="mb-6 flex items-center justify-between">
        <Header name="Penjualan" />
      </div>

      <div className="space-y-4">
        {sales?.length ? (
          sales.map((sale) => (
            <div
              key={sale._id}
              className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(sale.date).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>

                  <p className="font-semibold">{sale.products.length} Produk</p>

                  <p className="text-sm text-gray-600">
                    Pembeli:
                    <span className="font-medium">{sale.buyerName}</span>
                  </p>
                  <span
                    className={`rounded px-3 py-1 text-xs font-bold ${
                      sale.status === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {sale.status === 'PAID' ? 'Sudah Lunas' : 'Belum Lunas'}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Penjualan</p>
                  <p className="text-lg font-bold text-green-600">
                    Rp {sale.total.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-right">
                <Link
                  to={`/sales/${sale._id}`}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-[30vh] items-end justify-center">
            <p className="text-lg text-gray-500">Belum ada catatan penjualan</p>
          </div>
        )}
      </div>

      <PaginationArrows
        page={page}
        totalPages={totalPages}
        onPrev={() => {
          setSearchParams((prev) => {
            const params = Object.fromEntries(prev);
            params.page = page - 1;
            return params;
          });
        }}
        onNext={() => {
          setSearchParams((prev) => {
            const params = Object.fromEntries(prev);
            params.page = page + 1;
            return params;
          });
        }}
      />
    </div>
  );
};

export default Sales;

export async function loader({ request }) {
  const url = new URL(request.url);

  const page = url.searchParams.get('page') || 1;
  const date = url.searchParams.get('date');

  const buyerName = url.searchParams.get('buyerName');
  const sort = url.searchParams.get('sort');
  const status = url.searchParams.get('status');

  let sortQuery;
  if (sort === 'latest') sortQuery = '-date';
  else if (sort === 'oldest') sortQuery = 'date';
  else sortQuery = undefined;

  const data = await getSales({ page, date, buyerName, sortQuery, status });

  return data;
}
