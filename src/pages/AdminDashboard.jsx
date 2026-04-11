import { useQuery } from '@tanstack/react-query'
import React from 'react'
import API from '../api/axios';

import { Users, Home, FileText } from 'lucide-react'
import AdminSidebar from '../components/AdminSideBar';
import StatsCard from '../components/StatsCard';
import RequestChart from '../components/RequestChart';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const res = await API.get("/admin/stats");
            console.log("Res", res.data);
            
            return res.data;
        },
    });


  return (
    <div className='flex min-h-screen custom-background-color'>
      <AdminSidebar />

      <div className="flex-1 p-6 space-y-6">
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>

        <div className="grid grid-cols-4 gap-6">
            <Link to={"/admin/list"}><StatsCard title = "Users" value = {data?.users}  icons = { <Users /> }></StatsCard></Link>
            <Link to={"/admin/list"}><StatsCard title = "Owners" value = {data?.owners}  icons = { <Home /> }></StatsCard></Link>
            <StatsCard title = "Properties" value = {data?.properties}  icons = { <Home /> }></StatsCard>
            <StatsCard title = "Requests" value = {data?.requests}  icons = { <FileText /> }></StatsCard>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <RequestChart data = {data} />
        </div>
      </div>
    </div>
  )
}
