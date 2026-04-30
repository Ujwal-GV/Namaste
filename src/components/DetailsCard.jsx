import React, { useState } from "react";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { FaEye, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUpdateUserStatus } from "../hooks/useAdmin";
import { Modal } from "antd";

export default function DetailsCard({ details }) {
  const navigate = useNavigate();
  const { mutate } = useUpdateUserStatus();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");

  const handleConfirm = () => {
    mutate({
      id: details._id,
      status: action === "block" ? "blocked" : "active",
    });
    setOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition flex flex-col gap-4 overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          User Info
        </h2>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold capitalize shrink-0 ${
            details.role === "admin"
              ? "bg-purple-100 text-purple-600"
              : details.role === "owner"
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {details.role}
        </span>
      </div>

      {/* BODY */}
      <div className="flex items-center gap-3">

        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0 space-y-2">

          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <MdEmail className="shrink-0" />
            <span className="truncate">{details.email}</span>
          </p>

          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FaUser className="shrink-0" />
            <span className="uppercase font-medium truncate">
              {details.role}
            </span>
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">

            {/* STATUS */}
            <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full border bg-gray-100 dark:bg-gray-800 shrink-0">
              {details.accountStatus === "active" ? (
                <>
                  <CiCircleCheck className="text-green-500 text-lg shrink-0" />
                  <button
                    className="text-green-600 font-semibold"
                    onClick={() => {
                      setOpen(true);
                      setAction("block");
                    }}
                  >
                    Active
                  </button>
                </>
              ) : (
                <>
                  <CiCircleRemove className="text-red-500 text-lg shrink-0" />
                  <button
                    className="text-red-600 font-semibold"
                    onClick={() => {
                      setOpen(true);
                      setAction("activate");
                    }}
                  >
                    Blocked
                  </button>
                </>
              )}
            </div>

            {/* VIEW */}
            <button
              onClick={() => navigate(`/admin/user/${details._id}`)}
              className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-black text-white hover:bg-gray-800 transition shrink-0"
            >
              <FaEye /> View
            </button>
          </div>
        </div>

        {/* PROFILE IMAGE */}
        {details?.profilePic && (
          <div className="w-12 h-12 shrink-0">
            <img
              className="w-full h-full object-cover rounded-xl border"
              src={details.profilePic}
              alt="profile"
            />
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleConfirm}
        okText="Confirm"
        okButtonProps={{ danger: action === "block" }}
      >
        <p className="text-sm">
          Are you sure you want to{" "}
          <strong className="uppercase">{action}</strong> this user?
        </p>
      </Modal>
    </div>
  );
}