import AdminSidebar from "../components/AdminSideBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100">
        <Outlet />
      </div>

      <div className="lg:hidden fixed inset-0 bg-gray-100 flex justify-center items-center z-50">
        <p className="text-center text-red-600 font-semibold text-md p-4 font-outfit">
          This application is only compatible with large devices. Please switch to a larger screen.
        </p>
      </div>
    </div>
  );
}