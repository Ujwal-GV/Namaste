import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useApply = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => {
        console.log("Data", data);
        return API.post("/requests/apply", data)
    },
    onSuccess: () => {
      qc.invalidateQueries["my-request"];
      qc.invalidateQueries["property-requests"];
      toast.success("Applied, we'll get back in short time");
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      
        toast.error(error?.response?.data?.message || "Please try again later");
    }
  });
};

export const useOwnerRequests = () => {
  return useQuery({
    queryKey: ["owner-requests"],
    queryFn: async () => {
      const res = await API.get("/requests/owner");
      console.log("Owner Requests", res.data);
      
      return res.data;
    },
    staleTime: 5000,
    gcTime: 5000,
  });
};

export const useUpdateRequest = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      API.put(`/property/update-status/${id}`, { status }),

    onSuccess: (res) => {
      toast.success(res?.data?.message || "Request Approved");
      qc.invalidateQueries(["owner-requests"]);
    },
  });
};

export const useApplyOwner = () => {
const qc = useQueryClient();
const navigate = useNavigate();

    return useMutation({
    mutationFn: (data) => {
        console.log("Apply Owner", data);
        return API.post("/user/apply-owner", data);
    },
    onSuccess: (res) => {
      console.log("Response: ", res.data);
      qc.invalidateQueries["user-profile"];
      navigate("/");
      toast.success(res?.data?.message || "Your request has been submitted");
    },
    onError: (error) => {
        console.log("Error applying owner:\t", error);
        toast.error(error?.response?.data?.message || "Please try again later");
    }
  });
}

export const getPropertyRequests = (id) => {
  return useQuery({
    queryKey: ["property-requests", id],
    queryFn: async () => {
      const res = await API.get(`/requests/${id}`);      
      return res.data;
    },
    staleTime: 5000,
    gcTime: 5000,
  });
};

export const useMyRequest = (propertyId, token) => {
  return useQuery({
    queryKey: ["my-request", propertyId],
    queryFn: async () => {
      const res = await API.get(`/requests/my/${propertyId}`);
      return res.data;
    },
    enabled: !!propertyId && !!token,
  });
};

export const getUserApplications = (id) => {
  return useQuery({
    queryKey: ["user-applications"],
    queryFn: async () => {
      const res = await API.get(`/user/user-applications/${id}`);
      console.log("User applications", res.data);
      
      return res.data;
    },
    staleTime: 5000,
    gcTime: 5000,
  })
};