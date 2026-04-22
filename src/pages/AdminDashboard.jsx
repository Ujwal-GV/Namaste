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

      {/* MOBILE SIDEBAR */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white p-2 rounded-lg"
        >
          <Menu />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white shadow-lg">
            <AdminSidebar />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block md:min-h-screen">
        <AdminSidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 sm:p-6 space-y-6 w-full">

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
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow overflow-x-auto">
          <RequestChart data={data} />
        </div>

      </div>
    </div>
  );
}