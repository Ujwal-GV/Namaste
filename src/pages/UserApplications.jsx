import { useState, useMemo } from "react";
import SkeletonCard from "../components/SkeletonCard";
import { getUserApplications, useOwnerRequests, useUpdateRequest } from "../hooks/useRequests";
import { FaCircleExclamation } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export default function UserApplications() {
  const { data, isLoading } = getUserApplications();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((req) => req.status === filter);
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
        <div className="flex flex-col md:flex-row justify-between gap-4">

          <div>
            <h2 className="text-xl font-semibold text-[#222]">
              My Applications
            </h2>
            <p className="text-sm text-gray-500">
              Track your property requests
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {["all", "pending", "accepted", "rejected"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
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
        ) : filteredData.length > 0 ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredData.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition"
              >

                {/* PROPERTY */}
                <div className="space-y-3">

                  <div>
                    <p className="text-xs text-gray-400">Property</p>
                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">
                      {req.property?.title || "Undefined"}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Owner</p>
                    <p className="text-sm text-gray-600 truncate">
                      {req.user?.name || "Undefined"}
                    </p>
                  </div>

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

                  {/* ACTION */}
                  <button
                    onClick={() =>
                      navigate(`/property/${req?.property?._id}`)
                    }
                    className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition flex items-center gap-1"
                  >
                    <FaEye className="text-gray-500" />
                    View
                  </button>

                </div>

              </div>
            ))}

          </div>

        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-2">
            <FaCircleExclamation size={22} />
            <p>No {filter !== "all" ? filter : ""} applications found</p>
          </div>
        )}

      </div>
    </div>
  );
}