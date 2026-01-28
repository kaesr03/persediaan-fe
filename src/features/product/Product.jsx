import { PlusCircleIcon, SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFetcher, useLoaderData, useSearchParams } from 'react-router-dom';

import ProductItem from './ProductItem';
import ProductForm from './ProductForm';
import Header from '../../ui/Header';
import {
  addProductStock,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../../services/apiProduct';
import { getSuppliers } from '../../services/apiSupplier';
import { getCategoriesOptions } from '../../services/apiCategory';
import { getBrands, getBrandsOptions } from '../../services/apiBrands';
import PaginationArrows from '../../ui/PaginationArrows';
import SuccessModal from '../../ui/SuccessModal';

export default function Product() {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get('name') || '');
  const [openFormModal, setOpenFormModal] = useState(false);

  const timeoutRef = useRef(null);

  const page = Number(searchParams.get('page')) || 1;
  const updateQuery = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value) newParams.delete(key);
    if (value) newParams.set(key, value);
    else newParams.delete(key);

    setSearchParams(`?${newParams.toString()}`);
  };

  const { products, suppliers, categories, brands } = useLoaderData();

  const isSuccess =
    fetcher.state === 'idle' && fetcher.data?.status === 'success';

  const currentProducts = products?.data?.products;
  const supplierOptions = suppliers?.data?.suppliers;
  const categoryOptions = categories?.data;
  const brandOptions = brands?.data;

  const totalPages = products?.totalPages;

  if (!products) {
    return (
      <div className="py-4 text-center text-red-500">Gagal Fetching Data</div>
    );
  }

  return (
    <div className="mx-auto w-full pb-5">
      <div className="mb-6">
        <div className="flex items-center rounded border-2 border-gray-200">
          <SearchIcon className="m-2 h-5 w-5 text-gray-500" />
          <input
            className="w-full rounded bg-white px-4 py-2"
            placeholder="Cari nama produk..."
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
        <div className="md:flex md:w-[300px] md:justify-between">
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
          <select
            onChange={(e) => updateQuery('brand', e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none md:w-[145px]"
          >
            <option value="">Semua Brand</option>
            {brandOptions.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <Header name="Produk" />
        <button
          className="flex items-center rounded bg-blue-500 px-4 py-2 font-bold text-gray-200 hover:bg-blue-700"
          onClick={() => setOpenFormModal(true)}
        >
          <PlusCircleIcon className="mr-2 h-5 w-5 !text-gray-200" />
          Buat Produk
        </button>
      </div>

      {currentProducts.length ? (
        <div className="lg-grid-cols-3 grid grid-cols-1 justify-between gap-10 sm:grid-cols-2">
          {currentProducts?.map((product) => (
            <ProductItem
              fetcher={fetcher}
              key={product._id}
              product={product}
              categories={categoryOptions}
              suppliers={supplierOptions}
              brands={brandOptions}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[30vh] items-end justify-center">
          <p className="text-lg text-gray-500">Anda Belum Memiliki Produk</p>
        </div>
      )}

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

      <SuccessModal
        open={isSuccess}
        message={fetcher.data?.message}
        onClose={() => fetcher.reset()}
      />

      <ProductForm
        fetcher={fetcher}
        suppliers={supplierOptions}
        categories={categoryOptions}
        brands={brandOptions}
        isOpen={openFormModal}
        onClose={() => setOpenFormModal(false)}
        method="POST"
      />
    </div>
  );
}

export async function loader({ request }) {
  const url = new URL(request.url);

  const page = url.searchParams.get('page') || 1;
  const name = url.searchParams.get('name');
  const category = url.searchParams.get('category');
  const brand = url.searchParams.get('brand');

  const products = await getProducts({ page, name, category, brand });
  const suppliers = await getSuppliers();
  const categories = await getCategoriesOptions();
  const brands = await getBrandsOptions();

  return { products, suppliers, categories, brands };
}

export async function action({ request, params }) {
  const method = request.method;
  const id = params.productId;

  const data = await request.formData();

  const sku = data.get('sku');
  const name = data.get('name');
  const purchasePrice = Number(data.get('purchasePrice'));
  const sellingPrice = Number(data.get('sellingPrice'));
  const quantity = data.get('quantity');
  const supplier = data.get('supplier');
  const category = data.get('category');
  const brand = data.get('brand');
  const date = data.get('date');
  const addStock = data.get('addStock');

  let res;
  const errors = {};
  if (addStock && method === 'PATCH') {
    if (!quantity) {
      errors.quantity = 'Tolong masukkan jumlah penambahan stok barang';
      return { errors };
    }

    const data = { quantity, date };
    res = await addProductStock(id, data);
    const response = await res.json();
    return response;
  }

  if (method === 'POST' || method === 'PATCH') {
    if (method === 'POST') {
      if (!quantity) errors.quantity = 'Tolong masukkan jumlah stok barang';
      if (quantity < 0) errors.quantity = 'Stock tidak bisa minus';
    }
    if (!sku) errors.sku = 'Tolong masukkan SKU produk';
    if (sku.length > 50) errors.sku = 'Sku maksimal 50 karakter';
    if (!name) errors.name = 'Tolong masukkan nama produk';
    if (purchasePrice <= 0)
      errors.purchasePrice = 'Harga beli produk tidak boleh kosong atau minus';
    if (sellingPrice <= 0)
      errors.sellingPrice = 'Harga jual produk tidak boleh kosong atau minus';
    if (!supplier) errors.supplier = 'Tolong masukkan nama supplier';
    if (!category) errors.category = 'Tolong masukkan nama kategori';
    if (!brand) errors.brand = 'Tolong masukkan nama brand';
    if (sellingPrice < purchasePrice)
      errors.price =
        'Harga Jual produk harus lebih besar dari harga beli produk';

    if (Object.keys(errors).length > 0) {
      return {
        errors,
        enteredValue: {
          sku,
          name,
          purchasePrice,
          sellingPrice,
          quantity,
          supplier,
          category,
          brand,
        },
      };
    }

    if (method === 'PATCH') {
      res = await updateProduct(id, data);
    } else {
      res = await createProduct(data);
    }
  }

  if (method === 'DELETE') {
    res = await deleteProduct(id);
  }

  const response = await res.json();

  return response;
}
