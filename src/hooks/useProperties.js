import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";
import { data, useNavigate } from "react-router-dom";

const queryClient = useQueryClient;

export const usePreferredProperties = () => {    
    return useQuery({
        queryKey: ["preferred-properties"],
        queryFn: async () => {
            const res = await API.get(`/property/preferred-properties`);
            
            return res.data;
        },
        staleTime: 5000,
        gcTime: 5000,
    });
};

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
        
        return res.data;
        },
        onSuccess: () => {
            navigate("/");
            toast.success("Property added successfully");
            qClient.invalidateQueries(["get-properties"]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to add property");
        }
    });
};

export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await API.get("/user/favorites");
      return res.data;
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId) =>
      API.post("/user/toggle-favorite", { propertyId }),

    onMutate: async (propertyId) => {
      await queryClient.cancelQueries(["favorites"]);

      const prev = queryClient.getQueryData(["favorites"]);

      queryClient.setQueryData(["favorites"], (old = []) => {
        const exists = old.find((p) => p._id === propertyId);

        if (exists) {
          return old.filter((p) => p._id !== propertyId);
        } else {
          return [...old, { _id: propertyId }];
        }
      });

      return { prev };
    },

    onError: (err, _, context) => {
      queryClient.setQueryData(["favorites"], context.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["favorites"]);
    },

    onSuccess: () => {
        toast.success("Favorites updated");
    }
  });
};