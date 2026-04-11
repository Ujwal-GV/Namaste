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
            status: action === "block" ? "blocked" : "active"
        });
        setOpen(false);
    }

  return (
    <div className="dashboard-card rounded-2xl shadow p-4 hover:shadow-lg transition flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm text-gray-500">
          User Info
        </h2>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
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

      <div className="flex items-center justify-end">
        <div className="flex-1">
            <p className="flex items-center gap-2 text-sm">
                <MdEmail className="text-gray-500" />
                <span className="truncate">{details.email}</span>
            </p>

            <p className="flex items-center gap-2 text-sm">
                <FaUser className="text-gray-500" />
                <span className="uppercase font-medium">
                {details.role}
                </span>
            </p>

            <div className="w-full flex justify-start mt-4 items-center gap-2">
                <div className="flex items-center gap-2 text-sm bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-300">
                    {details.accountStatus === "active" ? (
                    <>
                        <CiCircleCheck className="text-green-500 text-lg" />
                        <button 
                            className="text-green-600 font-semibold"
                            onClick={() => {
                                    setOpen(true);
                                    setAction(details.accountStatus === "active" ? "block" : "activate");
                                }
                            }
                        >
                            Active
                        </button>
                    </>
                    ) : (
                    <>
                        <CiCircleRemove className="text-red-500 text-lg" />
                        <button 
                            className="text-red-600 font-semibold"
                            onClick={() => {
                                    setOpen(true);
                                    setAction(details.accountStatus === "blocked" ? "activate" : "block");
                                }
                            }
                        >
                            Blocked
                        </button>
                    </>
                    )}
                </div>
                <div 
                    className="flex items-center gap-2 bg-blue-900 cursor-pointer text-sm px-2  py-1 rounded-full hover:bg-blue-300 hover:text-black" 
                    onClick={() => navigate(`/admin/user/${details._id}`)}
                >
                   <FaEye /> View
                </div>
            </div>

            <Modal
             open = {open}
             onCancel={() => setOpen(false)}
             onOk={handleConfirm}
             okText="Confirm"
            >
                <p>
                    Are you sure want to {" "}
                    <strong className="uppercase">{action}</strong> this user?
                </p>
            </ Modal>
        </div>
        <div>
            {details?.profilePic && <img className="w-10 h-15 rounded-md p-1 border" src={details?.profilePic} />}
        </div>
      </div>
    </div>
  );
}