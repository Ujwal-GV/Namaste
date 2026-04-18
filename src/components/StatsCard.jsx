export default function StatsCard({ title, value, icon }) {
  return (
    <div className="dashboard-card2 p-5 rounded-2xl shadow flex items-center justify-between">
      <div>
        <p className="text-white">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      <div className="text-gray-400">{icon}</div>
    </div>
  );
}