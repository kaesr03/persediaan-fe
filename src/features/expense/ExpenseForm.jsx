import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const inputCssStyles =
  'block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none';

const ExpenseForm = ({ fetcher, products }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const addProduct = (id) => {
    if (!id) return;
    const product = products.find((p) => p._id === id);
    if (!product) return;

    setSelectedProducts((prev) => [
      ...prev,
      {
        productId: product._id,
        name: product.name,
        quantity: 1,
        stock: product.quantity,
        sellingPrice: product.purchasePrice,
      },
    ]);
  };

  const updateProduct = (index, field, value) => {
    setSelectedProducts((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, [field]: field === 'name' ? value : Number(value) }
          : p,
      ),
    );
  };

  const removeProduct = (index) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const total = useMemo(
    () => selectedProducts.reduce((s, p) => s + p.quantity * p.sellingPrice, 0),
    [selectedProducts],
  );

  const submitting = fetcher.state === 'submitting';

  return (
    <fetcher.Form
      method="post"
      className="mx-auto max-w-2xl space-y-4 rounded-md border bg-white p-6 shadow-sm"
    >
      <h2 className="text-center text-xl font-black uppercase">
        Catat Pengeluaran
      </h2>

      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="amount" value={total} />

      <div>
        <label className="text-sm font-medium">Tanggal</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Keterangan</label>

        <textarea
          name="description"
          className="w-full rounded border p-2"
          id="description"
        ></textarea>
      </div>

      <div>
        <label className="text-sm font-medium">Tambah Produk</label>
        <select
          className="w-full rounded border p-2"
          onChange={(e) => {
            addProduct(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">Pilih Produk</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Produk Dipilih</h3>

          {selectedProducts.map((p, index) => (
            <div
              key={p.productId}
              className="flex flex-col gap-4 rounded-lg border bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-3 sm:flex-1 sm:flex-row sm:items-center sm:gap-4">
                <div className="sm:w-48">
                  <p className="font-medium break-words">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    Stok tersedia: {p.stock}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:block">
                  <label className="text-sm sm:hidden">Jumlah</label>
                  <input
                    type="number"
                    min="1"
                    max={p.stock}
                    className={`${inputCssStyles} w-full text-center sm:w-20`}
                    value={p.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value > p.stock) return;
                      updateProduct(index, 'quantity', value);
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 sm:block">
                  <label className="text-sm sm:hidden">Harga</label>
                  <p className={`${inputCssStyles} w-full sm:w-32`}>
                    Rp{p.sellingPrice.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="w-full rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 sm:ml-4 sm:w-auto"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}

      {/* {selectedProducts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Produk Dipilih</h3>

          {selectedProducts.map((p, index) => (
            <div
              key={p.productId}
              className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="w-48">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    Stok tersedia: {p.stock}
                  </p>
                </div>

                <input
                  type="number"
                  min="1"
                  max={p.stock}
                  className={`${inputCssStyles} w-20 text-center`}
                  value={p.quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > p.stock) return;
                    updateProduct(index, 'quantity', value);
                  }}
                />

                <p className={`${inputCssStyles} w-32`}>
                  Rp{p.sellingPrice.toLocaleString('id-ID')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="ml-4 rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )} */}

      {selectedProducts.map((p, index) => (
        <div key={p.productId}>
          <input
            type="hidden"
            name={`products[${index}][productId]`}
            value={p.productId}
          />
          <input
            type="hidden"
            name={`products[${index}][name]`}
            value={p.name}
          />
          <input
            type="hidden"
            name={`products[${index}][quantity]`}
            value={p.quantity}
          />
          <input
            type="hidden"
            name={`products[${index}][purchasePrice]`}
            value={p.sellingPrice}
          />
        </div>
      ))}

      <div className="flex justify-between border-t pt-4 font-bold">
        <span>Total</span>
        <span className="text-red-600">Rp {total.toLocaleString('id-ID')}</span>
      </div>

      <div className="flex justify-end gap-2">
        <Link
          to="/expenses"
          className="rounded bg-gray-500 px-4 py-2 text-white"
        >
          Batal
        </Link>

        <button
          type="submit"
          disabled={!selectedProducts.length || submitting}
          className="rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Simpan
        </button>
      </div>
    </fetcher.Form>
  );
};

export default ExpenseForm;
