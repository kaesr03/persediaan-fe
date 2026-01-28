function Notification({ lowStocks }) {
  return (
    <article className="absolute z-50 w-72 rounded-lg border border-stone-300 bg-white shadow-lg">
      <div className="p-4">
        <h1 className="mb-3 border-b pb-2 text-center text-sm font-semibold text-gray-800">
          Notifikasi
        </h1>

        <ul
          className={`space-y-2 ${lowStocks.length > 3 ? 'max-h-36 overflow-y-auto' : ''} `}
        >
          {lowStocks.length > 0 ? (
            lowStocks.map((stock) => (
              <li
                key={stock._id}
                className="grid cursor-pointer grid-cols-2 rounded-md px-2 py-1 hover:bg-gray-100"
              >
                <span className="text-sm text-gray-700">{stock.name}</span>
                <span className="text-sm font-medium text-red-600">
                  stok tersisa: {stock.quantity}
                </span>
              </li>
            ))
          ) : (
            <span className="text-sm font-medium text-stone-400">
              Semua stok barang dalam kondisi aman
            </span>
          )}
        </ul>
      </div>
    </article>
  );
}

export default Notification;
