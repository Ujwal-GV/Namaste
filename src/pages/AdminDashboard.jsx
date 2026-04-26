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

  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await API.get("/admin/stats");
      return res.data;
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* DESKTOP SIDEBAR */}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 sm:p-6 space-y-6 w-full">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b px-4 sm:px-6 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden bg-black text-white p-2 rounded-lg"
            >
              <Menu size={18} />
            </button>

            <h1 className="text-lg sm:text-xl font-semibold">
              Dashboard
            </h1>
          </div>

          <div className="text-sm text-gray-500">
            Welcome, Admin
          </div>

        </div>

        <h1 className="text-xl sm:text-2xl font-bold">
          Admin Dashboard
        </h1>

        <hr className='text-white border-2 border-white' />

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          <Link to="/admin/list">
            <StatsCard title="Users" value={data?.users} icons={<Users />} />
          </Link>

          <Link to="/admin/list">
            <StatsCard title="Owners" value={data?.owners} icons={<Home />} />
          </Link>

          <StatsCard title="Properties" value={data?.properties} icons={<Home />} />

          <StatsCard title="Requests" value={data?.requests} icons={<FileText />} />

        </div>

        {/* CHART */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow flex flex-col gap-3">

          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Requests Overview</h2>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </div>

          <div className="w-full overflow-x-auto">
            <RequestChart data={data} />
          </div>

        </div>

      </div>
    </div>
  );
}