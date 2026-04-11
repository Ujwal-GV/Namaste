import SkeletonCard from "../components/SkeletonCard";
import { useOwnerRequests, useUpdateRequest } from "../hooks/useRequests";
import { FaCircleExclamation } from "react-icons/fa6";

export default function OwnerRequests() {
  const { data, isLoading } = useOwnerRequests();
  const { mutate } = useUpdateRequest();

  return (
    <div className="p-6 max-w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4">Applications</h2>
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
            ))}
        </div>
        ) : (
        data.length > 0 ? 
        <>
            <div className="grid md:grid-cols-3 gap-6">
                {data?.map((req) => (
                    <div
                    key={req._id}
                    className="border p-4 rounded-xl mb-3 bg-white shadow-gray-600 shadow-md hover:shadow-gray-100 hover:cursor-pointer bg-transition"
                    >
                    <p><b>Property:</b> {req?.propertyTitle}</p>
                    <p><b>User:</b> {req?.userEmail}</p>
                    <p><b>Message:</b> {req?.message}</p>

                    {/* Status */}
                    <p className="mt-2">
                        <b>Status:</b>{" "}
                        <span
                        className={`${
                            req.status === "accepted"
                            ? "text-green-600"
                            : req.status === "rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                        >
                        <span className="uppercase font-bold">{req.status}</span>
                        </span>
                    </p>

                    {/* Actions */}
                    {req.status === "pending" && (
                        <div className="flex gap-3 mt-3">
                        <button
                            onClick={() =>
                            mutate({ id: req._id, status: "accepted" })
                            }
                            className="macondo-regular text-md text-blue-950 bg-tahiti hover:bg-bermuda hover:text-black rounded-lg px-2 py-1"
                        >
                            Accept
                        </button>

                        <button
                            onClick={() =>
                            mutate({ id: req._id, status: "rejected" })
                            }
                            className="geo-regular-italic text-md bg-sunset rounded-lg px-2 py-1"
                        >
                            Reject
                        </button>
                        </div>
                    )}
                    </div>
                ))}
            </div>
        </> : 
        <div className="h-[620px] flex items-center justify-center">

            <div className="flex items-center justify-center gap-2">
            No requests found <FaCircleExclamation className="text-gray-600" />
        </div>
        </div>
        )}
    </div>
  );
}