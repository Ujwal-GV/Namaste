import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkClass = "block p-3 rounded-xl hover:bg-gray-200 hover:text-black";
  const activeClass = "bg-black text-white";

  return (
    <div className="w-64 dashboard-card shadow p-4">
      <nav className="space-y-2">
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
      </nav>
    </div>
  );
}