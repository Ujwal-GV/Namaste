import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { token, logout, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold chicle-regular">
          Namaste
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center sansita-swashed-ujwal">
          { user?.role !== "admin" && user?.role !== "admin"}

          {token && user?.role !== "admin" && (
            <>
              {user?.role === "owner" && (
                <NavLink to={`/my-properties/${user?.id}`} className={({ isActive }) => `px-3 py-2 ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-400"}`}>My Properties</NavLink>
              )}
              {user?.role === "owner" && (
                <NavLink to="/add-property" className={({ isActive }) => `px-3 py-2 ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-400"}`}>Add Property</NavLink>
              )}
              <NavLink to="/owner-requests" className={({ isActive }) => `px-3 py-2 ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-400"}`}>Applications</NavLink>
              <NavLink to="/apply-owner" className={({ isActive }) => `px-3 py-2 ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-400"}`}>Ownership</NavLink>
            </>
          )}

          {!token ? (
            <NavLink to="/login" className="bg-black text-white px-4 py-2 rounded">
              Login
            </NavLink>
          ) : (
            <span className="flex gap-2">
                <NavLink to={"/profile"}
                    className="text-white px-2 py-2 rounded-full bg-gray-600 hover:bg-gray-800"
                    >
                    <FaUserCircle />
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="text-white px-2 py-2 rounded-full bg-red-600 hover:bg-red-800"
                    >
                    <IoMdLogOut />
                </button>
            </span>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user?.role !== "admin" && (
        <div className="mt-4 flex flex-col gap-4 md:hidden sansita-swashed-ujwal">
          <NavLink to="/" className={({ isActive }) => `px-3 py-2 ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-400"}`} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          {token && user?.role !== "admin" && (
            <>
              {user?.role === "owner" && (
                <NavLink to={`/my-properties/${user?.id}`} className={({ isActive }) => `px-3 py-2 ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-400"}`}>My Properties</NavLink>
              )}
              {user?.role === "owner" && (
                <NavLink to="/add-property" className={({ isActive }) => `px-3 py-2 ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-400"}`}>Add Property</NavLink>
              )}
              <NavLink to="/owner-requests" className={({ isActive }) => `px-3 py-2 ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-400"}`}>Applications</NavLink>
              <NavLink to="/apply-owner" className={({ isActive }) => `px-3 py-2 ${isActive ? "border-b-2 border-black font-semibold" : "text-gray-400"}`}>Ownership</NavLink>
            </>
          )}

          {!token ? (
            <NavLink to="/login">Login</NavLink>
          ) : (
            <button onClick={handleLogout}><IoMdLogOut /></button>
          )}
        </div>
      )}
    </nav>
  );
}