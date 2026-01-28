import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

import SupplierForm from './SupplierForm';
import DeleteModal from '../../ui/DeleteModal';

export default function SupplierItem({ fetcher, supplier }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <article className="relative max-w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {supplier.name}
          </h3>

          <div className="mt-3 space-y-2 text-sm">
            <div>
              <span className="block text-xs font-medium break-words text-gray-500 uppercase">
                Alamat
              </span>
              <span className="block break-words text-gray-800">
                {supplier.address || '-'}
              </span>
            </div>

            <div>
              <span className="block text-xs font-medium text-gray-500 uppercase">
                Kontak
              </span>
              <span className="block break-words text-gray-800">
                {supplier.contact || '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-4 bottom-4 flex gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white transition hover:bg-green-700 active:scale-95"
            onClick={() => setOpenEditModal(true)}
            aria-label="Edit supplier"
          >
            <Pencil />
          </button>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700 active:scale-95"
            onClick={() => setOpenDeleteModal(true)}
            aria-label="Hapus supplier"
          >
            <Trash />
          </button>
        </div>
      </div>

      <DeleteModal
        fetcher={fetcher}
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        id={supplier._id}
      />

      <SupplierForm
        fetcher={fetcher}
        supplier={supplier}
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        method="PATCH"
      />
    </article>
  );
}
