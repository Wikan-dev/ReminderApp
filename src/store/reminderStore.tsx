import { create } from "zustand";
import axios from "axios";

// SECTION 1: Define Types / Interface (Disamakan dengan kolom backend & Supabase)
export interface Reminder {
    id?: number;
    user_id: string;   // Ini untuk menyimpan slug
    name: string;      // Menggantikan activity
    isPermanent: boolean;
    isDone: boolean;   // Sinkron dengan 'isFinish' / 'isDone' di backend
    datePick: string;  // Menggantikan reminder_time
    colorPick?: string;
    desc?: string;
}

interface ReminderState {
    reminders: Reminder[];
    isLoading: boolean;
    error: string | null;
    fetchReminder: (slug: string) => Promise<void>; // Butuh input slug lewat URL
    addReminder: (reminderData: {
        slug: string;
        name: string;
        datePick: string;
        isPermanent?: boolean;
        isFinish?: boolean;
        colorPick?: string;
        desc?: string;
    }) => Promise<void>;
}

// SECTION 2: Create Store
export const useReminderStore = create<ReminderState>((set, get) => ({
    reminders: [],
    isLoading: false,
    error: null,

    // Diubah agar menerima argumen slug dan dimasukkan ke URL parameter
    fetchReminder: async (slug: string) => {
        if (!slug) return;
        set({ isLoading: true, error: null });
        try {
            // Sesuai dengan perbaikan endpoint backend: /api/reminder/:slug
            const response = await axios.get(`http://localhost:5000/api/reminder/${slug}`);
            set({ reminders: response.data, isLoading: false });
        } catch (err: any) {
            console.error("❌ GET ALL ERROR:", err);
            set({ error: err.response?.data?.error || err.message, isLoading: false });
        }
    },

    // Diubah agar menerima object data lengkap yang sesuai dengan req.body backend
    addReminder: async (reminderData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('http://localhost:5000/api/reminder', reminderData);
            
            // Backend mengembalikan data objek baru dari Supabase (.select())
            const newReminder = response.data;
            
            set({ 
                reminders: [...get().reminders, newReminder],
                isLoading: false
            });
        } catch (err: any) {
            console.error("❌ CREATE ERROR:", err);
            set({ 
                error: err.response?.data?.error || "Gagal menambah reminder", 
                isLoading: false 
            });
        }
    }
}));