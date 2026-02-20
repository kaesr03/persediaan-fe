import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function SuccessModal({ open, message, onClose, auth }) {
  let textStyle = 'text-xl font-semibold ';
  let buttonStyle =
    'rounded-lg px-6 py-2 text-sm font-semibold text-white transition focus:ring-2 focus:outline-none ';

  if (auth) {
    textStyle += 'text-blue-600';
    buttonStyle += 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400';
  } else {
    textStyle += 'text-green-600';
    buttonStyle += 'bg-green-600 hover:bg-green-700 focus:ring-green-400';
  }

  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const prevActive = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
      prevActive?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
        aria-describedby="success-desc"
        className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <h2 id="success-title" className={textStyle}>
            {auth ? 'Sukses' : 'Berhasil'}
          </h2>
        </div>

        <p
          id="success-desc"
          className="mb-8 text-center text-2xl leading-relaxed text-gray-600"
        >
          {message}
        </p>

        <div className="flex justify-end">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className={buttonStyle}
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
