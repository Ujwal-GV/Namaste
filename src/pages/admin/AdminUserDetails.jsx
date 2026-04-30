import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axios";
import { useState } from "react";
import SkeletonCard from "../../components/SkeletonCard";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { useMyProperties } from "../../hooks/useProperties";
import { useUpdateUserStatus } from "../../hooks/useAdmin";
import { MdBlock, MdLocationPin } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { FaEye } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";

export default function AdminUserDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [action, setAction] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["user-details", id],
    queryFn: async () => {
      const res = await API.get(`/admin/user/${id}`);
      return res.data;
    },
  });

  const { data: propertyData, isLoading: propertyLoading } = useMyProperties(id);

  const { data: applications, isLoading: appLoading } = useQuery({
    queryKey: ["property-applications", selectedProperty?._id],
    queryFn: async () => {
      if (!selectedProperty?._id) return [];
      const res = await API.get(`/admin/property/${selectedProperty._id}/applications`);
      return res.data.requests;
    },
    enabled: !!selectedProperty?._id,
  });

  const { mutate } = useUpdateUserStatus();

  const handleBlock = () => {
    mutate({
      id: data._id,
      status: action === "block" ? "blocked" : "active"
    });
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 grid md:grid-cols-2 gap-4 bg-black min-h-screen">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const statusColor =
    data?.accountStatus === "active"
      ? "text-green-400"
      : "text-red-400";

  const verificationColor =
    data?.verificationStatus === "approved"
      ? "text-green-400"
      : data?.verificationStatus === "rejected"
      ? "text-red-400"
      : "text-yellow-400";

  return (
    <div className="bg-black min-h-screen p-4 md:p-6 text-white">

      <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

        {/* LEFT SIDE */}
        <div className="space-y-4">

          {/* USER INFO */}
          <div className="bg-gray-900 border border-green-500/20 p-5 rounded-xl shadow">
            <h2 className="text-xl font-bold">{data?.name}</h2>
            <p className="text-gray-400 text-sm">{data?.email}</p>

            <div className="mt-3 text-sm space-y-1">
              <p>Role: <span className="uppercase font-semibold">{data?.role}</span></p>
              <p>Account: <span className={`uppercase font-bold ${statusColor}`}>{data?.accountStatus}</span></p>
              <p>Verification: <span className={`uppercase font-bold ${verificationColor}`}>{data?.verificationStatus}</span></p>
            </div>

            <button
              className={`mt-4 px-3 py-1 rounded-lg text-sm ${
                data?.accountStatus === "active"
                  ? "bg-red-600"
                  : "bg-green-500"
              }`}
              onClick={() => {
                setOpen(true);
                setAction(data.accountStatus === "active" ? "block" : "activate");
              }}
            >
              {data?.accountStatus === "active" ? (
                <span className="flex items-center gap-2">Block <MdBlock /></span>
              ) : (
                <span className="flex items-center gap-2">Unblock <CgUnblock /></span>
              )}
            </button>
          </div>

          {/* BASIC INFO */}
          <div className="bg-gray-900 border border-green-500/20 p-5 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Basic Info</h3>
            <p>Mobile: {data?.mobile || "N/A"}</p>
            <p>Joined: {new Date(data?.createdAt).toLocaleDateString()}</p>
          </div>

          {/* PROPERTIES */}
          <div className="bg-gray-900 border border-green-500/20 p-4 rounded-xl">
            <h3 className="font-semibold mb-3">Properties</h3>

            {propertyLoading ? (
              [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            ) : propertyData?.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {propertyData.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => setSelectedProperty(p)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedProperty?._id === p._id
                        ? "bg-green-500/20 border border-green-400"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MdLocationPin className="text-red-400" />
                      {p.location}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No properties</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2">

          {!selectedProperty ? (
            <div className="bg-gray-900 border border-green-500/20 rounded-xl p-6 text-center">
              <p className="text-gray-400">Select a property</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-green-500/20 rounded-xl p-6 space-y-4">

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedProperty.title}</h2>
                <Link
                  to={`/property/${selectedProperty._id}`}
                  className="bg-green-500 text-black px-3 py-1 rounded-md text-sm flex items-center gap-2"
                >
                  View <FaEye />
                </Link>
              </div>

              <p className="text-gray-400 flex items-center gap-1">
                <MdLocationPin /> {selectedProperty.location}
              </p>

              <p className="text-green-400 font-bold text-lg">
                ₹ {selectedProperty.rent}
              </p>

              {/* IMAGE */}
              <div className="w-full h-64 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {selectedProperty.images?.[activeImg] ? (
                  <img
                    src={selectedProperty.images[activeImg]}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-2 overflow-x-auto">
                {selectedProperty.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded cursor-pointer border ${
                      activeImg === i ? "border-green-400" : "border-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* APPLICATIONS */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">Applications</h3>
                  <span className="flex items-center gap-1">
                    {applications?.length || 0} <IoIosPeople />
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {appLoading ? (
                    [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
                  ) : applications?.length > 0 ? (
                    applications.map((app) => (
                      <div key={app._id} className="bg-black p-3 rounded-lg border border-gray-700">
                        <p className="font-semibold">{app.user?.name}</p>
                        <p className="text-xs text-gray-400">{app.user?.email}</p>
                        <p className={`text-xs font-bold mt-1 ${
                          app.status === "accepted"
                            ? "text-green-400"
                            : app.status === "rejected"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}>
                          {app.status}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No applications</p>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleBlock}
      >
        <p>
          Are you sure want to <strong className="uppercase">{action}</strong> this user?
        </p>
      </Modal>
    </div>
  );
}