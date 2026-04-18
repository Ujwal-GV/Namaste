import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FiFileText, FiHome, FiMenu, FiPlusSquare, FiUserCheck } from "react-icons/fi";

export default function Navbar() {
  const { token, logout, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white shadow-md px-4 md:px-6 py-3 sticky top-0 z-40">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="text-xl font-bold">
            Namaste
          </NavLink>
          <div className="hidden md:flex gap-6 items-center">
            {token && user?.role !== "admin" && (
              <>
                {user?.role === "owner" && (
                  <>
                    <NavLink
                      to={`/my-properties/${user?.id}`}
                      className={({ isActive }) =>
                        `px-3 py-2 ${
                          isActive
                            ? "border-b-2 border-black font-semibold"
                            : "text-gray-500"
                        }`
                      }
                    >
                      My Properties
                    </NavLink>

                    <NavLink
                      to="/add-property"
                      className={({ isActive }) =>
                        `px-3 py-2 ${
                          isActive
                            ? "border-b-2 border-black font-semibold"
                            : "text-gray-500"
                        }`
                      }
                    >
                      Add Property
                    </NavLink>
                  </>
                )}

                {user?.role === "owner" ? (
                  <NavLink
                    to="/owner-requests"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                        `px-3 py-2 flex items-center gap-2 ${
                          isActive
                            ? "border-b-2 border-black font-semibold"
                            : "text-gray-500"
                        }`
                      }
                  >
                    <FiFileText /> Applications
                  </NavLink>
                ):(
                  <NavLink
                    to="/user-applications"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                        `px-3 py-2 flex items-center gap-2 ${
                          isActive
                            ? "border-b-2 border-black font-semibold"
                            : "text-gray-500"
                        }`
                      }
                  >
                    <FiPlusSquare /> My Requests
                  </NavLink>
              )}

                <NavLink
                  to="/apply-owner"
                  className={({ isActive }) =>
                    `px-3 py-2 ${
                      isActive
                        ? "border-b-2 border-black font-semibold"
                        : "text-gray-500"
                    }`
                  }
                >
                  Ownership
                </NavLink>
              </>
            )}

            {!token ? (
              <NavLink to={"/login"} className="bg-black text-white px-4 py-2 rounded">
                Login
              </NavLink>
            ) : (
              <div className="flex gap-3">
                <NavLink
                  to="/profile"
                  className="bg-gray-600 text-white p-2 rounded-full"
                >
                  <FaUserCircle />
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white p-2 rounded-full"
                >
                  <IoMdLogOut />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {token && (
              <NavLink
                to="/profile"
                className="bg-gray-200 p-2 rounded-full"
              >
                <FaUserCircle className="text-xl text-gray-700" />
              </NavLink>
            )}

            <button
              className="text-2xl"
              onClick={() => setMenuOpen(true)}
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-xl transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 border-b flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <FaUserCircle className="text-2xl text-gray-600" />
          </div>
          <div>
            {/* <p className="font-semibold text-sm">{user?.email || "Guest"}</p> */}
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="flex flex-col p-3 gap-2 text-[15px]">

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-gray-200 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <FiHome /> Home
          </NavLink>

          {user?.role === "owner" && (
            <>
              <NavLink
                to={`/my-properties/${user?.id}`}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-gray-200 "
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                <FiFileText /> My Properties
              </NavLink>

              <NavLink
                to="/add-property"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-gray-200 "
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                <FiPlusSquare /> Add Property
              </NavLink>
            </>
          )}

          {user?.role === "owner" ? (
            
              <NavLink
                to="/owner-requests"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                <FiFileText /> Applications
              </NavLink>
            ):(
              <NavLink
                to="/user-applications"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-gray-200 "
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                <FiPlusSquare /> My Requests
              </NavLink>
          )}

          <NavLink
            to="/apply-owner"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl ${
                isActive
                  ? "bg-gray-200"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <FiUserCheck /> Ownership
          </NavLink>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t">
          {!token ? (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-gray-200 py-2 rounded-xl"
            >
              Login
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-xl"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}