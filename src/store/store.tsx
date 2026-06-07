import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reminder } from "../helper/Types";

interface ReminderState {
    reminders: Reminder[];
    addReminder: (remindeer: Reminder) => void;
    deleteReminder: (index: number) => void;
    updateReminder: (index: number, updateReminder: Reminder) => void;
}

export const useReminderStore = create<ReminderState>()(
    persist (
        (set) => ({
            reminders: [],
            addReminder: (reminder: Reminder) => set((state) => ({
                reminders: [...state.reminders, reminder]
            })),
            deleteReminder: (index: number) => set((state) => ({
                reminders: state.reminders.filter((_, i) => i !== index)
            })),
            updateReminder: (index: number, updateReminder: Reminder) => set((state) => ({
                reminders: state.reminders.map((reminder, i) => 
                    i === index ? updateReminder : reminder)
            })),
        }),
        {
            name: "reminder-storage"
        }
    )
)