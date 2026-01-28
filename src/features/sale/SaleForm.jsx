import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const labelCssStyles = 'block text-sm font-medium text-gray-700';
const inputCssStyles =
  'block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none';

const SaleForm = ({ fetcher, products }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidDate, setPaidDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [buyerName, setBuyerName] = useState('');
  const [status, setStatus] = useState('UNPAID');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const addProduct = (productId) => {
    if (!productId) return;
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    if (selectedProducts.some((p) => p.productId === productId)) return;

    setSelectedProducts((prev) => [
      ...prev,
      {
        productId: product._id,
        name: product.name,
        quantity: 1,
        sellingPrice: product.sellingPrice,
        stock: product.quantity,
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

  const total = useMemo(() => {
    return selectedProducts.reduce(
      (s, p) => s + Number(p.quantity || 0) * Number(p.sellingPrice || 0),
      0,
    );
  }, [selectedProducts]);

  const submitting = fetcher.state === 'submitting';

  return (
    <fetcher.Form
      method="post"
      className="mx-auto max-w-2xl space-y-4 rounded-md border bg-white p-6 shadow-sm"
    >
      <h2 className="text-center text-xl font-black uppercase">
        Catat Penjualan
      </h2>

      <input type="hidden" name="total" value={total} />

      <div>
        <label className={labelCssStyles}>Tanggal Penjualan</label>
        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputCssStyles}
        />
      </div>

      <div>
        <label className={labelCssStyles}>Nama Pembeli</label>
        <input
          type="text"
          name="buyerName"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          placeholder="Nama pembeli"
          className={inputCssStyles}
          required
        />
      </div>

      <div>
        <label className={labelCssStyles}>Status Pembayaran</label>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputCssStyles}
        >
          <option value="UNPAID">Belum Lunas</option>
          <option value="PAID">Sudah Lunas</option>
        </select>
      </div>

      {status === 'PAID' && (
        <div>
          <label className={labelCssStyles}>Tanggal Dibayar</label>
          <input
            type="date"
            name="paidAt"
            value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)}
            className={inputCssStyles}
          />
        </div>
      )}

      <div>
        <label className={labelCssStyles}>Tambah Produk</label>
        <select
          className={inputCssStyles}
          onChange={(e) => {
            addProduct(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">Pilih Produk</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} — Rp {p.sellingPrice.toLocaleString('id-ID')}
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
      )}

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
            name={`products[${index}][sellingPrice]`}
            value={p.sellingPrice}
          />
        </div>
      ))}

      <div className="flex justify-between border-t pt-4 font-bold">
        <span>Total</span>
        <span className="text-green-600">
          Rp {total.toLocaleString('id-ID')}
        </span>
      </div>

      <div className="flex justify-end gap-2">
        <Link
          to="/sales"
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
        >
          Kembali
        </Link>

        <button
          type="submit"
          disabled={!selectedProducts.length || !buyerName || submitting}
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {submitting ? 'Menyimpan...' : 'Simpan Penjualan'}
        </button>
      </div>

      {fetcher.data?.errors && (
        <div className="mt-3 text-sm text-red-600">
          {Object.values(fetcher.data.errors).map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}
    </fetcher.Form>
  );
};

export default SaleForm;
