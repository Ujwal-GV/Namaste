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

  console.log("Notifications", data);
  

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
                  <>
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
                  className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-400"
                >
                  <FaUserCircle />
                </NavLink>

                <div className="bg-gray-500 text-white p-2 hover:bg-gray-400 rounded-full cursor-pointer">
                  <div className="relative">
                    <FiBell  onClick={() => setOpenNotifications(!openNotifications)} />

                    {data?.some(n => !n.isRead) && (
                      <span className="absolute -top-2 -right-2 w-3 h-3 bg-green-600 rounded-full" />
                    )}
                  </div>

                  {openNotifications && (
                    <div className="absolute right-2 top-12 mt-2 w-80 h-screen bg-white text-black shadow-xl rounded-xl z-50 max-h-96 overflow-y-auto border border-gray-300">
                      <span className="p-2 text-bold uppercase flex items-center justify-between">
                        <span className="flex items-center gap-1"><HiBell className="text-yellow-400" />Notifications</span>
                        {isDeleteAllNotificationsPending ? <LuLoader /> : <IoTrashBin onClick={() => deleteAllNotifications()} />}
                      </span>
                      <hr />
                      {(!data || data?.length === 0) && (
                        <p className="p-4 text-gray-400 text-center text-sm">No notifications</p>
                      )}

                      {data?.map((n) => (
                        <div
                          onClick={() => {
                          mutate(n._id);
                          navigate(n.link);
                        }}
                          key={n._id}
                          className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                            !n.isRead ? "bg-gray-50" : ""
                          }`}
                        >

                          <div
                            className="flex-1"
                            onClick={() => {
                              mutate(n._id);
                              navigate(n.link);
                            }}
                          >
                            <span className="flex items-center gap-2">
                              {n.isRead ? <LiaCheckDoubleSolid className="text-blue-500" /> : <LiaCheckDoubleSolid className="text-gray-600" />}
                              <p className="font-semibold text-sm">{n.title}</p>
                            </span>

                            <span className="flex items-center justify-between gap-2">
                              <p className="text-xs text-gray-500 ml-6">
                                  {n.message}
                                </p>
                                <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteId(n._id);
                                  setDeleteOpen(true);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <IoClose className="text-black" size={18} />
                              </button>
                            </span>
                          </div>
                        </div>
                      ))}

                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setConfirmOpen(true);
                  }}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-400"
                >
                  <IoMdLogOut />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {token && (
              <>
                <NavLink
                to="/profile"
                className="bg-gray-200 p-2 rounded-full"
              >
                <FaUserCircle className="text-xl text-gray-700" />
              </NavLink>

              <div className="bg-gray-500 text-white p-2 hover:bg-gray-400 rounded-full cursor-pointer">
                  <div className="relative">
                    <FiBell  onClick={() => setOpenNotifications(!openNotifications)} />

                    {data?.some(n => !n.isRead) && (
                      <span className="absolute -top-2 -right-2 w-3 h-3 bg-green-600 rounded-full" />
                    )}
                  </div>

                  {openNotifications && (
                    <div className="absolute right-2 top-12 mt-2 w-80 bg-white h-screen shadow-xl rounded-xl z-50 max-h-96 overflow-y-auto border border-gray-300">
                      <span className="p-2 text-bold uppercase text-black flex items-center justify-between">
                        <span className="flex items-center gap-1"><HiBell className="text-yellow-400" />Notifications</span>
                        {isDeleteAllNotificationsPending ? <LuLoader /> : <IoTrashBin onClick={() => deleteAllNotifications()} />}
                      </span>
                      <hr />
                      {(!data || data?.length === 0) && (                        
                        <p className="p-4 text-gray-400 text-center text-sm">No notifications</p>
                      )}

                      {data?.map((n) => (
                        <div
                          onClick={() => {
                          mutate(n._id);
                          navigate(n.link);
                        }}
                          key={n._id}
                          className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                            !n.isRead ? "bg-gray-50" : ""
                          }`}
                        >

                          <div
                            className="flex-1"
                            onClick={() => {
                              mutate(n._id);
                              navigate(n.link);
                            }}
                          >
                            <span className="flex items-center gap-2">
                              {n.isRead ? <LiaCheckDoubleSolid className="text-blue-500" /> : <LiaCheckDoubleSolid className="text-gray-600" />}
                              <p className="font-semibold text-sm">{n.title}</p>
                            </span>

                            <span className="flex items-center justify-between gap-2">
                              <p className="text-xs text-gray-500 ml-6">
                                  {n.message}
                                </p>
                                <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteId(n._id);
                                  setDeleteOpen(true);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <IoClose size={18} />
                              </button>
                            </span>
                          </div>
                        </div>
                      ))}

                    </div>
                  )}
                </div>
              </>
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
              <>
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
              </>
          )}
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
              onClick={() => setConfirmOpen(true)}
              className="w-full bg-red-500 text-white py-2 rounded-xl"
            >
              Logout
            </button>
          )}
        </div>
        <Modal
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onOk={handleLogout}
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