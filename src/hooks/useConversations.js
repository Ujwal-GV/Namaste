import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export const useConversations = () =>
  useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await API.get("/conversations");
      return res.data;
    },
});

export const useMessages = (id) =>
  useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const res = await API.get(`/conversations/messages/${id}`);
      console.log("USEMESSAGE RES", res);
      
      return res.data;
    },
    enabled: !!id,
});

export const useSendMessage = () =>
  useMutation({
    mutationFn: async (data) => {
      const res = await API.post("/conversations/message", data);
      return res.data;
    },
});