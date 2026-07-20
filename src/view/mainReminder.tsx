import { useEffect, useState } from "react";
import type { Reminder } from "../store/reminderStore";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import MainCard from "../components/ui/mainCard";
import { useReminderStore } from "../store/reminderStore";
//todo: selesaikan fungsi dan style mainReminder
export default function MainReminder() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const { toggleFinishReminder } = useReminderStore();
    const BASE_URL = 'http://localhost:5000/api/reminder';

    const inputSlug = useAuthStore((state) => state.user?.slug);

    useEffect(() => {
        if (inputSlug) {
            handleGetAll();
        }
    }, [inputSlug]);

    const handleGetAll = async () => {
        if (!inputSlug) return;
        try {
            const response = await axios.get<Reminder[]>(`${BASE_URL}/${inputSlug}`);
            setReminders(response.data);
        } catch (error) {
            console.error("Error fetching reminders:", error);
        }
    };

    

    return (
        <div>
            {reminders.length ? (
                <div>
                    {reminders.map((item) => (
                        <MainCard
                            key={item.id}
                            title={item.name}
                            desc={item.desc || ''}
                            datePick={item.datePick}
                            status={(item.isFinish ?? item.isDone ?? false) ? 'done' : 'pending'}
                            Permanent={item.isPermanent}
                            handleFinish={() => toggleFinishReminder(item)}
                        />
                    ))}
                </div>
            ) : (
                <p>No reminders found.</p>
            )}
        </div>
    );
}