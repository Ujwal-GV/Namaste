import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import API from "../api/axios"
import toast from "react-hot-toast";

export const getNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await API.get("/notifications");
            console.log("Data of notifications", res.data)
            return res.data;
        },
    });
};

export const useMarkRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => API.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};

export const useDeleteSingleNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => API.delete(`/notifications/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
            toast.success("Notification removed");
        }
    });
}

export const useDeleteAllNotifications = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => API.delete("/notifications"),
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
            toast.success("All cleared");
        },
        onError: (error) => {
            console.log(error);
        }
    });
};