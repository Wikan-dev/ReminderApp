import { create } from "zustand";
import axios from 'axios';

//tahap pertama ngedefine semua fungsi yang ada
interface AuthState {
    user: any | null;
    isLoading: boolean;
    error: string | null

    //fungsi untuk mengubah state
    registerUser: (email: string, name:string, password: string) => Promise<boolean>;
    loginUser: (email: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
    //state awal
    user: null,
    isLoading: false,
    error: null,
    //todo perbaiki error kayak gini
    //-----action
    //register user
    registerUser: async (name, email, password) => {
        set({ isLoading: true, error: null }) //mengubah state sebelum fetch
        try {
            //ambil response dari endpoint
            const response =  await axios.post('http://localhost:5000/api/register', {
                email,
                name,
                password
            });

            if (response.status == 201) {
                //jika backend langsung mengambil data user
                set({ user: response.data.user, isLoading: false });
                return true;
            }
            return false;
        } catch (err: any) {
            set({
                error: err.response?.data?.error || "registrasi gagal",
                isLoading: false
            })
            return false;
        }
    },
    //todo selesain storenya
    //fungsi login
    loginUser: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("http://localhost:5000/api/login", {
                email,
                password
            })

            if (response.status === 200) {
                set({ user: response.data.user, isLoading: false });
            }

            return false;
        } catch (err: any) {
            set({
                error: err.response?.data?.error || "email atau password salah",
                isLoading: false
            });
            return false;
        }
    }
}))