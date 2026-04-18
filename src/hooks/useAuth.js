import { useMutation } from "@tanstack/react-query";
import API from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export const useLogin = () => {
    const { login } = useContext(AuthContext);

    return useMutation({
        mutationKey: ["user-login"],
        mutationFn: (data) => API.post("/user/login", data),
        onSuccess: (res) => {
            // toast.success(res.data.token);
            toast.success("Logged in succesfully");
            login(res.data.token);
        },

        onError: (error) => {
            console.log(error);
            toast.error(error.response?.data?.message || "Login failed");
        }
    });
};

export const useRegister = () => {
    return useMutation({
        mutationKey: ["user-register"],
        mutationFn: (data) => API.post("/user/register", data),
        onSuccess: (res) => {
            toast.success("Registration succesful")
            console.log(res);
        },

        onError: (error) => {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed");
        }
    })
};

export const useSendOtp = () => {
    return useMutation({
        mutationKey: ["send-otp"],
        mutationFn: (data) => API.post("/user/send-otp", data),
        onSuccess: (res) => {
            toast.success("OTP sent successfully")
            console.log(res);
        },

        onError: (error) => {
            console.log(error);
            toast.error(error.response?.data?.message || "Error sending OTP");
        }
    })
}

export const useVerifyOtp = () => {
    return useMutation({
        mutationKey: ["verify-otp"],
        mutationFn: (data) => API.post("/user/verify-otp", data),
        onSuccess: (res) => {
            toast.success("OTP verification successful")
            console.log(res);
        },

        onError: (error) => {
            console.log(error);
            toast.error(error.response?.data?.message || "OTP verification failed");
        }
    })
}