import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function AdminOwners() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["pending-owners"],
    queryFn: async () => {
      const res = await API.get("/admin/owner-requests");
      console.log("Owner requests", res);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }) =>
      API.get(`/admin/approve-owner/${id}`, { status }),

    onSuccess: () => {
      toast.success("Updated");
      queryClient.invalidateQueries(["pending-owners"]);
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Owner Approvals</h2>

      <div className="space-y-4">
        {data?.map((user) => (
          <div key={user._id} className="bg-white p-4 rounded-xl shadow flex justify-between">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() =>
                  mutation.mutate({ id: user._id, status: "approved" })
                }
              >
                Approve
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() =>
                  mutation.mutate({ id: user._id, status: "rejected" })
                }
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}