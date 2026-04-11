import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await API.get("/utilities/locations");
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};