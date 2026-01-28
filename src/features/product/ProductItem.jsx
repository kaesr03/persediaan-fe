import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

import ProductForm from './ProductForm';
import DeleteModal from '../../ui/DeleteModal';
import AddStockForm from './AddStockForm';
import { useFetcher } from 'react-router-dom';
import SuccessModal from '../../ui/SuccessModal';

function formatCurrency(value) {
  if (value == null) return '-';
  try {
    return new Intl.NumberFormat('id-ID').format(Number(value));
  } catch {
    return value;
  }
}

const getCloudinaryThumb = (url) => {
  if (!url) return '';
  return url.replace(
    '/upload/',
    '/upload/w_144,h_144,c_fill,g_auto,f_auto,q_auto/',
  );
};

export default function ProductItem({
  product,
  categories,
  brands,
  suppliers,
  fetcher,
}) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddStockModal, setOpenAddStockModal] = useState(false);

  return (
    <article className="max-w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex justify-center md:w-40">
          <img
            src={
              getCloudinaryThumb(product.image?.url) ||
              'https://res.cloudinary.com/dfyvkrjem/image/upload/v1767677931/000000_text_No_Image_hjjaop.png'
            }
            alt={product.name}
            className="h-36 w-36 rounded-2xl object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col">
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>

          {product.sku && (
            <p className="text-sm text-gray-500">
              SKU: <span className="font-medium">{product.sku}</span>
            </p>
          )}

          <div className="mt-1 flex flex-wrap gap-2">
            {product.brand?.name ? (
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {product.brand.name}
              </span>
            ) : (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                Brand Terhapus
              </span>
            )}
            {product.category?.name ? (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {product.category.name}
              </span>
            ) : (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                Kategori Terhapus
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t pt-4">
            <div>
              <span className="block text-xs text-gray-500 uppercase">
                Harga Beli
              </span>
              <span className="text-sm font-semibold text-gray-800">
                Rp {formatCurrency(product.purchasePrice)}
              </span>
            </div>

            <div>
              <span className="block text-xs text-gray-500 uppercase">
                Harga Jual
              </span>
              <span className="text-sm font-semibold text-gray-800">
                Rp {formatCurrency(product.sellingPrice)}
              </span>
            </div>

            <div>
              <span className="block text-xs text-gray-500 uppercase">
                Supplier
              </span>
              {product.supplier?.name ? (
                <span className="text-sm text-gray-800">
                  {product.supplier?.name}
                </span>
              ) : (
                <span className="text-sm text-red-400">Supplier Terhapus</span>
              )}
            </div>

            <div>
              <span className="block text-xs text-gray-500 uppercase">
                Stock
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {product.quantity ?? 0}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => setOpenAddStockModal(true)}
              className="flex h-10 items-center justify-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition hover:bg-blue-600 active:scale-95"
            >
              Tambah Stock
            </button>

            <button
              onClick={() => setOpenEditModal(true)}
              className="flex h-10 items-center justify-center rounded-lg bg-green-600 text-white transition hover:bg-green-700 active:scale-95"
              aria-label="Edit product"
            >
              <Pencil />
            </button>

            <button
              onClick={() => setOpenDeleteModal(true)}
              className="flex h-10 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700 active:scale-95"
              aria-label="Hapus product"
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>

      <DeleteModal
        fetcher={fetcher}
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        id={product._id}
      />

      <AddStockForm
        fetcher={fetcher}
        isOpen={openAddStockModal}
        onClose={() => setOpenAddStockModal(false)}
        product={product}
      />

      <ProductForm
        fetcher={fetcher}
        product={product}
        suppliers={suppliers}
        categories={categories}
        brands={brands}
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        method="PATCH"
      />
    </article>
  );
}
