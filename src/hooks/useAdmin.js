import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";
import { data, useNavigate } from "react-router-dom";

const queryClient = useQueryClient;

export const useGetUsersList = () => {
    return useQuery({
        queryKey: ["users-list"],
        queryFn: async () => {
            const res = await API.get('/admin/get-users');
            return res.data;
        },
        // enabled: search.length > 2 || search === "",
        keepPreviousData: true,
        staleTime: 5000,
        gcTime: 5000,
    });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      API.put(`/admin/user/${id}/status`, { status }),

    onSuccess: (res) => {
        console.log("res", res);
        
      toast.success("Status updated");
      queryClient.invalidateQueries(["users-list"]);
    },

    onError: () => {
      toast.error("Update failed");
    },
  });
};
