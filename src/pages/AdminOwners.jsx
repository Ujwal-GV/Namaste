import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";
import SkeletonCard from "../components/SkeletonCard";
import { Modal } from "antd";
import { LuLoaderCircle } from "react-icons/lu";
import { IoDocuments } from "react-icons/io5";
import useDebounce from "../hooks/useDebounce";

export default function AdminOwners() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedUser, setSelectedUser] = useState(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["owner-requests", page, activeTab, debouncedSearch, limit],
    queryFn: async () => {
      const res = await API.get("/admin/owner-requests", {
        params: { page, limit, status: activeTab, search: debouncedSearch },
      });
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id }) =>
      API.put(`/admin/approve-owner/${id}`, { status: "approved" }),
    onSuccess: () => toast.success("Approved"),
    onSettled: () => queryClient.invalidateQueries(["owner-requests"]),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id }) =>
      API.put(`/admin/reject-owner/${id}`, { status: "rejected" }),
    onSuccess: () => toast.success("Rejected"),
    onSettled: () => queryClient.invalidateQueries(["owner-requests"]),
  });

  const users = useMemo(() => data?.data || [], [data]);

  const counts = {
    all: data?.totalUsers || 0,
    pending: data?.counts?.pending || 0,
    approved: data?.counts?.approved || 0,
    rejected: data?.counts?.rejected || 0,
  };

  const tabs = ["all", "pending", "approved", "rejected"];

  const getTabStyle = (tab) => {
    if (activeTab !== tab) return "bg-[#111827] text-gray-400";

    switch (tab) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30";
      case "approved":
        return "bg-green-500/20 text-green-400 border border-green-400/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-400/30";
      default:
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 p-4 md:p-6 space-y-6">

      {/* 🔥 HEADER */}
      <div className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">

        <h2 className="text-xl md:text-2xl font-semibold text-cyan-400 tracking-wide">
          OWNER APPROVALS
        </h2>

        <input
          type="text"
          placeholder="Search users..."
          className="w-full md:w-1/3 px-4 py-2 rounded-full bg-[#0b0f19] border border-cyan-500/20 focus:outline-none focus:border-cyan-400 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ⚡ TABS */}
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs md:text-sm whitespace-nowrap transition ${getTabStyle(tab)}`}
            >
              {tab.toUpperCase()} ({counts[tab]})
            </button>
          ))}
        </div>
      </div>

      {/* 📦 CONTENT */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : users.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {users.map((user) => (
            <div
              key={user._id}
              className="bg-[#111827] border border-cyan-500/10 rounded-2xl p-4 hover:border-cyan-400 hover:shadow-[0_0_15px_#22d3ee33] transition flex flex-col justify-between"
            >

              <div>
                <p className="font-semibold text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
              </div>

              {/* STATUS */}
              <div className="my-3 flex flex-col gap-2">

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold uppercase w-fit
                  ${
                    user.verificationStatus === "approved"
                      ? "bg-green-500/20 text-green-400"
                      : user.verificationStatus === "rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {user.verificationStatus}
                </span>

                <button
                  onClick={() => setSelectedUser(user)}
                  className="flex items-center justify-center gap-2 text-xs px-3 py-2 bg-cyan-500/10 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition"
                >
                  <IoDocuments /> Documents
                </button>

              </div>

              {/* ACTIONS */}
              {user.verificationStatus === "pending" && (
                <div className="flex gap-2">

                  <button
                    onClick={() => approveMutation.mutate({ id: user._id })}
                    className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-xl hover:bg-green-500/30 transition flex justify-center"
                  >
                    {approveMutation.isPending
                      ? <LuLoaderCircle className="animate-spin" />
                      : "Approve"}
                  </button>

                  <button
                    onClick={() => rejectMutation.mutate({ id: user._id })}
                    className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl hover:bg-red-500/30 transition flex justify-center"
                  >
                    {rejectMutation.isPending
                      ? <LuLoaderCircle className="animate-spin" />
                      : "Reject"}
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No users found
        </div>
      )}

      {/* 📄 PAGINATION */}
      <div className="flex flex-col items-center gap-4 mt-8">

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="bg-[#111827] border border-cyan-500/20 px-4 py-2 rounded-lg text-sm"
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
              className={`px-4 py-2 rounded-full text-sm transition
                ${
                  page === i + 1
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-[#111827] text-gray-400 hover:bg-[#1f2937]"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>

      {/* 📑 DOCUMENT MODAL */}
      <Modal
        open={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        footer={null}
        width={500}
        styles={{
          content: {
            background: "#0b0f19",
            color: "#fff",
            border: "1px solid rgba(34,211,238,0.2)",
            borderRadius: "16px"
          }
        }}
      >
        {selectedUser && (
          <div className="space-y-5">

            <h2 className="text-lg font-semibold text-cyan-400">
              Documents
            </h2>

            <div>
              <p className="text-sm text-gray-400">ID Proof</p>
              {selectedUser.documents?.idProof ? (
                <img
                  src={selectedUser.documents.idProof}
                  className="rounded-xl mt-2 border border-cyan-500/20"
                />
              ) : (
                <p className="text-gray-500 text-sm">Not uploaded</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-400">Property Proof</p>
              {selectedUser.documents?.propertyProof ? (
                <img
                  src={selectedUser.documents.propertyProof}
                  className="rounded-xl mt-2 border border-cyan-500/20"
                />
              ) : (
                <p className="text-gray-500 text-sm">Not uploaded</p>
              )}
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}