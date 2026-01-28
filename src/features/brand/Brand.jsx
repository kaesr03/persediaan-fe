import { PlusCircleIcon, SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  redirect,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';

import PaginationArrows from '../../ui/PaginationArrows';
import Header from '../../ui/Header';
import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from '../../services/apiBrands';
import BrandForm from './BrandForm';
import BrandItem from './BrandItem';
import SuccessModal from '../../ui/SuccessModal';
// import { getSuppliersState } from './supplierSlice';

export default function Brand() {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get('name') || '');
  const timeoutRef = useRef(null);
  const page = Number(searchParams.get('page')) || 1;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = useLoaderData();

  const brands = data.data.brands;

  const totalPages = data.totalPages;

  const isSuccess =
    fetcher.state === 'idle' && fetcher.data?.status === 'success';

  return (
    <div className="mx-auto w-full pb-5">
      <div className="mb-6">
        <div className="flex items-center rounded border-2 border-gray-200">
          <SearchIcon className="m-2 h-5 w-5 text-gray-500" />
          <input
            className="w-full rounded bg-white px-4 py-2"
            placeholder="Cari nama brand..."
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              setValue(v);

              clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => {
                if (!v) {
                  setSearchParams({});
                } else {
                  setSearchParams({ name: v });
                }
              }, 500);
            }}
          />
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <Header name="Brand" />
        <button
          className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-gray-200 hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="mr-2 h-5 w-5 !text-gray-200" />
          Buat Brand
        </button>
      </div>

      {brands?.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <BrandItem key={brand._id} brand={brand} fetcher={fetcher} />
          ))}
        </div>
      ) : (
        <div className="flex h-[30vh] items-end justify-center">
          <p className="text-lg text-gray-500">Anda Belum Memiliki Brand</p>
        </div>
      )}

      <BrandForm
        fetcher={fetcher}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        method="POST"
      />

      <SuccessModal
        open={isSuccess}
        message={fetcher.data?.message}
        onClose={() => fetcher.reset()}
      />

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
}

export async function loader({ request }) {
  const url = new URL(request.url);

  const page = url.searchParams.get('page') || 1;
  const name = url.searchParams.get('name');

  const data = await getBrands({ page, name });

  return data;
}

export async function action({ request, params }) {
  const method = request.method;
  const id = params.brandId;

  const data = await request.formData();

  const name = data.get('name');
  const errors = {};

  let res;
  if (method === 'POST' || method === 'PATCH') {
    if (!name) errors.name = 'Tolong masukkan nama brand';

    if (Object.keys(errors).length > 0) {
      return {
        errors,
        enteredValue: {
          name,
        },
      };
    }

    const categoryData = {
      name,
    };

    if (method === 'PATCH') {
      res = await updateBrand(id, categoryData);
    } else {
      res = await createBrand(categoryData);
    }
  }

  if (method === 'DELETE') {
    res = await deleteBrand(id);
  }

  const response = await res.json();
  return response;
}
