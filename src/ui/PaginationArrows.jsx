import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationArrows({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="sticky bottom-0 z-20 mt-60 bg-transparent py-4 md:mt-50">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-white shadow transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-8 w-8 text-gray-700" />
        </button>

        <span className="text-sm font-medium text-gray-600">
          Halaman {page} dari {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-white shadow transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-8 w-8 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
