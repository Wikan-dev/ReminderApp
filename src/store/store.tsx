import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Definisikan tipe data untuk satu item Reminder
export interface Reminder {
  id: string;
  title: string;
  description: string;
  color: string;      // Menyimpan warna (misal: 'bg-red-500')
  isCompleted: boolean;
}

// 2. Definisikan tipe data untuk isi Store (State + Actions)
interface ReminderState {
  reminders: Reminder[];
  addReminder: (newReminder: Omit<Reminder, 'id' | 'isCompleted'>) => void;
  toggleReminder: (id: string) => void;
  resetAllReminders: () => void; // Ini yang nanti dipicu jam 12 malam
}

// 3. Buat Store-nya
export const useReminderStore = create<ReminderState>()(
  persist(
    (set) => ({
      // --- STATE UTAMA ---
      reminders: [],

      // --- ACTIONS (Fungsi Pengubah State) ---
      // Menambahkan reminder baru
      addReminder: (newReminder) => set((state) => ({
        reminders: [
          ...state.reminders,
          {
            ...newReminder,
            id: crypto.randomUUID(), // Bikin ID unik otomatis
            isCompleted: false,      // Default-nya belum selesai
          }
        ]
      })),

      // Mengubah status checkbox (Selesai / Belum)
      toggleReminder: (id) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
        ),
      })),

      // Reset semua status checkbox jadi false (untuk jam 12 malam)
      resetAllReminders: () => set((state) => ({
        reminders: state.reminders.map((r) => ({ ...r, isCompleted: false })),
      })),
    }),
    {
      name: 'reminder-storage', // Nama kunci di localStorage
    }
  )
);