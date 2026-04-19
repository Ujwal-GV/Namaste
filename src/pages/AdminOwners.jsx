import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";
import SkeletonCard from "../components/SkeletonCard";
import { Modal } from "antd";
import { LuLoaderCircle } from "react-icons/lu";
import { IoDocuments } from "react-icons/io5";


export default function AdminOwners() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["owner-requests", page, activeTab, search, limit],
    queryFn: async () => {
      const res = await API.get("/admin/owner-requests", {
        params: {
          page,
          limit,
          status: activeTab,
          search,
        }
      });
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationKey: ["approve-owner"],
    mutationFn: async ({ id, status }) => {
      const res = await API.put(`/admin/approve-owner/${id}`, { status });
      return res.data;
    },

    onSuccess: (res) => {
      toast.success("User request approved");
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Update failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["owner-requests"]);
    },
  });

  const rejectMutation = useMutation({
    mutationKey: ["reject-owner"],
    mutationFn: async ({ id, status }) => {
      const res = await API.put(`/admin/reject-owner/${id}`, { status });
      return res.data;
    },

    onSuccess: () => {
      toast.success("User request rejected");
    },

    onError: (error) => {
      console.log("ERRR", error);
      
      toast.error(error?.response?.data?.message || "Update failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["owner-requests"]);
    },
  });
  
  

  const users = data?.data || [];

console.log("data", data);

  const filtered = users
    .filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) =>
      activeTab === "all" ? true : u.verificationStatus === activeTab
    );

  const counts = {
    all: data?.totalUsers || 0,
    pending: data?.counts.pending || 0,
    approved: data?.counts.approved || 0,
    rejected: data?.counts.rejected || 0,
  };

  const tabs = ["all", "pending", "approved", "rejected"];

  return (
    <div className="md:p-6 space-y-5 custom-background-color min-h-screen p-4">

      <div className="bg-gray-800 p-4 rounded-xl shadow flex flex-col md:flex-row gap-3 items-center justify-between">

        <h2 className="text-2xl font-bold text-white">Owner Approvals</h2>

        <input
          type="text"
          placeholder="Search by email..."
          className="border p-2 rounded-full bg-gray-100 w-full md:w-1/3 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex overflow-x-auto gap-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
              ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {tab.toUpperCase()} ({counts[tab]})
          </button>
        ))}
      </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((user) => (
            
            <div
              key={user._id}
              className="dashboard-card p-4 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold text-white text-lg">{user.name}</p>
                <p className="text-sm text-white">{user.email}</p>
              </div>

              <div className="my-3 flex justify-between items-center">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold uppercase
                    ${
                      user.verificationStatus === "approved"
                        ? "bg-green-100 text-green-600"
                        : user.verificationStatus === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                >
                  {user.verificationStatus}        
                </span>
                <button
                    title="Documents"
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center gap-2 text-sm p-2 text-black bg-gray-200 rounded-xl hover:bg-gray-400"
                  >
                    <IoDocuments /> View Documents
                  </button>
              </div>

              <div className="flex flex-col gap-2">

                {user.verificationStatus === "pending" && (
                  <div className="w-full flex text-center gap-2">
                    <button
                      onClick={() =>
                        approveMutation.mutate({
                          id: user._id,
                          status: "approved",
                        })
                      }
                      className="w-1/2 flex justify-center items-center bg-green-500 text-white py-2 rounded-xl"
                    >
                      {approveMutation.isPending ? <LuLoaderCircle className="animatespin-slow-reverse" /> : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        rejectMutation.mutate({
                          id: user._id,
                          status: "rejected",
                        })
                      }
                      className="w-1/2 flex justify-center items-center bg-red-500 text-white py-2 rounded-xl"
                    >
                      {rejectMutation.isPending ? <LuLoaderCircle className="animatespin-slow-reverse" /> : "Reject"}
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No users found
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-4">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="border px-3 py-2 rounded-lg text-sm text-black"
              >
                <option value={8}>8 / page</option>
                <option value={16}>16 / page</option>
                <option value={24}>24 / page</option>
              </select>

              <div className="flex gap-2 flex-wrap justify-center">
                {[...Array(data?.totalPages || 1)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      page === i + 1
                        ? "bg-black text-white"
                        : "bg-white border hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

      <Modal
        open={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        footer={null}
        title="User Documents"
      >
        {selectedUser && (
          <div className="space-y-4">

            <div>
              <p className="font-semibold">ID Proof</p>
              {selectedUser.documents?.idProof ? (
                <img
                  src={selectedUser.documents.idProof}
                  alt="ID"
                  className="rounded-lg mt-2"
                />
              ) : (
                <p className="text-gray-500">Not uploaded</p>
              )}
            </div>

            <div>
              <p className="font-semibold">Property Proof</p>
              {selectedUser.documents?.propertyProof ? (
                <img
                  src={selectedUser.documents.propertyProof}
                  alt="Property"
                  className="rounded-lg mt-2"
                />
              ) : (
                <p className="text-gray-500">Not uploaded</p>
              )}
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}