import { Loader } from 'lucide-react';
import { useFetcher } from 'react-router-dom';

export default function DeleteModal({ fetcher, isOpen, onClose, id }) {
  const isSubmitting = fetcher.state === 'submitting';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Konfirmasi Hapus
        </h2>

        <p className="mb-6 text-gray-600">
          Apakah anda yakin ingin menghapus ini?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-100"
          >
            Batal
          </button>

          <fetcher.Form method="DELETE" action={id}>
            <button
              disabled={isSubmitting}
              className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300"
            >
              {isSubmitting ? (
                <Loader className="spin" weight="bold" />
              ) : (
                'Hapus'
              )}
            </button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}
