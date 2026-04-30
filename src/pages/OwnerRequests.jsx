import { useState, useMemo } from "react";
import SkeletonCard from "../components/SkeletonCard";
import { useOwnerRequests, useUpdateRequest } from "../hooks/useRequests";
import { FaCircleExclamation } from "react-icons/fa6";
import API from "../api/axios";

export default function OwnerRequests() {
  const { data, isLoading } = useOwnerRequests();
  const { mutate } = useUpdateRequest();
  const [filter, setFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((req) => req.status === filter);
  }, [data, filter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-500";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#222]">
              Applications
            </h2>
            <p className="text-sm text-gray-500">
              Manage requests from tenants
            </p>
          </div>

          {/* FILTER PILLS */}
          <div className="flex gap-2 overflow-x-auto bg-white p-1 rounded-full border border-gray-200">
            {["all", "pending", "accepted", "rejected"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-1.5 rounded-full text-sm capitalize whitespace-nowrap transition ${
                  filter === item
                    ? "bg-[#FF5A5F] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredData.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition"
              >

                {/* CONTENT */}
                <div className="space-y-3">

                  <div>
                    <p className="text-xs text-gray-400">Property</p>
                    <h3 className="font-semibold text-base text-[#222] line-clamp-1">
                      {req.propertyTitle}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">User</p>
                    <p className="text-sm text-gray-700 truncate">
                      {req.userEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Message</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {req.message}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="mt-4 flex items-center justify-between">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>

                  {req.status === "pending" && (
                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          mutate(
                            { id: req._id, status: "accepted" },
                            {
                              onSuccess: async () => {
                                const convoRes = await API.post("/conversation", {
                                  propertyId: req.propertyId,
                                  userId: req.userId,
                                  ownerId: req.ownerId,
                                });

                                const conversationId = convoRes.data._id;
                                navigate(`/chat/${conversationId}`);
                              },
                            }
                          )
                        }
                        className="px-3 py-1 text-xs rounded-lg bg-[#FF5A5F] text-white hover:opacity-90 transition"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          mutate({ id: req._id, status: "rejected" })
                        }
                        className="px-3 py-1 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                      >
                        Reject
                      </button>

                    </div>
                  )}
                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center text-gray-500 gap-2">
            <FaCircleExclamation size={26} />
            <p className="text-sm">
              No {filter !== "all" ? filter : ""} requests found
            </p>
          </div>
        )}

      </div>
    </div>
  );
}