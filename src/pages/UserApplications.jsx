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
         return "bg-green-100 text-green-600";
       case "rejected":
         return "bg-red-100 text-red-500";
       default:
         return "bg-yellow-100 text-yellow-600";
     }
   };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <h2 className="text-2xl font-bold">Applications</h2>

        <div className="flex gap-2 overflow-x-auto">
          {["all", "pending", "accepted", "rejected"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1 rounded-full text-sm capitalize whitespace-nowrap transition ${
                filter === item
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

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
              className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition hover:cursor-pointer"
            >

              <div className="space-y-2">
                <span className="text-sm text-gray-500 flex items-center gap-1">Property:
                  <h3 className="font-semibold text-lg text-black">
                    {req.property?.title || "Undefined"}
                  </h3>
                </span>

                <p className="text-sm text-gray-500 mt-2">Owner: <span className="text-sm truncate">{req.user?.name || "Undefined"}</span></p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                    req.status
                  )}`}
                >
                  {req.status}
                </span>

                <span><FaEye onClick={() => navigate(`/property/${req?.property?._id}`)} className="px-2 text-3xl bg-gray-200 rounded-full hover:bg-gray-500 hover:text-white" /></span>
              </div>
            </div>
          ))}

        </div>
      ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center text-gray-500 gap-2">
          <FaCircleExclamation size={24} />
          <p>No {filter !== "all" ? filter : ""} requests found</p>
        </div>
      )}
    </div>
  );
}