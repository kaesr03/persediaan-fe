import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Package, ShoppingCart, HandCoins } from 'lucide-react';
import CardSummary from './CardSummary';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { getCategoriesOptions } from '../../services/apiCategory';
import { getDashboard } from '../../services/apiDashboard';

export default function Dashboard() {
  const { dashboardData, categoryOptions } = useLoaderData();
  const [params, setParams] = useSearchParams();

  const updateQuery = (key, value) => {
    const newParams = new URLSearchParams(params);
    if (!value) newParams.delete(key);
    if (value) newParams.set(key, value);
    else newParams.delete(key);

    setParams(`?${newParams.toString()}`);
  };

  const summary = dashboardData.data.summary;
  const monthlySales = dashboardData.data.monthlySales;
  const monthlyExpenses = dashboardData.data.monthlyExpenses;
  const topProducts = dashboardData.data.popularProducts;
  const years = dashboardData.data.years;
  const categories = categoryOptions.data;

  // return <h1>test</h1>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CardSummary
          title="Total Stock"
          value={summary.totalStock}
          icon={<Package />}
          extra={
            <select
              onChange={(e) =>
                updateQuery('totalStockCategory', e.target.value)
              }
              className="mt-2 w-full rounded border px-2 py-1 text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          }
        />

        <CardSummary
          title="Produk Terjual"
          value={summary.totalProductsSold}
          icon={<ShoppingCart />}
          extra={
            <select
              onChange={(e) =>
                updateQuery('totalStockSoldCategory', e.target.value)
              }
              className="mt-2 w-full rounded border px-2 py-1 text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          }
        />

        <CardSummary
          title="Total Pemasukan"
          value={`Rp ${summary.totalRevenue.toLocaleString('id-ID')}`}
          icon={<HandCoins />}
          extra={
            <select
              onChange={(e) =>
                updateQuery('totalIncomeCategory', e.target.value)
              }
              className="mt-2 w-full rounded border px-2 py-1 text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          }
        />
      </div>

      {/* ===== YEAR FILTER ===== */}
      <div className="flex justify-end">
        <select
          onChange={(e) => updateQuery('year', e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              Tahun {y}
            </option>
          ))}
        </select>
      </div>

      {/* ===== CHARTS ===== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Pemasukan Bulanan</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlySales} className="fill-blue-500">
              <XAxis
                dataKey="month"
                tickFormatter={(m) =>
                  [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'Mei',
                    'Jun',
                    'Jul',
                    'Agu',
                    'Sep',
                    'Okt',
                    'Nov',
                    'Des',
                  ][m - 1]
                }
              />
              <Tooltip
                formatter={(value) => [
                  `Rp ${value.toLocaleString('id-ID')}`,
                  'Pendapatan',
                ]}
              />
              <Bar dataKey="revenue" name="pendapatan" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Pengeluaran Bulanan</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyExpenses} className="fill-red-500">
              <XAxis
                dataKey="month"
                tickFormatter={(m) =>
                  [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'Mei',
                    'Jun',
                    'Jul',
                    'Agu',
                    'Sep',
                    'Okt',
                    'Nov',
                    'Des',
                  ][m - 1]
                }
              />
              <Tooltip
                formatter={(value) => [
                  `Rp ${value.toLocaleString('id-ID')}`,
                  'Pengeluaran',
                ]}
              />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== POPULAR PRODUCTS ===== */}
      <div className="rounded-2xl bg-white p-5 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Produk Terlaris</h2>
          <select
            onChange={(e) =>
              updateQuery('popularProductsCategory', e.target.value)
            }
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-3">
          {topProducts.map((p, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-500">Terjual: {p.totalSold}</p>
              </div>
              <p className="font-semibold text-green-600">
                Rp {p.totalRevenue.toLocaleString('id-ID')}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function loader({ request, params }) {
  const url = new URL(request.url);

  const totalStockCategory = url.searchParams.get('totalStockCategory');
  const totalStockSoldCategory = url.searchParams.get('totalStockSoldCategory');
  const totalIncomeCategory = url.searchParams.get('totalIncomeCategory');
  const popularProductsCategory = url.searchParams.get(
    'popularProductsCategory',
  );
  const year = url.searchParams.get('year');

  const dashboardData = await getDashboard({
    totalStockCategory,
    totalStockSoldCategory,
    popularProductsCategory,
    totalIncomeCategory,
    year,
  });

  const categoryOptions = await getCategoriesOptions();

  return { dashboardData, categoryOptions };
}

// import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
// import { Package, ShoppingCart, HandCoins } from 'lucide-react';
// import CardSummary from './CardSummary';
// import { useLoaderData } from 'react-router-dom';

// export default function Dashboard() {
//   const data = useLoaderData();

//   const summaryData = data.data.summary;
//   const monthlySales = data.data.monthlySales;
//   const monthlyExpenses = data.data.monthlyExpenses;
//   const topProducts = data.data.popularProducts;

//   return (
//     <div className="space-y-6">
//       {/* ===== TOP SUMMARY CARDS ===== */}
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//         <CardSummary
//           title="Total Stock"
//           value={summaryData.totalStock}
//           icon={<Package />}
//         />
//         <CardSummary
//           title="Produk Terjual"
//           value={summaryData.totalProductsSold}
//           icon={<ShoppingCart />}
//         />
//         <CardSummary
//           title="Total Pemasukan"
//           value={`Rp ${summaryData.totalRevenue.toLocaleString('id-ID')}`}
//           icon={<HandCoins />}
//         />
//       </div>

//       {/* ===== MIDDLE SECTION ===== */}
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
//         {/* MONTHLY SALES TABLE */}
//         <div className="rounded-2xl bg-white p-5 shadow-md">
//           <h2 className="mb-4 text-lg font-semibold">Pemasukan Bulanan</h2>
//           <ResponsiveContainer width="100%" height={240}>
//             <BarChart data={monthlySales} className="fill-blue-500">
//               <XAxis
//                 dataKey="month"
//                 tickFormatter={(m) =>
//                   [
//                     'Jan',
//                     'Feb',
//                     'Mar',
//                     'Apr',
//                     'Mei',
//                     'Jun',
//                     'Jul',
//                     'Agu',
//                     'Sep',
//                     'Okt',
//                     'Nov',
//                     'Des',
//                   ][m - 1]
//                 }
//               />
//               <Tooltip
//                 formatter={(value) => [
//                   `Rp ${value.toLocaleString('id-ID')}`,
//                   'Pendapatan',
//                 ]}
//               />
//               <Bar dataKey="revenue" name="pendapatan" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="rounded-2xl bg-white p-5 shadow-md">
//           <h2 className="mb-4 text-lg font-semibold">Pengeluaran Bulanan</h2>
//           <ResponsiveContainer width="100%" height={240}>
//             <BarChart data={monthlyExpenses} className="fill-red-500">
//               <XAxis
//                 dataKey="month"
//                 tickFormatter={(m) =>
//                   [
//                     'Jan',
//                     'Feb',
//                     'Mar',
//                     'Apr',
//                     'Mei',
//                     'Jun',
//                     'Jul',
//                     'Agu',
//                     'Sep',
//                     'Okt',
//                     'Nov',
//                     'Des',
//                   ][m - 1]
//                 }
//               />
//               <Tooltip
//                 formatter={(value) => [
//                   `Rp ${value.toLocaleString('id-ID')}`,
//                   'Pengeluaran',
//                 ]}
//               />
//               <Bar dataKey="amount" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* ===== MOST SOLD PRODUCTS ===== */}
//       <div className="rounded-2xl bg-white p-5 shadow-md">
//         <h2 className="mb-4 text-lg font-semibold">Produk Terlaris</h2>

//         <ul className="space-y-3">
//           {topProducts.map((p, i) => (
//             <li
//               key={i}
//               className="flex items-center justify-between rounded-lg border p-3"
//             >
//               <div>
//                 <p className="font-semibold">{p.name}</p>
//                 <p className="text-sm text-gray-500">Terjual: {p.totalSold}</p>
//               </div>

//               <p className="font-semibold text-green-600">
//                 Rp {p.totalRevenue.toLocaleString('id-ID')}
//               </p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
