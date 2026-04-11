import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";

export default function AdminUserDetails() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["user-details", id],
    queryFn: async () => {
      const res = await API.get(`/admin/user/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold">{data.name}</h2>
        <p className="text-gray-500">{data.email}</p>
        <p className="text-sm mt-1">
          Role: <span className="font-semibold">{data.role}</span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow space-y-2">
        <h3 className="font-semibold">Basic Info</h3>
        <p>Mobile: {data.mobile || "N/A"}</p>
        <p>Status: {data.accountStatus}</p>
        <p>Verification: {data.verificationStatus}</p>
      </div>

      {data.role === "owner" && (
        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
          <h3 className="font-semibold">Owner Details</h3>

          <p>
            ID Proof:{" "}
            {data.documents?.idProof ? "✅ Uploaded" : "❌ Missing"}
          </p>

          <p>
            Property Proof:{" "}
            {data.documents?.propertyProof
              ? "✅ Uploaded"
              : "❌ Missing"}
          </p>
        </div>
      )}

      {data.role === "user" && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold">User Activity</h3>
          <p>(Later: show applied properties)</p>
        </div>
      )}
    </div>
  );
}