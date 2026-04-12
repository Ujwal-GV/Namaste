import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import SkeletonCard from "../components/SkeletonCard";
import { getPropertyRequests, useUpdateRequest } from "../hooks/useRequests";
import { FaCircleExclamation } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";

export default function PropertyRequests() {
  const { id } = useParams();
  const { data, isLoading } = getPropertyRequests(id);
  const { mutate } = useUpdateRequest();

  const [filter, setFilter] = useState("all");

  const filteredRequests = useMemo(() => {
    if (!data?.requests) return [];
    if (filter === "all") return data.requests;
    return data.requests.filter((r) => r.status === filter);
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

      <div className="bg-white shadow rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">

        <div className="flex items-center gap-2">
          <IoHomeOutline className="text-green-600 text-xl" />
          <h2 className="text-lg md:text-xl">
            Applications for{" "}
            <span className="font-bold text-green-700">
              {data?.propertyName || "Property"}
            </span>
          </h2>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max pb-1">
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
      </div>

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
              className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
            >

              <div className="space-y-2">
                <p className="text-sm text-gray-500 flex gap-2">Applicant: <h3 className="font-semibold">{req.userName}</h3></p>
                

                <p className="text-sm text-gray-500">Email: <span className="text-sm truncate">{req.userEmail}</span></p>
                
              </div>

              <div className="mt-4 flex items-center justify-between">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                    req.status
                  )}`}
                >
                  {req.status}
                </span>

                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        mutate({ id: req._id, status: "accepted" })
                      }
                      className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        mutate({ id: req._id, status: "rejected" })
                      }
                      className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600"
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
          <FaCircleExclamation size={24} />
          <p>No {filter !== "all" ? filter : ""} requests found</p>
        </div>
      )}
    </div>
  );
}