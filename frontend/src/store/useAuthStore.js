import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    
    
    checkAuth : async () => {
        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
        }catch(err){    
            console.log("Error checking auth:",err);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup : async (data) => {
        set({isSigningUp:true});
        try{
            console.log("Sending signup data:", data);
            const res = await axiosInstance.post("/auth/signup",data,{
                withCredentials:true,
            });
            set({authUser:res.data});
            toast.success("Account Created successful!");
        }catch(err){
            console.log("Signup error:", err);
            const errorMessage = err.response?.data?.message || "Error signing up";
            toast.error(errorMessage);
        }finally{
            set({isSigningUp:false});
        }
    },

    login : async (data) => {
        set({isLoggingIn:true});
        try{
            console.log("Sending Login data:", data);
            const res = await axiosInstance.post("/auth/login",data,{
                withCredentials:true,
            });
            set({authUser:res.data});
            toast.success("Logged in successful!");
        }catch(err){
            console.log("Login error:", err);
            const errorMessage = err.response?.data?.message ;
            toast.error(errorMessage);
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout : async (data) => {
        
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successful!");
        }catch(err){
            console.log("Logout error:", err);
            const errorMessage = err.response?.data?.message ;
            toast.error(errorMessage);
        }
    }
}));