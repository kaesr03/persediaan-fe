import { useEffect, useReducer, useRef, useState } from 'react';
import { Loader } from 'lucide-react';
import SupplierForm from '../supplier/SupplierForm';
import { useFetcher, useLoaderData } from 'react-router-dom';
import { getSuppliers, getSuppliersOptions } from '../../services/apiSupplier';
import { getCategoriesOptions } from '../../services/apiCategory';
import { getBrands, getBrandsOptions } from '../../services/apiBrands';
import SuccessModal from '../../ui/SuccessModal';

const labelCssStyles = 'block text-sm font-medium text-gray-700';
const inputCssStyles =
  'block w-full mb-3 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none';

const CardWrapper = ({ children }) => (
  <div className="rounded-md border bg-white p-5 shadow-sm">{children}</div>
);

const AddProductPage = () => {
  const categoryFetcher = useFetcher();
  const brandFetcher = useFetcher();
  const productFetcher = useFetcher();
  const supplierFetcher = useFetcher();
  const [isOpenSupplierModal, setIsOpenSupplierModal] = useState(false);
  const [isSupplierSubmitting, setIsSupplierSubmitting] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { suppliers, categories, brands } = useLoaderData();
  const [preview, dispatchPreview] = useReducer((_, action) => {
    if (action === 'reset') return null;
    if (action instanceof File) return URL.createObjectURL(action);
    return _;
  }, null);

  const isSuccessCategory =
    categoryFetcher.state === 'idle' &&
    categoryFetcher.data?.status === 'success';
  const isSuccessBrand =
    brandFetcher.state === 'idle' && brandFetcher.data?.status === 'success';
  const isSuccessSupplier =
    supplierFetcher.state === 'idle' &&
    supplierFetcher.data?.status === 'success';
  const isSuccessProduct =
    productFetcher.state === 'idle' &&
    productFetcher.data?.status === 'success';

  const supplierOptions = suppliers?.data;
  const categoryOptions = categories?.data;
  const brandOptions = brands?.data;

  const categorySubmitting = categoryFetcher.state !== 'idle';
  const brandSubmitting = brandFetcher.state !== 'idle';
  const productSubmitting = productFetcher.state !== 'idle';

  const categoryFormRef = useRef(null);
  const brandFormRef = useRef(null);
  const productFormRef = useRef(null);

  useEffect(() => {
    if (
      categoryFetcher.state === 'idle' &&
      categoryFetcher.data?.status === 'success'
    ) {
      categoryFormRef.current?.reset();
    }
  }, [categoryFetcher.state, categoryFetcher.data?.status]);

  useEffect(() => {
    if (
      brandFetcher.state === 'idle' &&
      brandFetcher.data?.status === 'success'
    ) {
      brandFormRef.current?.reset();
    }
  }, [brandFetcher.state, brandFetcher.data]);

  useEffect(() => {
    if (
      productFetcher.state === 'idle' &&
      productFetcher.data?.status === 'success'
    ) {
      productFormRef.current?.reset();
      dispatchPreview('reset');
    }
  }, [productFetcher.state, productFetcher.data]);

  return (
    <div className="min-h-[calc(100vh-6rem)] p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          className="rounded-md border bg-white p-6 md:col-span-2"
          style={{ borderColor: '#164863' }}
        >
          <h1 className="mb-6 text-center text-2xl font-black uppercase">
            Buat Produk Baru
          </h1>

          <productFetcher.Form
            action="/products"
            method="POST"
            className="mx-auto max-w-3xl"
            encType="multipart/form-data"
            ref={productFormRef}
          >
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">SKU*</label>
              <div className="col-span-9">
                <input
                  className={inputCssStyles}
                  placeholder="SKU"
                  name="sku"
                />
                {productFetcher.data?.errors?.sku && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.sku}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">Nama*</label>
              <div className="col-span-9">
                <input
                  className={inputCssStyles}
                  placeholder="Nama Produk"
                  name="name"
                />
                {productFetcher.data?.errors?.name && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 items-start gap-4">
              <label className="col-span-3 text-sm font-semibold">
                Gambar Produk
              </label>
              <div className="col-span-9">
                <label
                  htmlFor="image"
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 transition hover:border-blue-500 hover:bg-blue-50"
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-20 w-40 rounded object-cover"
                      />
                      <span className="text-xs text-gray-600">
                        Klik untuk ganti gambar
                      </span>
                    </>
                  ) : (
                    'Klik untuk upload gambar'
                  )}

                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) dispatchPreview(file);
                    }}
                  />
                </label>

                <p className="mt-1 text-xs text-gray-400">
                  Format JPG / JPEG / PNG, maksimal 1MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">
                Harga Beli*
              </label>
              <div className="col-span-9">
                <input
                  name="purchasePrice"
                  type="number"
                  className={inputCssStyles}
                  placeholder="Harga Beli"
                />
                {productFetcher.data?.errors?.price && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.price}
                  </p>
                )}
                {productFetcher.data?.errors?.purchasePrice && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.purchasePrice}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">
                Harga Jual*
              </label>
              <div className="col-span-9">
                <input
                  name="sellingPrice"
                  type="number"
                  className={inputCssStyles}
                  placeholder="Harga Jual"
                />
                {productFetcher.data?.errors?.price && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.price}
                  </p>
                )}
                {productFetcher.data?.errors?.sellingPrice && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.sellingPrice}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">
                Jumlah Stok*
              </label>
              <div className="col-span-9">
                <input
                  name="quantity"
                  type="number"
                  className={inputCssStyles}
                  placeholder="Stock"
                />
                {productFetcher.data?.errors?.quantity && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.quantity}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">
                Tanggal Masuk
              </label>
              <div className="col-span-9">
                <input
                  type="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputCssStyles}
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">
                Tanggal Masuk
              </label>
              <div className="col-span-9">
                <input type="date" name="dateIn" className={inputCssStyles} />
                {productFetcher.data?.errors?.dateIn && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data.errors.dateIn}
                  </p>
                )}
              </div>
            </div> */}

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">
                Supplier*
              </label>
              <div className="col-span-9">
                <select name="supplier" className={inputCssStyles}>
                  <option value="">Pilih Supplier*</option>
                  {supplierOptions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {productFetcher.data?.errors?.supplier && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.supplier}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">
                Kategori*
              </label>
              <div className="col-span-9">
                <select name="category" className={inputCssStyles}>
                  <option value="">Pilih Kategori*</option>
                  {categoryOptions.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {productFetcher.data?.errors?.category && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.category}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-3 text-sm font-semibold">Brand</label>
              <div className="col-span-9">
                <select name="brand" className={inputCssStyles}>
                  <option value="">Pilih Brand*</option>
                  {brandOptions.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                {productFetcher.data?.errors?.brand && (
                  <p className="-mt-3 mb-3 text-sm text-red-600">
                    {productFetcher.data?.errors?.brand}
                  </p>
                )}
              </div>
            </div>
            {productFetcher.data?.status === 'fail' && (
              <p className="-mt-3 mb-3 text-sm text-red-600">
                {productFetcher.data?.message}
              </p>
            )}

            <div className="mt-6 flex justify-center">
              <button
                disabled={productSubmitting}
                type="submit"
                className="relative flex items-center justify-center rounded bg-blue-500 px-6 py-2 font-bold text-white uppercase hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
                style={{ minWidth: 160 }}
              >
                {productSubmitting && (
                  <Loader className="absolute h-5 w-5 animate-spin" />
                )}

                <span className={productSubmitting ? 'invisible' : 'visible'}>
                  Tambah Produk
                </span>
              </button>
            </div>
          </productFetcher.Form>
        </div>

        <div className="space-y-6">
          <CardWrapper>
            <h3 className="mb-4 text-center font-black uppercase">
              Buat supplier baru
            </h3>
            <div className="px-4">
              <button
                disabled={isSupplierSubmitting}
                onClick={() => setIsOpenSupplierModal(true)}
                className="w-full rounded-md bg-blue-500 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
              >
                {isSupplierSubmitting ? (
                  <Loader className="spin" weight="bold" />
                ) : (
                  'Tambah Supplier'
                )}
              </button>
            </div>
          </CardWrapper>

          <CardWrapper>
            <categoryFetcher.Form
              action="/categories"
              method="POST"
              ref={categoryFormRef}
            >
              <h3 className="mb-3 text-center font-black uppercase">
                Buat kategori baru
              </h3>
              <div>
                <input
                  name="name"
                  className={inputCssStyles}
                  placeholder="Nama Kategori"
                />
                <p className="text-sm text-red-600">
                  {categoryFetcher.data?.errors?.name}
                </p>
                {categoryFetcher.data?.status === 'fail' && (
                  <p className="text-sm text-red-600">
                    {categoryFetcher.data?.message}
                  </p>
                )}

                <button
                  disabled={categorySubmitting}
                  className="mt-2 w-full rounded-md bg-blue-500 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
                >
                  {categorySubmitting ? (
                    <Loader className="spin" weight="bold" />
                  ) : (
                    'Buat Kategori'
                  )}
                </button>
              </div>
            </categoryFetcher.Form>
          </CardWrapper>

          <CardWrapper>
            <brandFetcher.Form
              action="/brands"
              method="POST"
              ref={brandFormRef}
            >
              <h3 className="mb-3 text-center font-black uppercase">
                Buat brand baru
              </h3>
              <div>
                <input
                  name="name"
                  className={inputCssStyles}
                  placeholder="Nama Brand"
                />
                <p className="text-sm text-red-600">
                  {brandFetcher.data?.errors?.name}
                </p>
                {brandFetcher.data?.status === 'fail' && (
                  <p className="text-sm text-red-600">
                    {brandFetcher.data?.message}
                  </p>
                )}
                <button
                  disabled={brandSubmitting}
                  className="mt-2 w-full rounded-md bg-blue-500 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
                >
                  {brandSubmitting ? (
                    <Loader className="spin" weight="bold" />
                  ) : (
                    'Buat Brand'
                  )}
                </button>
              </div>
            </brandFetcher.Form>
          </CardWrapper>
        </div>
      </div>

      <SupplierForm
        fetcher={supplierFetcher}
        setLoading={setIsSupplierSubmitting}
        isOpen={isOpenSupplierModal}
        method="POST"
        onClose={() => setIsOpenSupplierModal(false)}
      />

      <SuccessModal
        open={isSuccessProduct}
        message={productFetcher.data?.message}
        onClose={() => productFetcher.reset()}
      />
      <SuccessModal
        open={isSuccessCategory}
        message={categoryFetcher.data?.message}
        onClose={() => categoryFetcher.reset()}
      />
      <SuccessModal
        open={isSuccessBrand}
        message={brandFetcher.data?.message}
        onClose={() => brandFetcher.reset()}
      />
      <SuccessModal
        open={isSuccessSupplier}
        message={supplierFetcher.data?.message}
        onClose={() => supplierFetcher.reset()}
      />
    </div>
  );
};

export default AddProductPage;

export async function loader() {
  const suppliers = await getSuppliersOptions();
  const categories = await getCategoriesOptions();
  const brands = await getBrandsOptions();

  return { suppliers, categories, brands };
}
