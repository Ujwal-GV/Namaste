import { useQuery } from '@tanstack/react-query'
import API from '../api/axios';
import { Users, Home, FileText, Menu } from 'lucide-react'
import AdminSidebar from '../components/AdminSideBar';
import StatsCard from '../components/StatsCard';
import RequestChart from '../components/RequestChart';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await API.get("/admin/stats");
      return res.data;
    },
  });

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-gray-200">

      {/* 🔥 MOBILE OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* 🧠 SIDEBAR (OPTIONAL) */}
      {/* <AdminSidebar open={open} setOpen={setOpen} /> */}

      {/* 🚀 MAIN CONTENT */}
      <div className="flex-1 p-4 sm:p-6 space-y-6 w-full">

        {/* 🧾 TOP BAR */}
        <div className="sticky top-0 z-30 bg-[#0b0f19]/80 backdrop-blur border-b border-cyan-500/20 px-4 sm:px-6 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden bg-cyan-500/20 text-cyan-400 p-2 rounded-lg hover:bg-cyan-500/30 transition"
            >
              <Menu size={18} />
            </button>

            <h1 className="text-lg sm:text-xl font-semibold tracking-wide text-cyan-400">
              SYSTEM PANEL
            </h1>
          </div>

          <div className="text-xs text-gray-400">
            ● Admin Online
          </div>

        </div>

        {/* 🔥 HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wider">
            ADMIN DASHBOARD
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor system activity & control access
          </p>
        </div>

        {/* ⚡ NEON DIVIDER */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40" />

        {/* 📊 STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <Link to="/admin/list">
            <div className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-4 hover:border-cyan-400 hover:shadow-[0_0_15px_#22d3ee33] transition">
              <StatsCard title="Users" value={data?.users} icons={<Users />} />
            </div>
          </Link>

          <Link to="/admin/list">
            <div className="bg-[#111827] border border-purple-500/20 rounded-2xl p-4 hover:border-purple-400 hover:shadow-[0_0_15px_#a855f733] transition">
              <StatsCard title="Owners" value={data?.owners} icons={<Home />} />
            </div>
          </Link>

          <div className="bg-[#111827] border border-green-500/20 rounded-2xl p-4 hover:border-green-400 hover:shadow-[0_0_15px_#22c55e33] transition">
            <StatsCard title="Properties" value={data?.properties} icons={<Home />} />
          </div>

          <div className="bg-[#111827] border border-pink-500/20 rounded-2xl p-4 hover:border-pink-400 hover:shadow-[0_0_15px_#ec489933] transition">
            <StatsCard title="Requests" value={data?.requests} icons={<FileText />} />
          </div>

        </div>

        {/* 📈 CHART SECTION */}
        <div className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-[0_0_20px_#22d3ee22] transition flex flex-col gap-4">

          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-cyan-400 tracking-wide">
              REQUEST TRAFFIC
            </h2>
            <span className="text-xs text-gray-500">
              last 7 days
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <RequestChart data={data} />
          </div>

        </div>

      </div>
    </div>
  );
}