import Header from '../../ui/Header';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

const SupplierForm = ({
  isOpen,
  onClose,
  method,
  supplier,
  setLoading,
  fetcher,
}) => {
  const isSubmitting = fetcher.state === 'submitting';

  useEffect(() => {
    if (typeof setLoading === 'function') {
      setLoading(isSubmitting);
    }
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    if (
      (fetcher.state === 'loading' || fetcher.state === 'submitting') &&
      typeof onClose === 'function' &&
      fetcher.data?.status === 'success'
    ) {
      onClose();
    }
  }, [onClose, fetcher.state, fetcher.data]);

  const labelCssStyles = 'block text-sm font-medium text-gray-700';
  const inputCssStyles =
    'block w-full mb-3 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20">
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative top-20 mx-auto w-full max-w-2xl rounded-xl border bg-white p-5 shadow-2xl">
        <Header
          name={method === 'POST' ? 'Tambah Supplier' : 'Edit Supplier'}
        />

        <fetcher.Form
          action={
            method === 'PATCH' ? `/suppliers/${supplier._id}` : '/suppliers'
          }
          method={method}
          className="mt-5 space-y-4"
          noValidate
        >
          <div>
            <label htmlFor="name" className={labelCssStyles}>
              Nama Supplier
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nama supplier"
              defaultValue={supplier?.name}
              className={inputCssStyles}
              required
            />
            <p className="text-sm text-red-600">{fetcher.data?.errors?.name}</p>
          </div>

          <div>
            <label htmlFor="contact" className={labelCssStyles}>
              Kontak
            </label>
            <input
              id="contact"
              type="text"
              name="contact"
              placeholder="No. telp"
              defaultValue={supplier?.contact}
              className={inputCssStyles}
              required
            />
            <p className="text-sm text-red-600">
              {fetcher.data?.errors?.contact}
            </p>
          </div>

          <div>
            <label htmlFor="address" className={labelCssStyles}>
              Alamat
            </label>
            <textarea
              id="address"
              name="address"
              placeholder="Alamat supplier"
              defaultValue={supplier?.address}
              className={`${inputCssStyles} resize-none`}
              required
            />
            <p className="text-sm text-red-600">
              {fetcher.data?.errors?.address}
            </p>
          </div>
          <p className="text-sm text-red-600">{fetcher.data?.message}</p>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
            >
              {isSubmitting ? (
                <Loader className="spin" />
              ) : method === 'POST' ? (
                'Buat'
              ) : (
                'Update'
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default SupplierForm;
