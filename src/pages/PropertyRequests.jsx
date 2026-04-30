import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import SkeletonCard from "../components/SkeletonCard";
import { getPropertyRequests, useUpdateRequest } from "../hooks/useRequests";
import { FaCircleExclamation } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { Loader2Icon } from "lucide-react";

export default function PropertyRequests() {
  const { id } = useParams();
  const { data, isLoading } = getPropertyRequests(id);
  const { mutate, isPending } = useUpdateRequest();

  const [filter, setFilter] = useState("all");

  const filteredRequests = useMemo(() => {
    if (!data?.requests) return [];
    if (filter === "all") return data.requests;
    return data.requests.filter((r) => r.status === filter);
  }, [data, filter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 text-green-600";
      case "rejected":
        return "bg-red-50 text-red-500";
      default:
        return "bg-yellow-50 text-yellow-600";
    }
  };

  return (
    <div className="bg-[#f8f9fb] min-h-screen p-4 md:p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4">

          <div>
            <h2 className="text-xl font-semibold text-[#222] flex items-center gap-2">
              <IoHomeOutline className="text-[#FF5A5F]" />
              Applications
              <p className="text-sm text-gray-500 mt-1">
                {data?.propertyName || "Your property"}
              </p>
            </h2>
            
          </div>

          {/* FILTERS */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {["all", "pending", "accepted", "rejected"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-1.5 rounded-full text-sm capitalize whitespace-nowrap transition ${
                  filter === item
                    ? "bg-[#FF5A5F] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredRequests.length > 0 ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition"
              >

                {/* USER INFO */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    {req.userName}
                  </h3>

                  <p className="text-sm text-gray-500 truncate">
                    {req.userEmail}
                  </p>
                </div>

                {/* FOOTER */}
                <div className="mt-5 flex items-center justify-between">

                  {/* STATUS */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>

                  {/* ACTIONS */}
                  {req.status === "pending" && (
                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          mutate({ id: req._id, status: "accepted" })
                        }
                        className="px-3 py-1 text-xs rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition flex items-center gap-1"
                      >
                        {isPending ? (
                          <Loader2Icon className="animate-spin" size={14} />
                        ) : (
                          "Accept"
                        )}
                      </button>

                      <button
                        onClick={() =>
                          mutate({ id: req._id, status: "rejected" })
                        }
                        className="px-3 py-1 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center gap-1"
                      >
                        {isPending ? (
                          <Loader2Icon className="animate-spin" size={14} />
                        ) : (
                          "Reject"
                        )}
                      </button>

                    </div>
                  )}

                </div>
              </div>
            ))}

          </div>

        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-2">
            <FaCircleExclamation size={22} />
            <p>No {filter !== "all" ? filter : ""} requests found</p>
          </div>
        )}

      </div>
    </div>
  );
}