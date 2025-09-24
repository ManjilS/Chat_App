import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set,get) => ({
    allContacts:[],
    chats:[],
    messages:[],
    activeTab:"chats",
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,
    isSoundEnabled:localStorage.getItem("isSoundEnabled") === "true",

    toggleSound:()=>{
        localStorage.setItem("isSoundEnabled",!get().isSoundEnabled);
        set({isSoundEnabled:!get().isSoundEnabled});
    },
    setActiveTab:(tab)=>{
        set({activeTab:tab});
    },
    setSelectedUser:(user)=>{
        set({selectedUser:user});
    },
    getAllContacts:async()=>{
        set({isUserLoading:true});
        try{
            const res = await axiosInstance.get("/messages/contacts");
            set({allContacts:res.data});
        }catch(err){
            toast.log("Error fetching contacts:",err);
        }finally{
            set({isUserLoading:false});
        }
    },
    getMyChatPartners:async()=>{
        set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
    },
    
}));