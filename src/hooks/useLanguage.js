import { useMutation } from "@tanstack/react-query"
import API from "../api/axios";

export const useUpdateLanguage = () => {
    return useMutation({
        mutationFn: async (language) => {
            const res = await API.put("/user/language", {
                language,
            });
            return res.data;
        },
    });
};