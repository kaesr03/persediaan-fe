import { PlusCircleIcon, SearchIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFetcher, useLoaderData, useSearchParams } from 'react-router-dom';

import PaginationArrows from '../../ui/PaginationArrows';
import Header from '../../ui/Header';
import SupplierItem from './SupplierItem';
import SupplierForm from './SupplierForm';
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from '../../services/apiSupplier';
import SuccessModal from '../../ui/SuccessModal';

const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

export default function Supplier() {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get('name') || '');
  const timeoutRef = useRef(null);
  const page = Number(searchParams.get('page')) || 1;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = useLoaderData();
  const suppliers = data.data.suppliers;

  const isSuccess =
    fetcher.state === 'idle' && fetcher.data?.status === 'success';

  const totalPages = data.totalPages;

  return (
    <div className="mx-auto w-full pb-5">
      <div className="mb-6">
        <div className="flex items-center rounded border-2 border-gray-200">
          <SearchIcon className="m-2 h-5 w-5 text-gray-500" />
          <input
            className="w-full rounded bg-white px-4 py-2"
            placeholder="Cari nama supplier..."
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
        <Header name="Supplier" />
        <button
          className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-gray-200 hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="mr-2 h-5 w-5 !text-gray-200" />
          Buat Supplier
        </button>
      </div>

      {suppliers.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <SupplierItem
              fetcher={fetcher}
              key={supplier._id}
              supplier={supplier}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[30vh] items-end justify-center">
          <p className="text-lg text-gray-500">Anda Belum Memiliki Supplier</p>
        </div>
      )}

      <SuccessModal
        open={isSuccess}
        message={fetcher.data?.message}
        onClose={() => fetcher.reset()}
      />

      <SupplierForm
        fetcher={fetcher}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        method="POST"
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

  const data = await getSuppliers({ page, name });

  return data;
}

export async function action({ request, params }) {
  const method = request.method;
  const id = params.supplierId;

  const data = await request.formData();

  const name = data.get('name');
  const contact = data.get('contact');
  const address = data.get('address');

  const errors = {};

  let res;
  if (method === 'POST' || method === 'PATCH') {
    if (!name) errors.name = 'Tolong masukkan nama supplier';
    if (!address) errors.address = 'Tolong masukkan alamat supplier';
    if (!contact) {
      errors.contact = 'Kontak supplier wajib diisi';
    } else if (!isValidPhone(contact)) {
      errors.contact =
        'Tolong masukkan kontak supplier dengan format nomor telepon yang benar';
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors,
        enteredValue: {
          name,
          contact,
          address,
        },
      };
    }

    const supplierData = {
      name,
      contact,
      address,
    };

    if (method === 'PATCH') {
      res = await updateSupplier(id, supplierData);
    } else {
      res = await createSupplier(supplierData);
    }
  }

  if (method === 'DELETE') {
    res = await deleteSupplier(id);
  }

  const response = await res.json();
  return response;
}
