import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

function formatRupiah(value) {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function CardMonthlyExpense({ monthlyExpenses }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Pengeluaran Bulanan</h2>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={monthlyExpenses}>
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            className="text-xs"
          />
          <Tooltip
            formatter={(value) => formatRupiah(value)}
            labelClassName="font-semibold"
          />
          <Bar
            dataKey="amount"
            radius={[8, 8, 0, 0]}
            className="fill-blue-500"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
