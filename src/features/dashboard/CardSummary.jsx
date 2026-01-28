export default function CardSummary({ title, value, icon, extra }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
        {extra && <div className="">{extra}</div>}
      </div>
    </div>
  );
}
