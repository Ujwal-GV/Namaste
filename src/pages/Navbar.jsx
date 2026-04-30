import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FiBell, FiFileText, FiHome, FiMenu, FiPlusSquare, FiUserCheck } from "react-icons/fi";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { IoTrashBin } from "react-icons/io5";
import { HiBell } from "react-icons/hi";
import { getNotifications, useDeleteAllNotifications, useDeleteSingleNotification, useMarkRead } from "../hooks/useNotifications";
import { IoClose } from "react-icons/io5";
import { LuLoader } from "react-icons/lu";

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 text-sm rounded-full transition ${
          isActive
            ? "bg-[#FF5A5F]/10 text-[#FF5A5F] font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const { token, logout, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data } = getNotifications();
  const [ openNotifications, setOpenNotifications ] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const unread = data?.filter(n => !n.isRead).length;

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate } = useMarkRead();
  const { mutate: deleteNotification } = useDeleteSingleNotification();
  const { mutate: deleteAllNotifications, isPending: isDeleteAllNotificationsPending } = useDeleteAllNotifications();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* LEFT - LOGO */}
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-xl font-semibold text-[#FF5A5F]">
              Namaste
            </NavLink>
          </div>

          {/* CENTER - NAV LINKS */}
          <div className="hidden md:flex items-center gap-2">

            {/* OWNER LINKS */}
            {user?.role === "owner" && (
              <>
                <NavItem to={`/my-properties/${user?.id}`} label="My Properties" />
                <NavItem to="/owner-requests" label="Applications" />
              </>
            )}

            {/* TENANT LINKS */}
            {user?.role !== "owner" && token && (
              <>
                <NavItem to="/user-applications" label="My Requests" />
                <NavItem to="/apply-owner" label="Become Owner" />
              </>
            )}
          </div>

          {/* RIGHT - ACTIONS */}
          <div className="flex items-center gap-3">

            {/* ADD PROPERTY (OWNER ONLY) */}
            {user?.role === "owner" && (
              <NavLink
                to="/add-property"
                className="hidden md:block px-4 py-2 rounded-full bg-[#FF5A5F] text-white text-sm hover:bg-[#e14c50] transition"
              >
                Add Property
              </NavLink>
            )}

            {/* NOTIFICATIONS */}
            {token && (
              <div className="relative">
                <button
                  onClick={() => setOpenNotifications(!openNotifications)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiBell className="text-lg text-gray-700" />
                </button>

                {data?.some(n => !n.isRead) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5A5F] rounded-full" />
                )}
              </div>
            )}

            {openNotifications && (
              <div className="absolute right-2 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <HiBell className="text-rose-500" />
                    Notifications
                  </span>

                  {isDeleteAllNotificationsPending ? (
                    <LuLoader className="animate-spin text-gray-400" />
                  ) : (
                    <IoTrashBin
                      onClick={() => deleteAllNotifications()}
                      className="text-gray-400 hover:text-red-500 cursor-pointer transition"
                    />
                  )}
                </div>

                {/* CONTENT */}
                <div className="max-h-96 overflow-y-auto">

                  {(!data || data?.length === 0) && (
                    <p className="p-6 text-gray-400 text-center text-sm">
                      No notifications yet
                    </p>
                  )}

                  {data?.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        mutate(n._id);
                        navigate(n.link);
                      }}
                      className={`px-4 py-3 cursor-pointer transition flex gap-3 ${
                        !n.isRead
                          ? "bg-rose-50 hover:bg-rose-100"
                          : "hover:bg-gray-50"
                      }`}
                    >

                      {/* ICON */}
                      <div className="mt-1">
                        <LiaCheckDoubleSolid
                          className={`text-lg ${
                            n.isRead ? "text-gray-400" : "text-rose-500"
                          }`}
                        />
                      </div>

                      {/* TEXT */}
                      <div className="flex-1">

                        <div className="flex justify-between items-start gap-2">

                          <p className="font-medium text-sm text-gray-800 line-clamp-1">
                            {n.title}
                          </p>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(n._id);
                              setDeleteOpen(true);
                            }}
                            className="text-gray-300 hover:text-red-500 transition"
                          >
                            <IoClose size={16} />
                          </button>

                        </div>

                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {n.message}
                        </p>

                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}

            {/* PROFILE */}
            {token && (
              <NavLink to="/profile" className="p-2 rounded-full hover:bg-gray-100">
                <FaUserCircle className="text-xl text-gray-700" />
              </NavLink>
            )}

            {/* LOGIN / LOGOUT */}
            {!token ? (
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-full border text-sm hover:bg-gray-100"
              >
                Login
              </NavLink>
            ) : (
              <button
                onClick={() => setConfirmOpen(true)}
                className="p-2 rounded-full hover:bg-red-50 text-red-500"
              >
                <IoMdLogOut />
              </button>
            )}

            {/* MOBILE MENU */}
            <button
              className="md:hidden text-2xl ml-1"
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
        className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b">
          <p className="font-semibold text-lg text-[#FF5A5F]">Namaste</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>

        <div className="flex flex-col gap-2 p-4 text-sm">

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 rounded-xl hover:bg-gray-100"
          >
            Home
          </NavLink>

          {user?.role === "owner" && (
            <>
              <NavLink to={`/my-properties/${user?.id}`} className="px-4 py-3 rounded-xl hover:bg-gray-100">
                My Properties
              </NavLink>

              <NavLink to="/add-property" className="px-4 py-3 rounded-xl hover:bg-gray-100">
                Add Property
              </NavLink>
            </>
          )}

          <NavLink
            to={user?.role === "owner" ? "/owner-requests" : "/user-applications"}
            className="px-4 py-3 rounded-xl hover:bg-gray-100"
          >
            Applications
          </NavLink>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t">
          {!token ? (
            <NavLink to="/login" className="block text-center py-2 rounded-xl border">
              Login
            </NavLink>
          ) : (
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full bg-[#FF5A5F] text-white py-2 rounded-xl"
            >
              Logout
            </button>
          )}
        </div>

        <Modal
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onOk={handleLogout}
          okButtonProps={{ danger: true }}
        >
          <p className="font-semibold">Confirm Logout?</p>
        </Modal>

        <Modal
          open={deleteOpen}
          onCancel={() => setDeleteOpen(false)}
          onOk={() => {
            deleteNotification(deleteId);
            setDeleteOpen(false);
          }}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p className="font-semibold">Delete notification?</p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </Modal>
      </div>
    </>
  );
}