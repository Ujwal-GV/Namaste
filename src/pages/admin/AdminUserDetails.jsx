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

  const {
    data: propertyData,
    isLoading: propertyLoading,
  } = useMyProperties(id);

  const mutation = useMutation({
    mutationFn: ({ status }) =>
      API.put(`/admin/update-user-status/${id}`, { status }),
    onSuccess: () => {
      toast.success("Updated successfully");
      queryClient.invalidateQueries(["user-details", id]);
      setConfirmOpen(false);
    },
  });

  const { data: applications, isLoading: appLoading } = useQuery({
    queryKey: ["property-applications", selectedProperty?._id],
    queryFn: async () => {
      if (!selectedProperty?._id) return [];
      console.log("Property ID:", selectedProperty);
      
      const res = await API.get(`/admin/property/${selectedProperty._id}/applications`);
      console.log("RES", res);
      
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
  }

  if (isLoading) {
    return (
      <div className="p-6 grid md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const statusColor =
    data?.accountStatus === "active"
      ? "text-green-600"
      : "text-red-500";

  const verificationColor =
    data?.verificationStatus === "approved"
      ? "text-green-600"
      : data?.verificationStatus === "rejected"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-6">

      <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

        <div className="lg:col-span-1 space-y-4">

          {/* USER INFO */}
        <div className="bg-white p-5 rounded-2xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{data?.name}</h2>
            <p className="text-gray-500 text-sm">{data?.email}</p>
            <p className="text-sm mt-1">
              Role: <span className="font-semibold uppercase">{data?.role}</span>
            </p>
          </div>

          <div className="flex flex-col md:gap-2">
            <span className="text-gray-500">
              Account: <span className={`uppercase font-bold text-sm ${statusColor}`}>{data?.accountStatus}</span>
            </span>
            <span className="text-gray-500">
              Verification: <span className={`uppercase font-bold text-sm ${verificationColor}`}>{data?.verificationStatus}</span>
            </span>
          </div>
          <button
              className={`w-[90px] md:mt-2  py-1 px-2 rounded-md bg-green-500 ${data?.accountStatus === "active" ? 'bg-green-500' : 'bg-red-600 text-white' }`}
              onClick={() => {
                setOpen(true);
                setAction(data.accountStatus === "active" ? "block" : "activate");
              }
              }
            >
              {data?.accountStatus === "active" ? <span className="flex items-center justify-between gap-2">Block <MdBlock /></span> : <span className="flex items-center justify-between gap-2">Unblock <CgUnblock /></span>}
            </button>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow space-y-2">
          <h3 className="font-semibold text-lg">Basic Info</h3>
          <p>Mobile: {data?.mobile || "N/A"}</p>
          <p>Joined: {new Date(data?.createdAt).toLocaleDateString()}</p>
        </div>

      <div className="bg-white p-5 rounded-2xl shadow space-y-2">
        <h3 className="font-semibold text-lg">Documents</h3>

        <p>
          ID Proof:{" "}
          {data?.documents?.idProof ? (
            <a
              href={data?.documents.idProof}
              target="_blank"
              className="text-blue-500"
            >
              View
            </a>
          ) : (
            "❌ Missing"
          )}
        </p>

        {data?.role === "owner" && (
          <p>
            Property Proof:{" "}
            {data?.documents?.propertyProof ? (
              <a
                href={data?.documents.propertyProof}
                target="_blank"
                className="text-blue-500"
              >
                View
              </a>
            ) : (
              "❌ Missing"
            )}
          </p>
        )}
      </div>

      {data?.role === "user" && (
        <div className="bg-white p-5 rounded-2xl shadow">
          <h3 className="font-semibold text-lg mb-3">
            Applications
          </h3>

          {data?.applications?.length > 0 ? (
            <div className="space-y-3">
              {data?.applications.map((a) => (
                <div
                  key={a._id}
                  className="border p-3 rounded-xl"
                >
                  <p className="font-semibold">{a.propertyTitle}</p>
                  <p className="text-sm text-gray-500">
                    Owner: {a.ownerEmail}
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span className="font-semibold uppercase">
                      {a.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No applications</p>
          )}
        </div>
      )}

          {/* PROPERTY LIST */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="font-semibold mb-3">Properties</h3>

            {propertyLoading ? (
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            ) : propertyData?.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {propertyData.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => setSelectedProperty(p)}
                    className={`p-3 rounded-xl border cursor-pointer transition 
                      ${
                        selectedProperty?._id === p._id
                          ? "bg-gray-300 text-white border border-black"
                          : "hover:bg-gray-100"
                      }`}
                  >
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs opacity-70 flex items-center gap-1"> <MdLocationPin className="text-red-600" />{p.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No properties</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">

          {!selectedProperty ? (
            <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-center h-full">
              <p className="text-gray-400">
                Select a property to view details
              </p>
            </div>
          ) : (
            <div className="bg-white h-[121vh] rounded-2xl p-6 shadow space-y-4">

              <h2 className="text-xl font-bold">
                {selectedProperty.title}
              </h2>

              <p className="text-gray-500">
                {selectedProperty.location}
              </p>

              <p className="text-lg font-semibold">
                ₹ {selectedProperty.rent}
              </p>

              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-sm text-gray-600">
                  {selectedProperty.description || "No description"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Details</h3>
                <p className="text-sm">Deposit: ₹ {selectedProperty.deposit}</p>
                <p className="text-sm">Status: {selectedProperty.status}</p>
              </div>
              <div className="space-y-3">

                <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                  {selectedProperty.images?.[activeImg] ? (
                    <img
                      src={selectedProperty.images?.[activeImg]}
                      alt="img"
                      className="w-full h-full object-cover"
                  />
                  ) : (
                    <span>No images</span>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto items-center justify-center">
                  {selectedProperty?.images.length > 0 ? (
                    selectedProperty.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="img"
                        onClick={() => setActiveImg(i)}
                        className={`w-16 h-16 rounded-lg cursor-pointer object-cover border ${
                          activeImg === i ? "border-black" : "border-gray-300"
                        }`}
                      />
                  ))
                  ) : (
                      <span className="`w-16 h-16 rounded-lg cursor-pointer object-cover text-sm">No preview images</span>      
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Applications for this property</h3>

                  <div className="h-[22vh] overflow-y-auto">
                    {appLoading ? (
                      [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
                    ) : applications?.length > 0 ? (
                      <div className=" grid grid-cols-3 space-x-2 ">
                        {applications.map((app) => (
                          <div key={app._id} className="border rounded-xl p-3 flex justify-between items-center">

                            <div>
                              <p className="font-semibold">{app.user?.name}</p>
                              <p className="text-xs text-gray-500">{app.user?.email}</p>
                            </div>

                            <div className="text-[10px]">
                              <span className={`font-semibold uppercase
                                ${app.status === "accepted" ? "text-green-600" :
                                  app.status === "rejected" ? "text-red-500" :
                                  "text-yellow-500"}
                              `}>
                                {app.status}
                              </span>
                            </div>

                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No applications yet</p>
                    )}
                  </div>
                </div>

              </div>

              {/* future expansion */}
              <div className="pt-3 border-t">
                <Link 
                  to={`/property/${selectedProperty?._id}`}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  View Full Property
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>

      <Modal
        open = {open}
        onCancel={() => setOpen(false)}
        onOk={handleBlock}
        okText="Confirm"
      >
        <p>
          Are you sure want to {" "}
          <strong className="uppercase">{action}</strong> this user?
        </p>
      </ Modal>
    </div>
  );
}