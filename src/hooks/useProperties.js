import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";
import { data, useNavigate } from "react-router-dom";

const queryClient = useQueryClient;

export const useGetProperties = (search, page, location, limit) => {
    return useQuery({
        queryKey: ["get-properties", search, page, location, limit],
        queryFn: async () => {
            const res = await API.get(`/property?search=${search}&page=${page}&location=${location}&limit=${limit}`);
            return res.data;
        },
        // enabled: search.length > 2 || search === "",
        keepPreviousData: true,
        staleTime: 5000,
        gcTime: 5000,
    });
};

export const useMyProperties = (userId) => {    
    return useQuery({
        queryKey: ["my-properties", userId],
        queryFn: async () => {
            const res = await API.get(`/property/my-properties/${userId}`);
            return res.data;
        },
        staleTime: 5000,
        gcTime: 5000,
        enabled: !!userId,
    });
};

export const useAddProperty = () => {
    const qClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationKey: ["add-property"],
        mutationFn: async (data) => {
            const res = await API.post("/property", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

        console.log("Add property result", res.data);
        
        return res.data;
        },
        onSuccess: () => {
            navigate("/");
            toast.success("Property added successfully");
            qClient.invalidateQueries(["get-properties"]);
        },
        onError: (error) => {
            console.log("Add property error", error);
            toast.error(error.response?.data?.message || "Failed to add property");
        }
    });
};