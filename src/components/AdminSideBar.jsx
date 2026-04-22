import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Modal } from "antd";
import toast from "react-hot-toast";

export default function AdminSidebar() {
  const linkClass = "block p-3 rounded-xl hover:bg-gray-200 hover:text-black";
  const activeClass = "bg-black text-white";

  const [open, setOpen] = useState(false);

  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="w-64 dashboard-card shadow p-4 min-h-screen text-white">
      <nav className="space-y-2">
        <h2 className="p-1">WELCOME BACK</h2>
        <hr />
        <NavLink to="/admin" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/owners" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          Owner Approvals
        </NavLink>

        <NavLink to="/admin/properties" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          Property Approvals
        </NavLink>

        <NavLink to="/admin/list" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          Users
        </NavLink>

        <NavLink onClick={() => {
          setOpen(true);
        }} className="block p-3 rounded-xl hover:bg-gray-200 hover:text-black">
          Logout
        </NavLink>
      </nav>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleLogout}
      >
        <p className="font-semibold">Confirm Logout?</p>
      </Modal>
    </div>
  );
}