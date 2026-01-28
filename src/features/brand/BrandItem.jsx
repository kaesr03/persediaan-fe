import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

import DeleteModal from '../../ui/DeleteModal';
import BrandForm from './BrandForm';

export default function BrandItem({ brand, fetcher }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <article className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm transition hover:shadow">
      <h3 className="block w-full text-sm font-semibold break-all text-gray-800 uppercase">
        {brand.name}
      </h3>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setOpenEditModal(true)}
          className="rounded-md p-2 text-green-600 hover:bg-green-50"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => setOpenDeleteModal(true)}
          className="rounded-md p-2 text-red-600 hover:bg-red-50"
        >
          <Trash size={18} />
        </button>
      </div>

      <DeleteModal
        fetcher={fetcher}
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        id={brand._id}
      />

      <BrandForm
        fetcher={fetcher}
        brand={brand}
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        method="PATCH"
      />
    </article>
  );
}
