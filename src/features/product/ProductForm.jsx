import { useFetcher } from 'react-router-dom';
import Header from '../../ui/Header';
import { useEffect, useReducer, useState } from 'react';
import { Loader } from 'lucide-react';

const ProductForm = ({
  fetcher,
  isOpen,
  onClose,
  method,
  product,
  suppliers,
  categories,
  brands,
}) => {
  const [preview, dispatchPreview] = useReducer((_, action) => {
    if (action === 'reset') return null;
    if (action instanceof File) return URL.createObjectURL(action);
    return _;
  }, null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const submitting = fetcher.state !== 'idle';

  useEffect(() => {
    if (
      (fetcher.state === 'loading' || fetcher.state === 'submitting') &&
      typeof onClose === 'function' &&
      fetcher.data?.status === 'success'
    ) {
      onClose();
      dispatchPreview('reset');
    }
  }, [fetcher.state, fetcher.data, onClose]);

  if (!isOpen) return null;

  const labelCssStyles = 'block text-sm font-medium text-gray-700';
  const inputCssStyles =
    'block w-full mb-3 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none';

  return (
    <div className="bg-opacity-50 fixed inset-0 z-30 h-full w-full overflow-y-auto bg-gray-600">
      <div className="relative top-20 mx-auto w-full max-w-md rounded-md border bg-white p-5 shadow-lg md:max-w-3xl">
        <Header
          name={method === 'PATCH' ? 'Edit produk' : 'Buat produk baru'}
        />
        <fetcher.Form
          action={method === 'PATCH' ? `/products/${product._id}` : '/products'}
          method={method}
          className="mt-5 grid gap-4 max-md:grid-cols-1 md:grid-cols-2"
          encType="multipart/form-data"
          noValidate
        >
          <div>
            <label htmlFor="sku" className={labelCssStyles}>
              SKU
            </label>
            <input
              id="sku"
              type="text"
              name="sku"
              placeholder="SKU"
              className={inputCssStyles}
              defaultValue={product?.sku}
              required
            />
            {fetcher.data?.errors?.sku && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {fetcher.data?.errors?.sku}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="name" className={labelCssStyles}>
              Nama produk
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nama"
              className={inputCssStyles}
              defaultValue={product?.name}
              required
            />
            {fetcher.data?.errors?.name && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {fetcher.data?.errors?.name}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="image" className={labelCssStyles}>
              Gambar produk (Format JPG / PNG, maksimal 1MB)
            </label>
            <input
              type="file"
              name="image"
              id="image"
              className="block w-full cursor-pointer rounded-md border border-gray-300 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) dispatchPreview(file);
              }}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-20 w-20 rounded-md border object-cover"
              />
            )}

            {product?.image?.url && (
              <div className="flex items-center gap-3 rounded-md border bg-gray-50 p-3">
                <img
                  src={product.image.url}
                  alt="Gambar saat ini"
                  className="h-20 w-20 rounded-md border object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Gambar saat ini
                  </p>
                  <p className="text-xs text-gray-500">
                    Upload gambar baru untuk mengganti
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="purchasePrice" className={labelCssStyles}>
              Harga beli
            </label>
            <input
              id="purchasePrice"
              type="number"
              name="purchasePrice"
              placeholder="Harga Beli"
              defaultValue={product?.purchasePrice}
              className={inputCssStyles}
              required
            />
            {fetcher.data?.errors?.purchasePrice && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {fetcher.data?.errors?.purchasePrice}
              </p>
            )}
            {fetcher.data?.errors?.price && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {fetcher.data?.errors?.price}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="sellingPrice" className={labelCssStyles}>
              Harga Jual
            </label>
            <input
              id="sellingPrice"
              type="number"
              name="sellingPrice"
              placeholder="Harga Jual"
              defaultValue={product?.sellingPrice}
              className={inputCssStyles}
              required
            />
            {fetcher.data?.errors?.sellingPrice && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {fetcher.data?.errors?.sellingPrice}
              </p>
            )}
            {fetcher.data?.errors?.price && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {fetcher.data?.errors?.price}
              </p>
            )}
          </div>

          {method === 'POST' && (
            <>
              <div>
                <label htmlFor="quantity" className={labelCssStyles}>
                  Jumlah stock
                </label>
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  placeholder="Jumlah Stock"
                  defaultValue={product?.quantity}
                  className={inputCssStyles}
                  required
                />
                {fetcher.data?.errors?.quantity && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {fetcher.data?.errors?.quantity}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="date" className={labelCssStyles}>
                  Tanggal Masuk
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputCssStyles}
                />
                {fetcher.data?.errors?.date && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {fetcher.data?.errors?.date}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor="supplier" className={labelCssStyles}>
              Nama supplier
            </label>
            <select
              name="supplier"
              className={inputCssStyles}
              defaultValue={product?.supplier?._id || ''}
            >
              <option value="">Pilih Supplier</option>

              {suppliers?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            {fetcher.data?.errors?.supplier && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {fetcher.data?.errors?.supplier}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className={labelCssStyles}>
              Nama kategori
            </label>
            <select
              name="category"
              className={inputCssStyles}
              defaultValue={product?.category?._id || ''}
            >
              <option value="">Pilih Kategori</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {fetcher.data?.errors?.category && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {fetcher.data?.errors?.category}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="brand" className={labelCssStyles}>
              Nama brand
            </label>
            <select
              name="brand"
              className={inputCssStyles}
              defaultValue={product?.brand?._id || ''}
            >
              <option value="">Pilih Brand</option>
              {brands?.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
            {fetcher.data?.errors?.brand && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {fetcher.data?.errors?.brand}
              </p>
            )}
            {fetcher.data?.message && (
              <p className="text-sm text-red-600">{fetcher.data?.message}</p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2 md:col-span-2">
            <button
              disabled={submitting}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
            >
              {submitting ? (
                <Loader className="spin" weight="bold" />
              ) : method === 'POST' ? (
                'Buat'
              ) : (
                'Edit'
              )}
            </button>

            <button
              onClick={() => {
                (onClose(), dispatchPreview('reset'));
              }}
              type="button"
              className="mt-4 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
            >
              Batal
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default ProductForm;
