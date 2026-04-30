import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Modal } from "antd";
import toast from "react-hot-toast";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-black border-r border-green-500/20 shadow-[0_0_20px_rgba(0,255,0,0.2)] p-4 text-green-400">

      {/* LOGO / TITLE */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold tracking-widest text-green-400">
          ADMIN<span className="text-green-600">_SYS</span>
        </h1>
        <p className="text-xs text-green-600">Control Panel</p>
      </div>

      {/* NAV LINKS */}
      <nav className="space-y-2 text-sm">

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-green-500/20 text-green-300 shadow-[0_0_10px_rgba(0,255,0,0.5)] border border-green-400"
                : "hover:bg-green-500/10 hover:text-green-300"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/owners"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-green-500/20 text-green-300 shadow-[0_0_10px_rgba(0,255,0,0.5)] border border-green-400"
                : "hover:bg-green-500/10 hover:text-green-300"
            }`
          }
        >
          Owner Approvals
        </NavLink>

        <NavLink
          to="/admin/properties"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-green-500/20 text-green-300 shadow-[0_0_10px_rgba(0,255,0,0.5)] border border-green-400"
                : "hover:bg-green-500/10 hover:text-green-300"
            }`
          }
        >
          Property Approvals
        </NavLink>

        <NavLink
          to="/admin/list"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-green-500/20 text-green-300 shadow-[0_0_10px_rgba(0,255,0,0.5)] border border-green-400"
                : "hover:bg-green-500/10 hover:text-green-300"
            }`
          }
        >
          Users
        </NavLink>

        {/* LOGOUT */}
        <button
          onClick={() => setOpen(true)}
          className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          Logout
        </button>

      </nav>

      {/* LOGOUT MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleLogout}
        okText="Logout"
        okButtonProps={{ danger: true }}
      >
        <p className="font-semibold text-red-500">Confirm Logout?</p>
      </Modal>
    </div>
  );
}