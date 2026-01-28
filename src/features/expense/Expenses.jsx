import { PlusCircleIcon, SearchIcon } from 'lucide-react';
import Header from '../../ui/Header';
import { Link, useLoaderData, useSearchParams } from 'react-router-dom';
import { getExpenses } from '../../services/apiExpense';
import SortByDate from '../../ui/SortByDate';
import PaginationArrows from '../../ui/PaginationArrows';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { id } from 'date-fns/locale';

function formatDateForQuery(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const truncateText = (text, max = 70) => {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '...' : text;
};

const Expenses = () => {
  const data = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const productName = searchParams.get('productName') || '';
  const [date, setDate] = useState(searchParams.get('date') || '');

  const expenses = data.data.expenses;

  const page = Number(searchParams.get('page')) || 1;
  const totalPages = data.totalPages;

  return (
    <div className="mx-auto w-full pb-5">
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama produk..."
            className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
            value={productName}
            onChange={(e) => {
              const v = e.target.value;
              setSearchParams((prev) => {
                const p = new URLSearchParams(prev);
                v ? p.set('productName', v) : p.delete('productName');
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

      <div className="mb-4 flex items-center justify-between">
        <SortByDate className="mr-4" />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <Header name="Pengeluaran" />
        <Link
          to="/expenses/new"
          className="flex items-center rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" />
          Catat Pengeluaran
        </Link>
      </div>

      <div className="space-y-4">
        {expenses.length ? (
          expenses.map((expense) => (
            <div
              key={expense._id}
              className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>

                  <p className="whitespace-norma font-semibold break-all">
                    {truncateText(expense.description) || 'Tanpa keterangan'}
                  </p>

                  {expense.products.slice(0, 3).map((product) => (
                    <p
                      key={product._id}
                      className="inline text-sm text-gray-600"
                    >
                      {product.name}
                      {expense.products.length > 3 && ', '}
                    </p>
                  ))}
                  {expense.products.length > 3 && (
                    <p className="inline text-sm text-gray-600"> .....</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Pengeluaran</p>
                  <p className="text-lg font-bold text-red-600">
                    Rp {expense.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-right">
                <Link
                  to={`/expenses/${expense._id}`}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-[30vh] items-center justify-center">
            <p className="text-lg text-gray-500">
              Belum ada catatan pengeluaran
            </p>
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

export default Expenses;

export async function loader({ request }) {
  const url = new URL(request.url);

  const page = url.searchParams.get('page') || 1;
  const date = url.searchParams.get('date');
  const sort = url.searchParams.get('sort');
  const productName = url.searchParams.get('productName');

  let sortQuery;
  if (sort === 'latest') sortQuery = '-date';
  else if (sort === 'oldest') sortQuery = 'date';
  else sortQuery = undefined;

  const data = await getExpenses({ page, date, sortQuery, productName });
  return data;
}
