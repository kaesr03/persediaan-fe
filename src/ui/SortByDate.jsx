import { useEffect, useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function SortByDate({ paramName = 'sort', className = '' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get(paramName) || '';

  const [selected, setSelected] = useState(current);

  const [open, setOpen] = useState(false);

  const label =
    selected === 'latest'
      ? 'Terbaru'
      : selected === 'oldest'
        ? 'Terlama'
        : 'Urutkan';

  useEffect(() => {
    setSelected(current);
  }, [current]);

  const apply = (value) => {
    setSelected(value);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);

      if (value) p.set(paramName, value);
      else p.delete(paramName);

      p.delete('page');

      return p;
    });
  };

  const clear = () => apply('');

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-[72px] z-10 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => {
              apply(selected === 'latest' ? '' : 'latest');
              setOpen(false);
            }}
            className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
          >
            Terbaru
            {selected === 'latest' && (
              <Check className="h-4 w-4 text-blue-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              apply(selected === 'oldest' ? '' : 'oldest');
              setOpen(false);
            }}
            className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
          >
            Terlama
            {selected === 'oldest' && (
              <Check className="h-4 w-4 text-blue-500" />
            )}
          </button>

          {selected && (
            <button
              type="button"
              onClick={() => {
                clear();
                setOpen(false);
              }}
              className="w-full border-t px-4 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
