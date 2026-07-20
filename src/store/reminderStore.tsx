import { create } from "zustand";
import axios from "axios";

// SECTION 1: Define Types / Interface (Disamakan dengan kolom backend & Supabase)
export interface Reminder {
    id?: number | string;
    user_id?: string;   // Ini untuk menyimpan slug
    name: string;      // Menggantikan activity
    isPermanent: boolean;
    isDone?: boolean;   // Sinkron dengan 'isFinish' / 'isDone' di backend
    isFinish?: boolean;
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
    handleFinishReminder: (id: number | string | undefined, isFinish: boolean) => Promise<void>;
    toggleFinishReminder: (item: Reminder) => Promise<void>
}

// SECTION 2: Create Store
export const useReminderStore = create<ReminderState>((set, get) => ({
    reminders: [],
    isLoading: false,
    error: null,
    isFinish: false,

    handleFinishReminder: async (id, isFinish) => {
        if (!id) return;
        set({ isLoading: true, error: null });
        try {
            const response = await axios.patch(`http://localhost:5000/api/reminder/${id}`, { isFinish });
            const updatedReminder = response.data;

            // Update state dengan reminder yang sudah diubah
            set({
                reminders: get().reminders.map((reminder) =>
                    String(reminder.id) === String(updatedReminder.id) ? updatedReminder : reminder
                ),
                isLoading: false
            });
        } catch (err: any) {
            console.error("❌ UPDATE ERROR:", err);
            set({ error: err.response?.data?.error || "Gagal memperbarui status reminder", isLoading: false });
        }
    },

    toggleFinishReminder: async (item: Reminder) => {
        if (!item.id) return;
        const nextValue = !(item.isFinish ?? item.isDone ?? false);
        set((state) => ({
            reminders: state.reminders.map((reminder) => 
                String(reminder.id) === String(item.id) ? {...reminder, isFinish: nextValue, isDone: nextValue } : reminder )
        }))


        await get().handleFinishReminder(item.id, nextValue);
    },

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