export default function StatsCard({ title, value, icon }) {
  value = title === "Requests" ? "To be attached" : value;
  return (
    <div className="bg-black border border-green-500/20 rounded-2xl p-5 flex items-center justify-between
      shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_25px_rgba(0,255,0,0.5)]
      transition duration-300 group">

      {/* TEXT */}
      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-widest text-green-600">
          {title}
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-green-400 group-hover:text-green-300 transition">
          {value}
        </h2>
      </div>

      {/* ICON */}
      <div className="text-green-500 text-3xl opacity-80 group-hover:scale-110 group-hover:text-green-300 transition">
        {icon}
      </div>

    </div>
  );
}