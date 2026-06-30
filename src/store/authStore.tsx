import { create } from "zustand";
import axios from 'axios';

interface UserType {
    id: string;
    name: string;
    email: string;
    slug: string; 
}

interface AuthState {
    user: UserType | null;
    isLoading: boolean;
    error: string | null;
    registerUser: (email: string, password: string, name: string) => Promise<boolean>;
    loginUser: (email: string, password: string) => Promise<boolean>;
    logoutUser: () => void;
}

// Ganti URL ini sesuai dengan BASE URL backend Express kamu
const API_BASE_URL = "http://localhost:5000/api";

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    registerUser: async (email, password, name) => {
        set({ isLoading: true, error: null });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            set({ error: "Format email salah", isLoading: false });
            return false;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                name,
                email,
                password
            });

            if (response.status === 201 || response.status === 200) {
                const userData = response.data.user;
                
                set({ 
                    user: {
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        // PROTEKSI UTAMA: Mengunci slug dari backend agar aman
                        slug: userData.slug || userData.id || name.toLowerCase().replace(/\s+/g, '-')
                    }, 
                    isLoading: false 
                });
                return true;
            }
            return false;
        } catch (err: any) {
            set({
                error: err.response?.data?.error || "Registrasi gagal",
                isLoading: false
            });
            return false;
        }
    },

    loginUser: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            // DISESUAIKAN: Menembak backend Express sendiri (bukan langsung Supabase frontend)
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password
            });

            if (response.status === 200) {
                const userData = response.data.user;

                set({ 
                    user: {
                        id: userData.id,
                        name: userData.name || "User",
                        email: userData.email,
                        // PROTEKSI AMAN: Mengambil slug asli yang di-generate backend saat login berhasil
                        slug: userData.slug || userData.id || "user-slug"
                    }, 
                    isLoading: false 
                });
                return true;
            }

            return false;
        } catch (err: any) {
            set({
                // Menangkap pesan error spesifik dari backend Express kamu
                error: err.response?.data?.error || "Email atau password salah",
                isLoading: false
            });
            return false;
        }
    },

    logoutUser: () => {
        set({ user: null, error: null });
    }
}));1